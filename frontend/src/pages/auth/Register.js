import React from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Container,
  Link,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  MenuItem
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { register, selectAuthError, selectAuthLoading } from '../../store/slices/authSlice';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  department: Yup.string()
    .required('Department is required'),
  position: Yup.string()
    .required('Position is required')
});

const departments = [
  'Engineering',
  'Product',
  'Design',
  'Marketing',
  'Sales',
  'HR',
  'Finance'
];

const positions = [
  'Software Engineer',
  'Product Manager',
  'Designer',
  'Marketing Manager',
  'Sales Representative',
  'HR Manager',
  'Financial Analyst',
  'Team Lead',
  'Director',
  'Other'
];

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const error = useSelector(selectAuthError);
  const loading = useSelector(selectAuthLoading);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const { confirmPassword, ...registrationData } = values;
      await dispatch(register(registrationData)).unwrap();
      navigate('/dashboard');
    } catch (err) {
      setSubmitting(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          py: 4
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%'
          }}
        >
          <Typography component="h1" variant="h4" gutterBottom>
            360° Evaluation
          </Typography>
          
          <Typography component="h2" variant="h5" sx={{ mb: 3 }}>
            Create Account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
              {error}
            </Alert>
          )}

          <Formik
            initialValues={{
              name: '',
              email: '',
              password: '',
              confirmPassword: '',
              department: '',
              position: ''
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              isSubmitting
            }) => (
              <Form style={{ width: '100%' }}>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label="Full Name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                  margin="normal"
                  autoFocus
                />

                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email Address"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  margin="normal"
                  autoComplete="email"
                />

                <TextField
                  fullWidth
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  margin="normal"
                  autoComplete="new-password"
                />

                <TextField
                  fullWidth
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                  helperText={touched.confirmPassword && errors.confirmPassword}
                  margin="normal"
                  autoComplete="new-password"
                />

                <TextField
                  fullWidth
                  select
                  id="department"
                  name="department"
                  label="Department"
                  value={values.department}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.department && Boolean(errors.department)}
                  helperText={touched.department && errors.department}
                  margin="normal"
                >
                  {departments.map(dept => (
                    <MenuItem key={dept} value={dept}>
                      {dept}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  select
                  id="position"
                  name="position"
                  label="Position"
                  value={values.position}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.position && Boolean(errors.position)}
                  helperText={touched.position && errors.position}
                  margin="normal"
                >
                  {positions.map(pos => (
                    <MenuItem key={pos} value={pos}>
                      {pos}
                    </MenuItem>
                  ))}
                </TextField>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={isSubmitting || loading}
                  sx={{ mt: 3, mb: 2 }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Sign Up'
                  )}
                </Button>
              </Form>
            )}
          </Formik>

          <Box sx={{ mt: 2 }}>
            <Link
              component={RouterLink}
              to="/login"
              variant="body2"
              sx={{ textDecoration: 'none' }}
            >
              {"Already have an account? Sign In"}
            </Link>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
