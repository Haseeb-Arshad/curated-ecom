import { Hono } from 'hono';
import { supabaseAdmin } from '../lib/supabase';
import crypto from 'node:crypto';

const app = new Hono();

function ipHash(ip: string) {
  return crypto.createHash('sha256').update(ip).digest('hex');
}

app.get('r/:code', async (c) => {
  const code = c.req.param('code');
  let target = 'https://example.com/';

  if (supabaseAdmin) {
    const { data: link } = await supabaseAdmin
      .from('affiliate_links')
      .select('id, external_url, active')
      .eq('code', code)
      .eq('active', true)
      .single();

    if (link?.external_url) {
      target = link.external_url;

      const referer = c.req.header('referer') || null;
      const ua = c.req.header('user-agent') || null;
      const ip = c.req.header('x-forwarded-for')?.split(',')[0]?.trim() || c.req.header('cf-connecting-ip') || 'local';
      const url = new URL(c.req.url);
      const utm: Record<string, string> = {};
      for (const [k, v] of url.searchParams.entries()) {
        if (k.startsWith('utm_')) utm[k] = v;
      }

      await supabaseAdmin.from('affiliate_clicks').insert({
        link_id: link.id,
        referer,
        ua,
        ip_hash: ipHash(String(ip)),
        utm,
      });
    }
  }

  return c.redirect(target, 302);
});

export default app;
