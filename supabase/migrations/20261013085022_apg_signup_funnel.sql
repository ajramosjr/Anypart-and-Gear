create table public.apg_funnel_events (
 month date not null default date_trunc('month', now() at time zone 'America/New_York')::date,
 visitor_id uuid not null,
 event text not null check (event in ('visit','sell_intent','contact_intent','signup_open','signup_submit','signup_accepted','signup_error','signin_error')),
 source text not null check (source in ('facebook','instagram','search','direct','other')),
 recorded_at timestamptz not null default now(),
 primary key (month,visitor_id,event)
);
alter table public.apg_funnel_events enable row level security;
revoke all on public.apg_funnel_events from public, anon, authenticated;
grant insert (visitor_id,event,source) on public.apg_funnel_events to anon, authenticated;
create policy "Record limited funnel events" on public.apg_funnel_events for insert to anon, authenticated with check (
 month = date_trunc('month', now() at time zone 'America/New_York')::date and
 coalesce((select auth.jwt())->'app_metadata'->>'role','') <> 'admin'
);
create function public.record_apg_funnel(p_visitor_id uuid,p_event text,p_source text) returns void language plpgsql security invoker set search_path='' as $$
begin
 insert into public.apg_funnel_events(visitor_id,event,source) values(p_visitor_id,p_event,p_source) on conflict do nothing;
 if p_event='visit' then perform public.record_apg_visitor(p_visitor_id); end if;
end;
$$;
revoke all on function public.record_apg_funnel(uuid,text,text) from public;
grant execute on function public.record_apg_funnel(uuid,text,text) to anon, authenticated;
create function private.apg_funnel_totals() returns jsonb language plpgsql security definer set search_path='' as $$
declare start_month timestamptz := date_trunc('month',now() at time zone 'America/New_York') at time zone 'America/New_York';
 result jsonb;
begin
 if not exists(select 1 from auth.users where id=auth.uid() and raw_app_meta_data->>'role'='admin') then
  raise exception 'Administrator access required' using errcode='42501';
 end if;
 with cohort as (
  select id,email_confirmed_at,last_sign_in_at from auth.users where created_at>=start_month and deleted_at is null and not coalesce(is_anonymous,false) and coalesce(raw_app_meta_data->>'role','')<>'admin'
 ) select jsonb_build_object(
 'new_accounts',count(*),
 'confirmed',count(*) filter(where email_confirmed_at is not null),
 'signed_in',count(*) filter(where last_sign_in_at is not null),
 'listed',count(*) filter(where exists(select 1 from public.listings l where l.user_id=cohort.id)),
 'messaged',count(*) filter(where exists(select 1 from public.messages m where m.sender_id=cohort.id))
 ) into result from cohort;
 return result || jsonb_build_object(
 'steps',coalesce((select jsonb_object_agg(event,total) from (select event,count(*) total from public.apg_funnel_events where month=(start_month at time zone 'America/New_York')::date group by event) q),'{}'::jsonb),
 'sources',coalesce((select jsonb_object_agg(source,total) from (select source,count(*) total from public.apg_funnel_events where month=(start_month at time zone 'America/New_York')::date and event='visit' group by source) q),'{}'::jsonb),
 'tracking_started','2026-10-13'
 );
end;
$$;
revoke all on function private.apg_funnel_totals() from public,anon,authenticated;
grant execute on function private.apg_funnel_totals() to authenticated;
create function public.apg_funnel_totals() returns jsonb language sql security invoker set search_path='' as $$select private.apg_funnel_totals();$$;
revoke all on function public.apg_funnel_totals() from public,anon,authenticated;
grant execute on function public.apg_funnel_totals() to authenticated;
