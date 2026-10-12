create table public.tech_wire_settings (
 id text primary key check (id = 'tech-wire'),
 enabled boolean not null default false,
 updated_at timestamptz not null default now()
);
alter table public.tech_wire_settings enable row level security;
revoke all on public.tech_wire_settings from anon, authenticated;
grant select on public.tech_wire_settings to anon, authenticated;
grant update (enabled, updated_at) on public.tech_wire_settings to authenticated;
create policy "Tech Wire visibility is public" on public.tech_wire_settings for select to anon, authenticated using (id = 'tech-wire');
create policy "Only admins may change Tech Wire visibility" on public.tech_wire_settings for update to authenticated
using ((select auth.uid()) is not null and (select auth.jwt())->'app_metadata'->>'role' = 'admin')
with check ((select auth.uid()) is not null and (select auth.jwt())->'app_metadata'->>'role' = 'admin');
insert into public.tech_wire_settings (id, enabled) values ('tech-wire', false);
alter policy "Published tech articles are public" on public.tech_articles using (
 status = 'published' and exists (select 1 from public.tech_wire_settings where id = 'tech-wire' and enabled)
);
