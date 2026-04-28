-- Run this in the Supabase SQL Editor to create the domain tables.

-- === domains ===
create table if not exists domains (
  id text primary key,
  name text not null unique,
  tld text not null,
  site_id text references sites(id) on delete set null,
  user_id uuid not null references auth.users(id) on delete cascade,
  source text not null check (source in ('REGISTERED','EXTERNAL')),
  status text not null check (status in ('PENDING','ACTIVE','EXPIRED','FAILED')),
  registered_at timestamptz,
  expires_at timestamptz,
  auto_renew boolean not null default true,
  porkbun_order_id text,
  owner_name text,
  owner_email text,
  owner_phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_domains_user_id on domains(user_id);
create index if not exists idx_domains_site_id on domains(site_id);
create index if not exists idx_domains_status on domains(status);

alter table domains enable row level security;

create policy "Users can read own domains"
  on domains for select using (auth.uid() = user_id);

create policy "Users can insert own domains"
  on domains for insert with check (auth.uid() = user_id);

create policy "Users can update own domains"
  on domains for update using (auth.uid() = user_id);

create policy "Users can delete own domains"
  on domains for delete using (auth.uid() = user_id);

-- === domain_orders ===
create table if not exists domain_orders (
  id text primary key,
  domain_id text references domains(id) on delete set null,
  user_id uuid not null references auth.users(id) on delete cascade,
  domain_name text not null,
  tld text not null,
  price_birr integer not null,
  years integer not null default 1,
  kind text not null check (kind in ('INITIAL','RENEWAL')),
  status text not null check (status in ('PENDING_PAYMENT','PAID','REGISTERED','REFUNDED','FAILED')),
  chapa_tx_ref text not null unique,
  chapa_charge_id text,
  failure_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_domain_orders_user_id on domain_orders(user_id);
create index if not exists idx_domain_orders_domain_id on domain_orders(domain_id);

alter table domain_orders enable row level security;

create policy "Users can read own domain orders"
  on domain_orders for select using (auth.uid() = user_id);

-- === payment_methods ===
create table if not exists payment_methods (
  id text primary key,
  user_id uuid not null unique references auth.users(id) on delete cascade,
  chapa_customer_id text not null,
  card_last4 text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table payment_methods enable row level security;

create policy "Users can read own payment method"
  on payment_methods for select using (auth.uid() = user_id);

-- Note: writes to domain_orders and payment_methods, plus all backend mutations on domains
-- by webhook/cron jobs, go through the service-role client which bypasses RLS.
