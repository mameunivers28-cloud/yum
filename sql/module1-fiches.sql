alter table public.vehicles
  add column if not exists fuel text,
  add column if not exists description text,
  add column if not exists mileage_km int,
  add column if not exists photos text[],
  add column if not exists mileage_policy text,
  add column if not exists fuel_policy text,
  add column if not exists rental_conditions text,
  add column if not exists return_conditions text,
  add column if not exists deposit_amount int,
  add column if not exists delivery_fee int,
  add column if not exists availability_note text;
alter table public.rental_requests
  add column if not exists start_time text,
  add column if not exists end_time text,
  add column if not exists est_total int;
