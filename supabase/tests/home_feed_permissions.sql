begin;
do $$ begin
 perform set_config('apg.test_a',(select id::text from public.profiles order by id limit 1),true);
 perform set_config('apg.test_b',(select id::text from public.profiles order by id limit 1 offset 1),true);
 if current_setting('apg.test_a')='' or current_setting('apg.test_b')='' then raise exception 'Two existing profiles required for permission checks'; end if;
 perform set_config('request.jwt.claims',jsonb_build_object('sub',current_setting('apg.test_a'),'role','authenticated','app_metadata','{}'::jsonb)::text,true);
end $$;
set local role authenticated;
do $$ declare p uuid; c uuid; begin
 insert into public.apg_feed_posts(user_id,category,title,body) values(auth.uid(),'Questions','Permission check, rolled back','Temporary permission check.') returning id into p;
 perform set_config('apg.test_post',p::text,true);
 insert into public.apg_feed_comments(user_id,item_type,item_id,body) values(auth.uid(),'post',p,'Temporary reply.') returning id into c;
 perform set_config('apg.test_comment',c::text,true);
 insert into public.apg_feed_engagement(user_id,item_type,item_id,action) values(auth.uid(),'post',p,'like'),(auth.uid(),'post',p,'save');
 insert into public.apg_feed_reports(user_id,item_type,item_id,reason) values(auth.uid(),'post',p,'Temporary permission test.');
 if (select count(*) from public.apg_feed_engagement where item_id=p)<>2 then raise exception 'Owner must see own save and like';end if;
 begin
  insert into public.apg_feed_posts(user_id,category,title,body,created_at) values(auth.uid(),'Updates','Invalid timestamp','Should fail',now());
  raise exception 'Client timestamp injection was allowed';
 exception when insufficient_privilege then null;end;
 perform set_config('request.jwt.claims',jsonb_build_object('sub',current_setting('apg.test_b'),'role','authenticated','app_metadata','{}'::jsonb,'user_metadata','{"role":"admin"}'::jsonb)::text,true);
 if (select count(*) from public.apg_feed_engagement where item_id=p and action='save')<>0 then raise exception 'Another member can see private saves';end if;
 if (select count(*) from public.apg_feed_reports where item_id=p)<>0 then raise exception 'Another member can see reports';end if;
 update public.apg_feed_posts set body='Unauthorized change' where id=p;
 if found then raise exception 'Another member can edit a post';end if;
 update public.apg_feed_comments set status='removed' where id=c;
 if found then raise exception 'Another member can remove a reply';end if;
 update public.apg_home_settings set layout='classic' where id='home';
 if found then raise exception 'User-editable metadata changed homepage';end if;
 begin
  insert into public.apg_feed_posts(user_id,category,title,body) values(current_setting('apg.test_a')::uuid,'Updates','Invalid author','Should fail');
  raise exception 'Author impersonation was allowed';
 exception when insufficient_privilege then null;end;
 perform set_config('request.jwt.claims','{}',true);
end $$;
set local role anon;
do $$ begin
 if (select count(*) from public.apg_feed_posts where id=current_setting('apg.test_post')::uuid)<>1 then raise exception 'Visitors cannot browse active posts';end if;
 if (select count(*) from public.apg_feed_engagement where item_id=current_setting('apg.test_post')::uuid and action='save')<>0 then raise exception 'Visitors can read private saves';end if;
 if (select count(*) from public.apg_feed_engagement where item_id=current_setting('apg.test_post')::uuid and action='like')<>1 then raise exception 'Visitors cannot read public likes';end if;
 begin
  insert into public.apg_feed_comments(user_id,item_type,item_id,body) values(current_setting('apg.test_a')::uuid,'post',current_setting('apg.test_post')::uuid,'Should fail');
  raise exception 'Visitor wrote a reply';
 exception when insufficient_privilege then null;end;
end $$;
reset role;
rollback;
select 'PASSED: member posting and replies, public reads, private saves and reports, author ownership, timestamp protection, visitor write rejection, and admin-only homepage switching. All test writes rolled back.' as result;
