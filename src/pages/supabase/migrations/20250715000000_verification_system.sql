-- Create verification_documents table
CREATE TABLE IF NOT EXISTS public.verification_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    document_type TEXT CHECK (document_type IN ('business_license', 'property_deed', 'national_id', 'other')),
    document_url TEXT,
    document_name TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
    admin_notes TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_verification_documents_user_id ON public.verification_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_documents_status ON public.verification_documents(status);

-- Enable RLS (Row Level Security)
ALTER TABLE public.verification_documents ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can view their own documents
CREATE POLICY "Users can view their own verification documents" 
ON public.verification_documents 
FOR SELECT 
USING (user_id = auth.uid());

-- Users can insert their own documents
CREATE POLICY "Users can insert their own verification documents" 
ON public.verification_documents 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Users can update their own documents (only when status is pending)
CREATE POLICY "Users can update their own pending verification documents" 
ON public.verification_documents 
FOR UPDATE 
USING (user_id = auth.uid() AND status = 'pending');

-- Admins can view all documents
CREATE POLICY "Admins can view all verification documents" 
ON public.verification_documents 
FOR SELECT 
USING ( EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
));

-- Admins can update document status
CREATE POLICY "Admins can update verification document status" 
ON public.verification_documents 
FOR UPDATE 
USING ( EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
));

-- Create storage bucket for verification documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('verification-documents', 'verification-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for verification documents
CREATE POLICY "Users can upload verification documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'verification-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can view their own verification documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'verification-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Admins can view all verification documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'verification-documents' AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
));

-- Function to check if user is verified
CREATE OR REPLACE FUNCTION is_user_verified(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.verification_documents 
        WHERE user_id = user_uuid 
        AND status = 'verified'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user verification is pending
CREATE OR REPLACE FUNCTION is_user_verification_pending(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.verification_documents 
        WHERE user_id = user_uuid 
        AND status = 'pending'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;