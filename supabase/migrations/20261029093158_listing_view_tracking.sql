create table public.listing_view_totals (
 listing_id uuid primary key references public.listings(id) on delete cascade,
 total bigint not null default 0 check (total >= 0),
 tracking_started_at timestamptz not null default now()
);
alter table public.listing_view_totals enable row level security;
revoke all on public.listing_view_totals from public, anon, authenticated;
grant select on public.listing_view_totals to authenticated;
grant all on public.listing_view_totals to service_role;
create policy "Owners read listing view totals" on public.listing_view_totals for select to authenticated using (
 exists(select 1 from public.listings l where l.id=listing_id and l.user_id=(select auth.uid()))
);
create table public.listing_view_days (
 listing_id uuid not null references public.listings(id) on delete cascade,
 day date not null default (now() at time zone 'UTC')::date,
 viewer_hash text not null check (viewer_hash ~ '^[0-9a-f]{64}$'),
 primary key (listing_id,day,viewer_hash)
);
create index listing_view_days_expiry on public.listing_view_days(day);
alter table public.listing_view_days enable row level security;
revoke all on public.listing_view_days from public, anon, authenticated;
grant all on public.listing_view_days to service_role;
-- Only the validated server endpoint may write. No elevated SECURITY DEFINER function.
create function public.record_listing_view(p_listing_id uuid,p_viewer_hash text,p_viewer_user_id uuid default null)
returns boolean language plpgsql security invoker set search_path='' as $$
declare added integer;
begin
 if not exists(select 1 from public.listings where id=p_listing_id and status='active' and (p_viewer_user_id is null or user_id<>p_viewer_user_id)) then return false; end if;
 if p_viewer_user_id is not null and exists(select 1 from auth.users where id=p_viewer_user_id and raw_app_meta_data->>'role'='admin') then return false; end if;
 insert into public.listing_view_days(listing_id,viewer_hash) values(p_listing_id,p_viewer_hash) on conflict do nothing;
 get diagnostics added = row_count;
 if added=1 then
  insert into public.listing_view_totals(listing_id,total) values(p_listing_id,1)
  on conflict(listing_id) do update set total=public.listing_view_totals.total+1;
 end if;
 delete from public.listing_view_days where day < (now() at time zone 'UTC')::date-7;
 return added=1;
end;
$$;
revoke all on function public.record_listing_view(uuid,text,uuid) from public,anon,authenticated;
grant execute on function public.record_listing_view(uuid,text,uuid) to service_role;
