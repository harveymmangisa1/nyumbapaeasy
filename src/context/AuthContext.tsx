import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

// Define the structure of a user profile
export interface UserProfile {
  id: string;
  username?: string;
  avatar_url?: string;
  role: 'user' | 'landlord' | 'admin' | 'real_estate_agency';
  agency_name?: string;
  is_verified?: boolean;
  has_pending_verification?: boolean;
}

// Define the structure of our AppUser, combining Supabase auth and our profile
export interface AppUser extends SupabaseUser {
  profile: UserProfile;
}

// Define the context shape
interface AuthContextType {
  user: AppUser | null;
  session: Session | null;
  loading: boolean;
  login: (email: string) => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<{ error: Error | null }>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to get user profile from Supabase
const getProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, status } = await supabase
      .from('profiles')
      .select(`*`)
      .eq('id', userId)
      .single();

    if (status !== 406) {
      return null;
    }

    if (data) {
      return data as UserProfile;
    }
    return null;
  } catch (error) {
    return null;
  }
};

// Helper function to create a user profile
const createProfile = async (userId: string, email?: string): Promise<UserProfile | null> => {
  try {
    const username = email?.split('@')[0]; // Basic username from email
    const { data } = await supabase
      .from('profiles')
      .insert([
        {
          id: userId,
          username,
          role: 'user', // Default role
        },
      ])
      .select()
      .single();

    if (error) {
      return null;
    }

    return data as UserProfile;
  } catch (error) {
    return null;
  }
};

// AuthProvider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch user data and profile
  const fetchUser = async (sessionUser: SupabaseUser): Promise<AppUser | null> => {
    let profile = await getProfile(sessionUser.id);

    if (!profile) {
      profile = await createProfile(sessionUser.id, sessionUser.email);
    }

    if (profile) {
      const appUser: AppUser = {
        ...sessionUser,
        profile,
      };
      return appUser;
    }

    return null;
  };

  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      setSession(initialSession);

      if (initialSession?.user) {
        const appUser = await fetchUser(initialSession.user);
        setUser(appUser);
      }
      setLoading(false);
    };

    getInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        const appUser = await fetchUser(newSession.user);
        setUser(appUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      return { error };
    }
    return { error: null };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const sendPasswordReset = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      return { error };
    }
    return { error: null };
  };

  const value = {
    user,
    session,
    loading,
    login,
    logout,
    sendPasswordReset,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

// Custom hook to use the Auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};