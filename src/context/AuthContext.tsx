import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

// Define the structure of a user profile
export interface UserProfile {
  id: string;
  username?: string;
  name?: string;
  avatar_url?: string;
  role: 'user' | 'landlord' | 'admin' | 'real_estate_agency' | 'lodge_owner' | 'bnb_owner';
  agency_name?: string;
  is_verified?: boolean;
  has_pending_verification?: boolean;
  business_registration_number?: string;
  license_number?: string;
  manager_names?: string;
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
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  sendOtp: (email: string) => Promise<void>;
  verifyOtp: (email: string, token: string) => Promise<void>;
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

    // 406 is returned by PostgREST when no rows are found with .single()
    if (status === 406 || !data) {
      return null;
    }
    return data as UserProfile;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
};
const createProfile = async (userId: string, email?: string, role: UserProfile['role'] = 'user'): Promise<UserProfile | null> => {
  try {
    const name = email?.split('@')[0]; // Basic name from email
    const { data, error } = await supabase
      .from('profiles')
      .insert([
        {
          id: userId,
          name,
          role,
          is_verified: false,
          has_pending_verification: false,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating profile:', error);
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
      // Extract role from metadata, default to 'user' if not present
      // Map 'renter' from registration to 'user' database role
      let role = sessionUser.user_metadata?.role;
      if (role === 'renter') role = 'user';

      profile = await createProfile(sessionUser.id, sessionUser.email, role);
    }

    if (profile) {
      const appUser: AppUser = {
        ...sessionUser,
        profile,
      };
      return appUser;
    }

    // If profile could not be created/fetched (RLS or other error),
    // return a minimal user by attaching a default profile so UI can still render.
    console.warn("Could not find or create a profile for user:", sessionUser.id);
    return {
      ...sessionUser,
      profile: {
        id: sessionUser.id,
        role: 'user',
        is_verified: false,
        has_pending_verification: false,
      },
    } as AppUser;
  };

  useEffect(() => {
    const getInitialSession = async () => {
      setLoading(true);
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);

        if (initialSession?.user) {
          // Set minimal user quickly to reduce UI flicker, then hydrate
          setUser({ ...(initialSession.user as SupabaseUser), profile: { id: initialSession.user.id, role: 'user', is_verified: false, has_pending_verification: false } } as AppUser);
          try {
            const appUser = await fetchUser(initialSession.user);
            setUser(appUser);
          } catch (e) {
            console.error('fetchUser (initial) failed:', e);
          }
        } else {
          setUser(null);
        }
      } catch (e) {
        console.error('getSession failed:', e);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.debug('Auth event:', event);

      // Don't trigger loading state for token refresh unless no user is present
      if (event === 'TOKEN_REFRESHED' && user) {
        setSession(newSession);
        return;
      }

      setLoading(true);
      try {
        setSession(newSession);
        if (newSession?.user) {
          // Set minimal user immediately if no user exists, then hydrate
          if (!user || user.id !== newSession.user.id) {
            setUser({ ...(newSession.user as SupabaseUser), profile: { id: newSession.user.id, role: 'user', is_verified: false, has_pending_verification: false } } as AppUser);
          }
          try {
            const appUser = await fetchUser(newSession.user);
            setUser(appUser);
          } catch (e) {
            console.error('fetchUser (onAuthStateChange) failed:', e);
          }
        } else {
          // User signed out - ensure user is null
          setUser(null);
        }
      } catch (e) {
        console.error('onAuthStateChange handler error:', e);
        setUser(null);
        setSession(null);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('Attempting signIn for:', email);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('Supabase signInWithPassword error:', error);
      throw error;
    }
    console.log('SignIn successful:', data.user?.id);
  };

  const logout = async () => {
    console.log('Starting logout process...');
    try {
      // Sign out from Supabase first
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Supabase signOut error:', error);
      } else {
        console.log('Supabase signOut successful');
      }

      // Clear all auth state
      setUser(null);
      setSession(null);
      console.log('Local auth state cleared');

      // Clear any local storage items
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('supabase.auth.refreshToken');

    } catch (error) {
      console.error('Logout error exception:', error);
      // Ensure state is cleared even if exception occurs
      setUser(null);
      setSession(null);
    } finally {
      setLoading(false);
      console.log('Logout process complete');
    }
  };

  const sendOtp = async (email: string) => {
    console.log('Attempting sendOtp for:', email);
    const { data, error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      console.error('Supabase signInWithOtp error:', error);
      throw error;
    }
    console.log('OTP request successful:', data);
  };

  // If you use magic links instead of numeric OTP codes, do not call verifyOtp on client.
  // For numeric OTP email codes, keep type: 'email'. For password recovery, use type: 'recovery'.
  const verifyOtp = async (email: string, token: string) => {
    const { error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });
    if (error) {
      throw error;
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    logout,
    sendOtp,
    verifyOtp,
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