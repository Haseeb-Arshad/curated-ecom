import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { supabaseAdmin, supabasePublic } from '../lib/supabase';
import crypto from 'node:crypto';

const app = new Hono();

async function getOrCreateCart(userId: string | null, anonId: string | null) {
  const client = supabaseAdmin ?? supabasePublic;
  if (!client) return { id: null } as any;
  let query = client.from('carts').select('id').eq('status', 'active').limit(1);
  if (userId) query = query.eq('user_id', userId);
  else if (anonId) query = query.eq('anon_id', anonId);
  const found = await query.single().catch(() => ({ data: null } as any));
  if (found?.data?.id) return { id: found.data.id };
  const newId = crypto.randomUUID();
  const insert = await client.from('carts').insert({ id: newId, user_id: userId, anon_id: userId ? null : anonId, status: 'active' }).select('id').single();
  if (insert.error) throw new Error(insert.error.message);
  return { id: insert.data.id };
}

const addItemSchema = z.object({ product: z.string(), variant_id: z.number().int().optional(), qty: z.number().int().min(1).max(99).default(1) });
const updateItemSchema = z.object({ qty: z.number().int().min(0).max(99) });

app.get('/', async (c) => {
  const user = c.get('user');
  const anonId = c.req.header('x-cart-id') || null;
  if (!supabasePublic) return c.json({ id: null, items: [] });
  const cart = await getOrCreateCart(user?.sub ?? null, anonId);
  const { data } = await supabasePublic
    .from('cart_items')
    .select('id, qty, products(slug,title,product_images(url,sort))')
    .eq('cart_id', cart.id);
  const items = (data ?? []).map((row: any) => ({
    id: row.id,
    qty: row.qty,
    product: {
      id: row.products?.slug,
      name: row.products?.title,
      image: (row.products?.product_images || []).sort((a: any,b: any)=>(a.sort??0)-(b.sort??0))[0]?.url,
    },
  }));
  return c.json({ id: cart.id, items });
});

app.post('/items', zValidator('json', addItemSchema), async (c) => {
  const user = c.get('user');
  const anonId = c.req.header('x-cart-id') || null;
  if (!supabasePublic) return c.json({ ok: true });
  const cart = await getOrCreateCart(user?.sub ?? null, anonId);
  const { product, variant_id, qty } = c.req.valid('json');
  const prod = await supabasePublic.from('products').select('id').eq('slug', product).single();
  if (prod.error || !prod.data) { c.status(400); return c.json({ error: { message: 'Invalid product' } }); }
  const client = supabaseAdmin ?? supabasePublic;
  const { error } = await client.from('cart_items').insert({ cart_id: cart.id, product_id: prod.data.id, variant_id: variant_id ?? null, qty });
  if (error) { c.status(500); return c.json({ error: { message: error.message } }); }
  return c.json({ ok: true });
});

app.patch('/items/:id', zValidator('json', updateItemSchema), async (c) => {
  const id = c.req.param('id');
  const { qty } = c.req.valid('json');
  const client = supabaseAdmin ?? supabasePublic;
  if (!client) return c.json({ ok: true });
  if (qty === 0) {
    await client.from('cart_items').delete().eq('id', id);
  } else {
    await client.from('cart_items').update({ qty }).eq('id', id);
  }
  return c.json({ ok: true });
});

app.delete('/items/:id', async (c) => {
  const id = c.req.param('id');
  const client = supabaseAdmin ?? supabasePublic;
  if (!client) return c.json({ ok: true });
  await client.from('cart_items').delete().eq('id', id);
  return c.json({ ok: true });
});

export default app;
