-- Add contact details to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS location TEXT;

-- Create property_visits table for tracking user property views
CREATE TABLE IF NOT EXISTS public.property_visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    visited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_property_visits_user_id ON public.property_visits(user_id);
CREATE INDEX IF NOT EXISTS idx_property_visits_property_id ON public.property_visits(property_id);
CREATE INDEX IF NOT EXISTS idx_property_visits_visited_at ON public.property_visits(visited_at);

-- Enable RLS (Row Level Security)
ALTER TABLE public.property_visits ENABLE ROW LEVEL SECURITY;

-- Create policies for property_visits
-- Users can view their own property visits
CREATE POLICY "Users can view their own property visits" 
ON public.property_visits 
FOR SELECT 
USING (user_id = auth.uid());

-- Users can insert their own property visits
CREATE POLICY "Users can insert their own property visits" 
ON public.property_visits 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Function to track property visits
CREATE OR REPLACE FUNCTION track_property_visit(property_uuid UUID)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.property_visits (user_id, property_id, visited_at)
    VALUES (auth.uid(), property_uuid, NOW())
    ON CONFLICT (user_id, property_id) 
    DO UPDATE SET visited_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's property visit history
CREATE OR REPLACE FUNCTION get_user_property_visits(user_uuid UUID, limit_count INTEGER DEFAULT 20)
RETURNS TABLE (
    id UUID,
    property_id UUID,
    property_title TEXT,
    property_location TEXT,
    property_price BIGINT,
    property_images TEXT[],
    visited_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pv.id,
        pv.property_id,
        p.title,
        p.location,
        p.price,
        p.images,
        pv.visited_at
    FROM public.property_visits pv
    JOIN public.properties p ON pv.property_id = p.id
    WHERE pv.user_id = user_uuid
    ORDER BY pv.visited_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;