-- Create property_views table to track individual property views
CREATE TABLE IF NOT EXISTS public.property_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_property_views_property_id ON public.property_views(property_id);
CREATE INDEX IF NOT EXISTS idx_property_views_user_id ON public.property_views(user_id);
CREATE INDEX IF NOT EXISTS idx_property_views_created_at ON public.property_views(created_at);

-- Enable RLS (Row Level Security)
ALTER TABLE public.property_views ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Admins can view all property views
CREATE POLICY "Admins can view all property views" 
ON public.property_views 
FOR SELECT 
USING ( EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
));

-- Landlords can view views of their own properties
CREATE POLICY "Landlords can view views of their properties" 
ON public.property_views 
FOR SELECT 
USING ( EXISTS (
    SELECT 1 FROM public.properties 
    WHERE id = property_id AND landlord_id = auth.uid()
));

-- Admins can insert property views (for tracking purposes)
CREATE POLICY "Admins can insert property views" 
ON public.property_views 
FOR INSERT 
WITH CHECK ( EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
));

-- Add views column to properties table if it doesn't exist
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- Create a function to update property views count
CREATE OR REPLACE FUNCTION update_property_views()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the views count in the properties table
    UPDATE public.properties 
    SET views = views + 1 
    WHERE id = NEW.property_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically update property views count
DROP TRIGGER IF EXISTS on_property_view ON public.property_views;
CREATE TRIGGER on_property_view
    AFTER INSERT ON public.property_views
    FOR EACH ROW EXECUTE FUNCTION update_property_views();

-- Create a materialized view for property view statistics
CREATE MATERIALIZED VIEW IF NOT EXISTS public.property_view_stats AS
SELECT 
    p.id as property_id,
    p.title as property_title,
    COUNT(pv.id) as total_views,
    COUNT(DISTINCT pv.user_id) as unique_views,
    MAX(pv.created_at) as last_viewed
FROM public.properties p
LEFT JOIN public.property_views pv ON p.id = pv.property_id
GROUP BY p.id, p.title;

-- Refresh the materialized view
REFRESH MATERIALIZED VIEW public.property_view_stats;

-- Create a function to refresh the materialized view
CREATE OR REPLACE FUNCTION refresh_property_view_stats()
RETURNS TRIGGER AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY public.property_view_stats;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to refresh materialized view when property_views changes
DROP TRIGGER IF EXISTS refresh_property_view_stats_trigger ON public.property_views;
CREATE TRIGGER refresh_property_view_stats_trigger
    AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE ON public.property_views
    FOR EACH STATEMENT EXECUTE FUNCTION refresh_property_view_stats();

-- Create function for landlord analytics summary
CREATE OR REPLACE FUNCTION get_landlord_analytics_summary(landlord_id UUID)
RETURNS TABLE(
    total_views BIGINT,
    unique_visitors BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(pv.id) as total_views,
        COUNT(DISTINCT pv.user_id) as unique_visitors
    FROM public.properties p
    LEFT JOIN public.property_views pv ON p.id = pv.property_id
    WHERE p.landlord_id = landlord_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function for admin analytics summary
CREATE OR REPLACE FUNCTION get_admin_analytics_summary()
RETURNS TABLE(
    total_views BIGINT,
    unique_visitors BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(pv.id) as total_views,
        COUNT(DISTINCT pv.user_id) as unique_visitors
    FROM public.property_views pv;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function for popular properties (landlord)
CREATE OR REPLACE FUNCTION get_popular_properties(landlord_id UUID)
RETURNS TABLE(
    property_id UUID,
    property_title TEXT,
    total_views BIGINT,
    unique_views BIGINT,
    last_viewed TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pvs.property_id,
        pvs.property_title,
        pvs.total_views,
        pvs.unique_views,
        pvs.last_viewed
    FROM public.property_view_stats pvs
    JOIN public.properties p ON pvs.property_id = p.id
    WHERE p.landlord_id = landlord_id
    ORDER BY pvs.total_views DESC
    LIMIT 5;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function for popular properties (admin)
CREATE OR REPLACE FUNCTION get_popular_properties_admin()
RETURNS TABLE(
    property_id UUID,
    property_title TEXT,
    total_views BIGINT,
    unique_views BIGINT,
    last_viewed TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        property_id,
        property_title,
        total_views,
        unique_views,
        last_viewed
    FROM public.property_view_stats
    ORDER BY total_views DESC
    LIMIT 5;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function for views by date (landlord)
CREATE OR REPLACE FUNCTION get_views_by_date(landlord_id UUID)
RETURNS TABLE(
    date TEXT,
    views BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        TO_CHAR(pv.created_at, 'YYYY-MM-DD') as date,
        COUNT(pv.id) as views
    FROM public.property_views pv
    JOIN public.properties p ON pv.property_id = p.id
    WHERE p.landlord_id = landlord_id
    AND pv.created_at >= NOW() - INTERVAL '30 days'
    GROUP BY TO_CHAR(pv.created_at, 'YYYY-MM-DD')
    ORDER BY date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function for views by date (admin)
CREATE OR REPLACE FUNCTION get_views_by_date_admin()
RETURNS TABLE(
    date TEXT,
    views BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        TO_CHAR(created_at, 'YYYY-MM-DD') as date,
        COUNT(id) as views
    FROM public.property_views
    WHERE created_at >= NOW() - INTERVAL '30 days'
    GROUP BY TO_CHAR(created_at, 'YYYY-MM-DD')
    ORDER BY date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;