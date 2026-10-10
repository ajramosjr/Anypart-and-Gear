create table public.shout_outs (
 id uuid primary key default gen_random_uuid(),
 name text not null check (length(btrim(name)) between 1 and 120),
 description text not null check (length(btrim(description)) between 1 and 3000),
 website_url text not null check (length(website_url) <= 2048 and website_url ~ '^https?://'),
 image_url text check (image_url is null or (length(image_url) <= 2048 and image_url ~ '^https?://')),
 status text not null default 'draft' check (status in ('draft','published','archived')),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
alter table public.shout_outs enable row level security;
revoke all on public.shout_outs from anon, authenticated;
grant select on public.shout_outs to anon, authenticated;
grant insert, update on public.shout_outs to authenticated;
create policy "Everyone can read published shout outs" on public.shout_outs for select to anon, authenticated using (status='published');
create policy "Admins can read all shout outs" on public.shout_outs for select to authenticated using ((select auth.uid()) is not null and (select auth.jwt())->'app_metadata'->>'role'='admin');
create policy "Admins can create shout outs" on public.shout_outs for insert to authenticated with check ((select auth.uid()) is not null and (select auth.jwt())->'app_metadata'->>'role'='admin');
create policy "Admins can edit shout outs" on public.shout_outs for update to authenticated using ((select auth.uid()) is not null and (select auth.jwt())->'app_metadata'->>'role'='admin') with check ((select auth.uid()) is not null and (select auth.jwt())->'app_metadata'->>'role'='admin');
insert into public.shout_outs(name,description,website_url,status)
values ('iFixit','We like what iFixit is doing—helping people repair their stuff and keep it working. If you enjoy fixing things, check them out!','https://www.ifixit.com/','draft');
