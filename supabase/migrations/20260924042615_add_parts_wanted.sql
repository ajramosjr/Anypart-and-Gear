begin;

create table if not exists public.part_requests (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references auth.users(id) on delete cascade,
  request_kind text not null check (request_kind in ('known_part','help_identify')),
  item_type text not null check (item_type in ('Car or truck','Motorcycle','Boat','Trailer','Machinery','RC or hobby','Tool or equipment','Other')),
  vehicle_year integer check (vehicle_year is null or vehicle_year between 1886 and 2100),
  make text check (make is null or char_length(make) <= 100),
  model text check (model is null or char_length(model) <= 100),
  part_name text check (part_name is null or char_length(part_name) <= 160),
  description text not null check (char_length(description) between 10 and 2000),
  location text not null check (char_length(location) between 2 and 120),
  postal_code text not null check (char_length(postal_code) between 3 and 12),
  search_radius integer not null default 25 check (search_radius in (10,25,50,100)),
  condition_preference text not null default 'Either' check (condition_preference in ('New','Used','Either')),
  image_paths text[] not null default '{}',
  status text not null default 'active' check (status in ('active','fulfilled','closed')),
  expires_at timestamptz not null default (now() + interval '30 days'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (request_kind <> 'known_part' or char_length(coalesce(part_name, '')) >= 2)
);

create index if not exists part_requests_requester_idx on public.part_requests(requester_id, created_at desc);
create index if not exists part_requests_active_created_idx on public.part_requests(created_at desc) where status = 'active';
create index if not exists part_requests_postal_code_idx on public.part_requests(postal_code) where status = 'active';
create index if not exists part_requests_item_type_idx on public.part_requests(item_type) where status = 'active';

create table if not exists public.part_request_responses (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.part_requests(id) on delete cascade,
  shop_id uuid not null references public.shops(id) on delete cascade,
  responder_id uuid not null references auth.users(id) on delete cascade,
  availability text not null check (availability in ('In stock','Can source it','Need more information')),
  message text not null check (char_length(message) between 10 and 1200),
  price numeric(12,2) check (price is null or price >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (request_id, shop_id)
);

create index if not exists part_request_responses_request_idx on public.part_request_responses(request_id, created_at);
create index if not exists part_request_responses_shop_idx on public.part_request_responses(shop_id, created_at desc);
create index if not exists part_request_responses_responder_idx on public.part_request_responses(responder_id);

create or replace function private.protect_part_request_identity()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.requester_id := old.requester_id;
  new.created_at := old.created_at;
  new.expires_at := old.expires_at;
  return new;
end;
$$;
revoke all on function private.protect_part_request_identity() from public, anon, authenticated, service_role;
drop trigger if exists part_requests_protect_identity on public.part_requests;
create trigger part_requests_protect_identity before update on public.part_requests
for each row execute function private.protect_part_request_identity();

create or replace function private.protect_part_response_identity()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.request_id := old.request_id;
  new.shop_id := old.shop_id;
  new.responder_id := old.responder_id;
  new.created_at := old.created_at;
  return new;
end;
$$;
revoke all on function private.protect_part_response_identity() from public, anon, authenticated, service_role;
drop trigger if exists part_request_responses_protect_identity on public.part_request_responses;
create trigger part_request_responses_protect_identity before update on public.part_request_responses
for each row execute function private.protect_part_response_identity();

drop trigger if exists part_requests_touch_updated_at on public.part_requests;
create trigger part_requests_touch_updated_at before update on public.part_requests
for each row execute procedure public.touch_updated_at();

drop trigger if exists part_request_responses_touch_updated_at on public.part_request_responses;
create trigger part_request_responses_touch_updated_at before update on public.part_request_responses
for each row execute procedure public.touch_updated_at();

alter table public.part_requests enable row level security;
alter table public.part_request_responses enable row level security;

revoke all on public.part_requests from public, anon, authenticated;
grant select, insert, update, delete on public.part_requests to authenticated;
revoke all on public.part_request_responses from public, anon, authenticated;
grant select, insert, update on public.part_request_responses to authenticated;

drop policy if exists "Owners and verified businesses view part requests" on public.part_requests;
create policy "Owners and verified businesses view part requests"
  on public.part_requests for select to authenticated
  using (
    requester_id = (select auth.uid())
    or exists (
      select 1 from public.shops
      where shops.owner_id = (select auth.uid())
        and shops.is_verified = true
        and shops.is_active = true
    )
    or ((select auth.jwt())->'app_metadata'->>'role') = 'admin'
  );

drop policy if exists "Members create own part requests" on public.part_requests;
create policy "Members create own part requests"
  on public.part_requests for insert to authenticated
  with check (
    requester_id = (select auth.uid())
    and status = 'active'
    and expires_at <= now() + interval '31 days'
    and not exists (
      select 1 from unnest(image_paths) as image_path
      where split_part(image_path, '/', 1) <> (select auth.uid())::text
    )
  );

drop policy if exists "Owners update own part requests" on public.part_requests;
create policy "Owners update own part requests"
  on public.part_requests for update to authenticated
  using (requester_id = (select auth.uid()))
  with check (
    requester_id = (select auth.uid())
    and not exists (
      select 1 from unnest(image_paths) as image_path
      where split_part(image_path, '/', 1) <> (select auth.uid())::text
    )
  );

drop policy if exists "Owners delete own part requests" on public.part_requests;
create policy "Owners delete own part requests"
  on public.part_requests for delete to authenticated
  using (requester_id = (select auth.uid()));

drop policy if exists "Request owners and responding businesses view responses" on public.part_request_responses;
create policy "Request owners and responding businesses view responses"
  on public.part_request_responses for select to authenticated
  using (
    responder_id = (select auth.uid())
    or exists (
      select 1 from public.part_requests
      where part_requests.id = part_request_responses.request_id
        and part_requests.requester_id = (select auth.uid())
    )
    or ((select auth.jwt())->'app_metadata'->>'role') = 'admin'
  );

drop policy if exists "Verified businesses respond to active requests" on public.part_request_responses;
create policy "Verified businesses respond to active requests"
  on public.part_request_responses for insert to authenticated
  with check (
    responder_id = (select auth.uid())
    and exists (
      select 1 from public.shops
      where shops.id = part_request_responses.shop_id
        and shops.owner_id = (select auth.uid())
        and shops.is_verified = true
        and shops.is_active = true
    )
    and exists (
      select 1 from public.part_requests
      where part_requests.id = part_request_responses.request_id
        and part_requests.requester_id <> (select auth.uid())
        and part_requests.status = 'active'
        and part_requests.expires_at > now()
    )
  );

drop policy if exists "Businesses update own responses" on public.part_request_responses;
create policy "Businesses update own responses"
  on public.part_request_responses for update to authenticated
  using (responder_id = (select auth.uid()))
  with check (
    responder_id = (select auth.uid())
    and exists (
      select 1 from public.shops
      where shops.id = part_request_responses.shop_id
        and shops.owner_id = (select auth.uid())
        and shops.is_verified = true
        and shops.is_active = true
    )
  );

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('part-request-images', 'part-request-images', false, 10485760, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Request participants view private images" on storage.objects;
create policy "Request participants view private images" on storage.objects
for select to authenticated using (
  bucket_id = 'part-request-images'
  and (
    (storage.foldername(name))[1] = (select auth.uid())::text
    or exists (
      select 1 from public.shops
      where shops.owner_id = (select auth.uid())
        and shops.is_verified = true
        and shops.is_active = true
    )
    or ((select auth.jwt())->'app_metadata'->>'role') = 'admin'
  )
);

drop policy if exists "Members upload private request images" on storage.objects;
create policy "Members upload private request images" on storage.objects
for insert to authenticated with check (
  bucket_id = 'part-request-images'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists "Members delete own request images" on storage.objects;
create policy "Members delete own request images" on storage.objects
for delete to authenticated using (
  bucket_id = 'part-request-images'
  and owner_id = (select auth.uid())::text
);

create or replace function private.notify_part_request_response()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  request_owner uuid;
  request_label text;
  shop_name text;
begin
  if new.responder_id is distinct from (select auth.uid()) then
    raise exception 'Response identity mismatch';
  end if;

  select requester_id, coalesce(nullif(part_name, ''), item_type)
    into request_owner, request_label
  from public.part_requests
  where id = new.request_id;

  select name into shop_name from public.shops where id = new.shop_id;

  insert into public.notifications (user_id, actor_id, notification_type, title, body, link)
  values (
    request_owner,
    new.responder_id,
    'part_request_response',
    'A business responded to your request',
    coalesce(shop_name, 'A verified business') || ' responded about ' || request_label || '.',
    '/parts-wanted/' || new.request_id::text
  );
  return new;
end;
$$;

revoke all on function private.notify_part_request_response() from public, anon, authenticated, service_role;
drop trigger if exists part_request_response_notification on public.part_request_responses;
create trigger part_request_response_notification
after insert on public.part_request_responses
for each row execute function private.notify_part_request_response();

comment on table public.part_requests is 'Private Parts Wanted requests visible to their owner and verified APG businesses.';
comment on table public.part_request_responses is 'One initial response per verified business for a Parts Wanted request.';

commit;
