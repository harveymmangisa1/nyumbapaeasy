-- Add views column to properties table
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- Add a comment to describe the column
COMMENT ON COLUMN public.properties.views IS 'Number of times this property has been viewed';