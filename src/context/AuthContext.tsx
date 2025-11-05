import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { Session, User as SupabaseUser, AuthError } from '@supabase/supabase-js';
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
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>; // Renamed login to signIn and added password
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to get user profile from Supabase
const getProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, status } = await supabase
      .from('profiles')
      .select(`*`)
      .eq('id', userId)
      .single();

    if (status !== 406) { // 406 is returned by PostgREST when no rows are found with .single()
      return null;
    }
    return data as UserProfile;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
};
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

    if (!data) {
        console.error('Error creating profile:');
      return null;
    }

    return data as UserProfile;
  } catch (error) {
    console.error('Catastrophic error creating profile:', error);
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
      // Create profile if it doesn't exist, e.g., for a new user
      profile = await createProfile(sessionUser.id, sessionUser.email);
    }

    if (profile) {
      const appUser: AppUser = {
        ...sessionUser,
        profile,
      };
      return appUser;
    }
    
    console.warn("Could not find or create a profile for user:", sessionUser.id);
    return null;
  };

  useEffect(() => {
    const getInitialSession = async () => {
      setLoading(true);
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
      setLoading(true);
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

  // Changed to signInWithPassword
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const sendPasswordReset = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error };
  };

  const value = {
    user,
    session,
    loading,
    signIn, // Use signIn
    logout,
    sendPasswordReset,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};