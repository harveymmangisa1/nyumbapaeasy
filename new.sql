do $$ begin  if not exists (select 1 from storage.buckets where id =
'verification-documents') then  insert into storage.buckets (id, name,
public) values ('verification-documents', 'verification-documents', true);
end if;  if not exists (select 1 from storage.buckets where id =
'properties-images') then  insert into storage.buckets (id, name, public)
values ('properties-images', 'properties-images', true);  end if; end$$;

-- Make both buckets public (readable by anyone) update storage.buckets set
public = true where id in ('verification-documents', 'properties-images');

-- 3) Enable RLS on storage.objects (enabled by default, but ensure policies
are correct) alter table storage.objects enable row level security;

-- Helper: role check function from profiles -- This function returns true if
the current authenticated user has any of the allowed roles. create or
replace function public.user_has_allowed_role(allowed_roles text[]) returns
boolean language sql stable as $$  select exists (  select 1  from
public.profiles p  where p.id = auth.uid()  and p.role = any (allowed_roles)
); $$;

-- 4) Storage policies per bucket -- NOTE: storage.objects has columns: --
bucket_id, name, id, owner, metadata, created_at, updated_at -- We’ll use
path convention: folder starts with user UUID (e.g., 'USER_ID/...') to
enforce ownership.

-- 4a) Public READ for both buckets (anyone can view images) drop policy if
exists "Public read verification docs" on storage.objects; create policy
"Public read verification docs" on storage.objects for select using
(bucket_id = 'verification-documents');

drop policy if exists "Public read property images" on storage.objects;
create policy "Public read property images" on storage.objects for select
using (bucket_id = 'properties-images');

-- 4b) Authenticated upload (insert) to own folder for allowed roles --
Allowed roles: landlord, real_estate_agency, admin drop policy if exists
"Upload own verification docs" on storage.objects; create policy "Upload own
verification docs" on storage.objects for insert to authenticated with check
(  bucket_id = 'verification-documents'  and
user_has_allowed_role(array['landlord','real_estate_agency','admin'])  and
(split_part(name, '/', 1) = auth.uid()::text) -- Enforce path starts with
user id );

drop policy if exists "Upload own property images" on storage.objects; create
policy "Upload own property images" on storage.objects for insert to
authenticated with check (  bucket_id = 'properties-images'  and
user_has_allowed_role(array['landlord','real_estate_agency','admin'])  and
(split_part(name, '/', 1) = auth.uid()::text) );

-- 4c) Update (replace) own files only for allowed roles drop policy if
exists "Update own verification docs" on storage.objects; create policy
"Update own verification docs" on storage.objects for update to authenticated
using (  bucket_id = 'verification-documents'  and
user_has_allowed_role(array['landlord','real_estate_agency','admin'])  and
(split_part(name, '/', 1) = auth.uid()::text) ) with check (  bucket_id =
'verification-documents'  and (split_part(name, '/', 1) = auth.uid()::text)
);

drop policy if exists "Update own property images" on storage.objects; create
policy "Update own property images" on storage.objects for update to
authenticated using (  bucket_id = 'properties-images'  and
user_has_allowed_role(array['landlord','real_estate_agency','admin'])  and
(split_part(name, '/', 1) = auth.uid()::text) ) with check (  bucket_id =
'properties-images'  and (split_part(name, '/', 1) = auth.uid()::text) );

-- 4d) Delete own files only for allowed roles drop policy if exists "Delete
own verification docs" on storage.objects; create policy "Delete own
verification docs" on storage.objects for delete to authenticated using (
bucket_id = 'verification-documents'  and
user_has_allowed_role(array['landlord','real_estate_agency','admin'])  and
(split_part(name, '/', 1) = auth.uid()::text) );

drop policy if exists "Delete own property images" on storage.objects; create
policy "Delete own property images" on storage.objects for delete to
authenticated using (  bucket_id = 'properties-images'  and
user_has_allowed_role(array['landlord','real_estate_agency','admin'])  and
(split_part(name, '/', 1) = auth.uid()::text) );

-- ========================================= -- Optional: Table policies for
image metadata (if applicable) -- If you maintain a property_images table
referencing properties and storing image URLs, -- use policies below. If not,
you can remove this section. -- =========================================

-- Example schema (adjust if you already have one) -- create table if not
exists public.property_images ( -- id uuid primary key default
gen_random_uuid(), -- property_id uuid not null references
public.properties(id) on delete cascade, -- user_id uuid not null references
auth.users(id) on delete cascade, -- image_url text not null, -- created_at
timestamptz not null default now() -- );

-- Enable RLS -- alter table public.property_images enable row level
security;

-- Allow public read of images metadata (just the URLs and relations) -- drop
policy if exists "Public read property_images" on public.property_images; --
create policy "Public read property_images" -- on public.property_images for
select -- using (true);

-- Allow owners (landlord/agency/admin) to insert/update/delete their own
rows -- drop policy if exists "Insert own property_images" on
public.property_images; -- create policy "Insert own property_images" -- on
public.property_images for insert -- to authenticated -- with check
(auth.uid() = user_id and
user_has_allowed_role(array['landlord','real_estate_agency','admin']));

-- drop policy if exists "Update own property_images" on
public.property_images; -- create policy "Update own property_images" -- on
public.property_images for update -- to authenticated -- using (auth.uid() =
user_id and
user_has_allowed_role(array['landlord','real_estate_agency','admin'])) --
with check (auth.uid() = user_id);

-- drop policy if exists "Delete own property_images" on
public.property_images; -- create policy "Delete own property_images" -- on
public.property_images for delete -- to authenticated -- using (auth.uid() =
user_id and
user_has_allowed_role(array['landlord','real_estate_agency','admin']));