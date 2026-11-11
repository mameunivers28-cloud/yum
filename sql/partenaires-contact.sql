create table if not exists public.partner_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null, phone text not null, email text not null,
  city text, vehicle_make text, vehicle_model text, vehicle_year int,
  message text, status text not null default 'Nouvelle', created_at timestamptz not null default now()
);
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  full_name text not null, phone text, email text not null,
  subject text, message text not null, created_at timestamptz not null default now()
);
alter table public.partner_requests enable row level security;
alter table public.contact_messages enable row level security;
drop policy if exists "insert public partner" on public.partner_requests;
create policy "insert public partner" on public.partner_requests for insert to anon, authenticated with check (true);
drop policy if exists "insert public contact" on public.contact_messages;
create policy "insert public contact" on public.contact_messages for insert to anon, authenticated with check (true);
drop policy if exists "admin read partner" on public.partner_requests;
create policy "admin read partner" on public.partner_requests for select to authenticated using (public.is_admin());
drop policy if exists "admin read contact" on public.contact_messages;
create policy "admin read contact" on public.contact_messages for select to authenticated using (public.is_admin());
