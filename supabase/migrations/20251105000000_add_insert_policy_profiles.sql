-- Add INSERT policy for profiles table
-- This allows users to create their own profile if one doesn't exist
CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (id = auth.uid());
