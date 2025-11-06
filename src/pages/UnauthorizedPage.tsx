import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home, LifeBuoy, Mail, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation() as any;
  const { user, logout } = useAuth();
  const from = location.state?.from?.pathname as string | undefined;
  const [logged, setLogged] = useState(false);

  const userRole = user?.profile?.role;

  // Build a contextual suggestion based on role
  const suggestion = useMemo(() => {
    if (!user) {
      return {
        title: 'You are not logged in',
        body: 'Log in to access more pages. If you believe this is an error, try logging in again.',
        actionText: 'Go to Login',
        action: () => navigate('/login'),
      };
    }
    if (userRole === 'admin') return { title: 'Admin restriction', body: 'This page may require a different admin permission.', actionText: 'Go to Admin Dashboard', action: () => navigate('/admin/dashboard') };
    if (userRole === 'real_estate_agency') return { title: 'Agency restriction', body: 'This page is not available for agency accounts.', actionText: 'Go to Agency Dashboard', action: () => navigate('/agency/dashboard') };
    if (userRole === 'landlord') return { title: 'Landlord restriction', body: 'This page is not available for landlord accounts.', actionText: 'Go to Dashboard', action: () => navigate('/dashboard') };
    return { title: 'Access restricted', body: 'Your account does not have the required permissions for this page.', actionText: 'Go Home', action: () => navigate('/') };
  }, [user, userRole, navigate]);

  // Optional: client-side logging (console + optional POST to /api/logs if present)
  useEffect(() => {
    if (logged) return;
    const payload = {
      type: 'unauthorized_access',
      at: new Date().toISOString(),
      path: from || location.pathname,
      userId: user?.id || null,
      role: userRole || null,
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'unknown',
    };
    // Always console log
    // eslint-disable-next-line no-console
    console.warn('[Unauthorized]', payload);

    // Best-effort POST (will fail silently if endpoint not available)
    fetch('/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => void 0);

    setLogged(true);
  }, [logged, from, location.pathname, user?.id, userRole]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h1>
          <p className="text-slate-600">
            You don't have permission to view this page.
            {from ? (
              <>
                <br />
                <span className="text-slate-500 text-sm">Attempted to access: {from}</span>
              </>
            ) : null}
          </p>
        </div>

        {/* Contextual suggestion */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-start gap-3">
            <LifeBuoy className="h-5 w-5 text-slate-600 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900">{suggestion.title}</p>
              <p className="text-slate-600 text-sm">{suggestion.body}</p>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={suggestion.action}
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 px-5 rounded-lg transition-all"
            >
              {suggestion.actionText}
            </button>
          </div>
        </div>

        {/* Contact support */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-slate-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-slate-900">Need access?</p>
              <p className="text-slate-600 text-sm">If you think this is a mistake, contact support. Include the page URL and your account email.</p>
              <a
                href={`mailto:support@nyumbapaeasy.com?subject=Access%20Request&body=I%20cannot%20access:%20${encodeURIComponent(from || location.pathname)}%0AUser:%20${encodeURIComponent(user?.email || 'guest')}`}
                className="inline-flex mt-3 items-center gap-2 text-slate-900 font-medium hover:underline"
              >
                Email Support
              </a>
            </div>
          </div>
        </div>

        {/* Navigation options */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              if (from && from === location.pathname) navigate('/');
              else navigate(-1);
            }}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium py-3 px-6 rounded-xl transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 px-6 rounded-xl transition-all"
          >
            <Home className="h-5 w-5" />
            Home
          </button>
          {user && (
            <button
              onClick={async () => { await logout(); navigate('/login'); }}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-medium py-3 px-6 rounded-xl transition-all"
            >
              <LogOut className="h-5 w-5" />
              Log out
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
