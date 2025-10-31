import { Hono } from 'hono';
import { supabaseAdmin, supabasePublic } from '../lib/supabase';

const app = new Hono();

app.post('/checkout', async (c) => {
  const user = c.get('user');
  if (!user?.sub) { c.status(401); return c.json({ error: { message: 'Unauthorized' } }); }
  const client = supabaseAdmin ?? supabasePublic;
  if (!client) return c.json({ ok: true });

  // Find active cart
  const cart = await client.from('carts').select('id').eq('user_id', user.sub).eq('status', 'active').single();
  if (cart.error || !cart.data) { c.status(400); return c.json({ error: { message: 'No active cart' } }); }

  // Pull items with prices
  const items = await client
    .from('cart_items')
    .select('id, qty, products(id, price_cents, currency)')
    .eq('cart_id', cart.data.id);
  const list = items.data ?? [];
  const currency = list[0]?.products?.currency ?? 'USD';
  const subtotal = list.reduce((sum: number, it: any) => sum + (it.products?.price_cents ?? 0) * it.qty, 0);
  const tax = Math.round(subtotal * 0.0);
  const shipping = 0;
  const total = subtotal + tax + shipping;

  const orderIns = await client.from('orders').insert({ user_id: user.sub, status: 'pending_payment', subtotal_cents: subtotal, tax_cents: tax, shipping_cents: shipping, total_cents: total, currency }).select('id').single();
  if (orderIns.error || !orderIns.data) { c.status(500); return c.json({ error: { message: orderIns.error?.message || 'Order create failed' } }); }
  const orderId = orderIns.data.id;
  // Insert order items
  const orderItems = list.map((it: any) => ({ order_id: orderId, product_id: it.products.id, qty: it.qty, unit_price_cents: it.products.price_cents }));
  if (orderItems.length) await client.from('order_items').insert(orderItems);
  // Mark cart converted
  await client.from('carts').update({ status: 'converted' }).eq('id', cart.data.id);
  return c.json({ id: orderId, status: 'pending_payment', total_cents: total, currency });
});

app.get('/:id', async (c) => {
  const user = c.get('user');
  if (!user?.sub) { c.status(401); return c.json({ error: { message: 'Unauthorized' } }); }
  const id = c.req.param('id');
  const client = supabaseAdmin ?? supabasePublic;
  if (!client) return c.json({});
  const { data, error } = await client.from('orders').select('id, status, subtotal_cents, tax_cents, shipping_cents, total_cents, currency, order_items(qty, unit_price_cents, products(slug,title))').eq('id', id).single();
  if (error || !data) { c.status(404); return c.json({ error: { message: 'Not found' } }); }
  return c.json(data);
});

export default app;
