create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops(id) on delete cascade,
  title text not null check (char_length(btrim(title)) between 3 and 120),
  location text not null check (char_length(btrim(location)) between 2 and 120),
  field text not null check (field in ('Automotive','Marine','Motorcycle','Machinery','Parts & Warehouse','Other')),
  schedule text not null check (schedule in ('Full-time','Part-time','Apprenticeship','Temporary')),
  pay_range text not null check (char_length(btrim(pay_range)) between 2 and 120),
  description text not null check (char_length(btrim(description)) between 20 and 5000),
  application_method text not null check (application_method in ('email','website')),
  application_contact text not null check (char_length(application_contact) between 3 and 300 and application_contact !~ '[\r\n]' and ((application_method = 'email' and application_contact ~ '^[A-Za-z0-9.!#$%&''*+/=?^_`{|}~-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$') or (application_method = 'website' and application_contact ~ '^https://[^[:space:]@]+$'))),
  status text not null default 'open' check (status in ('open','filled')),
  expires_at timestamptz not null default (now() + interval '30 days'),
  created_at timestamptz not null default now()
);
create index jobs_shop_id_idx on public.jobs(shop_id);
create index jobs_open_newest_idx on public.jobs(created_at desc) where status = 'open';
alter table public.jobs enable row level security;
revoke all on public.jobs from anon, authenticated;
grant select on public.jobs to anon, authenticated;
grant insert (shop_id,title,location,field,schedule,pay_range,description,application_method,application_contact) on public.jobs to authenticated;
grant update (title,location,field,schedule,pay_range,description,application_method,application_contact,status,expires_at) on public.jobs to authenticated;
create policy "Public reads active openings" on public.jobs for select to anon, authenticated using (
  status = 'open' and expires_at > now() and exists (select 1 from public.shops s where s.id = shop_id and s.is_active)
);
create policy "Business owners read their jobs" on public.jobs for select to authenticated using (
  exists (select 1 from public.shops s where s.id = shop_id and s.owner_id = (select auth.uid()))
);
create policy "Registered business owners post jobs" on public.jobs for insert to authenticated with check (
  exists (select 1 from public.shops s where s.id = shop_id and s.is_active and s.owner_id = (select auth.uid()))
);
create policy "Business owners manage their jobs" on public.jobs for update to authenticated using (
  exists (select 1 from public.shops s where s.id = shop_id and s.is_active and s.owner_id = (select auth.uid()))
) with check (
  exists (select 1 from public.shops s where s.id = shop_id and s.is_active and s.owner_id = (select auth.uid()))
);
