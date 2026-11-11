alter table public.rental_requests add column if not exists user_id uuid default auth.uid();
alter table public.special_requests add column if not exists user_id uuid default auth.uid();
drop policy if exists "own rental select" on public.rental_requests;
create policy "own rental select" on public.rental_requests for select to authenticated using (user_id = auth.uid());
drop policy if exists "own special select" on public.special_requests;
create policy "own special select" on public.special_requests for select to authenticated using (user_id = auth.uid());
