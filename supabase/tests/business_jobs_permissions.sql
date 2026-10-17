begin;
insert into auth.users (id, email, raw_user_meta_data) values ('a7a70000-0000-4000-8000-000000000001','apg-permission-test@example.invalid','{"full_name":"APG Test"}');
insert into public.shops (id,owner_id,name,specialty,description,location,postal_code) values ('a7a70000-0000-4000-8000-000000000002','a7a70000-0000-4000-8000-000000000001','APG test fixture','Automotive','Temporary rolled-back permission fixture.','Test location','00000');
select set_config('request.jwt.claim.sub','a7a70000-0000-4000-8000-000000000001',true);
set local role authenticated;
insert into public.jobs (shop_id,title,location,field,schedule,pay_range,description,application_method,application_contact) values ('a7a70000-0000-4000-8000-000000000002','APG permission test','Test location','Automotive','Full-time','$25/hour','Temporary permission verification job.','email','test@example.com');
select set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',true);
do $$ begin
  begin
    insert into public.jobs (shop_id,title,location,field,schedule,pay_range,description,application_method,application_contact) values ('a7a70000-0000-4000-8000-000000000002','Unauthorized test','Test location','Automotive','Full-time','$25/hour','Temporary permission verification job.','email','test@example.com');
    raise exception 'FAIL: non-owner insert succeeded';
  exception when insufficient_privilege then null; end;
  update public.jobs set status='filled' where title='APG permission test';
  if found then raise exception 'FAIL: non-owner update succeeded'; end if;
end $$;
select set_config('request.jwt.claim.sub','a7a70000-0000-4000-8000-000000000001',true);
do $$ begin
 update public.jobs set status='filled' where title='APG permission test';
 if not found then raise exception 'FAIL: owner close failed'; end if;
end $$;
set local role anon;
do $$ begin
 if exists(select 1 from public.jobs where title='APG permission test') then raise exception 'FAIL: filled job visible publicly'; end if;
 begin
  insert into public.jobs (shop_id,title,location,field,schedule,pay_range,description,application_method,application_contact) values ('a7a70000-0000-4000-8000-000000000002','Anonymous test','Test location','Automotive','Full-time','$25/hour','Temporary permission verification job.','email','test@example.com');
  raise exception 'FAIL: anonymous insert succeeded';
 exception when insufficient_privilege then null; end;
end $$;
set local role authenticated;
update public.jobs set status='open', expires_at=now()-interval '1 day' where title='APG permission test';
set local role anon;
do $$ begin
 if exists(select 1 from public.jobs where title='APG permission test') then raise exception 'FAIL: expired job visible publicly'; end if;
end $$;
set local role authenticated;
update public.jobs set expires_at=now()+interval '30 days' where title='APG permission test';
set local role anon;
do $$ begin
 if not exists(select 1 from public.jobs where title='APG permission test') then raise exception 'FAIL: renewed job missing publicly'; end if;
end $$;
reset role;
rollback;
select 'PASS: owner create/close/renew; non-owner and anonymous writes denied; filled/expired jobs hidden; test data rolled back' as result;
