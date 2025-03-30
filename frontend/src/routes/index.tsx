import React, { useEffect } from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { ROUTES } from './routes';

// Private route component
import PrivateRoute from './PrivateRoute';

// Page components
import Dashboard from '../pages/Dashboard';
import Analysis from '../pages/Analysis';
import Batch from '../pages/Batch';
import History from '../pages/History';
import Settings from '../pages/Settings';
import Login from '../pages/Login';
import Register from '../pages/Register';
import NotFound from '../pages/NotFound';

// Analytics service
import { analyticsService } from '../services/analytics';

const AppRoutes: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  // Track page views
  useEffect(() => {
    const pageName = Object.values(ROUTES).find(
      (route) => route.path === location.pathname
    )?.title || 'Unknown Page';
    
    analyticsService.trackPageView(pageName, location.pathname);
  }, [location.pathname]);
  
  return (
    <Routes>
      {/* Public Home/Dashboard */}
      <Route
        path={ROUTES.HOME.path}
        element={
          isAuthenticated ? (
            <Navigate to={ROUTES.DASHBOARD.path} replace />
          ) : (
            <Navigate to={ROUTES.LOGIN.path} replace />
          )
        }
      />
      
      {/* Auth Routes */}
      <Route path={ROUTES.LOGIN.path} element={<Login />} />
      <Route path={ROUTES.REGISTER.path} element={<Register />} />
      
      {/* Private Routes */}
      <Route
        path={ROUTES.DASHBOARD.path}
        element={<PrivateRoute element={<Dashboard />} />}
      />
      
      <Route
        path={ROUTES.ANALYSIS.path}
        element={<PrivateRoute element={<Analysis />} />}
      />
      
      <Route
        path={ROUTES.BATCH.path}
        element={<PrivateRoute element={<Batch />} />}
      />
      
      <Route
        path={ROUTES.HISTORY.path}
        element={<PrivateRoute element={<History />} />}
      />
      
      <Route
        path={ROUTES.SETTINGS.path}
        element={<PrivateRoute element={<Settings />} />}
      />
      
      {/* Not Found Route */}
      <Route path={ROUTES.NOT_FOUND.path} element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;