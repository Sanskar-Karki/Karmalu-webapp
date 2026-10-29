-- KARMALU — hand-picked, ordered products for the home pages
-- ("New Arrivals" on Originals, "Featured this season" on Living & Decor).
-- Run once in the Supabase SQL editor. Safe to run again.
--
-- home_rank: null = not picked; 0, 1, 2… = position in the home page section.

alter table public.catalog_products
  add column if not exists home_rank int;

create index if not exists catalog_products_home_rank_idx
  on public.catalog_products (brand, home_rank)
  where home_rank is not null;
