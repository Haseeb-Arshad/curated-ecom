-- Minimal schema excerpt for initial endpoints and affiliate tracking
create table if not exists public.categories (
  id bigserial primary key,
  slug text unique not null,
  name text not null,
  parent_id bigint references public.categories(id)
);

create table if not exists public.brands (
  id bigserial primary key,
  slug text unique not null,
  name text not null
);

create table if not exists public.products (
  id bigserial primary key,
  slug text unique not null,
  title text not null,
  description text,
  brand_id bigint references public.brands(id) on delete set null,
  category_id bigint references public.categories(id) on delete set null,
  price_cents int,
  currency text default 'USD',
  published boolean default false,
  metadata jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.product_images (
  id bigserial primary key,
  product_id bigint references public.products(id) on delete cascade,
  url text not null,
  alt text,
  sort int default 0
);

create table if not exists public.affiliate_programs (
  id bigserial primary key,
  name text not null,
  type text not null,
  config jsonb default '{}'
);

create table if not exists public.affiliate_links (
  id bigserial primary key,
  product_id bigint references public.products(id) on delete set null,
  program_id bigint references public.affiliate_programs(id) on delete set null,
  external_url text not null,
  code text unique not null,
  commission_rate numeric,
  active boolean default true
);

create table if not exists public.affiliate_clicks (
  id bigserial primary key,
  link_id bigint references public.affiliate_links(id) on delete cascade,
  ts timestamptz default now(),
  referer text,
  ua text,
  ip_hash text,
  utm jsonb default '{}'
);

-- Reviews
create table if not exists public.reviews (
  id bigserial primary key,
  product_id bigint references public.products(id) on delete cascade,
  user_id uuid not null,
  rating int not null check (rating between 1 and 5),
  title text not null,
  body text not null,
  approved boolean default false,
  created_at timestamptz default now()
);

-- Wishlists
create table if not exists public.wishlists (
  id bigserial primary key,
  user_id uuid not null,
  name text not null,
  created_at timestamptz default now()
);

create table if not exists public.wishlist_items (
  id bigserial primary key,
  wishlist_id bigint references public.wishlists(id) on delete cascade,
  product_id bigint references public.products(id) on delete cascade,
  created_at timestamptz default now()
);

-- Cart & Orders
create table if not exists public.carts (
  id uuid primary key,
  user_id uuid,
  anon_id text,
  status text not null default 'active' check (status in ('active','converted')),
  created_at timestamptz default now()
);

create table if not exists public.cart_items (
  id bigserial primary key,
  cart_id uuid references public.carts(id) on delete cascade,
  product_id bigint references public.products(id) on delete restrict,
  variant_id bigint,
  qty int not null check (qty > 0),
  created_at timestamptz default now()
);

create table if not exists public.orders (
  id bigserial primary key,
  user_id uuid not null,
  status text not null default 'pending_payment',
  subtotal_cents int not null default 0,
  shipping_cents int not null default 0,
  tax_cents int not null default 0,
  total_cents int not null default 0,
  currency text not null default 'USD',
  created_at timestamptz default now()
);

create table if not exists public.order_items (
  id bigserial primary key,
  order_id bigint references public.orders(id) on delete cascade,
  product_id bigint references public.products(id) on delete restrict,
  variant_id bigint,
  qty int not null check (qty > 0),
  unit_price_cents int not null
);

-- minimal RLS for public reads
alter table public.reviews enable row level security;
create policy if not exists public_reviews_read on public.reviews for select using (approved = true);

alter table public.products enable row level security;
create policy if not exists public_products_read on public.products for select using (published = true);

alter table public.categories enable row level security;
create policy if not exists public_categories_read on public.categories for select using (true);

alter table public.brands enable row level security;
create policy if not exists public_brands_read on public.brands for select using (true);
