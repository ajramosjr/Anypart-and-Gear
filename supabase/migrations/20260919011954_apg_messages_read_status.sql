revoke update on table public.messages from authenticated;
grant update (read_at) on table public.messages to authenticated;

drop policy if exists "Recipients mark messages read" on public.messages;
create policy "Recipients mark messages read"
on public.messages
for update
to authenticated
using (
  sender_id <> (select auth.uid())
  and exists (
    select 1 from public.conversations c
    where c.id = messages.conversation_id
      and ((select auth.uid()) = c.buyer_id or (select auth.uid()) = c.seller_id)
  )
)
with check (
  sender_id <> (select auth.uid())
  and exists (
    select 1 from public.conversations c
    where c.id = messages.conversation_id
      and ((select auth.uid()) = c.buyer_id or (select auth.uid()) = c.seller_id)
  )
);

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'messages'
  ) then
    alter publication supabase_realtime add table public.messages;
  end if;
end $$;
