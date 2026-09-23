begin;

alter table public.listings
  add column if not exists shop_id uuid;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'listings_shop_id_fkey'
      and conrelid = 'public.listings'::regclass
  ) then
    alter table public.listings
      add constraint listings_shop_id_fkey
      foreign key (shop_id) references public.shops(id) on delete set null;
  end if;
end $$;

create index if not exists listings_shop_id_idx
  on public.listings(shop_id)
  where shop_id is not null;

drop policy if exists "Listings use owned shops on insert" on public.listings;
create policy "Listings use owned shops on insert"
  on public.listings as restrictive for insert to authenticated
  with check (
    shop_id is null or exists (
      select 1 from public.shops
      where shops.id = listings.shop_id
        and shops.owner_id = (select auth.uid())
    )
  );

drop policy if exists "Listings use owned shops on update" on public.listings;
create policy "Listings use owned shops on update"
  on public.listings as restrictive for update to authenticated
  using (
    shop_id is null or exists (
      select 1 from public.shops
      where shops.id = listings.shop_id
        and shops.owner_id = (select auth.uid())
    )
  )
  with check (
    shop_id is null or exists (
      select 1 from public.shops
      where shops.id = listings.shop_id
        and shops.owner_id = (select auth.uid())
    )
  );

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  notification_type text not null check (notification_type = btrim(notification_type) and notification_type <> ''),
  title text not null check (title = btrim(title) and title <> ''),
  body text,
  link text,
  listing_id uuid references public.listings(id) on delete set null,
  conversation_id uuid references public.conversations(id) on delete set null,
  transaction_id uuid references public.transactions(id) on delete set null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_created_idx on public.notifications(user_id, created_at desc);
create index if not exists notifications_user_unread_idx on public.notifications(user_id, created_at desc) where read_at is null;
create index if not exists notifications_actor_idx on public.notifications(actor_id) where actor_id is not null;
create index if not exists notifications_listing_idx on public.notifications(listing_id) where listing_id is not null;
create index if not exists notifications_conversation_idx on public.notifications(conversation_id) where conversation_id is not null;
create index if not exists notifications_transaction_idx on public.notifications(transaction_id) where transaction_id is not null;

alter table public.notifications enable row level security;
revoke all on public.notifications from public, anon, authenticated;
grant select, delete on public.notifications to authenticated;
grant update (read_at) on public.notifications to authenticated;
grant select, insert, update, delete on public.notifications to service_role;

drop policy if exists "Users view own notifications" on public.notifications;
create policy "Users view own notifications" on public.notifications
  for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "Users mark own notifications read" on public.notifications;
create policy "Users mark own notifications read" on public.notifications
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users delete own notifications" on public.notifications;
create policy "Users delete own notifications" on public.notifications
  for delete to authenticated using ((select auth.uid()) = user_id);

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'notifications'
  ) then
    alter publication supabase_realtime add table public.notifications;
  end if;
end $$;

comment on table public.notifications is 'Private in-app notifications delivered to APG users.';
comment on column public.notifications.notification_type is 'Application event type such as message, transaction, or review.';

commit;
