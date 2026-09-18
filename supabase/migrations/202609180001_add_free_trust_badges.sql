create schema if not exists private;

alter table public.profiles
  add column if not exists email_verified boolean not null default false,
  add column if not exists trusted_seller boolean not null default false;

update public.profiles p
set email_verified = (u.email_confirmed_at is not null)
from auth.users u
where u.id = p.id;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, full_name, email_verified)
  values (new.id, coalesce(nullif(trim(new.raw_user_meta_data->>'full_name'), ''), 'Member'), new.email_confirmed_at is not null)
  on conflict (id) do update set email_verified = excluded.email_verified;
  return new;
end;
$$;
revoke execute on function public.handle_new_user() from public, anon, authenticated;

create or replace function private.sync_email_verified()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if old.email_confirmed_at is distinct from new.email_confirmed_at then
    update public.profiles set email_verified = new.email_confirmed_at is not null where id = new.id;
  end if;
  return new;
end;
$$;
revoke all on function private.sync_email_verified() from public, anon, authenticated;
drop trigger if exists sync_profile_email_verified on auth.users;
create trigger sync_profile_email_verified after update of email_confirmed_at on auth.users
for each row execute function private.sync_email_verified();

create or replace function public.protect_profile_badges()
returns trigger language plpgsql set search_path = '' as $$
begin
  if (select auth.uid()) is not null and coalesce((select auth.jwt()->'app_metadata'->>'role'), '') <> 'admin' then
    new.email_verified := old.email_verified;
    new.trusted_seller := old.trusted_seller;
    new.is_verified_business := old.is_verified_business;
  end if;
  return new;
end;
$$;
drop trigger if exists profiles_protect_badges on public.profiles;
create trigger profiles_protect_badges before update on public.profiles
for each row execute function public.protect_profile_badges();

create or replace function private.refresh_trusted_seller(target_user uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
  update public.profiles p set trusted_seller = exists (
    select 1 from public.transactions t
    join public.conversations c on c.id = t.conversation_id
    join public.reviews r on r.transaction_id = t.id
    where c.seller_id = target_user and t.completed_at is not null
      and r.reviewee_id = target_user and r.rating >= 4
  ) where p.id = target_user;
end;
$$;
revoke all on function private.refresh_trusted_seller(uuid) from public, anon, authenticated;

create or replace function private.refresh_trusted_from_transaction()
returns trigger language plpgsql security definer set search_path = '' as $$
declare seller uuid;
begin
  select c.seller_id into seller from public.conversations c
  where c.id = coalesce(new.conversation_id, old.conversation_id);
  if seller is not null then perform private.refresh_trusted_seller(seller); end if;
  return coalesce(new, old);
end;
$$;
revoke all on function private.refresh_trusted_from_transaction() from public, anon, authenticated;
drop trigger if exists transactions_refresh_trusted on public.transactions;
create trigger transactions_refresh_trusted after insert or update or delete on public.transactions
for each row execute function private.refresh_trusted_from_transaction();

create or replace function private.refresh_trusted_from_review()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if tg_op in ('UPDATE', 'DELETE') then perform private.refresh_trusted_seller(old.reviewee_id); end if;
  if tg_op in ('INSERT', 'UPDATE') then perform private.refresh_trusted_seller(new.reviewee_id); end if;
  return coalesce(new, old);
end;
$$;
revoke all on function private.refresh_trusted_from_review() from public, anon, authenticated;
drop trigger if exists reviews_refresh_trusted on public.reviews;
create trigger reviews_refresh_trusted after insert or update or delete on public.reviews
for each row execute function private.refresh_trusted_from_review();

update public.profiles p set trusted_seller = exists (
  select 1 from public.transactions t
  join public.conversations c on c.id = t.conversation_id
  join public.reviews r on r.transaction_id = t.id
  where c.seller_id = p.id and t.completed_at is not null
    and r.reviewee_id = p.id and r.rating >= 4
);
