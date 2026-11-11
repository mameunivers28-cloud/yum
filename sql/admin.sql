-- Espace administrateur YUM : seuls les courriels listés dans la table "admins" peuvent lire et modifier les demandes.
create table if not exists public.admins (email text primary key);
alter table public.admins enable row level security;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where lower(email) = lower(auth.jwt() ->> 'email'));
$$;

drop policy if exists "admin lit demandes" on public.rental_requests;
drop policy if exists "admin modifie demandes" on public.rental_requests;
create policy "admin lit demandes" on public.rental_requests for select to authenticated using (public.is_admin());
create policy "admin modifie demandes" on public.rental_requests for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin lit demandes speciales" on public.special_requests;
drop policy if exists "admin modifie demandes speciales" on public.special_requests;
create policy "admin lit demandes speciales" on public.special_requests for select to authenticated using (public.is_admin());
create policy "admin modifie demandes speciales" on public.special_requests for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin lit vehicules" on public.vehicles;
drop policy if exists "admin modifie vehicules" on public.vehicles;
create policy "admin lit vehicules" on public.vehicles for select to authenticated using (public.is_admin());
create policy "admin modifie vehicules" on public.vehicles for update to authenticated using (public.is_admin()) with check (public.is_admin());
