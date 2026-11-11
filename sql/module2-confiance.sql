-- Statut de vérification des véhicules (les véhicules existants restent « Approuvé »)
alter table public.vehicles add column if not exists verification_status text not null default 'Approuvé';
alter table public.vehicles alter column verification_status set default 'En attente de vérification';
alter table public.vehicles drop constraint if exists vehicles_verif_check;
alter table public.vehicles add constraint vehicles_verif_check check (verification_status in ('En attente de vérification','En cours d’examen','Informations complémentaires demandées','Approuvé','Refusé','Suspendu'));
-- Règle appliquée par la base : le public ne voit que les véhicules approuvés (l'admin voit tout)
drop policy if exists "approved only" on public.vehicles;
create policy "approved only" on public.vehicles as restrictive for select to anon, authenticated using (verification_status = 'Approuvé' or public.is_admin());

-- États des lieux (structure) : accès administrateur uniquement
create table if not exists public.vehicle_inspections (
  id uuid primary key default gen_random_uuid(),
  rental_request_id uuid references public.rental_requests(id),
  kind text not null check (kind in ('Départ','Retour')),
  inspected_at timestamptz not null default now(),
  mileage_km int, fuel_level text, exterior_state text, interior_state text, notes text,
  photos text[], confirmed_by_client boolean not null default false, confirmed_by_staff boolean not null default false,
  created_by uuid default auth.uid(), created_at timestamptz not null default now()
);
-- Contrats (structure) : aucun texte juridique, à rédiger et valider par YUM
create table if not exists public.rental_contracts (
  id uuid primary key default gen_random_uuid(),
  rental_request_id uuid references public.rental_requests(id),
  status text not null default 'À préparer',
  terms_version text, document_path text,
  client_confirmed_at timestamptz, staff_confirmed_at timestamptz,
  created_by uuid default auth.uid(), created_at timestamptz not null default now()
);
alter table public.vehicle_inspections enable row level security;
alter table public.rental_contracts enable row level security;
drop policy if exists "admin all inspections" on public.vehicle_inspections;
create policy "admin all inspections" on public.vehicle_inspections for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin all contracts" on public.rental_contracts;
create policy "admin all contracts" on public.rental_contracts for all to authenticated using (public.is_admin()) with check (public.is_admin());
