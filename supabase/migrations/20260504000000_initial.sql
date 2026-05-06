-- ── Tables ───────────────────────────────────────────────────────────────────

create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  firm_name text,
  firm_type text check (firm_type in ('RIA', 'Fintech', 'Insurance', 'Bank')),
  aum_range text,
  regulator text check (regulator in ('FINRA', 'SEC', 'State', 'Multiple')),
  plan text not null default 'design_partner',
  created_at timestamptz not null default now()
);

create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  file_name text not null,
  file_path text,
  extracted_text text,
  page_count int,
  status text not null default 'uploaded'
    check (status in ('uploaded', 'analysing', 'complete', 'error')),
  created_at timestamptz not null default now()
);

create table if not exists audits (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references documents(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  firm_name text not null,
  exec_summary text,
  total_gaps int not null default 0,
  high_risk int not null default 0,
  medium_risk int not null default 0,
  low_risk int not null default 0,
  strengths jsonb not null default '[]',
  priority_actions jsonb not null default '[]',
  raw_result jsonb,
  created_at timestamptz not null default now()
);

create table if not exists findings (
  id uuid primary key default gen_random_uuid(),
  audit_id uuid not null references audits(id) on delete cascade,
  req_id text,
  rule text,
  requirement text,
  policy_says text,
  gap text,
  risk text check (risk in ('High', 'Medium', 'Low')),
  recommendation text,
  status text not null default 'open'
    check (status in ('open', 'in_progress', 'resolved')),
  created_at timestamptz not null default now()
);

-- Phase 2
create table if not exists regulatory_updates (
  id uuid primary key default gen_random_uuid(),
  regulator text,
  title text,
  summary text,
  url text,
  published_at timestamptz,
  relevance_score int check (relevance_score between 1 and 5),
  affected_rules text[],
  raw_content text,
  created_at timestamptz not null default now()
);

-- ── Auto-create profile on signup ─────────────────────────────────────────────

create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- Revoke execute from public for security definer functions
revoke execute on function public.handle_new_user() from public;
revoke execute on function public.handle_new_user() from authenticated;
revoke execute on function public.handle_new_user() from anon;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ── Row-Level Security ────────────────────────────────────────────────────────

alter table profiles enable row level security;
alter table documents enable row level security;
alter table audits enable row level security;
alter table findings enable row level security;
alter table regulatory_updates enable row level security;

-- Profiles
create policy "own profile select" on profiles
  for select using (auth.uid() = id);
create policy "own profile update" on profiles
  for update using (auth.uid() = id);
create policy "own profile insert" on profiles
  for insert with check (auth.uid() = id);

-- Documents
create policy "own documents select" on documents
  for select using (auth.uid() = user_id);
create policy "own documents insert" on documents
  for insert with check (auth.uid() = user_id);
create policy "own documents update" on documents
  for update using (auth.uid() = user_id);

-- Audits
create policy "own audits select" on audits
  for select using (auth.uid() = user_id);
create policy "own audits insert" on audits
  for insert with check (auth.uid() = user_id);

-- Findings (access granted via audit ownership)
create policy "own findings select" on findings
  for select using (
    exists (
      select 1 from audits
      where audits.id = findings.audit_id
        and audits.user_id = auth.uid()
    )
  );
create policy "own findings insert" on findings
  for insert with check (
    exists (
      select 1 from audits
      where audits.id = findings.audit_id
        and audits.user_id = auth.uid()
    )
  );

-- ── Storage ───────────────────────────────────────────────────────────────────

insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

create policy "users upload own documents" on storage.objects
  for insert with check (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "users read own documents" on storage.objects
  for select using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
