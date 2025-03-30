import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { FEATURES } from '../config/features';

interface PrivateRouteProps {
  element: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  
  // If auth is not required (feature flag), always allow access
  if (!FEATURES.AUTH_REQUIRED) {
    return <>{element}</>;
  }
  
  // If guest mode is enabled, allow access
  if (FEATURES.GUEST_MODE) {
    return <>{element}</>;
  }
  
  // Otherwise, redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }
  
  // User is authenticated, allow access
  return <>{element}</>;
};

export default PrivateRoute;