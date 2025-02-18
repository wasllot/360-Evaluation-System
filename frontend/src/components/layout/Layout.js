import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Box, CssBaseline, Container, CircularProgress } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import { selectCurrentUser, selectAuthLoading, getCurrentUser } from '../../store/slices/authSlice';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const drawerWidth = 240;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector(selectCurrentUser);
  const loading = useSelector(selectAuthLoading);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user && !loading) {
      dispatch(getCurrentUser())
        .unwrap()
        .catch(() => {
          navigate('/login');
        });
    }
  }, [dispatch, navigate, user, loading]);

  const handleDrawerToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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

  if (!user) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      
      {/* App Header */}
      <Header 
        drawerWidth={drawerWidth}
        isOpen={isSidebarOpen}
        onDrawerToggle={handleDrawerToggle}
        user={user}
      />

      {/* Sidebar Navigation */}
      <Sidebar
        drawerWidth={drawerWidth}
        isOpen={isSidebarOpen}
        onDrawerToggle={handleDrawerToggle}
        user={user}
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 8, // Space for fixed header
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          height: '100vh',
          overflow: 'auto',
          backgroundColor: theme => theme.palette.background.default
        }}
      >
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
