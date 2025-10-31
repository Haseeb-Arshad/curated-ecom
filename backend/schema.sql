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

alter table public.products enable row level security;
create policy if not exists public_products_read on public.products for select using (published = true);

alter table public.categories enable row level security;
create policy if not exists public_categories_read on public.categories for select using (true);

alter table public.brands enable row level security;
create policy if not exists public_brands_read on public.brands for select using (true);
