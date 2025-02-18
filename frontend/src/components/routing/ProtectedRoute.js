import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Box, CircularProgress } from '@mui/material';
import { selectIsAuthenticated, selectAuthLoading, getCurrentUser } from '../../store/slices/authSlice';

const ProtectedRoute = ({ children, roles = [] }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    // If we have a token but no user data and we're not already loading, try to fetch the user
    const token = localStorage.getItem('token');
    if (token && !user && !loading && !isAuthenticated) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, user, loading, isAuthenticated]);

  // Show loading spinner while checking authentication
  console.log('ProtectedRoute - Loading:', loading);
  console.log('User:', user);
  console.log('Is Authenticated:', isAuthenticated);
  console.log('Required Roles:', roles);
  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if route requires specific roles
  if (roles.length > 0 && !roles.includes(user?.role)) {
    // If user's role is not authorized, redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // If there are children, render them, otherwise render the Outlet
  return children || <Outlet />;
};

export default ProtectedRoute;
