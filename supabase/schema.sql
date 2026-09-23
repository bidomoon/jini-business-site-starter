-- JINI BUSINESS SITE STARTER / Supabase schema
-- Run this in a NEW dedicated Supabase project after approval.

create table if not exists public.site_settings (
  id bigint primary key default 1,
  company_name text not null default '스마트포스',
  tagline text default '현장을 더 스마트하게',
  phone text,
  kakao_url text,
  address text,
  business_no text,
  hero_title text,
  hero_subtitle text,
  primary_color text default '#0f315f',
  accent_color text default '#ff8a2a',
  updated_at timestamptz default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text,
  summary text,
  image_url text,
  status text not null default 'published',
  created_at timestamptz default now()
);

create table if not exists public.installation_cases (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  region text,
  industry text,
  description text,
  cover_url text,
  installed_at date,
  status text not null default 'published',
  created_at timestamptz default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  excerpt text,
  status text not null default 'published',
  created_at timestamptz default now()
);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  company text,
  name text,
  phone text not null,
  region text,
  business_type text,
  message text not null,
  status text not null default 'new',
  created_at timestamptz default now()
);

alter table public.site_settings enable row level security;
alter table public.products enable row level security;
alter table public.installation_cases enable row level security;
alter table public.posts enable row level security;
alter table public.inquiries enable row level security;

create policy "public read settings" on public.site_settings for select to anon, authenticated using (true);
create policy "public read products" on public.products for select to anon, authenticated using (status='published' or auth.role()='authenticated');
create policy "public read cases" on public.installation_cases for select to anon, authenticated using (status='published' or auth.role()='authenticated');
create policy "public read posts" on public.posts for select to anon, authenticated using (status='published' or auth.role()='authenticated');
create policy "public insert inquiries" on public.inquiries for insert to anon, authenticated with check (true);

create policy "admin settings" on public.site_settings for all to authenticated using (true) with check (true);
create policy "admin products" on public.products for all to authenticated using (true) with check (true);
create policy "admin cases" on public.installation_cases for all to authenticated using (true) with check (true);
create policy "admin posts" on public.posts for all to authenticated using (true) with check (true);
create policy "admin inquiries" on public.inquiries for select to authenticated using (true);
create policy "admin update inquiries" on public.inquiries for update to authenticated using (true) with check (true);

insert into storage.buckets (id, name, public)
values ('site-media','site-media', true)
on conflict (id) do update set public = true;

create policy "public media read" on storage.objects for select to public using (bucket_id='site-media');
create policy "admin media insert" on storage.objects for insert to authenticated with check (bucket_id='site-media');
create policy "admin media update" on storage.objects for update to authenticated using (bucket_id='site-media') with check (bucket_id='site-media');
create policy "admin media delete" on storage.objects for delete to authenticated using (bucket_id='site-media');
