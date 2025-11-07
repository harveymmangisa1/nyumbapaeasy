import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

const PostAuthRedirect = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Optional: pick up any staged verification uploads saved pre-login (e.g., in localStorage)
  useEffect(() => {
    const uploadStagedVerification = async () => {
      if (!user) return;
      try {
        const staged = localStorage.getItem('staged_verification_uploads');
        if (!staged) return;
        const parsed = JSON.parse(staged) as Array<{ type: string; base64: string; name: string }>;
        if (!Array.isArray(parsed) || parsed.length === 0) return;

        for (const doc of parsed) {
          // Convert base64 to Blob
          const byteString = atob(doc.base64.split(',')[1] || '');
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
          const file = new File([ab], doc.name, { type: 'application/octet-stream' });

          const fileExt = doc.name.split('.').pop();
          const path = `${user.id}/${doc.type}/${Date.now()}.${fileExt}`;
          const { error: uploadError } = await supabase.storage.from('verification-documents').upload(path, file, { upsert: false });
          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage.from('verification-documents').getPublicUrl(path);
          const { error: insertError } = await supabase
            .from('verification_documents')
            .insert({ user_id: user.id, document_type: doc.type, document_url: publicUrl, document_name: doc.name, status: 'pending' });
          if (insertError) throw insertError;
        }

        // Clear staged items after successful upload
        localStorage.removeItem('staged_verification_uploads');
      } catch (e) {
        console.error('Post-auth verification upload failed:', e);
      }
    };

    uploadStagedVerification();
  }, [user]);

  useEffect(() => {
    // If still loading auth state, wait.
    if (loading) return;

    // If not authenticated, go to login
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    // Route by role - fallback to metadata role if profile missing
    const metadataRole = (user?.user_metadata?.role || user?.app_metadata?.role) as string | undefined;
    const role = user.profile?.role || metadataRole;

    if (role === 'admin') navigate('/admin/dashboard', { replace: true });
    else if (role === 'real_estate_agency') navigate('/agency/dashboard', { replace: true });
    else if (role === 'landlord') navigate('/dashboard', { replace: true });
    else navigate('/', { replace: true });
  }, [user, loading, navigate, location]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-10 w-10 animate-spin text-accent mx-auto mb-3" />
        <p className="text-text-secondary">Redirecting...</p>
      </div>
    </div>
  );
};

export default PostAuthRedirect;
