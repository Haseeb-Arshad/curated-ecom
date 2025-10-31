import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { supabaseAdmin, supabasePublic } from '../lib/supabase';

const app = new Hono();

const createSchema = z.object({ name: z.string().min(1).max(80) });
const addItemSchema = z.object({ product: z.string() });

app.get('/', async (c) => {
  const user = c.get('user');
  if (!user?.sub) { c.status(401); return c.json({ error: { message: 'Unauthorized' } }); }
  if (!supabasePublic) return c.json({ items: [] });
  const { data, error } = await supabasePublic.from('wishlists').select('id, name, wishlist_items(products(slug,title,product_images(url,sort)))').eq('user_id', user.sub);
  if (error) { c.status(500); return c.json({ error: { message: error.message } }); }
  return c.json({ items: data });
});

app.post('/', zValidator('json', createSchema), async (c) => {
  const user = c.get('user');
  if (!user?.sub) { c.status(401); return c.json({ error: { message: 'Unauthorized' } }); }
  const client = supabaseAdmin ?? supabasePublic;
  if (!client) return c.json({ ok: true });
  const { name } = c.req.valid('json');
  const { error } = await client.from('wishlists').insert({ user_id: user.sub, name });
  if (error) { c.status(500); return c.json({ error: { message: error.message } }); }
  return c.json({ ok: true });
});

app.post('/:id/items', zValidator('json', addItemSchema), async (c) => {
  const user = c.get('user');
  if (!user?.sub) { c.status(401); return c.json({ error: { message: 'Unauthorized' } }); }
  const client = supabaseAdmin ?? supabasePublic;
  if (!client) return c.json({ ok: true });
  const id = c.req.param('id');
  const { product } = c.req.valid('json');
  const prod = await client.from('products').select('id').eq('slug', product).single();
  if (prod.error || !prod.data) { c.status(400); return c.json({ error: { message: 'Invalid product' } }); }
  const { error } = await client.from('wishlist_items').insert({ wishlist_id: id, product_id: prod.data.id });
  if (error) { c.status(500); return c.json({ error: { message: error.message } }); }
  return c.json({ ok: true });
});

export default app;
