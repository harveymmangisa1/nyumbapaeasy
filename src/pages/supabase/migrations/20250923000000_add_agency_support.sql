-- Update the role CHECK constraint to include real_estate_agency
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
    CHECK (role IN ('admin', 'landlord', 'renter', 'real_estate_agency'));

-- Add agency-specific fields to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS business_registration_number TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS license_number TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS manager_names TEXT;

-- Update the trigger function to handle agency fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id, 
        name, 
        role,
        business_registration_number,
        license_number,
        manager_names
    )
    VALUES (
        NEW.id, 
        NEW.raw_user_meta_data->>'name', 
        COALESCE(NEW.raw_user_meta_data->>'role', 'renter'),
        NEW.raw_user_meta_data->>'business_registration_number',
        NEW.raw_user_meta_data->>'license_number',
        NEW.raw_user_meta_data->>'manager_names'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update RLS policies to include real estate agencies
-- Real estate agencies can view and manage properties like landlords
CREATE POLICY IF NOT EXISTS "Real estate agencies can view properties" 
ON public.properties 
FOR SELECT 
USING (
    landlord_id = auth.uid() 
    OR EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND role IN ('real_estate_agency', 'admin')
    )
);

CREATE POLICY IF NOT EXISTS "Real estate agencies can manage properties" 
ON public.properties 
FOR ALL 
USING (
    landlord_id = auth.uid() 
    OR EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND role IN ('real_estate_agency', 'admin')
    )
);