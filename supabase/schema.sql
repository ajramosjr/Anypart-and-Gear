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
  email_verified boolean not null default false,
  trusted_seller boolean not null default false,
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
  reason text not null check (char_length(reason) between 3 and 120),
  details text check (details is null or char_length(details) <= 1000),
  status text not null default 'open' check (status in ('open','reviewing','resolved','dismissed')),
  created_at timestamptz not null default now()
);
create index if not exists reports_reporter_idx on public.reports(reporter_id);
create index if not exists reports_listing_idx on public.reports(listing_id) where listing_id is not null;

create table if not exists public.blocks (
  blocker_id uuid not null references auth.users(id) on delete cascade,
  blocked_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  check (blocker_id <> blocked_id)
);
create index if not exists blocks_blocked_idx on public.blocks(blocked_id);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null unique references public.conversations(id) on delete cascade,
  buyer_confirmed_at timestamptz,
  seller_confirmed_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists transactions_completed_idx on public.transactions(completed_at) where completed_at is not null;

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid not null references public.transactions(id) on delete cascade,
  reviewer_id uuid not null references auth.users(id) on delete cascade,
  reviewee_id uuid not null references auth.users(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text check (comment is null or char_length(comment) <= 800),
  created_at timestamptz not null default now(),
  unique (transaction_id, reviewer_id),
  check (reviewer_id <> reviewee_id)
);
create index if not exists reviews_reviewee_idx on public.reviews(reviewee_id, created_at desc);
create index if not exists reviews_reviewer_idx on public.reviews(reviewer_id, created_at desc);

create table if not exists public.notification_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email_messages boolean not null default true,
  email_transactions boolean not null default true,
  email_reviews boolean not null default true,
  updated_at timestamptz not null default now()
);

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
drop trigger if exists notification_preferences_touch_updated_at on public.notification_preferences;
create trigger notification_preferences_touch_updated_at before update on public.notification_preferences for each row execute procedure public.touch_updated_at();

create or replace function public.protect_shop_verification()
returns trigger language plpgsql set search_path = public as $$
begin
  if (select auth.uid()) is not null and coalesce((select auth.jwt()->'app_metadata'->>'role'), '') <> 'admin' then
    new.is_verified := case when tg_op = 'UPDATE' then old.is_verified else false end;
  end if;
  return new;
end;
$$;
drop trigger if exists shops_protect_verification on public.shops;
create trigger shops_protect_verification before insert or update on public.shops for each row execute procedure public.protect_shop_verification();

create or replace function public.protect_transaction_confirmation()
returns trigger language plpgsql set search_path = public as $$
declare
  participant record;
  current_user_id uuid := (select auth.uid());
begin
  if tg_op = 'UPDATE' then new.conversation_id := old.conversation_id; end if;
  select buyer_id, seller_id into participant from public.conversations where id = new.conversation_id;
  if not found or current_user_id is null or current_user_id not in (participant.buyer_id, participant.seller_id) then
    raise exception 'Only conversation participants can confirm an exchange';
  end if;
  if tg_op = 'UPDATE' then
    if current_user_id = participant.buyer_id then new.seller_confirmed_at := old.seller_confirmed_at;
    else new.buyer_confirmed_at := old.buyer_confirmed_at; end if;
  end if;
  if current_user_id = participant.buyer_id and new.buyer_confirmed_at is not null then new.buyer_confirmed_at := now(); end if;
  if current_user_id = participant.seller_id and new.seller_confirmed_at is not null then new.seller_confirmed_at := now(); end if;
  new.completed_at := case when new.buyer_confirmed_at is not null and new.seller_confirmed_at is not null then case when tg_op = 'UPDATE' then coalesce(old.completed_at, now()) else now() end else null end;
  new.updated_at := now();
  return new;
end;
$$;
revoke execute on function public.protect_transaction_confirmation() from public, anon, authenticated;
drop trigger if exists transactions_protect_confirmation on public.transactions;
create trigger transactions_protect_confirmation before insert or update on public.transactions for each row execute procedure public.protect_transaction_confirmation();

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
alter table public.blocks enable row level security;
alter table public.transactions enable row level security;
alter table public.reviews enable row level security;
alter table public.notification_preferences enable row level security;

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
drop policy if exists "Admins update shops" on public.shops;
create policy "Admins update shops" on public.shops for update to authenticated using (((select auth.jwt())->'app_metadata'->>'role') = 'admin') with check (((select auth.jwt())->'app_metadata'->>'role') = 'admin');

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
create policy "Buyers start conversations" on public.conversations for insert to authenticated with check ((select auth.uid()) = buyer_id and not exists (select 1 from public.blocks b where (b.blocker_id=buyer_id and b.blocked_id=seller_id) or (b.blocker_id=seller_id and b.blocked_id=buyer_id)));
drop policy if exists "Participants view messages" on public.messages;
create policy "Participants view messages" on public.messages for select to authenticated using (exists (select 1 from public.conversations c where c.id = conversation_id and (select auth.uid()) in (c.buyer_id, c.seller_id)));
drop policy if exists "Participants send messages" on public.messages;
create policy "Participants send messages" on public.messages for insert to authenticated with check ((select auth.uid()) = sender_id and exists (select 1 from public.conversations c where c.id = conversation_id and (select auth.uid()) in (c.buyer_id, c.seller_id) and not exists (select 1 from public.blocks b where (b.blocker_id=c.buyer_id and b.blocked_id=c.seller_id) or (b.blocker_id=c.seller_id and b.blocked_id=c.buyer_id))));

