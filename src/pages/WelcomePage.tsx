import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Welcome to NyumbaPaeasy!';
    // Optionally, redirect after a few seconds
    const timer = setTimeout(() => {
      navigate('/login'); // Redirect to login after 5 seconds
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-cyan-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 p-8 text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-8 w-8 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-semibold text-slate-900 mb-3">Email Verified!</h2>
        <p className="text-slate-600 mb-6">
          Your email address has been successfully verified. You can now log in to your account.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-6 rounded-xl transition-all"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;