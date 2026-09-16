-- Anypart & Gear initial production schema
-- Safe to run more than once in the Supabase SQL editor.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  location text,
  bio text,
  is_business boolean not null default false,
  is_verified_business boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  seller_name text not null default 'Seller',
  title text not null check (char_length(title) between 3 and 100),
  description text not null check (char_length(description) between 10 and 2500),
  price numeric(12,2) not null default 0 check (price >= 0),
  condition text not null check (condition in ('New','Like new','Good','Fair')),
  category text not null check (category in ('Car Parts','Boat Parts','Motorcycles','Trucks','Trailers','Tools','Machinery','Workwear & Apparel','Vehicles for Sale','Other')),
  location text not null,
  image_url text not null,
  image_urls text[] not null default '{}',
  trade boolean not null default false,
  trade_type text,
  status text not null default 'active' check (status in ('draft','active','sold','removed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists listings_active_created_idx on public.listings(created_at desc) where status = 'active';
create index if not exists listings_category_idx on public.listings(category);
create index if not exists listings_user_idx on public.listings(user_id);

create table if not exists public.favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  listing_id uuid not null references public.listings(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, listing_id)
);
create index if not exists favorites_listing_idx on public.favorites(listing_id);

create table if not exists public.shops (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 100),
  specialty text not null check (char_length(specialty) between 2 and 120),
  description text not null check (char_length(description) between 10 and 800),
  location text not null check (char_length(location) between 2 and 120),
  postal_code text not null check (char_length(postal_code) between 3 and 12),
  hours text not null default 'Contact for hours' check (char_length(hours) between 2 and 160),
  website text,
  services text[] not null default '{}',
  is_verified boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists shops_location_idx on public.shops(location);
create index if not exists shops_postal_code_idx on public.shops(postal_code);
create index if not exists shops_specialty_idx on public.shops(specialty);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.listings(id) on delete cascade,
  shop_id uuid references public.shops(id) on delete cascade,
  buyer_id uuid not null references auth.users(id) on delete cascade,
  seller_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (listing_id, buyer_id, seller_id),
  unique (shop_id, buyer_id, seller_id),
  check ((listing_id is not null and shop_id is null) or (listing_id is null and shop_id is not null)),
  check (buyer_id <> seller_id)
);
create index if not exists conversations_buyer_idx on public.conversations(buyer_id, updated_at desc);
create index if not exists conversations_seller_idx on public.conversations(seller_id, updated_at desc);
create index if not exists conversations_shop_idx on public.conversations(shop_id, updated_at desc);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists messages_conversation_idx on public.messages(conversation_id, created_at);
create index if not exists messages_sender_idx on public.messages(sender_id);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references auth.users(id) on delete cascade,
  listing_id uuid references public.listings(id) on delete set null,
  reason text not null,
  details text,
  status text not null default 'open' check (status in ('open','reviewing','resolved','dismissed')),
  created_at timestamptz not null default now()
);
create index if not exists reports_reporter_idx on public.reports(reporter_id);
create index if not exists reports_listing_idx on public.reports(listing_id) where listing_id is not null;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(nullif(trim(new.raw_user_meta_data->>'full_name'), ''), 'Member'))
  on conflict (id) do nothing;
  return new;
end;
$$;
revoke execute on function public.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public as $$ begin new.updated_at = now(); return new; end; $$;
drop trigger if exists listings_touch_updated_at on public.listings;
create trigger listings_touch_updated_at before update on public.listings for each row execute procedure public.touch_updated_at();
drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at before update on public.profiles for each row execute procedure public.touch_updated_at();
drop trigger if exists shops_touch_updated_at on public.shops;
create trigger shops_touch_updated_at before update on public.shops for each row execute procedure public.touch_updated_at();

create or replace function public.protect_shop_verification()
returns trigger language plpgsql set search_path = public as $$
begin
  if (select auth.uid()) is not null then
    new.is_verified := case when tg_op = 'UPDATE' then old.is_verified else false end;
  end if;
  return new;
end;
$$;
drop trigger if exists shops_protect_verification on public.shops;
create trigger shops_protect_verification before insert or update on public.shops for each row execute procedure public.protect_shop_verification();

create or replace function public.touch_conversation_from_message()
returns trigger language plpgsql set search_path = public as $$
begin
  update public.conversations set updated_at = now() where id = new.conversation_id;
  return new;
