alter table public.admins add column if not exists role text not null default 'Administrateur principal';
alter table public.admins drop constraint if exists admins_role_check;
alter table public.admins add constraint admins_role_check check (role in ('Administrateur principal','Gestionnaire','Agent opérationnel'));
create or replace function public.admin_role() returns text language sql stable security definer set search_path = public as $$ select role from public.admins where lower(email) = lower(auth.jwt() ->> 'email') limit 1; $$;
create or replace function public.is_manager() returns boolean language sql stable security definer set search_path = public as $$ select coalesce(public.admin_role() in ('Administrateur principal','Gestionnaire'), false); $$;
create table if not exists public.rental_admin (rental_id uuid primary key references public.rental_requests(id) on delete cascade, final_total int, delivery_fee int, yum_commission int, owner_share int, client_docs_status text not null default 'Non vérifié' check (client_docs_status in ('Non vérifié','Documents reçus','Vérifié','Refusé')), notes text, updated_at timestamptz not null default now());
create table if not exists public.rental_payments (id uuid primary key default gen_random_uuid(), rental_id uuid not null references public.rental_requests(id) on delete cascade, kind text not null check (kind in ('Loyer','Dépôt de garantie','Frais de livraison')), amount int not null check (amount >= 0), status text not null default 'Paiement attendu' check (status in ('Paiement attendu','Paiement déclaré','Paiement à vérifier','Paiement validé','Paiement refusé','Remboursement à traiter','Remboursement effectué')), note text, created_at timestamptz not null default now());
alter table public.rental_admin enable row level security;
alter table public.rental_payments enable row level security;
drop policy if exists "finance managers rental_admin" on public.rental_admin;
create policy "finance managers rental_admin" on public.rental_admin for all to authenticated using (public.is_manager()) with check (public.is_manager());
drop policy if exists "finance managers payments" on public.rental_payments;
create policy "finance managers payments" on public.rental_payments for all to authenticated using (public.is_manager()) with check (public.is_manager());
drop policy if exists "admin modifie vehicules" on public.vehicles;
create policy "admin modifie vehicules" on public.vehicles for update to authenticated using (public.is_manager()) with check (public.is_manager());
drop policy if exists "admin insert vehicules" on public.vehicles;
create policy "admin insert vehicules" on public.vehicles for insert to authenticated with check (public.is_manager());
drop policy if exists "admin update applications" on public.partner_applications;
create policy "admin update applications" on public.partner_applications for update to authenticated using (public.is_manager()) with check (public.is_manager());
drop policy if exists "admin all application admin" on public.partner_application_admin;
create policy "admin all application admin" on public.partner_application_admin for all to authenticated using (public.is_manager()) with check (public.is_manager());
create or replace function public.log_change() returns trigger language plpgsql security definer set search_path = public as $$
declare d text;
begin
  if TG_TABLE_NAME in ('rental_requests','special_requests','partner_applications','rental_payments') then
    if new.status is distinct from old.status then d := 'statut : ' || coalesce(old.status,'') || ' → ' || new.status; end if;
  elsif TG_TABLE_NAME = 'vehicles' then
    if new.published is distinct from old.published then d := 'publication : ' || old.published::text || ' → ' || new.published::text;
    elsif new.verification_status is distinct from old.verification_status then d := 'vérification : ' || coalesce(old.verification_status,'') || ' → ' || coalesce(new.verification_status,''); end if;
  end if;
  if d is not null then insert into public.admin_history (admin_email, entity, entity_id, detail) values (coalesce(auth.jwt() ->> 'email', 'système'), TG_TABLE_NAME, new.id, d); end if;
  return new;
end $$;
drop trigger if exists trg_log_payment on public.rental_payments;
create trigger trg_log_payment after update on public.rental_payments for each row execute function public.log_change();
