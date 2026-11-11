create table if not exists public.partner_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  status text not null default 'Soumise' check (status in ('Brouillon','Soumise','En attente de vérification','En cours d’examen','Documents complémentaires demandés','Approuvée','Refusée','Suspendue')),
  full_name text not null, phone text not null, whatsapp text, email text not null, city text, address_zone text,
  vehicle_make text not null, vehicle_model text not null, vehicle_year int, plate text, category text, transmission text, fuel text, engine text, seats int, has_ac boolean, mileage_km int, description text, equipment text[],
  min_daily_price int, availability_note text, min_rental_days int, special_conditions text, delivery_possible boolean, delivery_zones text,
  documents jsonb not null default '[]'::jsonb,
  accepted_terms boolean not null default false,
  vehicle_id uuid,
  created_at timestamptz not null default now()
);
create table if not exists public.partner_application_admin (
  application_id uuid primary key references public.partner_applications(id) on delete cascade,
  notes text, commission_pct numeric, final_daily_price int, updated_at timestamptz not null default now()
);
alter table public.partner_applications enable row level security;
alter table public.partner_application_admin enable row level security;
drop policy if exists "partner insert own" on public.partner_applications;
create policy "partner insert own" on public.partner_applications for insert to authenticated with check (user_id = auth.uid() and status = 'Soumise' and accepted_terms = true);
drop policy if exists "partner select own" on public.partner_applications;
create policy "partner select own" on public.partner_applications for select to authenticated using (user_id = auth.uid() or public.is_admin());
drop policy if exists "admin update applications" on public.partner_applications;
create policy "admin update applications" on public.partner_applications for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin all application admin" on public.partner_application_admin;
create policy "admin all application admin" on public.partner_application_admin for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin insert vehicules" on public.vehicles;
create policy "admin insert vehicules" on public.vehicles for insert to authenticated with check (public.is_admin());
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values ('partner-docs', 'partner-docs', false, 5242880, array['image/jpeg','image/png','image/webp','application/pdf']) on conflict (id) do nothing;
drop policy if exists "partner upload own" on storage.objects;
create policy "partner upload own" on storage.objects for insert to authenticated with check (bucket_id = 'partner-docs' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "partner read own" on storage.objects;
create policy "partner read own" on storage.objects for select to authenticated using (bucket_id = 'partner-docs' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin()));
