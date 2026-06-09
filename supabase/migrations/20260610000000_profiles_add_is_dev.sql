alter table public.profiles
  add column if not exists is_dev boolean not null default false;

-- Replace the broad update policy with one that prevents users from
-- elevating their own is_dev flag. Only service role can set is_dev = true.
drop policy if exists "own profile update" on public.profiles;

create policy "own profile update" on public.profiles
  for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and is_dev = (select is_dev from public.profiles where id = auth.uid())
  );
