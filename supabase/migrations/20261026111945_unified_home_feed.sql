create table public.apg_feed_posts (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
 category text not null check (category in ('Projects','Questions','Updates')),
 title text not null check (char_length(trim(title)) between 1 and 150),
 body text not null check (char_length(trim(body)) between 1 and 3000),
 image_urls text[] not null default '{}' check (cardinality(image_urls)<=4),
 status text not null default 'active' check (status in ('active','removed')),
 created_at timestamptz not null default now()
);
create index apg_feed_posts_newest on public.apg_feed_posts (created_at desc,id) where status='active';
create index apg_feed_posts_author on public.apg_feed_posts(user_id,created_at desc);
create table public.apg_feed_comments (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
 item_type text not null check(item_type in ('listing','post')), item_id uuid not null,
 body text not null check(char_length(trim(body)) between 1 and 1500),
 status text not null default 'active' check(status in ('active','removed')), created_at timestamptz not null default now()
);
create index apg_feed_comments_item on public.apg_feed_comments(item_id,item_type,created_at);
create index apg_feed_comments_author on public.apg_feed_comments(user_id,created_at desc);
create table public.apg_feed_engagement (
 user_id uuid not null references public.profiles(id) on delete cascade, item_type text not null check(item_type in ('listing','post')),
 item_id uuid not null, action text not null check(action in ('like','save')), created_at timestamptz not null default now(),
 primary key(user_id,item_type,item_id,action)
);
create index apg_feed_engagement_item on public.apg_feed_engagement(item_id,item_type,action);
create table public.apg_feed_reports (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
 item_type text not null check(item_type in ('listing','post','comment')), item_id uuid not null,
 reason text not null check(char_length(trim(reason)) between 1 and 500),
 status text not null default 'open' check(status in ('open','reviewed')), created_at timestamptz not null default now()
);
create index apg_feed_reports_open on public.apg_feed_reports(status,created_at desc);
create index apg_feed_reports_author on public.apg_feed_reports(user_id,created_at desc);
alter table public.apg_feed_posts enable row level security;
alter table public.apg_feed_comments enable row level security;
alter table public.apg_feed_engagement enable row level security;
alter table public.apg_feed_reports enable row level security;
revoke all on public.apg_feed_posts,public.apg_feed_comments,public.apg_feed_engagement,public.apg_feed_reports from anon,authenticated;
grant select on public.apg_feed_posts,public.apg_feed_comments,public.apg_feed_engagement to anon,authenticated;
grant insert on public.apg_feed_posts,public.apg_feed_comments,public.apg_feed_engagement,public.apg_feed_reports to authenticated;
grant update(title,body,image_urls,status) on public.apg_feed_posts to authenticated;
grant update(body,status) on public.apg_feed_comments to authenticated;
grant delete on public.apg_feed_engagement to authenticated;
grant select on public.apg_feed_reports to authenticated;
grant update(status) on public.apg_feed_reports to authenticated;
create policy "Feed posts readable" on public.apg_feed_posts for select to anon,authenticated using(status='active' or user_id=(select auth.uid()) or (select auth.jwt())->'app_metadata'->>'role'='admin');
create policy "Members create feed posts" on public.apg_feed_posts for insert to authenticated with check(user_id=(select auth.uid()) and status='active');
create policy "Authors update active posts" on public.apg_feed_posts for update to authenticated using(user_id=(select auth.uid()) and status='active') with check(user_id=(select auth.uid()));
create policy "Admins moderate posts" on public.apg_feed_posts for update to authenticated using((select auth.jwt())->'app_metadata'->>'role'='admin') with check((select auth.jwt())->'app_metadata'->>'role'='admin');
create policy "Visible feed replies" on public.apg_feed_comments for select to anon,authenticated using(((status='active') and ((item_type='post' and exists(select 1 from public.apg_feed_posts p where p.id=item_id and p.status='active')) or (item_type='listing' and exists(select 1 from public.listings l where l.id=item_id and l.status='active')))) or user_id=(select auth.uid()) or (select auth.jwt())->'app_metadata'->>'role'='admin');
create policy "Members reply to visible items" on public.apg_feed_comments for insert to authenticated with check(user_id=(select auth.uid()) and status='active' and ((item_type='post' and exists(select 1 from public.apg_feed_posts p where p.id=item_id and p.status='active')) or (item_type='listing' and exists(select 1 from public.listings l where l.id=item_id and l.status='active'))));
create policy "Authors remove own replies" on public.apg_feed_comments for update to authenticated using(user_id=(select auth.uid()) and status='active') with check(user_id=(select auth.uid()));
create policy "Admins moderate replies" on public.apg_feed_comments for update to authenticated using((select auth.jwt())->'app_metadata'->>'role'='admin') with check((select auth.jwt())->'app_metadata'->>'role'='admin');
create policy "Public likes private saves" on public.apg_feed_engagement for select to anon,authenticated using(user_id=(select auth.uid()) or (action='like' and ((item_type='post' and exists(select 1 from public.apg_feed_posts p where p.id=item_id and p.status='active')) or (item_type='listing' and exists(select 1 from public.listings l where l.id=item_id and l.status='active')))));
create policy "Members react to visible items" on public.apg_feed_engagement for insert to authenticated with check(user_id=(select auth.uid()) and ((item_type='post' and exists(select 1 from public.apg_feed_posts p where p.id=item_id and p.status='active')) or (item_type='listing' and exists(select 1 from public.listings l where l.id=item_id and l.status='active'))));
create policy "Members remove own reactions" on public.apg_feed_engagement for delete to authenticated using(user_id=(select auth.uid()));
create policy "Members report items" on public.apg_feed_reports for insert to authenticated with check(user_id=(select auth.uid()) and status='open');
create policy "Members see own reports admins see all" on public.apg_feed_reports for select to authenticated using(user_id=(select auth.uid()) or (select auth.jwt())->'app_metadata'->>'role'='admin');
create policy "Admins review feed reports" on public.apg_feed_reports for update to authenticated using((select auth.jwt())->'app_metadata'->>'role'='admin') with check((select auth.jwt())->'app_metadata'->>'role'='admin');
create table public.apg_home_settings(id text primary key check(id='home'),layout text not null default 'feed' check(layout in ('feed','classic')));
alter table public.apg_home_settings enable row level security;
revoke all on public.apg_home_settings from anon,authenticated;
grant select on public.apg_home_settings to anon,authenticated;
grant update(layout) on public.apg_home_settings to authenticated;
create policy "Public homepage layout" on public.apg_home_settings for select to anon,authenticated using(id='home');
create policy "Admins change homepage layout" on public.apg_home_settings for update to authenticated using((select auth.jwt())->'app_metadata'->>'role'='admin') with check((select auth.jwt())->'app_metadata'->>'role'='admin');
insert into public.apg_home_settings(id,layout) values('home','feed');
revoke insert on public.apg_feed_posts,public.apg_feed_comments,public.apg_feed_engagement,public.apg_feed_reports from authenticated;
grant insert(user_id,category,title,body,image_urls) on public.apg_feed_posts to authenticated;
grant insert(user_id,item_type,item_id,body) on public.apg_feed_comments to authenticated;
grant insert(user_id,item_type,item_id,action) on public.apg_feed_engagement to authenticated;
grant insert(user_id,item_type,item_id,reason) on public.apg_feed_reports to authenticated;
