import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const PostAuthRedirect = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
