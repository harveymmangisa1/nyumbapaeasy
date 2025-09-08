-- Create helper function to check user role
CREATE OR REPLACE FUNCTION is_landlord()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE id = auth.uid() AND role = 'landlord'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create bucket if not exists
INSERT INTO storage.buckets (id, name)
VALUES ('property-images', 'property-images')
ON CONFLICT DO NOTHING;