-- Add missing columns to profiles table
-- This migration adds the columns needed by the application that were missing from the initial schema

-- Add missing columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS name text,
ADD COLUMN IF NOT EXISTS role text DEFAULT 'user' CHECK (role IN ('user', 'landlord', 'admin', 'real_estate_agency')),
ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS has_pending_verification boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS agency_name text,
ADD COLUMN IF NOT EXISTS business_registration_number text,
ADD COLUMN IF NOT EXISTS license_number text,
ADD COLUMN IF NOT EXISTS manager_names text,
ADD COLUMN IF NOT EXISTS phone_number text,
ADD COLUMN IF NOT EXISTS bio text,
ADD COLUMN IF NOT EXISTS location text;

-- Update the trigger function to handle new user creation with proper defaults
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, name, role, is_verified, has_pending_verification)
  VALUES (
    new.id, 
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce((new.raw_user_meta_data->>'role')::text, 'user'),
    coalesce((new.raw_user_meta_data->>'is_verified')::boolean, false),
    coalesce((new.raw_user_meta_data->>'has_pending_verification')::boolean, false)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update RLS policies to handle the new columns properly
-- Policy for selecting profiles remains the same

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON public.profiles;

-- Policy for inserting profiles - ensure users can only insert their own profile with proper defaults
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT
  WITH CHECK (id = auth.uid());

-- Policy for updating profiles - users can update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Policy for deleting profiles - users can delete their own profile
CREATE POLICY "Users can delete own profile" ON public.profiles
  FOR DELETE
  USING (id = auth.uid());

-- Create an index on role for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Create an index on verification status for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_is_verified ON public.profiles(is_verified);

-- Create an index on pending verification for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_has_pending_verification ON public.profiles(has_pending_verification);