import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, CircularProgress, Box } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import theme from './theme';

// Layout
import Layout from './components/layout/Layout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Dashboard Pages
import AdminDashboard from './pages/dashboard/AdminDashboard';
import ManagerDashboard from './pages/dashboard/ManagerDashboard';
import EmployeeDashboard from './pages/dashboard/EmployeeDashboard';

// Employee Pages
import EmployeeList from './pages/employees/EmployeeList';
import EmployeeForm from './pages/employees/EmployeeForm';
import EmployeeProfile from './pages/employees/EmployeeProfile';

// Evaluation Pages
import EvaluationList from './pages/evaluations/EvaluationList';
import EvaluationForm from './pages/evaluations/EvaluationForm';
import EvaluationDetails from './pages/evaluations/EvaluationDetails';

// Template Pages
import TemplateList from './pages/templates/TemplateList';
import TemplateForm from './pages/templates/TemplateForm';

// Report Pages
import Reports from './pages/reports/Reports';
import EmployeeReport from './pages/reports/EmployeeReport';
import TeamReport from './pages/reports/TeamReport';
import DepartmentReport from './pages/reports/DepartmentReport';

// Protected Route Component
import ProtectedRoute from './components/routing/ProtectedRoute';

// Auth Actions
import { getCurrentUser, selectIsAuthenticated, selectAuthLoading, setLoading } from './store/slices/authSlice';

const App = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !isAuthenticated) {
      dispatch(getCurrentUser()).unwrap()
        .catch(() => {
          // Si falla getCurrentUser, aseguramos que loading se establezca en false
          dispatch(setLoading(false));
        });
    } else if (!token) {
      // Si no hay token, establecemos loading en false inmediatamente
      dispatch(setLoading(false));
    }
  }, [dispatch, isAuthenticated]);

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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={
            !isAuthenticated ? <Login /> : <Navigate to="/dashboard" />
          } />
          <Route path="/register" element={
            !isAuthenticated ? <Register /> : <Navigate to="/dashboard" />
          } />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute roles={['admin', 'manager']}><Layout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<DashboardRouter />} />
            
            {/* Employee Routes */}
            <Route path="/employees" element={<EmployeeList />} />
            <Route path="/employees/new" element={
              <ProtectedRoute roles={['admin']}>
                <EmployeeForm />
              </ProtectedRoute>
            } />
            <Route path="/employees/:id/edit" element={
              <ProtectedRoute roles={['admin', 'manager']}>
                <EmployeeForm />
              </ProtectedRoute>
            } />
            <Route path="/employees/:id" element={<EmployeeProfile />} />

            {/* Evaluation Routes */}
            <Route path="/evaluations" element={<EvaluationList />} />
            <Route path="/evaluations/new" element={
              <ProtectedRoute roles={['admin', 'manager']}>
                <EvaluationForm />
              </ProtectedRoute>
            } />
            <Route path="/evaluations/:id/edit" element={
              <ProtectedRoute roles={['admin', 'manager']}>
                <EvaluationForm />
              </ProtectedRoute>
            } />
            <Route path="/evaluations/:id" element={<EvaluationDetails />} />
            <Route path="/evaluations/employee/:id" element={<EvaluationList />} />

            {/* Template Routes */}
            <Route path="/templates" element={
              <ProtectedRoute roles={['admin', 'manager']}>
                <TemplateList />
              </ProtectedRoute>
            } />
            <Route path="/templates/new" element={
              <ProtectedRoute roles={['admin', 'manager']}>
                <TemplateForm />
              </ProtectedRoute>
            } />
            <Route path="/templates/:id/edit" element={
              <ProtectedRoute roles={['admin', 'manager']}>
                <TemplateForm />
              </ProtectedRoute>
            } />

            {/* Report Routes */}
            <Route path="/reports" element={
              <ProtectedRoute roles={['admin', 'manager']}>
                <Reports />
              </ProtectedRoute>
            } />
            <Route path="/reports/employee/:id" element={<EmployeeReport />} />
            <Route path="/reports/team" element={
              <ProtectedRoute roles={['admin', 'manager']}>
                <TeamReport />
              </ProtectedRoute>
            } />
            <Route path="/reports/department/:department" element={
              <ProtectedRoute roles={['admin', 'manager']}>
                <DepartmentReport />
              </ProtectedRoute>
            } />
          </Route>

          {/* Redirect root to dashboard or login */}
          <Route path="/" element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          } />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

// Helper component to route to the correct dashboard based on user role
const DashboardRouter = () => {
  const user = useSelector(state => state.auth.user);

  if (!user) return null;

  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'manager':
      return <ManagerDashboard />;
    default:
      return <EmployeeDashboard />;
  }
};

export default App;
