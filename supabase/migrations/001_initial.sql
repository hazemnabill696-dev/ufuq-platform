-- أُفُق (Ufuq) — initial schema
-- Run in Supabase SQL Editor or via CLI: supabase db push

create extension if not exists "pgcrypto";

-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  role text not null check (role in ('student', 'parent', 'teacher')),
  avatar_url text,
  age integer,
  grade integer,
  parent_id uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

create table if not exists public.subject_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  subject_id text not null,
  points integer not null default 0,
  level integer not null default 1,
  activities_completed integer not null default 0,
  last_activity timestamptz,
  unique (user_id, subject_id)
);

create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  achievement_id text not null,
  earned_at timestamptz not null default now(),
  unique (user_id, achievement_id)
);

create table if not exists public.activity_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  subject_id text not null,
  points_earned integer not null default 0,
  activity_type text not null default 'activity',
  completed_at timestamptz not null default now()
);

create index if not exists idx_subject_progress_user on public.subject_progress (user_id);
create index if not exists idx_achievements_user on public.achievements (user_id);
create index if not exists idx_activity_log_user on public.activity_log (user_id);

alter table public.profiles enable row level security;
alter table public.subject_progress enable row level security;
alter table public.achievements enable row level security;
alter table public.activity_log enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

create policy "subject_progress_all_own"
  on public.subject_progress for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "achievements_all_own"
  on public.achievements for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "activity_log_all_own"
  on public.activity_log for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Auto-create profile row on signup (uses user_metadata from signUp)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'طالب'),
    coalesce(new.raw_user_meta_data->>'role', 'student')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
