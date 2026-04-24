-- Run this in the Supabase SQL Editor to create the sites table.

create table if not exists sites (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  slug text not null unique,
  template_id text not null,
  animation text not null default 'none',
  theme jsonb not null,
  sections jsonb not null default '[]',
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index for fast lookups by user and slug
create index if not exists idx_sites_user_id on sites(user_id);
create index if not exists idx_sites_slug on sites(slug);

-- Row Level Security: users can only access their own sites
alter table sites enable row level security;

-- Policy: users can read their own sites
create policy "Users can read own sites"
  on sites for select
  using (auth.uid() = user_id);

-- Policy: users can insert their own sites
create policy "Users can insert own sites"
  on sites for insert
  with check (auth.uid() = user_id);

-- Policy: users can update their own sites
create policy "Users can update own sites"
  on sites for update
  using (auth.uid() = user_id);

-- Policy: users can delete their own sites
create policy "Users can delete own sites"
  on sites for delete
  using (auth.uid() = user_id);

-- Policy: anyone can read published sites (for the public site renderer)
create policy "Anyone can read published sites"
  on sites for select
  using (published = true);

-- === Supabase Storage: Image Uploads ===
-- Create a public bucket for site images.
-- Run this in the SQL Editor or configure via Supabase Dashboard > Storage.

insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do nothing;

-- Allow authenticated users to upload to their own site folder
create policy "Users can upload to own site folder"
  on storage.objects for insert
  with check (
    bucket_id = 'site-images' and
    auth.role() = 'authenticated'
  );

-- Allow public read of all site images
create policy "Public read site images"
  on storage.objects for select
  using (bucket_id = 'site-images');

-- Allow users to delete their own uploads
create policy "Users can delete own uploads"
  on storage.objects for delete
  using (
    bucket_id = 'site-images' and
    auth.role() = 'authenticated'
  );
