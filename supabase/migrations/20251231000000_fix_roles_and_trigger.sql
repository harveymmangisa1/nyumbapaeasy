-- Migration: Fix roles and trigger mapping
-- Created: 2025-12-31

-- 1. Update role constraint to include all frontend roles
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('user', 'landlord', 'admin', 'real_estate_agency', 'searcher', 'lodge_owner', 'bnb_owner'));

-- 2. Add missing columns to profiles table if they don't exist
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS national_id TEXT,
ADD COLUMN IF NOT EXISTS phone_number TEXT;

-- 3. Update trigger function to map all metadata fields from auth.users to public.profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    full_name, 
    name, 
    role, 
    is_verified, 
    has_pending_verification,
    phone_number,
    national_id,
    business_registration_number,
    license_number,
    manager_names
  )
  VALUES (
    new.id, 
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce((new.raw_user_meta_data->>'role')::text, 'user'),
    coalesce((new.raw_user_meta_data->>'is_verified')::boolean, false),
    coalesce((new.raw_user_meta_data->>'has_pending_verification')::boolean, false),
    new.raw_user_meta_data->>'phone_number',
    new.raw_user_meta_data->>'national_id',
    new.raw_user_meta_data->>'business_registration_number',
    new.raw_user_meta_data->>'license_number',
    new.raw_user_meta_data->>'manager_names'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    phone_number = EXCLUDED.phone_number,
    national_id = EXCLUDED.national_id,
    business_registration_number = EXCLUDED.business_registration_number,
    license_number = EXCLUDED.license_number,
    manager_names = EXCLUDED.manager_names;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 4. Update property policies to include all management roles
DROP POLICY IF EXISTS "Agencies and admins can insert properties" ON public.properties;
DROP POLICY IF EXISTS "Managers can insert properties" ON public.properties;

CREATE POLICY "Managers can insert properties"
  ON public.properties
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND owner_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('real_estate_agency', 'admin', 'landlord', 'lodge_owner', 'bnb_owner')
    )
  );

-- 5. Ensure existing profiles have correct roles if they were stuck
UPDATE public.profiles SET role = 'searcher' WHERE role = 'user' AND id IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'searcher');
