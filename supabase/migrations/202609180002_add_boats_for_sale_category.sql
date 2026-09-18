alter table public.listings drop constraint if exists listings_category_check;
alter table public.listings add constraint listings_category_check
check (category in ('Car Parts','Boat Parts','Boats for Sale','Motorcycles','Trucks','Trailers','Tools','Machinery','Workwear & Apparel','Vehicles for Sale','Other'));
