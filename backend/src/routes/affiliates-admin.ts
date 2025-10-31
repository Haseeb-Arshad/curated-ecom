import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { supabaseAdmin, supabasePublic } from '../lib/supabase';

const app = new Hono();

function requireAdmin(c: any) {
  const user = c.get('user');
  if (!user || user.role !== 'admin') {
    c.status(403);
    return c.json({ error: { message: 'Forbidden' } });
  }
  return null;
}

app.get('/api/admin/affiliate-links', async (c) => {
  const forbidden = requireAdmin(c);
  if (forbidden) return forbidden as any;
  const client = supabaseAdmin ?? supabasePublic;
  if (!client) return c.json({ items: [] });
  const { data, error } = await client.from('affiliate_links').select('id, code, external_url, active, products(slug,title)');
  if (error) { c.status(500); return c.json({ error: { message: error.message } }); }
  return c.json({ items: data });
});

const createSchema = z.object({ product: z.string(), external_url: z.string().url(), code: z.string().min(3).max(64) });
app.post('/api/admin/affiliate-links', zValidator('json', createSchema), async (c) => {
  const forbidden = requireAdmin(c);
  if (forbidden) return forbidden as any;
  const client = supabaseAdmin ?? supabasePublic;
  if (!client) return c.json({ ok: true });
  const { product, external_url, code } = c.req.valid('json');
  const prod = await client.from('products').select('id').eq('slug', product).single();
  if (prod.error || !prod.data) { c.status(400); return c.json({ error: { message: 'Invalid product' } }); }
  const { error } = await client.from('affiliate_links').insert({ product_id: prod.data.id, external_url, code, active: true });
  if (error) { c.status(500); return c.json({ error: { message: error.message } }); }
  return c.json({ ok: true });
});

export default app;
