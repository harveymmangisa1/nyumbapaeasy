
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthCallbackPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // The AuthProvider is already handling the session from the URL.
    // We just need to wait for the user object to be available and then redirect.
    if (user) {
      // Redirect based on user role from their profile
      const role = user.profile?.role;
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else if (role === 'real_estate_agency') {
        navigate('/agency/dashboard');
      } else if (role === 'landlord') {
        navigate('/dashboard');
      } else {
        // Default redirection for renters or users without a specific role dashboard
        navigate('/welcome'); 
      }
    }
    // If the user object is not available after some time,
    // it could indicate an error or that the user is not logged in.
    // For now, we'll just wait for the user object to be populated by the AuthProvider.
  }, [user, navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Authenticating...</h1>
        <p className="text-slate-600">Please wait while we log you in.</p>
        {/* Optional: Add a spinner */}
      </div>
    </div>
  );
};

export default AuthCallbackPage;
