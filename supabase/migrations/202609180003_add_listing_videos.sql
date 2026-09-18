alter table public.listings add column if not exists video_url text
check (video_url is null or char_length(video_url) <= 2048);

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('listing-videos','listing-videos',true,52428800,array['video/mp4','video/webm','video/quicktime'])
on conflict (id) do update set public=excluded.public,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;

drop policy if exists "Public listing videos" on storage.objects;
create policy "Public listing videos" on storage.objects for select using (bucket_id='listing-videos');
drop policy if exists "Users upload listing videos" on storage.objects;
create policy "Users upload listing videos" on storage.objects for insert to authenticated with check (bucket_id='listing-videos' and (storage.foldername(name))[1]=(select auth.uid())::text);
drop policy if exists "Users update own listing videos" on storage.objects;
create policy "Users update own listing videos" on storage.objects for update to authenticated using (bucket_id='listing-videos' and owner_id=(select auth.uid())::text) with check (bucket_id='listing-videos' and owner_id=(select auth.uid())::text);
drop policy if exists "Users delete own listing videos" on storage.objects;
create policy "Users delete own listing videos" on storage.objects for delete to authenticated using (bucket_id='listing-videos' and owner_id=(select auth.uid())::text);
