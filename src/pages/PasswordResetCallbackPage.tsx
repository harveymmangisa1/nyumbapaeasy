import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

const PasswordResetCallbackPage = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your request...');

  useEffect(() => {
    const handlePasswordResetCallback = async () => {
      try {
        // When the user clicks the link in their email, they are redirected here.
        // The session is automatically established by Supabase from the URL.
        // We just need to wait for it to be established.
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session) {
          setStatus('error');
          setMessage('Invalid or expired password reset link. Please try again.');
          setTimeout(() => navigate('/forgot-password'), 3000);
          return;
        }

        setStatus('success');
        setMessage('Verification successful! Redirecting you to reset your password...');
        
        // The onAuthStateChange listener in AuthContext will handle setting the user.
        // We can now redirect to the page where the user can enter a new password.
        setTimeout(() => {
          navigate('/reset-password');
        }, 2000);
      } catch (err) {
        setStatus('error');
        setMessage('An error occurred. Please try again.');
        setTimeout(() => navigate('/forgot-password'), 3000);
      }
    };

    handlePasswordResetCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {status === 'loading' && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Verifying Request</h1>
            <p className="text-slate-600">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Success!</h1>
            <p className="text-slate-600">{message}</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Error</h1>
            <p className="text-slate-600">{message}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default PasswordResetCallbackPage;
