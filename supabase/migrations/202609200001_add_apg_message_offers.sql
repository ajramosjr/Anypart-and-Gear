alter table public.listings
  add column if not exists allow_offers boolean not null default true;

alter table public.messages
  add column if not exists message_type text not null default 'text',
  add column if not exists offer_amount numeric(12,2),
  add column if not exists related_message_id uuid references public.messages(id) on delete set null;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'messages_type_check') then
    alter table public.messages add constraint messages_type_check
      check (message_type in ('text','offer','offer_counter','offer_accept','offer_decline'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'messages_offer_shape_check') then
    alter table public.messages add constraint messages_offer_shape_check check (
      (message_type = 'text' and offer_amount is null and related_message_id is null)
      or (message_type = 'offer' and offer_amount > 0)
      or (message_type = 'offer_counter' and offer_amount > 0 and related_message_id is not null)
      or (message_type in ('offer_accept','offer_decline') and offer_amount is null and related_message_id is not null)
    );
  end if;
end $$;

create index if not exists messages_related_offer_idx
  on public.messages(related_message_id)
  where related_message_id is not null;
