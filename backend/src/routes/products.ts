import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { supabasePublic } from '../lib/supabase';

const listSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

const app = new Hono();

app.get('/', zValidator('query', listSchema), async (c) => {
  const params = c.req.valid('query');
  const { page, limit, q, category, brand } = params;

  if (!supabasePublic) {
    return c.json({ items: [], page, limit, total: 0 });
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabasePublic
    .from('products')
    .select(
      'id, slug, title, description, price_cents, currency, brands(name,slug), categories(name,slug), product_images(url,alt,sort)',
      { count: 'exact' }
    )
    .eq('published', true)
    .order('id', { ascending: false })
    .range(from, to);

  if (q) {
    query = query.ilike('title', `%${q}%`);
  }
  if (category) {
    query = query.eq('categories.slug', category);
  }
  if (brand) {
    query = query.eq('brands.slug', brand);
  }

  const { data, error, count } = await query;
  if (error) {
    c.status(500);
    return c.json({ error: { message: error.message } });
  }

  const items = (data || []).map((row: any) => ({
    id: row.slug,
    name: row.title,
    brand: row.brands?.name ?? null,
    category: row.categories?.name ?? null,
    image: (row.product_images?.sort((a: any, b: any) => (a.sort ?? 0) - (b.sort ?? 0))[0]?.url) ?? null,
  }));

  return c.json({ items, page, limit, total: count ?? items.length });
});

app.get('/:slug', async (c) => {
  const slug = c.req.param('slug');
  if (!supabasePublic) {
    c.status(404);
    return c.json({ error: { message: 'Not found' } });
  }
  const { data, error } = await supabasePublic
    .from('products')
    .select('id, slug, title, description, price_cents, currency, brands(name,slug), categories(name,slug), product_images(url,alt,sort)')
    .eq('slug', slug)
    .single();
  if (error || !data) {
    c.status(404);
    return c.json({ error: { message: 'Not found' } });
  }
  const d: any = data;
  // Try fetch active affiliate link
  const aff = await supabasePublic
    .from('affiliate_links')
    .select('code, external_url, active')
    .eq('product_id', data.id)
    .eq('active', true)
    .limit(1)
    .maybeSingle();
  const affiliate_code = aff.data?.code ?? null;
  const purchase_url = aff.data?.external_url ?? null;
  return c.json({
    id: d.slug,
    name: d.title,
    brand: d.brands?.name ?? null,
    brand_slug: d.brands?.slug ?? null,
    category: d.categories?.name ?? null,
    category_slug: d.categories?.slug ?? null,
    images: (d.product_images || []).sort((a: any, b: any) => (a.sort ?? 0) - (b.sort ?? 0)),
    description: d.description,
    price_cents: d.price_cents,
    currency: d.currency,
    affiliate_code,
    purchase_url,
    redirect_url: affiliate_code ? `/r/${affiliate_code}` : null,
  });
});

export default app;
