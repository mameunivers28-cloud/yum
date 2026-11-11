-- Module 7 : suppression de dossiers (Administrateur principal uniquement)
-- A exécuter une fois dans Supabase > SQL Editor. Aucune donnée existante n'est modifiée.

create or replace function public.is_main_admin() returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(public.admin_role() = 'Administrateur principal', false);
$$;

-- Dossiers partenaires : suppression possible seulement s'ils ne sont pas liés à un véhicule
drop policy if exists "main admin delete applications" on public.partner_applications;
create policy "main admin delete applications" on public.partner_applications for delete to authenticated
  using (public.is_main_admin() and vehicle_id is null);

-- Demandes spéciales
drop policy if exists "main admin delete specials" on public.special_requests;
create policy "main admin delete specials" on public.special_requests for delete to authenticated
  using (public.is_main_admin());

-- Documents privés des dossiers partenaires
drop policy if exists "main admin delete partner docs" on storage.objects;
create policy "main admin delete partner docs" on storage.objects for delete to authenticated
  using (bucket_id = 'partner-docs' and public.is_main_admin());

-- Trace dans l'historique avant toute suppression
create or replace function public.log_delete() returns trigger language plpgsql security definer set search_path = public as $$
declare d text;
begin
  if TG_TABLE_NAME = 'partner_applications' then
    d := 'dossier supprimé : ' || coalesce(old.full_name, '') || ' · ' || coalesce(old.vehicle_make, '') || ' ' || coalesce(old.vehicle_model, '') || ' · statut ' || coalesce(old.status, '');
  else
    d := 'demande supprimée : ' || coalesce(old.full_name, '') || ' · statut ' || coalesce(old.status, '');
  end if;
  insert into public.admin_history (admin_email, entity, entity_id, detail) values (coalesce(auth.jwt() ->> 'email', 'système'), TG_TABLE_NAME, old.id, d);
  return old;
end $$;
drop trigger if exists trg_log_delete_app on public.partner_applications;
create trigger trg_log_delete_app before delete on public.partner_applications for each row execute function public.log_delete();
drop trigger if exists trg_log_delete_special on public.special_requests;
create trigger trg_log_delete_special before delete on public.special_requests for each row execute function public.log_delete();
