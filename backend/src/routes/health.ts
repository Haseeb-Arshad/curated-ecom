import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => c.json({ ok: true, ts: new Date().toISOString() }));

export default app;
