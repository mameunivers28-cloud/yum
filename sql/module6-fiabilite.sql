alter table public.vehicle_availability add column if not exists rental_id uuid references public.rental_requests(id) on delete cascade;
create unique index if not exists va_rental_unique on public.vehicle_availability (rental_id) where rental_id is not null;
create or replace function public.guard_rental_status() returns trigger language plpgsql security definer set search_path = public as $$
declare confirmed boolean;
begin
  confirmed := new.status in ('Réservation confirmée','Location en cours');
  if confirmed and (old.status is distinct from new.status or old.start_date is distinct from new.start_date or old.end_date is distinct from new.end_date or old.vehicle_id is distinct from new.vehicle_id) then
    if new.vehicle_id is null then raise exception 'NO_VEHICLE'; end if;
    if new.end_date < new.start_date then raise exception 'BAD_DATES'; end if;
    if not exists (select 1 from public.rental_payments p where p.rental_id = new.id and p.kind = 'Loyer' and p.status = 'Paiement validé') then raise exception 'PAYMENT_NOT_VALIDATED'; end if;
    if exists (select 1 from public.vehicle_availability a where a.vehicle_id = new.vehicle_id and a.rental_id is distinct from new.id and daterange(a.start_date, a.end_date, '[]') && daterange(new.start_date, new.end_date, '[]')) then raise exception 'DATES_CONFLICT'; end if;
    insert into public.vehicle_availability (vehicle_id, start_date, end_date, kind, rental_id) values (new.vehicle_id, new.start_date, new.end_date, 'Réservation confirmée', new.id)
      on conflict (rental_id) where rental_id is not null do update set start_date = excluded.start_date, end_date = excluded.end_date, vehicle_id = excluded.vehicle_id;
  elsif not confirmed and old.status in ('Réservation confirmée','Location en cours') and new.status <> 'Location terminée' then
    delete from public.vehicle_availability where rental_id = new.id;
  end if;
  return new;
end $$;
drop trigger if exists trg_guard_rental on public.rental_requests;
create trigger trg_guard_rental before update on public.rental_requests for each row execute function public.guard_rental_status();
create or replace function public.check_rate() returns trigger language plpgsql security definer set search_path = public as $$
declare em text; n int;
begin
  em := lower(coalesce(to_jsonb(new) ->> 'email', ''));
  if em <> '' then
    execute format('select count(*) from public.%I where created_at > now() - interval ''10 minutes'' and lower(coalesce(email, '''')) = %L', tg_table_name, em) into n;
    if n >= 5 then raise exception 'RATE_LIMIT'; end if;
  end if;
  execute format('select count(*) from public.%I where created_at > now() - interval ''10 minutes''', tg_table_name) into n;
  if n >= 60 then raise exception 'RATE_LIMIT'; end if;
  return new;
end $$;
drop trigger if exists trg_rate_rental on public.rental_requests;
create trigger trg_rate_rental before insert on public.rental_requests for each row execute function public.check_rate();
drop trigger if exists trg_rate_special on public.special_requests;
create trigger trg_rate_special before insert on public.special_requests for each row execute function public.check_rate();
drop trigger if exists trg_rate_contact on public.contact_messages;
create trigger trg_rate_contact before insert on public.contact_messages for each row execute function public.check_rate();
drop trigger if exists trg_rate_partner on public.partner_requests;
create trigger trg_rate_partner before insert on public.partner_requests for each row execute function public.check_rate();
drop policy if exists "partner select own" on public.partner_applications;
create policy "partner select own" on public.partner_applications for select to authenticated using (user_id = auth.uid() or public.is_manager());
drop policy if exists "partner read own" on storage.objects;
create policy "partner read own" on storage.objects for select to authenticated using (bucket_id = 'partner-docs' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_manager()));
drop policy if exists "Envoyer une demande de location" on public.rental_requests;
create policy "Envoyer une demande de location" on public.rental_requests for insert to anon, authenticated with check (status = 'Nouvelle demande' and (user_id is null or user_id = auth.uid()));
drop policy if exists "Envoyer une demande spéciale" on public.special_requests;
create policy "Envoyer une demande spéciale" on public.special_requests for insert to anon, authenticated with check (status = 'Nouvelle demande' and (user_id is null or user_id = auth.uid()));
revoke update, delete, truncate on all tables in schema public from anon;
revoke insert on public.admin_history, public.admins, public.vehicles, public.vehicle_inspections, public.rental_contracts, public.rental_admin, public.rental_payments, public.partner_applications, public.partner_application_admin, public.vehicle_availability from anon;
