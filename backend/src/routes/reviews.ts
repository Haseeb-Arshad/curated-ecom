import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { supabaseAdmin, supabasePublic } from '../lib/supabase';

const listSchema = z.object({
  product: z.string(), // product slug
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

const createSchema = z.object({
  product: z.string(), // product slug
  rating: z.number().int().min(1).max(5),
  title: z.string().min(1).max(120),
  body: z.string().min(1).max(2000),
});

const app = new Hono();

app.get('/', zValidator('query', listSchema), async (c) => {
  const { product, page, limit } = c.req.valid('query');
  if (!supabasePublic) return c.json({ items: [], page, limit, total: 0 });

  const prod = await supabasePublic.from('products').select('id').eq('slug', product).single();
  if (prod.error || !prod.data) return c.json({ items: [], page, limit, total: 0 });

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  const { data, error, count } = await supabasePublic
    .from('reviews')
    .select('id, rating, title, body, created_at, user_id', { count: 'exact' })
    .eq('product_id', prod.data.id)
    .eq('approved', true)
    .order('created_at', { ascending: false })
    .range(from, to);
  if (error) {
    c.status(500);
    return c.json({ error: { message: error.message } });
  }
  return c.json({ items: data ?? [], page, limit, total: count ?? 0 });
});

app.post('/', zValidator('json', createSchema), async (c) => {
  const user = c.get('user');
  if (!user?.sub) {
    c.status(401);
    return c.json({ error: { message: 'Unauthorized' } });
  }
  if (!supabasePublic) return c.json({ ok: true });
  const input = c.req.valid('json');
  const prod = await supabasePublic.from('products').select('id').eq('slug', input.product).single();
  if (prod.error || !prod.data) {
    c.status(400);
    return c.json({ error: { message: 'Invalid product' } });
  }
  const { error } = await (supabaseAdmin ?? supabasePublic)
    .from('reviews')
    .insert({ product_id: prod.data.id, user_id: user.sub, rating: input.rating, title: input.title, body: input.body, approved: false });
  if (error) {
    c.status(500);
    return c.json({ error: { message: error.message } });
  }
  return c.json({ ok: true });
});

export default app;
