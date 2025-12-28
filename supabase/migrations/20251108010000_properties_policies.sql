-- RLS policies and trigger for public.properties
-- Adjust role values if your app uses different role names

-- Ensure properties table exists (no-op if it already does). Modify columns as per your schema.
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  title text,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_properties_updated_at on public.properties;
create trigger set_properties_updated_at
before update on public.properties
for each row execute function public.set_updated_at();

-- Enable RLS
alter table public.properties enable row level security;

-- Helper trigger: set owner_id to current user if not provided
create or replace function public.set_property_owner()
returns trigger as $$
begin
  if new.owner_id is null then
    new.owner_id := auth.uid();
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists set_property_owner_tg on public.properties;
create trigger set_property_owner_tg
before insert on public.properties
for each row execute function public.set_property_owner();

-- Policies
-- Select: open read (adjust if needed)
drop policy if exists "Properties are viewable by everyone" on public.properties;
create policy "Properties are viewable by everyone"
  on public.properties
  for select
  to anon, authenticated
  using (true);

-- Insert: agencies and admins can create (owner_id must be current user)
drop policy if exists "Agencies and admins can insert properties" on public.properties;
create policy "Agencies and admins can insert properties"
  on public.properties
  for insert
  to authenticated
  with check (
    auth.uid() is not null
    and owner_id = auth.uid()
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role in ('real_estate_agency', 'admin')
    )
  );

-- Update: owners or admins
drop policy if exists "Owners (and admins) can update properties" on public.properties;
create policy "Owners (and admins) can update properties"
  on public.properties
  for update
  to authenticated
  using (
    owner_id = auth.uid()
    or exists (
      select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
    )
  )
  with check (
    owner_id = auth.uid()
    or exists (
      select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Delete: owners or admins
drop policy if exists "Owners (and admins) can delete properties" on public.properties;
create policy "Owners (and admins) can delete properties"
  on public.properties
  for delete
  to authenticated
  using (
    owner_id = auth.uid()
    or exists (
      select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
    )
  );
