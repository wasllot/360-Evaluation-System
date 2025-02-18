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
  CircularProgress
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { login, selectAuthError, selectAuthLoading } from '../../store/slices/authSlice';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required')
});

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const error = useSelector(selectAuthError);
  const loading = useSelector(selectAuthLoading);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(login(values)).unwrap();
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
          alignItems: 'center'
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
            Sign In
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
              {error}
            </Alert>
          )}

          <Formik
            initialValues={{
              email: '',
              password: ''
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
                  autoFocus
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
                  autoComplete="current-password"
                />

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
                    'Sign In'
                  )}
                </Button>
              </Form>
            )}
          </Formik>

          <Box sx={{ mt: 2 }}>
            <Link
              component={RouterLink}
              to="/register"
              variant="body2"
              sx={{ textDecoration: 'none' }}
            >
              {"Don't have an account? Sign Up"}
            </Link>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
