import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { prettyJSON } from 'hono/pretty-json';
import { secureHeaders } from 'hono/secure-headers';
import { env } from './env';
import { errorHandler } from './middlewares/error';
import { rateLimit } from './middlewares/rateLimit';
import { authOptional } from './middlewares/auth';
import { logger } from './middlewares/logger';
import health from './routes/health';
import products from './routes/products';
import categories from './routes/categories';
import brands from './routes/brands';
import affiliates from './routes/affiliates';
import reviews from './routes/reviews';
import cart from './routes/cart';
import orders from './routes/orders';
import wishlists from './routes/wishlists';
import stripeWebhook from './routes/webhooks/stripe';
import affiliatesAdmin from './routes/affiliates-admin';

const app = new Hono();

app.use('*', secureHeaders());
app.use('*', logger());
app.use('*', cors({
  origin: env.ALLOWED_ORIGIN || '*',
  allowMethods: ['GET','POST','PATCH','DELETE','OPTIONS'],
  allowHeaders: ['Content-Type','Authorization'],
  maxAge: 86400,
}));
app.use('*', prettyJSON());
app.use('*', rateLimit());
app.use('*', errorHandler());
app.use('*', authOptional());

app.route('/health', health);
app.route('/api/products', products);
app.route('/api/categories', categories);
app.route('/api/brands', brands);
app.route('/api/reviews', reviews);
app.route('/api/cart', cart);
app.route('/api/orders', orders);
app.route('/api/wishlists', wishlists);
app.route('/webhooks/stripe', stripeWebhook);
app.route('/', affiliatesAdmin);

// Affiliate redirect lives at top-level path like /r/:code
app.route('/', affiliates);

export default {
  port: env.PORT || 8787,
  fetch: app.fetch,
};