drop policy if exists "Users submit reports" on public.reports;
create policy "Users submit reports" on public.reports for insert to authenticated with check ((select auth.uid()) = reporter_id);
drop policy if exists "Users view own reports" on public.reports;
create policy "Users view own reports" on public.reports for select to authenticated using ((select auth.uid()) = reporter_id);
drop policy if exists "Admins view reports" on public.reports;
create policy "Admins view reports" on public.reports for select to authenticated using (((select auth.jwt())->'app_metadata'->>'role') = 'admin');
drop policy if exists "Admins update reports" on public.reports;
create policy "Admins update reports" on public.reports for update to authenticated using (((select auth.jwt())->'app_metadata'->>'role') = 'admin') with check (((select auth.jwt())->'app_metadata'->>'role') = 'admin');

drop policy if exists "Users view own blocks" on public.blocks;
create policy "Users view own blocks" on public.blocks for select to authenticated using ((select auth.uid()) = blocker_id);
drop policy if exists "Users create own blocks" on public.blocks;
create policy "Users create own blocks" on public.blocks for insert to authenticated with check ((select auth.uid()) = blocker_id);
drop policy if exists "Users remove own blocks" on public.blocks;
create policy "Users remove own blocks" on public.blocks for delete to authenticated using ((select auth.uid()) = blocker_id);

drop policy if exists "Participants view transactions" on public.transactions;
create policy "Participants view transactions" on public.transactions for select to authenticated using (exists (select 1 from public.conversations c where c.id = conversation_id and (select auth.uid()) in (c.buyer_id, c.seller_id)));
drop policy if exists "Participants create transactions" on public.transactions;
create policy "Participants create transactions" on public.transactions for insert to authenticated with check (exists (select 1 from public.conversations c where c.id = conversation_id and (select auth.uid()) in (c.buyer_id, c.seller_id)));
drop policy if exists "Participants update transactions" on public.transactions;
create policy "Participants update transactions" on public.transactions for update to authenticated using (exists (select 1 from public.conversations c where c.id = conversation_id and (select auth.uid()) in (c.buyer_id, c.seller_id))) with check (exists (select 1 from public.conversations c where c.id = conversation_id and (select auth.uid()) in (c.buyer_id, c.seller_id)));

drop policy if exists "Reviews are public" on public.reviews;
create policy "Reviews are public" on public.reviews for select to anon, authenticated using (true);
drop policy if exists "Participants create verified reviews" on public.reviews;
create policy "Participants create verified reviews" on public.reviews for insert to authenticated with check (
  reviewer_id = (select auth.uid()) and exists (
    select 1 from public.transactions t join public.conversations c on c.id = t.conversation_id
    where t.id = transaction_id and t.completed_at is not null and
    ((reviewer_id = c.buyer_id and reviewee_id = c.seller_id) or (reviewer_id = c.seller_id and reviewee_id = c.buyer_id))
  )
);

grant select, insert, update on public.transactions to authenticated;
grant select on public.reviews to anon, authenticated;
grant insert on public.reviews to authenticated;

drop policy if exists "Users view own notification preferences" on public.notification_preferences;
create policy "Users view own notification preferences" on public.notification_preferences for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "Users create own notification preferences" on public.notification_preferences;
create policy "Users create own notification preferences" on public.notification_preferences for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "Users update own notification preferences" on public.notification_preferences;
create policy "Users update own notification preferences" on public.notification_preferences for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
grant select, insert, update on public.notification_preferences to authenticated;
revoke all on public.notification_preferences from anon;

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
revoke all on public.reports from anon;
grant select, insert, delete on public.blocks to authenticated;
revoke all on public.blocks from anon;

create table if not exists public.tech_articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  image_url text check (image_url is null or char_length(image_url) <= 2048),
  category text not null check (char_length(category) between 2 and 80),
  title text not null check (char_length(title) between 5 and 180),
  summary text not null check (char_length(summary) between 10 and 500),
  read_time text not null default '5 min read' check (char_length(read_time) between 3 and 30),
  sections jsonb not null default '[]'::jsonb check (jsonb_typeof(sections) = 'array'),
  sources jsonb not null default '[]'::jsonb check (jsonb_typeof(sources) = 'array'),
  status text not null default 'draft' check (status in ('draft','published')),
  published_at timestamptz,
  created_by uuid not null default auth.uid() references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.tech_articles enable row level security;
grant select on public.tech_articles to anon;
grant select, insert, update, delete on public.tech_articles to authenticated;
revoke all on public.tech_articles from public;

drop policy if exists "Published tech articles are public" on public.tech_articles;
create policy "Published tech articles are public" on public.tech_articles for select to anon, authenticated using (status = 'published');
drop policy if exists "Admins can read all tech articles" on public.tech_articles;
create policy "Admins can read all tech articles" on public.tech_articles for select to authenticated using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
drop policy if exists "Admins can create tech articles" on public.tech_articles;
create policy "Admins can create tech articles" on public.tech_articles for insert to authenticated with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' and created_by = (select auth.uid()));
drop policy if exists "Admins can update tech articles" on public.tech_articles;
create policy "Admins can update tech articles" on public.tech_articles for update to authenticated using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin') with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
drop policy if exists "Admins can delete tech articles" on public.tech_articles;
create policy "Admins can delete tech articles" on public.tech_articles for delete to authenticated using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create index if not exists tech_articles_published_idx on public.tech_articles (published_at desc) where status = 'published';
