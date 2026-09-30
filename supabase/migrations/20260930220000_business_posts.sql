create table public.business_posts (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  category text not null check (category in ('Auto', 'Marine', 'Motorcycle', 'Tools', 'Equipment', 'Other')),
  caption text not null check (char_length(btrim(caption)) between 3 and 500),
  image_url text not null check (image_url ~ '^https://'),
  price numeric(12,2) check (price >= 0),
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  check (expires_at is null or expires_at > created_at)
);

create index business_posts_recent_idx on public.business_posts(created_at desc);
create index business_posts_shop_recent_idx on public.business_posts(shop_id, created_at desc);
alter table public.business_posts enable row level security;
grant select on public.business_posts to anon, authenticated;
grant insert, delete on public.business_posts to authenticated;

create policy "Public sees active shop posts" on public.business_posts for select to anon, authenticated
  using ((expires_at is null or expires_at > now()) and exists (
    select 1 from public.shops where shops.id = shop_id and shops.is_active
  ));
create policy "Owners create own shop posts" on public.business_posts for insert to authenticated
  with check (owner_id = (select auth.uid()) and exists (
    select 1 from public.shops where shops.id = shop_id and shops.owner_id = (select auth.uid()) and shops.is_active
  ));
create policy "Owners remove own shop posts" on public.business_posts for delete to authenticated
  using (owner_id = (select auth.uid()));
