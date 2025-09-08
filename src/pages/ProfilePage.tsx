import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import VerificationDocumentUpload from '../components/VerificationDocumentUpload';

import { Loader2, CheckCircle, Shield, Clock, XCircle } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useUser();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  // Removed unused phone state variable
  const [profilePicture, setProfilePicture] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    document.title = 'My Profile | NyumbaPaeasy';
  }, []);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Verification badge component
  const VerificationBadge = () => {
    if (!user) return null;
    
    if (user.isVerified) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Verified
        </span>
      );
    }
    
    if (user.hasPendingVerification) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock className="h-3 w-3 mr-1" />
          Pending Verification
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <XCircle className="h-3 w-3 mr-1" />
        Not Verified
      </span>
    );
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-600">
        Could not load user data. Please try logging in again.
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">My Profile</h1>
          
          {/* Verification Status Banner */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <Shield className="h-8 w-8 text-emerald-600 mr-3" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Account Verification</h2>
                  <p className="text-sm text-gray-600">
                    {user.isVerified 
                      ? "Your account is verified and in good standing." 
                      : user.hasPendingVerification 
                        ? "Your verification documents are being reviewed." 
                        : "Please upload verification documents to verify your account."}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 mr-2">Status:</span>
                <VerificationBadge />
              </div>
            </div>
            
            {!user.isVerified && (
              <div className="mt-4 p-4 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> You must verify your account within 5 days of registration to continue listing or managing properties.
                  {user.hasPendingVerification 
                    ? " Your documents are under review." 
                    : " Please upload verification documents below."}
                </p>
              </div>
            )}
          </div>
          
          {/* Profile Information */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <p className="text-gray-900">{user.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-gray-900">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <p className="text-gray-900 capitalize">{user.role}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
                <p className="text-gray-900">TODO: Add member since date</p>
              </div>
            </div>
          </div>
          
          {/* Verification Document Upload */}
          {(user.role === 'landlord' || user.role === 'admin') && (
            <div className="mb-6">
              <VerificationDocumentUpload />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;