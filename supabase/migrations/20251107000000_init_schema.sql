-- Init schema: auth users reference + public profiles with RLS
-- Note: Supabase auth.users exists in the auth schema and is managed by Supabase.
-- This migration creates a public.profiles table referencing auth.users.

-- Create extension if needed for UUID (usually enabled by default in Supabase)
create extension if not exists "uuid-ossp";

-- Schema: public.profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  full_name text,
  avatar_url text,
  website text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Ensure updated_at auto-updates
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- Enable RLS and add policies
alter table public.profiles enable row level security;

-- Policy: users can select any profile (optional: open-read)
create policy if not exists "Profiles are viewable by everyone"
  on public.profiles
  for select
  using (true);

-- Policy: users can insert their own profile (id must equal auth.uid())
create policy if not exists "Users can insert their own profile"
  on public.profiles
  for insert
  with check ( id = auth.uid() );

-- Policy: users can update their own profile
create policy if not exists "Users can update own profile"
  on public.profiles
  for update
  using ( id = auth.uid() )
  with check ( id = auth.uid() );

-- Optional: restrict delete to owners only (or admins via a future role)
create policy if not exists "Users can delete own profile"
  on public.profiles
  for delete
  using ( id = auth.uid() );

-- Helper: when a new user signs up, create a profile row automatically
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
