-- Hiding an inbox thread is private to one participant. Messages and offers remain intact.
create table public.conversation_inbox_state (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  hidden_at timestamptz not null default now(),
  primary key (conversation_id, user_id)
);

alter table public.conversation_inbox_state enable row level security;
grant select, insert, update on public.conversation_inbox_state to authenticated;

create policy "Members see their own inbox state" on public.conversation_inbox_state
for select to authenticated using ((select auth.uid()) = user_id);

create policy "Members hide their own conversations" on public.conversation_inbox_state
for insert to authenticated with check (
  (select auth.uid()) = user_id and exists (
    select 1 from public.conversations c
    where c.id = conversation_id and (c.buyer_id = user_id or c.seller_id = user_id)
  )
);

create policy "Members update their own inbox state" on public.conversation_inbox_state
for update to authenticated using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id and exists (
  select 1 from public.conversations c
  where c.id = conversation_id and (c.buyer_id = user_id or c.seller_id = user_id)
));
