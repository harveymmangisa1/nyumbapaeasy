DROP TABLE IF EXISTS public.property_views;
DROP TABLE IF EXISTS public.properties;

CREATE TABLE public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by UUID REFERENCES auth.users(id),
    landlord_id UUID REFERENCES auth.users(id),
    landlord_name TEXT,
    landlord_contact TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_featured BOOLEAN DEFAULT FALSE,
    title TEXT,
    description TEXT,
    price NUMERIC,
    payment_cycle TEXT,
    location TEXT,
    district TEXT,
    sector TEXT,
    type TEXT,
    listing_type TEXT,
    bedrooms INTEGER,
    bathrooms INTEGER,
    area TEXT,
    is_self_contained BOOLEAN,
    amenities TEXT[],
    cover_image TEXT,
    images TEXT[],
    views INTEGER DEFAULT 0
);

CREATE TABLE public.property_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);