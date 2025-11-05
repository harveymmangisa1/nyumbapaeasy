import { createContext } from 'react';
import { useAuth } from './AuthContext';

// Re-export the types from AuthContext for consistency
export type { AppUser } from './AuthContext';

// Define the shape of the UserContext
interface UserContextType {
  user: ReturnType<typeof useAuth>['user'];
  isAuthenticated: boolean;
  loading: boolean;
}

// Create the context with default undefined value
const UserContext = createContext<UserContextType | undefined>(undefined);

// Custom hook to use the UserContext
export const useUser = () => {
  // Get auth data from AuthContext
  const auth = useAuth();
  
  // Transform the auth data into the expected UserContext format
  return {
    user: auth.user,
    isAuthenticated: !!auth.user,
    loading: auth.loading
  };
};

// Provider component (just re-exports AuthProvider since we're using AuthContext internally)
export const UserProvider = UserContext.Provider;

export default UserContext;