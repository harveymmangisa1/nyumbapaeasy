import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, User, Mail, Lock, Check, Building2, FileText, Briefcase } from 'lucide-react';


const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'landlord' | 'renter' | 'real_estate_agency'>('renter');
  const [businessRegistrationNumber, setBusinessRegistrationNumber] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [managerNames, setManagerNames] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, user } = useAuth();
  const navigate = useNavigate();
  
  // Update document title
  useEffect(() => {
    document.title = 'Register | NyumbaPaeasy';
  }, []);
  
  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      // Redirect to appropriate dashboard based on user role
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'real_estate_agency') {
        navigate('/agency/dashboard');
      } else if (user.role === 'landlord') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) { // Supabase default is 6 characters
      setError('Password must be at least 6 characters long');
      return;
    }

    if (role === 'real_estate_agency') {
      if (!businessRegistrationNumber.trim()) {
        setError('Business Registration Number is required.');
        return;
      }
      if (!licenseNumber.trim()) {
        setError('License Number is required.');
        return;
      }
      if (!managerNames.trim()) {
        setError('Manager Names are required.');
        return;
      }
    }

    setIsLoading(true);

    try {
      let agencyDetails = undefined;
      if (role === 'real_estate_agency') {
        agencyDetails = {
          business_registration_number: businessRegistrationNumber,
          license_number: licenseNumber,
          manager_names: managerNames,
        };
      }
      await signUp(name, email, password, role, agencyDetails);
      setIsLoading(false);
      setError('');
      
      // Redirect to appropriate dashboard based on user role
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else if (role === 'real_estate_agency') {
        navigate('/agency/dashboard');
      } else if (role === 'landlord') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } catch (err: Error | { message: string }) {
      setIsLoading(false);
      console.error('Registration error:', err);
      
      // Handle various error types more comprehensively
      if (err.message === 'EMAIL_EXISTS' || err.message.includes('already exists') || err.message.includes('already registered')) {
        setError('An account with this email already exists. Please try logging in instead.');
      } else if (err.message === 'WEAK_PASSWORD' || err.message.includes('Password should be at least')) {
        setError('Password is too weak. Please choose a stronger password with at least 6 characters.');
      } else if (err.message.includes('Invalid email')) {
        setError('Please enter a valid email address.');
      } else if (err.message.includes('email') && err.message.includes('taken')) {
        setError('This email address is already registered. Please try logging in or use a different email.');
      } else {
        setError('Registration failed: ' + err.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Create your Account</h1>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name / Company Name
                </label>
                <div className="relative">
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="input pl-10"
                    placeholder="Enter your full name or company name"
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
              
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
                    placeholder="Create a password"
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
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="input pl-10"
                    placeholder="Confirm your password"
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  I am a:
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <label 
                    className={`flex items-center justify-center p-3 rounded-md border cursor-pointer ${
                      role === 'renter' 
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      value="renter"
                      checked={role === 'renter'}
                      onChange={() => setRole('renter')}
                      className="sr-only"
                    />
                    <span className="font-medium">Renter/Buyer</span>
                    {role === 'renter' && <Check className="h-5 w-5 ml-2 text-emerald-600" />}
                  </label>
                  <label 
                    className={`flex items-center justify-center p-3 rounded-md border cursor-pointer ${
                      role === 'landlord' 
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      value="landlord"
                      checked={role === 'landlord'}
                      onChange={() => setRole('landlord')}
                      className="sr-only"
                    />
                    <span className="font-medium">Landlord</span>
                    {role === 'landlord' && <Check className="h-5 w-5 ml-2 text-emerald-600" />}
                  </label>
                  <label 
                    className={`flex items-center justify-center p-3 rounded-md border cursor-pointer ${
                      role === 'real_estate_agency' 
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      value="real_estate_agency"
                      checked={role === 'real_estate_agency'}
                      onChange={() => setRole('real_estate_agency')}
                      className="sr-only"
                    />
                    <span className="font-medium">Real Estate Agency</span>
                    {role === 'real_estate_agency' && <Check className="h-5 w-5 ml-2 text-emerald-600" />}
                  </label>
                </div>
              </div>

              {role === 'real_estate_agency' && (
                <div className="space-y-4 mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-800">Agency Details</h3>
                  <div>
                    <label htmlFor="businessRegistrationNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Business Registration Number
                    </label>
                    <div className="relative">
                      <input
                        id="businessRegistrationNumber"
                        type="text"
                        value={businessRegistrationNumber}
                        onChange={(e) => setBusinessRegistrationNumber(e.target.value)}
                        required
                        className="input pl-10"
                        placeholder="e.g., BRN123456"
                      />
                      <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      License Number
                    </label>
                    <div className="relative">
                      <input
                        id="licenseNumber"
                        type="text"
                        value={licenseNumber}
                        onChange={(e) => setLicenseNumber(e.target.value)}
                        required
                        className="input pl-10"
                        placeholder="e.g., LCN789012"
                      />
                      <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="managerNames" className="block text-sm font-medium text-gray-700 mb-1">
                      Manager Names (Comma Separated)
                    </label>
                    <div className="relative">
                      <input
                        id="managerNames"
                        type="text"
                        value={managerNames}
                        onChange={(e) => setManagerNames(e.target.value)}
                        required
                        className="input pl-10"
                        placeholder="e.g., John Doe, Jane Smith"
                      />
                      <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex items-start">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded mt-1"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                  I agree to the <a href="#" className="text-emerald-600 hover:text-emerald-700">Terms of Service</a> and <a href="#" className="text-emerald-600 hover:text-emerald-700">Privacy Policy</a>
                </label>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className={`btn btn-primary w-full py-2.5 ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
