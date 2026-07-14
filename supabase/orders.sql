-- KARMALU / Karmify — orders table + secure insert RPC
-- Run this in the Supabase SQL editor (Dashboard → SQL → New query).

create table if not exists public.orders (
  order_id          text primary key,
  brand             text not null default 'activewear',
  customer_name     text not null,
  whatsapp_number   text not null,
  email             text,
  address           jsonb not null,          -- { street, city, state, zip, country }
  notes             text,
  items             jsonb not null,          -- [{ name, quantity, price, size?, color? }, ...]
  subtotal          numeric(10,2) not null default 0,
  delivery_charge   numeric(10,2) not null default 0,
  total             numeric(10,2) not null,
  delivery_method   text,
  payment_method    text,
  status            text not null default 'Awaiting WhatsApp Confirmation',
  created_at        timestamptz not null default now()
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_status_idx     on public.orders (status);

-- ── Row Level Security ──────────────────────────────────────────────
-- The site uses the publishable (anon) key. We DENY all direct table access to
-- the public (no insert/select policies) and instead expose ONE security-definer
-- function that generates the sequential id and inserts the order. This means
-- the public can create orders but can never read other people's orders.
-- The admin dashboard (service_role key) bypasses RLS for full read/write.

alter table public.orders enable row level security;
-- (Intentionally no anon policies — all public writes go through create_order().)

-- ── Secure insert function ──────────────────────────────────────────
-- Generates KRM-YYYYMMDD-NNNN atomically and inserts the order.
-- Returns the new order_id. Runs as the table owner (security definer),
-- so it works even with RLS locked down.
create or replace function public.create_order(payload jsonb)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  prefix     text;
  seq        int;
  new_id     text;
begin
  prefix := 'KRM-' || to_char(now(), 'YYYYMMDD') || '-';

  select count(*) into seq
  from public.orders
  where order_id like prefix || '%';

  new_id := prefix || lpad((seq + 1)::text, 4, '0');

  insert into public.orders (
    order_id, brand, customer_name, whatsapp_number, email, address, notes,
    items, subtotal, delivery_charge, total, delivery_method, payment_method, status
  ) values (
    new_id,
    coalesce(payload->>'brand', 'activewear'),
    payload->>'customerName',
    payload->>'whatsappNumber',
    payload->>'email',
    payload->'address',
    payload->>'notes',
    payload->'items',
    coalesce((payload->>'subtotal')::numeric, 0),
    coalesce((payload->>'deliveryCharge')::numeric, 0),
    (payload->>'total')::numeric,
    payload->>'deliveryMethod',
    payload->>'paymentMethod',
    'Awaiting WhatsApp Confirmation'
  );

  return new_id;
end;
$$;

-- Allow the public (anon) + logged-in users to call the function only.
grant execute on function public.create_order(jsonb) to anon, authenticated;
