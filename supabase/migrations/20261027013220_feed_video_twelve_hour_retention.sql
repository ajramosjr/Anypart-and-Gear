alter table public.apg_feed_posts add column video_url text, add column video_duration double precision;
alter table public.apg_feed_posts add constraint feed_video_metadata check ((video_url is null and video_duration is null) or (video_url is not null and video_duration is not null and video_duration > 0 and video_duration <= 60 and video_url like ('https://emhdntbmihwvqpncyicl.supabase.co/storage/v1/object/public/feed-videos/' || user_id::text || '/feed/%')));

create extension if not exists pg_cron;
create extension if not exists pg_net with schema extensions;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('feed-videos','feed-videos',true,52428800,array['video/mp4','video/webm','video/quicktime'])
on conflict(id) do nothing;
create policy "Members upload own feed videos" on storage.objects for insert to authenticated with check(bucket_id='feed-videos' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy "Members delete own feed videos" on storage.objects for delete to authenticated using(bucket_id='feed-videos' and owner_id=(select auth.uid())::text);
create policy "Public feed videos" on storage.objects for select using(bucket_id='feed-videos');
select vault.create_secret(encode(extensions.gen_random_bytes(32),'hex'),'feed_video_cleanup_token');
create function public.authorize_feed_cleanup(token text) returns boolean language sql security definer set search_path='' as $$
 select exists(select 1 from vault.decrypted_secrets where name='feed_video_cleanup_token' and decrypted_secret=token);
$$;
revoke all on function public.authorize_feed_cleanup(text) from public,anon,authenticated;
grant execute on function public.authorize_feed_cleanup(text) to service_role;
create function public.expired_feed_video_paths() returns table(name text) language sql security definer set search_path='' as $$
 select o.name from storage.objects o where o.bucket_id='feed-videos' and o.created_at<=now()-interval '12 hours' order by o.created_at limit 100;
$$;
revoke all on function public.expired_feed_video_paths() from public,anon,authenticated;
grant execute on function public.expired_feed_video_paths() to service_role;

select cron.schedule('expire-feed-videos','* * * * *',$job$
 select net.http_post(
 url:='https://emhdntbmihwvqpncyicl.supabase.co/functions/v1/cleanup-feed-videos',
 headers:=jsonb_build_object('Content-Type','application/json','x-cleanup-token',(select decrypted_secret from vault.decrypted_secrets where name='feed_video_cleanup_token')),
 body:='{}'::jsonb,timeout_milliseconds:=30000);
$job$);
