import { createContext, useContext } from 'react';
import { useAuth, AppUser } from './AuthContext';

// Define the shape of the UserContext
interface UserContextType {
  user: AppUser | null;
  isAuthenticated: boolean;
  loading: boolean;
}

// Create the context with a default value
const UserContext = createContext<UserContextType>({ user: null, isAuthenticated: false, loading: true });

// Custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;

