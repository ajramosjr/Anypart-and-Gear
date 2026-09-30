create policy "APG admins post for active shops" on public.business_posts
for insert to authenticated
with check (
  (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  and exists (
    select 1 from public.shops
    where shops.id = shop_id
      and shops.owner_id = business_posts.owner_id
      and shops.is_active
  )
);
