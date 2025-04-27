// src/context/UserContext.tsx (Example Structure)
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser, // Rename to avoid conflict with potential custom User type
  updateProfile
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDTbzIqfYhPlNOd60tDz_v6jyyS47zlmwM",
  authDomain: "nyumbapaeasy.firebaseapp.com",
  projectId: "nyumbapaeasy",
  storageBucket: "nyumbapaeasy.firebasestorage.app",
  messagingSenderId: "887603462087",
  appId: "1:887603462087:web:ca96db0ec9515c7ed023e2",
  measurementId: "G-RWMVBKJ6C2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Use getFirestore here
const auth = getAuth(app); // Initialize Firebase Authentication

// Define the shape of your user object including the role
interface AppUser {
  id: string; // Firebase UID
  email: string;
  name: string;
  role: 'landlord' | 'renter'; // Add role here
}

interface UserContextProps {
  user: AppUser | null;
  isAuthenticated: boolean;
  isLoading: boolean; // Add loading state for auth check
  register: (name: string, email: string, password: string, role: 'landlord' | 'renter') => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start loading until auth state is checked

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        // Match Firestore document structure with auth UID
        setUser({
          id: firebaseUser.uid, // Critical match
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          role: 'landlord' // Get from your database
        });
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    });
    return () => unsubscribe();
  }, []);
  
  const register = async (name: string, email: string, password: string, role: 'landlord' | 'renter') => {
    try {
      // 1. Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // 2. Update Firebase Auth profile (optional but good for display name)
      await updateProfile(firebaseUser, { displayName: name });

      // 3. Create user document in Firestore to store role and other info
      const userDocRef = doc(db, "users", firebaseUser.uid);
      await setDoc(userDocRef, {
        uid: firebaseUser.uid,
        name: name,
        email: email,
        role: role, // Store the selected role!
        createdAt: new Date(), // Optional: timestamp
      });

      // No need to setUser here, onAuthStateChanged will handle it

    } catch (error: any) {
      console.error("Firebase Registration Error:", error);
      // Throw specific errors for the UI to catch
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('EMAIL_EXISTS');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('WEAK_PASSWORD');
      }
      throw new Error('Registration failed'); // Generic fallback
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // No need to setUser here, onAuthStateChanged will handle it
    } catch (error: any) {
      console.error("Firebase Login Error:", error);
      // Throw specific errors
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
         throw new Error('INVALID_CREDENTIALS');
      }
      throw new Error('Login failed'); // Generic fallback
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      // No need to setUser here, onAuthStateChanged will handle it
    } catch (error) {
      console.error("Firebase Logout Error:", error);
      throw new Error('Logout failed');
    }
  };

  return (
    <UserContext.Provider value={{
      user,
      isAuthenticated: !!user, // True if user object exists
      isLoading,
      register,
      login,
      logout
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
