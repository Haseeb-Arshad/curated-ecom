import { Hono } from 'hono';
import { env } from '../../env';
import crypto from 'node:crypto';

const app = new Hono();

// Minimal signature verification for Stripe webhook (v1)
function verifyStripeSignature(payload: string, sigHeader: string, secret: string): boolean {
  try {
    const parts = Object.fromEntries(sigHeader.split(',').map((p) => p.split('=')) as any);
    const signedPayload = `${parts['t']}.${payload}`;
    const mac = crypto.createHmac('sha256', secret).update(signedPayload).digest('hex');
    const expected = parts['v1'];
    if (!expected) return false;
    const a = Buffer.from(mac, 'hex');
    const b = Buffer.from(expected, 'hex');
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

app.post('/', async (c) => {
  const sig = c.req.header('stripe-signature');
  if (!sig) { c.status(400); return c.json({ error: { message: 'Missing signature' } }); }
  const raw = await c.req.text();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (secret && !verifyStripeSignature(raw, sig, secret)) {
    c.status(400);
    return c.json({ error: { message: 'Invalid signature' } });
  }
  // Acknowledge; order reconciliation would be implemented here
  return c.json({ received: true });
});

export default app;
