-- KARMALU — product catalogue, media library and admin access
-- Run this in the Supabase SQL editor (Dashboard → SQL → New query). Then sign
-- in at /admin and press "Import current products" once to copy the products
-- that ship in the code into these tables.
--
-- Security model
--   • The public site (publishable key) can only READ published products,
--     categories, and media.
--   • Writes require a signed-in Supabase Auth user whose email is listed in
--     public.admin_users. RLS enforces this on every insert/update/delete,
--     so the admin pages can never be bypassed by calling the API directly.

-- ── Admins ──────────────────────────────────────────────────────────
create table if not exists public.admin_users (
  email      text primary key,
  created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;

-- True when the current request comes from a signed-in admin.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;
grant execute on function public.is_admin() to anon, authenticated;

-- Admins can see the admin list (to confirm their own access); nobody can
-- change it through the API — add admins here in the SQL editor:
--   insert into public.admin_users (email) values ('you@example.com');
drop policy if exists "admins read admin list" on public.admin_users;
create policy "admins read admin list" on public.admin_users
  for select to authenticated using (public.is_admin());

-- ── Categories ──────────────────────────────────────────────────────
create table if not exists public.catalog_categories (
  brand      text not null check (brand in ('decor', 'originals')),
  slug       text not null,
  name       text not null,
  tagline    text not null default '',
  image      text not null default '',
  position   int  not null default 0,
  updated_at timestamptz not null default now(),
  primary key (brand, slug)
);
alter table public.catalog_categories enable row level security;

drop policy if exists "public read categories" on public.catalog_categories;
create policy "public read categories" on public.catalog_categories
  for select to anon, authenticated using (true);
drop policy if exists "admins write categories" on public.catalog_categories;
create policy "admins write categories" on public.catalog_categories
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ── Products ────────────────────────────────────────────────────────
create table if not exists public.catalog_products (
  id                 text primary key default ('p-' || substr(md5(random()::text), 1, 10)),
  brand              text not null check (brand in ('decor', 'originals')),
  slug               text not null,
  name               text not null,
  category_slug      text not null,
  tags               text[] not null default '{}',
  price              numeric(10,2) not null check (price >= 0),
  old_price          numeric(10,2) check (old_price is null or old_price >= 0),
  description        text not null default '',
  details            text[] not null default '{}',
  badge              text,
  rating             numeric(3,2) not null default 0,
  reviews            int not null default 0,
  sizes              text[] not null default '{}',
  size_chart         jsonb,            -- [{ size, chest, waist, hip }]
  colors             jsonb not null default '[]'::jsonb, -- [{ hex, label }]
  media              jsonb not null default '[]'::jsonb, -- ordered [{ url, type: 'image'|'video', publicId? }]
  hover_url          text,             -- optional second photo shown on card hover
  status             text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  position           int  not null default 0,
  karmify_product_id text,             -- link to Karmify inventory (future)
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  unique (brand, slug)
);
create index if not exists catalog_products_brand_status_idx
  on public.catalog_products (brand, status, position);
alter table public.catalog_products enable row level security;

drop policy if exists "public read published products" on public.catalog_products;
create policy "public read published products" on public.catalog_products
  for select to anon, authenticated using (status = 'published' or public.is_admin());
drop policy if exists "admins write products" on public.catalog_products;
create policy "admins write products" on public.catalog_products
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ── Media library (Cloudinary uploads) ──────────────────────────────
create table if not exists public.media_assets (
  id          uuid primary key default gen_random_uuid(),
  url         text not null,
  public_id   text not null unique,
  type        text not null check (type in ('image', 'video')),
  width       int,
  height      int,
  bytes       bigint,
  format      text,
  original_filename text,
  created_at  timestamptz not null default now()
);
create index if not exists media_assets_created_idx on public.media_assets (created_at desc);
alter table public.media_assets enable row level security;

drop policy if exists "admins manage media" on public.media_assets;
create policy "admins manage media" on public.media_assets
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ── Keep updated_at fresh ───────────────────────────────────────────
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;
drop trigger if exists catalog_products_touch on public.catalog_products;
create trigger catalog_products_touch before update on public.catalog_products
  for each row execute function public.touch_updated_at();
drop trigger if exists catalog_categories_touch on public.catalog_categories;
create trigger catalog_categories_touch before update on public.catalog_categories
  for each row execute function public.touch_updated_at();

-- ── Home page picks (also in home_picks.sql for existing setups) ─────
alter table public.catalog_products add column if not exists home_rank int;
create index if not exists catalog_products_home_rank_idx
  on public.catalog_products (brand, home_rank) where home_rank is not null;
