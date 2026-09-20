create index if not exists listings_active_user_idx
  on public.listings (user_id)
  where status = 'active';

create or replace function public.enforce_active_listing_limit()
returns trigger
language plpgsql
set search_path = public, pg_catalog
as $$
declare
  active_count integer;
begin
  if new.status <> 'active' then
    return new;
  end if;

  if tg_op = 'UPDATE'
     and old.status = 'active'
     and old.user_id = new.user_id then
    return new;
  end if;

  perform pg_advisory_xact_lock(hashtextextended(new.user_id::text, 0));

  select count(*)
    into active_count
    from public.listings
   where user_id = new.user_id
     and status = 'active'
     and id <> new.id;

  if active_count >= 100 then
    raise exception using
      errcode = 'P0001',
      message = 'You have reached the limit of 100 active listings. Mark an item sold or remove it before posting another.';
  end if;

  return new;
end;
$$;

revoke execute on function public.enforce_active_listing_limit() from public, anon, authenticated;

drop trigger if exists listings_enforce_active_limit on public.listings;
create trigger listings_enforce_active_limit
before insert or update of status, user_id on public.listings
for each row execute function public.enforce_active_listing_limit();
