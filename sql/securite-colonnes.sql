-- Ajoute les colonnes utilisées par les formulaires si elles n'existent pas déjà.
-- Sans danger : ne supprime ni ne change rien d'existant.
alter table public.rental_requests
  add column if not exists vehicle_id uuid,
  add column if not exists full_name text,
  add column if not exists phone text,
  add column if not exists email text,
  add column if not exists start_date date,
  add column if not exists end_date date,
  add column if not exists pickup_place text,
  add column if not exists return_place text,
  add column if not exists notes text,
  add column if not exists status text default 'Demande reçue';

alter table public.special_requests
  add column if not exists full_name text,
  add column if not exists phone text,
  add column if not exists email text,
  add column if not exists city text,
  add column if not exists start_date date,
  add column if not exists end_date date,
  add column if not exists vehicle_type text,
  add column if not exists make text,
  add column if not exists model text,
  add column if not exists daily_budget numeric,
  add column if not exists transmission text,
  add column if not exists seats integer,
  add column if not exists preferences text,
  add column if not exists pickup_place text,
  add column if not exists return_place text,
  add column if not exists notes text,
  add column if not exists status text default 'Demande reçue';

-- Rappel : les visiteurs peuvent écrire des demandes mais pas les lire.
alter table public.rental_requests enable row level security;
alter table public.special_requests enable row level security;
