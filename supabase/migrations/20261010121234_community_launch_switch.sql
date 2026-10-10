create table public.community_settings (
  id text primary key check (id = 'community'),
  enabled boolean not null default false,
  updated_at timestamptz not null default now()
);
alter table public.community_settings enable row level security;
revoke all on public.community_settings from anon, authenticated;
grant select on public.community_settings to anon, authenticated;
grant update (enabled, updated_at) on public.community_settings to authenticated;
create policy "Community launch status is public" on public.community_settings
for select to anon, authenticated using (id = 'community');
create policy "Only admins may change community launch status" on public.community_settings
for update to authenticated
using ((select auth.uid()) is not null and (select auth.jwt())->'app_metadata'->>'role' = 'admin')
with check ((select auth.uid()) is not null and (select auth.jwt())->'app_metadata'->>'role' = 'admin');
insert into public.community_settings (id, enabled) values ('community', false);
