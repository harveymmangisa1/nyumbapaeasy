import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export type Role = 'admin' | 'landlord' | 'renter' | 'real_estate_agency' | 'lodge_owner' | 'bnb_owner' | 'user';

interface ProtectedRouteProps {
  requireAuth?: boolean; // default true
  allowedRoles?: Role[]; // if provided, user must have one of these
  redirectTo?: string; // default '/login'
  unauthorizedTo?: string; // default '/unauthorized'
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requireAuth = true,
  allowedRoles,
  redirectTo = '/login',
  unauthorizedTo = '/unauthorized',
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // While auth state is loading, keep the user on a neutral loader
  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center text-text-secondary">Loading...</div>
      </div>
    );
  }

  // If auth is required and no user, redirect to login and preserve intended path
  if (requireAuth && !user) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  // If specific roles are required, enforce them
  if (allowedRoles && allowedRoles.length) {
    const userRole = user?.profile?.role as Role | undefined;
    if (!userRole || !allowedRoles.includes(userRole)) {
      return <Navigate to={unauthorizedTo} replace state={{ from: location }} />;
    }
  }

  // All good - render nested route content
  return <Outlet />;
};

export default ProtectedRoute;
