import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, user, session, loading } = useAuth();
  const navigate = useNavigate();
  
  // Update document title
  useEffect(() => {
    document.title = 'Login | NyumbaPaeasy'; 
  }, []);
  
  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      const role = user.profile?.role;
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else if (role === 'real_estate_agency') {
        navigate('/agency/dashboard');
      } else if (role === 'landlord') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Safety timeout to avoid endless spinner
      const timeoutId = window.setTimeout(() => {
        setIsLoading(false);
        setError('Login is taking longer than expected. Please try again.');
      }, 12000);

      // Attempt sign in
      await signIn(email, password);

      // Sanity check: ensure session exists
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Optionally, we could navigate immediately; otherwise role-based redirect will happen via useEffect
        // navigate('/post-auth');
      }

      window.clearTimeout(timeoutId);
      // Redirect will be handled by the useEffect above based on user role
    } catch (err: unknown) {
      console.error('Sign-in failed:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

// ... rest of the component

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Login to NyumbaPaeasy</h1>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}
            
            {/* Temporary Auth Debug Panel */}
            <div className="mb-4 p-3 bg-gray-50 text-gray-800 rounded-md text-xs">
              <div className="font-semibold mb-1">Auth Debug (temporary)</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <div><span className="font-medium">Auth loading:</span> {String(loading)}</div>
                  <div><span className="font-medium">Session user:</span> {session?.user?.id || 'none'}</div>
                  <div><span className="font-medium">Session email:</span> {session?.user?.email || 'none'}</div>
                </div>
                <div>
                  <div><span className="font-medium">App user:</span> {user?.id || 'none'}</div>
                  <div><span className="font-medium">Profile role:</span> {user?.profile?.role || 'none'}</div>
                  <div><span className="font-medium">Verified:</span> {user?.profile?.is_verified === true ? 'true' : String(user?.profile?.is_verified)}</div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="input pl-10"
                    placeholder="Enter your email"
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="input pl-10"
                    placeholder="Enter your password"
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <div className="mt-1 text-right">
                  <Link to="/forgot-password" className="text-sm text-emerald-600 hover:text-emerald-700">
                    Forgot password?
                  </Link>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className={`btn btn-primary w-full py-2.5 ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-emerald-600 hover:text-emerald-700 font-medium">
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;