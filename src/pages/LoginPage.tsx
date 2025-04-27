import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useUser();
  const navigate = useNavigate();
  
  // Update document title
  useEffect(() => {
    document.title = 'Login | NyumbaPaeasy';
  }, []);
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  // Inside LoginPage.tsx

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);

  try {
    await login(email, password);
    // Navigation is handled by onAuthStateChanged redirecting authenticated users,
    // but navigating here immediately provides faster feedback.
    navigate('/');
  } catch (err: any) {
     // Handle specific errors from Firebase via UserContext
    if (err.message === 'INVALID_CREDENTIALS') {
       setError('Invalid email or password. Please try again.');
    } else {
       setError('Login failed. Please check your connection or try again later.');
       console.error("Login Submit Error:", err); // Log the actual error
    }
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
                  <a href="#" className="text-sm text-emerald-600 hover:text-emerald-700">
                    Forgot password?
                  </a>
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