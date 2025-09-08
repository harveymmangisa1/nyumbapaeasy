// src/context/UserContext.tsx (Example Structure)
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase'; // Import your Supabase client
import { VerificationDocument } from '../types/database';

// Define the shape of your user object including the role
interface AppUser {
  id: string;
  email: string;
  name: string;
  role: 'landlord' | 'renter' | 'admin';
  isVerified: boolean;
  hasPendingVerification: boolean;
  verificationDocuments: VerificationDocument[];
}

interface UserContextProps {
  user: AppUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  register: (name: string, email: string, password: string, role: 'landlord' | 'renter') => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserVerificationStatus: () => Promise<void>;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Set to true initially to load user session

  // Function to fetch user verification status
  const fetchUserVerificationStatus = async (userId: string) => {
    try {
      // Check if user has verified documents
      const { data: verifiedDocs, error: verifiedError } = await supabase
        .from('verification_documents')
        .select('id')
        .eq('user_id', userId)
        .eq('status', 'verified');
      
      if (verifiedError) throw verifiedError;
      
      // Check if user has pending documents
      const { data: pendingDocs, error: pendingError } = await supabase
        .from('verification_documents')
        .select('id')
        .eq('user_id', userId)
        .eq('status', 'pending');
      
      if (pendingError) throw pendingError;
      
      // Fetch all user documents
      const { data: allDocs, error: allDocsError } = await supabase
        .from('verification_documents')
        .select('*')
        .eq('user_id', userId)
        .order('submitted_at', { ascending: false });
      
      if (allDocsError) throw allDocsError;
      
      return {
        isVerified: verifiedDocs.length > 0,
        hasPendingVerification: pendingDocs.length > 0,
        verificationDocuments: allDocs as VerificationDocument[]
      };
    } catch (error) {
      console.error("Error fetching user verification status:", error);
      return {
        isVerified: false,
        hasPendingVerification: false,
        verificationDocuments: []
      };
    }
  };

  // Function to refresh user verification status
  const refreshUserVerificationStatus = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const verificationStatus = await fetchUserVerificationStatus(user.id);
      setUser(prevUser => prevUser ? {
        ...prevUser,
        ...verificationStatus
      } : null);
    } catch (error) {
      console.error("Error refreshing user verification status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch user profile
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('name, role')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      return {
        name: data.name || '',
        role: data.role as 'landlord' | 'renter' | 'admin'
      };
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return {
        name: '',
        role: 'renter' as 'landlord' | 'renter' | 'admin'
      };
    }
  };

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        // Fetch user profile
        const profile = await fetchUserProfile(session.user.id);
        
        // Fetch verification status
        const verificationStatus = await fetchUserVerificationStatus(session.user.id);
        
        const appUser: AppUser = {
          id: session.user.id,
          email: session.user.email || '',
          name: profile.name,
          role: profile.role,
          ...verificationStatus
        };
        setUser(appUser);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const register = async (name: string, email: string, password: string, role: 'landlord' | 'renter') => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, role }, // Store name and role in user_metadata initially
        },
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        // Update profile in database
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ name, role })
          .eq('id', data.user.id);
        
        if (profileError) {
          console.error("Error updating profile:", profileError);
        }

        // Fetch verification status
        const verificationStatus = await fetchUserVerificationStatus(data.user.id);
        
        const appUser: AppUser = {
          id: data.user.id,
          email: data.user.email || '',
          name,
          role,
          ...verificationStatus
        };
        setUser(appUser);
      }
    } catch (error: any) {
      console.error("Registration Error:", error.message);
      throw new Error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        // Fetch user profile
        const profile = await fetchUserProfile(data.user.id);
        
        // Fetch verification status
        const verificationStatus = await fetchUserVerificationStatus(data.user.id);
        
        const appUser: AppUser = {
          id: data.user.id,
          email: data.user.email || '',
          name: profile.name,
          role: profile.role,
          ...verificationStatus
        };
        setUser(appUser);
      }
    } catch (error: any) {
      console.error("Login Error:", error.message);
      throw new Error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      setUser(null);
    } catch (error: any) {
      console.error("Logout Error:", error.message);
      throw new Error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      register,
      login,
      logout,
      refreshUserVerificationStatus
    }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = (): UserContextProps => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;