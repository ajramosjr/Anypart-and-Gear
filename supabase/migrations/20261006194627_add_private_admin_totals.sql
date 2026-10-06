create schema if not exists private;
create table public.apg_monthly_visitors (
  month date not null default date_trunc('month', now() at time zone 'America/New_York')::date,
  visitor_id uuid not null,
  primary key (month, visitor_id)
);
alter table public.apg_monthly_visitors enable row level security;
revoke all on public.apg_monthly_visitors from public, anon, authenticated;
grant insert (visitor_id) on public.apg_monthly_visitors to anon, authenticated;
create policy "Record anonymous visitor identifiers" on public.apg_monthly_visitors for insert to anon, authenticated with check (month = date_trunc('month', now() at time zone 'America/New_York')::date);
create function public.record_apg_visitor(p_visitor_id uuid) returns void language sql security invoker set search_path = '' as $$
  insert into public.apg_monthly_visitors (visitor_id) values (p_visitor_id) on conflict do nothing;
$$;
revoke all on function public.record_apg_visitor(uuid) from public;
grant execute on function public.record_apg_visitor(uuid) to anon, authenticated;
create function private.apg_admin_totals() returns jsonb language plpgsql security definer set search_path = '' as $$
declare start_month timestamptz := date_trunc('month',now() at time zone 'America/New_York') at time zone 'America/New_York';
begin
  if not exists (select 1 from auth.users where id = auth.uid() and raw_app_meta_data->>'role' = 'admin') then
    raise exception 'Administrator access required' using errcode='42501';
  end if;
  return jsonb_build_object(
    'total_users', (select count(*) from auth.users where not coalesce(is_anonymous,false)),
    'new_users', (select count(*) from auth.users where not coalesce(is_anonymous,false) and created_at >= start_month),
    'visitors', (select count(*) from public.apg_monthly_visitors where month = (start_month at time zone 'America/New_York')::date),
    'tracking_started', '2026-10-06'
  );
end;
$$;
revoke all on function private.apg_admin_totals() from public, anon, authenticated;
grant usage on schema private to authenticated;
grant execute on function private.apg_admin_totals() to authenticated;
create function public.apg_admin_totals() returns jsonb language sql security invoker set search_path = '' as $$ select private.apg_admin_totals(); $$;
revoke all on function public.apg_admin_totals() from public, anon, authenticated;
grant execute on function public.apg_admin_totals() to authenticated;

