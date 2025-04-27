import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseconfig';
import { Loader2, User, Mail, Phone, AlertCircle, CheckCircle } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useUser();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
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

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!authLoading && isAuthenticated && user?.uid) {
        setLoading(true);
        setError('');
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setName(userData.name || user.displayName || '');
            setEmail(userData.email || user.email || '');
            setPhone(userData.phone || '');
            setProfilePicture(userData.profilePicture || '');
          } else {
            setName(user.displayName || '');
            setEmail(user.email || '');
            setPhone('');
            setProfilePicture('');
            console.warn('No Firestore document found for user. Pre-filling with auth data.');
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
          setError('Failed to load profile data. Please refresh the page.');
        } finally {
          setLoading(false);
        }
      } else if (!authLoading && !isAuthenticated) {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user, isAuthenticated, authLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError('Please fill in your Name, Email, and Phone Number.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!user?.uid) {
      setError('User session not found. Please log in again.');
      return;
    }

    setIsSubmitting(true);

    try {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        profilePicture: profilePicture.trim(),
        updatedAt: new Date(),
      }, { merge: true });

      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Unable to save your profile changes. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
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
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">My Profile</h1>
          {/* Error and Success Messages */}
          {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
          {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}
          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Form Fields */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
