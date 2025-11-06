import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Key } from 'lucide-react';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { sendOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Forgot Password | NyumbaPaeasy';
  }, []);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsLoading(true);

    try {
      await sendOtp(email);
      setOtpSent(true);
      setMessage('An OTP has been sent to your email address.');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsLoading(true);

    try {
      await verifyOtp(email, otp);
      // After successful verification, the user is logged in.
      // The onAuthStateChange listener in AuthContext will handle the session.
      // We can now redirect to the page where the user can enter a new password.
      navigate('/reset-password');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid or expired OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Forgot Your Password?</h1>
            <p className="text-center text-gray-600 mb-6">
              {otpSent
                ? 'Enter the OTP you received in your email.'
                : 'Enter your email address below and we\'ll send you an OTP to reset your password.'}
            </p>
            
            {message && (
              <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md text-sm">
                {message}
              </div>
            )}
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}
            
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
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
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`btn btn-primary w-full py-2.5 ${ isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? 'Sending...' : 'Send OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                    OTP
                  </label>
                  <div className="relative">
                    <input
                      id="otp"
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      className="input pl-10"
                      placeholder="Enter the OTP"
                    />
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`btn btn-primary w-full py-2.5 ${ isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? 'Verifying...' : 'Verify OTP and Proceed'}
                </button>
              </form>
            )}
            
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Remember your password?{' '}
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

export default ForgotPasswordPage;