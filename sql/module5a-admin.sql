alter table public.rental_requests alter column status set default 'Nouvelle demande';
alter table public.special_requests alter column status set default 'Nouvelle demande';
update public.rental_requests set status = case status when 'Demande reçue' then 'Nouvelle demande' when 'En vérification' then 'En cours de traitement' when 'Approuvée' then 'Disponibilité confirmée' when 'Payée' then 'Paiement à vérifier' when 'Terminée' then 'Location terminée' else status end;
update public.special_requests set status = case status when 'Demande reçue' then 'Nouvelle demande' when 'En vérification' then 'Recherche en cours' when 'Approuvée' then 'Proposition envoyée' when 'Payée' then 'Convertie en réservation' when 'Terminée' then 'Clôturée' when 'Refusée' then 'Impossible à satisfaire' else status end;
create table if not exists public.admin_history (id uuid primary key default gen_random_uuid(), created_at timestamptz not null default now(), admin_email text, entity text not null, entity_id uuid, detail text not null);
alter table public.admin_history enable row level security;
drop policy if exists "history admin read" on public.admin_history;
create policy "history admin read" on public.admin_history for select to authenticated using (public.is_admin());
create or replace function public.log_change() returns trigger language plpgsql security definer set search_path = public as $$
declare d text;
begin
  if TG_TABLE_NAME in ('rental_requests','special_requests','partner_applications') then
    if new.status is distinct from old.status then d := 'statut : ' || coalesce(old.status,'') || ' → ' || new.status; end if;
  elsif TG_TABLE_NAME = 'vehicles' then
    if new.published is distinct from old.published then d := 'publication : ' || old.published::text || ' → ' || new.published::text;
    elsif new.verification_status is distinct from old.verification_status then d := 'vérification : ' || coalesce(old.verification_status,'') || ' → ' || coalesce(new.verification_status,''); end if;
  end if;
  if d is not null then insert into public.admin_history (admin_email, entity, entity_id, detail) values (coalesce(auth.jwt() ->> 'email', 'système'), TG_TABLE_NAME, new.id, d); end if;
  return new;
end $$;
drop trigger if exists trg_log_rental on public.rental_requests;
create trigger trg_log_rental after update on public.rental_requests for each row execute function public.log_change();
drop trigger if exists trg_log_special on public.special_requests;
create trigger trg_log_special after update on public.special_requests for each row execute function public.log_change();
drop trigger if exists trg_log_partner on public.partner_applications;
create trigger trg_log_partner after update on public.partner_applications for each row execute function public.log_change();
drop trigger if exists trg_log_vehicle on public.vehicles;
create trigger trg_log_vehicle after update on public.vehicles for each row execute function public.log_change();
drop policy if exists "Envoyer une demande de location" on public.rental_requests;
create policy "Envoyer une demande de location" on public.rental_requests for insert to anon, authenticated with check (status = 'Nouvelle demande');
drop policy if exists "Envoyer une demande spéciale" on public.special_requests;
create policy "Envoyer une demande spéciale" on public.special_requests for insert to anon, authenticated with check (status = 'Nouvelle demande');
