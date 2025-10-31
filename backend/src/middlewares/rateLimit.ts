import type { MiddlewareHandler } from 'hono';
import { env } from '../env';

type Bucket = { tokens: number; last: number };
const buckets = new Map<string, Bucket>();

export function rateLimit(): MiddlewareHandler {
  const capacity = env.RATE_LIMIT_POINTS;
  const windowMs = env.RATE_LIMIT_WINDOW_MS;

  return async (c, next) => {
    const ip = c.req.header('x-forwarded-for')?.split(',')[0]?.trim() || c.req.header('cf-connecting-ip') || 'local';
    const now = Date.now();
    let b = buckets.get(ip);
    if (!b) {
      b = { tokens: capacity, last: now };
    }
    const elapsed = now - b.last;
    const refill = Math.floor((elapsed / windowMs) * capacity);
    b.tokens = Math.min(capacity, b.tokens + (refill > 0 ? refill : 0));
    b.last = refill > 0 ? now : b.last;

    if (b.tokens <= 0) {
      const resetMs = Math.max(0, windowMs - elapsed);
      c.header('Retry-After', Math.ceil(resetMs / 1000).toString());
      c.status(429);
      return c.json({ error: { message: 'Too Many Requests' } });
    }
    b.tokens -= 1;
    buckets.set(ip, b);
    await next();
  };
}
