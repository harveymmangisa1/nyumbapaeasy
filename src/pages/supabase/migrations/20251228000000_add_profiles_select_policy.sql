-- Add missing SELECT policy for profiles table
-- Users should be able to read their own profiles and admins should be able to read all profiles

-- Enable RLS on profiles table (if not already enabled)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing SELECT policy if it exists
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;

-- Policy for selecting profiles - users can read their own profile, admins can read all profiles
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT
  USING (
    id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );