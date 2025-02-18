import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  Assignment as AssignmentIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';

const Sidebar = ({ drawerWidth, isOpen, onDrawerToggle }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const user = useSelector(state => state.auth.user);

  const menuItems = [
    {
      text: 'Panel',
      icon: <DashboardIcon />,
      path: '/dashboard',
      roles: ['admin', 'manager', 'employee']
    },
    {
      text: 'Empleados',
      icon: <PeopleIcon />,
      path: '/employees',
      roles: ['admin', 'manager']
    },
    {
      text: 'Evaluaciones',
      icon: <AssignmentIcon />,
      path: '/evaluations',
      roles: ['admin', 'manager', 'employee']
    },
    {
      text: 'Reportes',
      icon: <BarChartIcon />,
      path: '/reports',
      roles: ['admin', 'manager']
    },
    {
      text: 'Plantillas',
      icon: <DescriptionIcon />,
      path: '/templates',
      roles: ['admin']
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      onDrawerToggle();
    }
  };

  const drawer = (
    <Box sx={{ overflow: 'auto' }}>
      <List>
        {menuItems
          .filter(item => item.roles.includes(user?.role))
          .map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => handleNavigation(item.path)}
              >
                <ListItemIcon
                  sx={{
                    color: location.pathname === item.path ? 
                      theme.palette.primary.main : 
                      'inherit'
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  sx={{
                    color: location.pathname === item.path ? 
                      theme.palette.primary.main : 
                      'inherit'
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
      </List>
      
      <Divider />
      
      {user?.role === 'admin' && (
        <List>
          <ListItem disablePadding>
            <ListItemButton
              selected={location.pathname === '/settings'}
              onClick={() => handleNavigation('/settings')}
            >
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Configuración" />
            </ListItemButton>
          </ListItem>
        </List>
      )}
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={isOpen}
        onClose={onDrawerToggle}
        ModalProps={{
          keepMounted: true // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            backgroundColor: theme.palette.background.default
          }
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            backgroundColor: theme.palette.background.default,
            borderRight: `1px solid ${theme.palette.divider}`
          }
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
