create extension if not exists btree_gist;
create table if not exists public.vehicle_availability (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  start_date date not null, end_date date not null,
  kind text not null default 'Indisponible' check (kind in ('Réservation confirmée','Indisponible','Maintenance')),
  created_at timestamptz not null default now(),
  constraint va_dates check (end_date >= start_date),
  constraint va_no_overlap exclude using gist (vehicle_id with =, daterange(start_date, end_date, '[]') with &&)
);
alter table public.vehicle_availability enable row level security;
drop policy if exists "dispo public" on public.vehicle_availability;
create policy "dispo public" on public.vehicle_availability for select to anon, authenticated using (exists (select 1 from public.vehicles v where v.id = vehicle_id and v.published = true) or public.is_admin());
drop policy if exists "dispo admin write" on public.vehicle_availability;
create policy "dispo admin write" on public.vehicle_availability for all to authenticated using (public.is_admin()) with check (public.is_admin());
create or replace function public.check_request_availability() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.vehicle_id is not null and exists (select 1 from public.vehicle_availability a where a.vehicle_id = new.vehicle_id and daterange(a.start_date, a.end_date, '[]') && daterange(new.start_date, new.end_date, '[]')) then
    raise exception 'VEHICLE_UNAVAILABLE' using errcode = 'P0001';
  end if;
  return new;
end $$;
drop trigger if exists trg_request_availability on public.rental_requests;
create trigger trg_request_availability before insert on public.rental_requests for each row execute function public.check_request_availability();