end;
$$;
revoke execute on function public.touch_conversation_from_message() from public, anon, authenticated;
drop trigger if exists messages_touch_conversation on public.messages;
create trigger messages_touch_conversation after insert on public.messages for each row execute procedure public.touch_conversation_from_message();

alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.shops enable row level security;
alter table public.favorites enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.reports enable row level security;

drop policy if exists "Public profiles are viewable" on public.profiles;
create policy "Public profiles are viewable" on public.profiles for select using (true);
drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

drop policy if exists "Active shops are public" on public.shops;
create policy "Active shops are public" on public.shops for select using (is_active or (select auth.uid()) = owner_id);
drop policy if exists "Owners create shops" on public.shops;
create policy "Owners create shops" on public.shops for insert to authenticated with check ((select auth.uid()) = owner_id and is_verified = false);
drop policy if exists "Owners update shops" on public.shops;
create policy "Owners update shops" on public.shops for update to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
drop policy if exists "Owners delete shops" on public.shops;
create policy "Owners delete shops" on public.shops for delete to authenticated using ((select auth.uid()) = owner_id);

drop policy if exists "Active listings are public" on public.listings;
create policy "Active listings are public" on public.listings for select using (status = 'active' or (select auth.uid()) = user_id);
drop policy if exists "Users create own listings" on public.listings;
create policy "Users create own listings" on public.listings for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "Users update own listings" on public.listings;
create policy "Users update own listings" on public.listings for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists "Users delete own listings" on public.listings;
create policy "Users delete own listings" on public.listings for delete to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "Users view own favorites" on public.favorites;
create policy "Users view own favorites" on public.favorites for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "Users add own favorites" on public.favorites;
create policy "Users add own favorites" on public.favorites for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "Users remove own favorites" on public.favorites;
create policy "Users remove own favorites" on public.favorites for delete to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "Participants view conversations" on public.conversations;
create policy "Participants view conversations" on public.conversations for select to authenticated using ((select auth.uid()) in (buyer_id, seller_id));
drop policy if exists "Buyers start conversations" on public.conversations;
create policy "Buyers start conversations" on public.conversations for insert to authenticated with check ((select auth.uid()) = buyer_id);
drop policy if exists "Participants view messages" on public.messages;
create policy "Participants view messages" on public.messages for select to authenticated using (exists (select 1 from public.conversations c where c.id = conversation_id and (select auth.uid()) in (c.buyer_id, c.seller_id)));
drop policy if exists "Participants send messages" on public.messages;
create policy "Participants send messages" on public.messages for insert to authenticated with check ((select auth.uid()) = sender_id and exists (select 1 from public.conversations c where c.id = conversation_id and (select auth.uid()) in (c.buyer_id, c.seller_id)));

drop policy if exists "Users submit reports" on public.reports;
create policy "Users submit reports" on public.reports for insert to authenticated with check ((select auth.uid()) = reporter_id);
drop policy if exists "Users view own reports" on public.reports;
create policy "Users view own reports" on public.reports for select to authenticated using ((select auth.uid()) = reporter_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('part-images', 'part-images', true, 10485760, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public listing images" on storage.objects;
create policy "Public listing images" on storage.objects for select using (bucket_id = 'part-images');
drop policy if exists "Users upload listing images" on storage.objects;
create policy "Users upload listing images" on storage.objects for insert to authenticated with check (bucket_id = 'part-images' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "Users update own listing images" on storage.objects;
create policy "Users update own listing images" on storage.objects for update to authenticated using (bucket_id = 'part-images' and owner_id = auth.uid()::text);
drop policy if exists "Users delete own listing images" on storage.objects;
create policy "Users delete own listing images" on storage.objects for delete to authenticated using (bucket_id = 'part-images' and owner_id = auth.uid()::text);

-- Explicit Data API grants support projects configured to keep new tables private by default.
grant usage on schema public to anon, authenticated;
grant select on public.profiles to anon, authenticated;
grant update on public.profiles to authenticated;
grant select on public.listings to anon, authenticated;
grant insert, update, delete on public.listings to authenticated;
grant select on public.shops to anon, authenticated;
grant insert, update, delete on public.shops to authenticated;
grant select, insert, delete on public.favorites to authenticated;
grant select, insert, update on public.conversations to authenticated;
grant select, insert, update on public.messages to authenticated;
grant select, insert on public.reports to authenticated;
