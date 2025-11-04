import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import { VerificationDocument } from '../types/database';

// Define the shape of your user object including the role
interface AppUser extends User {
  name: string;
  role: 'landlord' | 'renter' | 'admin' | 'real_estate_agency';
  isVerified: boolean;
  hasPendingVerification: boolean;
  verificationDocuments: VerificationDocument[];
  business_registration_number?: string | null;
  license_number?: string | null;
  manager_names?: string | null;
}

type AuthContextType = {
  user: AppUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string, role: 'landlord' | 'renter' | 'real_estate_agency', agencyDetails?: { business_registration_number: string; license_number: string; manager_names: string }) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUserVerificationStatus: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (name: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (userId: string) => {
    console.log('Fetching profile for userId:', userId);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    console.log('Fetched profile data:', data);

    if (error) {
      console.error("Error fetching user profile:", error);
      
      // If profile doesn't exist, it might be because the trigger didn't fire
      if (error.code === 'PGRST116') { // No rows found
        console.log('Profile not found, this might be a new user after email verification');
        return null;
      }
      throw error;
    }

    return data;
  };

  const createProfile = async (sessionUser: User) => {
    console.log('Creating profile for user:', sessionUser.id);
    
    const userData = sessionUser.user_metadata || {};
    const profileData = {
      id: sessionUser.id,
      name: userData.name || sessionUser.email?.split('@')[0] || 'User',
      role: userData.role || 'renter',
      business_registration_number: userData.business_registration_number || null,
      license_number: userData.license_number || null,
      manager_names: userData.manager_names || null
    };

    const { data, error } = await supabase
      .from('profiles')
      .insert(profileData)
      .select()
      .single();

    if (error) {
      console.error('Error creating profile:', error);
      throw error;
    }

    console.log('Profile created successfully:', data);
    return data;
  };

  const fetchUserVerificationStatus = async (userId: string) => {
    // Fetch verification documents
    const { data: documents, error: documentsError } = await supabase
      .from('verification_documents')
      .select('*')
      .eq('user_id', userId);

    if (documentsError && documentsError.code !== 'PGRST116') {
      console.error("Error fetching verification documents:", documentsError);
      // Don't throw error if table doesn't exist or no documents found
    }

    // Determine verification status
    const verifiedDocs = (documents || []).filter(doc => doc.status === 'verified');
    const pendingDocs = (documents || []).filter(doc => doc.status === 'pending');

    return {
      isVerified: verifiedDocs.length > 0,
      hasPendingVerification: pendingDocs.length > 0,
      verificationDocuments: documents || []
    };
  };

  useEffect(() => {
    const fetchUser = async (sessionUser: User): Promise<AppUser | null> => {
      try {
        console.log('Fetching user data for:', sessionUser.id, sessionUser.email);
        
        let profile = await fetchUserProfile(sessionUser.id);
        console.log('Fetched profile in fetchUser:', profile);
        
        // If profile doesn't exist, try to create it
        if (!profile) {
          console.log('Profile not found, attempting to create one...');
          try {
            profile = await createProfile(sessionUser);
          } catch (createError) {
            console.error('Failed to create profile:', createError);
            // If creation fails, use fallback data from user metadata
            const userData = sessionUser.user_metadata || {};
            profile = {
              id: sessionUser.id,
              name: userData.name || sessionUser.email?.split('@')[0] || 'User',
              role: userData.role || 'renter',
              business_registration_number: userData.business_registration_number || null,
              license_number: userData.license_number || null,
              manager_names: userData.manager_names || null
            };
          }
        }
        
        const verificationStatus = await fetchUserVerificationStatus(sessionUser.id);

        const appUser = {
          ...sessionUser,
          name: profile.name,
          role: profile.role,
          ...verificationStatus,
          business_registration_number: profile.business_registration_number,
          license_number: profile.license_number,
          manager_names: profile.manager_names,
        } as AppUser;
        
        console.log('Successfully created AppUser:', appUser);
        return appUser;
      } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
      }
    };

    const setSession = async () => {
      setLoading(true);
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Initial session check:', session?.user?.email);
        
        if (session && session.user) {
          // Add timeout to prevent infinite loading
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('fetchUser timeout')), 10000)
          );
          
          const userPromise = fetchUser(session.user);
          const appUser = await Promise.race([userPromise, timeoutPromise]) as AppUser | null;
          
          setUser(appUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error in initial session setup:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    setSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      setLoading(true);
      
      try {
        if (session && session.user) {
          // Add timeout to prevent infinite loading
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('fetchUser timeout')), 10000)
          );
          
          const userPromise = fetchUser(session.user);
          const appUser = await Promise.race([userPromise, timeoutPromise]) as AppUser | null;
          
          setUser(appUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const refreshUserVerificationStatus = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const verificationStatus = await fetchUserVerificationStatus(user.id);
      setUser(prevUser => prevUser ? {
        ...prevUser,
        ...verificationStatus
      } : null);
    } catch (error) {
      console.error("Error refreshing user verification status:", error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('Attempting to sign in user:', email);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      console.error('Sign in error:', {
        code: error.status,
        message: error.message,
        details: error.details
      });
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('Invalid email or password.');
      } else if (error.message.includes('Email not confirmed')) {
        throw new Error('Please confirm your email before logging in.');
      } else {
        throw new Error(error.message);
      }
    }
  };

  const signUp = async (name: string, email: string, password: string, role: 'landlord' | 'renter' | 'real_estate_agency', agencyDetails?: { business_registration_number: string; license_number: string; manager_names: string }) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role, ...agencyDetails },
      },
    });

    if (error) {
      if (error.message.includes('already exists')) {
        throw new Error('An account with this email already exists.');
      } else if (error.message.includes('Password should be at least 6 characters')) {
        throw new Error('Password should be at least 6 characters.');
      } else {
        throw new Error(error.message);
      }
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  };

  const updateProfile = async (name: string) => {
    if (!user) throw new Error('User not authenticated.');

    try {
      const { error } = await supabase.rpc('update_user_profile', { user_id: user.id, user_name: name, user_role: user.role });

      if (error) throw error;

      // Update local user state
      setUser(prevUser => prevUser ? { ...prevUser, name } : null);
    } catch (error: Error | { message: string }) {
      console.error("Error updating profile:", error);
      throw new Error(error.message || 'Failed to update profile.');
    }
  };

  console.log('AuthContext: user', user);
  console.log('AuthContext: loading', loading);

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    refreshUserVerificationStatus,
    resetPassword,
    updateProfile
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}