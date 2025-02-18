import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Paper,
  Grid,
  CircularProgress
} from '@mui/material';
import { 
  createEmployee,
  fetchEmployeeById,
  updateEmployee,
  selectEmployeeLoading,
  selectEmployeeError
} from '../../store/slices/employeeSlice';

const departments = ['HR', 'IT', 'Finance', 'Marketing', 'Operations'];

function EmployeeForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  
  const [formData, setFormData] = React.useState(null);
  const [isLoadingEmployee, setIsLoadingEmployee] = React.useState(false);
  const [fetchError, setFetchError] = React.useState(null);

  const loading = useSelector(selectEmployeeLoading);
  const error = useSelector(selectEmployeeError);
  const currentUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (isEditMode) {
      setIsLoadingEmployee(true);
      setFetchError(null);
      dispatch(fetchEmployeeById(id))
        .unwrap()
        .then((employee) => {
          setFormData({
            email: employee.email,
            password: '', // Don't pre-fill password for security
            firstName: employee.firstName,
            lastName: employee.lastName,
            department: employee.department,
            role: employee.role
          });
        })
        .catch((error) => {
          setFetchError(error.message || 'Failed to load employee data');
        })
        .finally(() => {
          setIsLoadingEmployee(false);
        });
    } else {
      setFormData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        department: '',
        role: 'employee',
      });
    }
  }, [id, isEditMode, dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // If current user is a manager, set department to manager's department
    if (currentUser.role === 'manager') {
      formData.department = currentUser.department;
    }

    const action = isEditMode ? updateEmployee({ id, data: formData }) : createEmployee(formData);
    const result = await dispatch(action);
    if (!result.error) {
      navigate('/employees');
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {isEditMode ? 'Editar Empleado' : 'Agregar Nuevo Empleado'}
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        {fetchError && (
          <Typography color="error" sx={{ mb: 2 }}>
            {fetchError}
          </Typography>
        )}
        {isLoadingEmployee && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <CircularProgress />
          </Box>
        )}

        {formData && (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Nombre"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Apellido"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Correo"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Contraseña"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </Grid>
              {currentUser.role === 'admin' && (
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    select
                    label="Departamento"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                  >
                    {departments.map((dept) => (
                      <MenuItem key={dept} value={dept}>
                        {dept}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              )}
              <Grid item xs={12}>
                <Box sx={{ mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    sx={{ mr: 2 }}
                  >
                    {loading ? (isEditMode ? 'Actualizando...' : 'Creando...') : (isEditMode ? 'Actualizar Empleado' : 'Crear Empleado')}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/employees')}
                  >
                    Cancelar
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        )}
      </Paper>
    </Container>
  );
}

export default EmployeeForm;
