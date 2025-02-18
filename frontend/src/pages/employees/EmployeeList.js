import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  IconButton,
  Chip,
  MenuItem,
  TablePagination,
  Tooltip,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Edit as EditIcon,
  Visibility as ViewIcon,
  Assessment as AssessmentIcon,
  Add as AddIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { 
  fetchEmployees, 
  selectAllEmployees, 
  selectEmployeeLoading, 
  selectEmployeeError,
  selectDepartments 
} from '../../store/slices/employeeSlice';

const EmployeeList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  const employees = useSelector(selectAllEmployees);
  const isLoading = useSelector(selectEmployeeLoading);
  const error = useSelector(selectEmployeeError);
  const user = useSelector(state => state.auth.user);
  const departments = useSelector(selectDepartments);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleDepartmentFilterChange = (event) => {
    setDepartmentFilter(event.target.value);
    setPage(0);
  };

  const handleAddEmployee = () => {
    navigate('/employees/new');
  };

  const handleEditEmployee = (employeeId) => {
    navigate(`/employees/${employeeId}/edit`);
  };

  const handleViewProfile = (employeeId) => {
    navigate(`/employees/${employeeId}`);
  };

  const handleViewEvaluations = (employeeId) => {
    navigate(`/evaluations/employee/${employeeId}`);
  };

  const filteredEmployees = employees.filter(employee => {
    if (!employee) return false;
    
    const searchFields = [
      employee.firstName,
      employee.lastName,
      employee.email,
      employee.position
    ].filter(Boolean);

    const matchesSearch = searchTerm === '' || searchFields.some(field => 
      field && field.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesDepartment = !departmentFilter || employee.department === departmentFilter;

    return matchesSearch && matchesDepartment;
  });

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'manager':
        return 'warning';
      default:
        return 'primary';
    }
  };

  const canManageEmployee = (employee) => {
    if (user.role === 'admin') return true;
    if (user.role === 'manager' && user.department === employee.department) return true;
    return false;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Empleados</Typography>
        {user.role === 'admin' && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddEmployee}
          >
            Agregar Empleado
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ mb: 2, p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Buscar"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
            }}
            sx={{ flexGrow: 1 }}
          />
          <TextField
            select
            label="Departamento"
            variant="outlined"
            size="small"
            value={departmentFilter}
            onChange={handleDepartmentFilterChange}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">Todos los Departamentos</MenuItem>
            {departments.map(dept => (
              <MenuItem key={dept} value={dept}>
                {dept}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Correo</TableCell>
              <TableCell>Departamento</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : filteredEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No se encontraron empleados
                </TableCell>
              </TableRow>
            ) : (
              filteredEmployees
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(employee => (
                  <TableRow key={employee._id}>
                    <TableCell>{`${employee.firstName} ${employee.lastName}`}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>
                      <Chip
                        label={employee.role}
                        color={getRoleColor(employee.role)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Ver Perfil">
                        <IconButton
                          size="small"
                          onClick={() => handleViewProfile(employee._id)}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      {canManageEmployee(employee) && (
                        <Tooltip title="Editar Empleado">
                          <IconButton
                            size="small"
                            onClick={() => handleEditEmployee(employee._id)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Ver Evaluaciones">
                        <IconButton
                          size="small"
                          onClick={() => handleViewEvaluations(employee._id)}
                        >
                          <AssessmentIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredEmployees.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
};

export default EmployeeList;
