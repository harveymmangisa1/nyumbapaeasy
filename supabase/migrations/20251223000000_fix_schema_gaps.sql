-- Migration to fix schema gaps and align with application code
-- Adds missing columns to properties and creates verification_documents and property_views tables

-- 1. Update properties table
ALTER TABLE public.properties
ADD COLUMN IF NOT EXISTS price NUMERIC,
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'MWK',
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS district TEXT,
ADD COLUMN IF NOT EXISTS images TEXT[],
ADD COLUMN IF NOT EXISTS bedrooms INTEGER,
ADD COLUMN IF NOT EXISTS bathrooms NUMERIC,
ADD COLUMN IF NOT EXISTS area NUMERIC,
ADD COLUMN IF NOT EXISTS listing_type TEXT CHECK (listing_type IN ('rent', 'sale', 'lease')),
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'available',
ADD COLUMN IF NOT EXISTS amenities TEXT[],
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- Create index for faster searches
CREATE INDEX IF NOT EXISTS idx_properties_location ON public.properties(location);
CREATE INDEX IF NOT EXISTS idx_properties_district ON public.properties(district);
CREATE INDEX IF NOT EXISTS idx_properties_price ON public.properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_listing_type ON public.properties(listing_type);

-- 2. Create verification_documents table
CREATE TABLE IF NOT EXISTS public.verification_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('business_license', 'property_deed', 'national_id', 'other')),
  document_url TEXT NOT NULL,
  document_name TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  admin_notes TEXT,
  submitted_at TIMESTAMPTZ DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS for verification_documents
ALTER TABLE public.verification_documents ENABLE ROW LEVEL SECURITY;

-- Users can insert their own documents
CREATE POLICY "Users can upload their own verification documents"
  ON public.verification_documents
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can view their own documents
CREATE POLICY "Users can view their own verification documents"
  ON public.verification_documents
  FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can view all documents
CREATE POLICY "Admins can view all verification documents"
  ON public.verification_documents
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update documents (to verify/reject)
CREATE POLICY "Admins can update verification documents"
  ON public.verification_documents
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 3. Create property_views table (for analytics)
CREATE TABLE IF NOT EXISTS public.property_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS for property_views
ALTER TABLE public.property_views ENABLE ROW LEVEL SECURITY;

-- Anonymous and authenticated users can insert views
CREATE POLICY "Anyone can insert property views"
  ON public.property_views
  FOR INSERT
  WITH CHECK (true);

-- Users can view their own view history (optional, mostly for analytics dashboards)
CREATE POLICY "Users can view their own property views"
  ON public.property_views
  FOR SELECT
  USING (auth.uid() = user_id);

-- Property owners can view stats for their properties
CREATE POLICY "Owners can view analytics for their properties"
  ON public.property_views
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id = property_views.property_id AND p.owner_id = auth.uid()
    )
  );
