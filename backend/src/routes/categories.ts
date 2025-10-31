import { Hono } from 'hono';
import { supabasePublic } from '../lib/supabase';

const app = new Hono();

app.get('/', async (c) => {
  if (!supabasePublic) return c.json({ items: [] });
  const { data, error } = await supabasePublic
    .from('categories')
    .select('id, slug, name, parent_id')
    .order('name');
  if (error) {
    c.status(500);
    return c.json({ error: { message: error.message } });
  }
  return c.json({ items: data });
});

export default app;
