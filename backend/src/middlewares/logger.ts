import type { MiddlewareHandler } from 'hono';
import crypto from 'node:crypto';

export function logger(): MiddlewareHandler {
  return async (c, next) => {
    const start = Date.now();
    const id = crypto.randomUUID();
    c.res.headers.set('x-request-id', id);
    const { method, url } = c.req;
    try {
      await next();
      const ms = Date.now() - start;
      console.log(JSON.stringify({ id, method, url, status: c.res.status, ms }));
    } catch (err) {
      const ms = Date.now() - start;
      console.error(JSON.stringify({ id, method, url, status: 500, ms, error: (err as Error).message }));
      throw err;
    }
  };
}
