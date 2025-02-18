import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks
export const fetchEmployees = createAsyncThunk(
  'employee/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/employees');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch employees');
    }
  }
);

export const fetchEmployeeById = createAsyncThunk(
  'employee/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/employees/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch employee');
    }
  }
);

export const createEmployee = createAsyncThunk(
  'employee/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post('/employees', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create employee');
    }
  }
);

export const updateEmployee = createAsyncThunk(
  'employee/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/employees/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update employee');
    }
  }
);

export const fetchEmployeesByDepartment = createAsyncThunk(
  'employee/fetchByDepartment',
  async (department, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/employees/department/${department}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch department employees');
    }
  }
);

export const fetchEmployeeStats = createAsyncThunk(
  'employee/fetchStats',
  async (department, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/employees/department/${department}/stats`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch employee statistics');
    }
  }
);

const initialState = {
  employees: [],
  currentEmployee: null,
  departmentEmployees: [],
  departments: [],
  stats: null,
  loading: false,
  error: null,
  success: false
};

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    clearCurrentEmployee: (state) => {
      state.currentEmployee = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Employees
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload;
        // Extract unique departments
        state.departments = [...new Set(action.payload.map(emp => emp.department))];
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Employee by ID
      .addCase(fetchEmployeeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEmployee = action.payload;
      })
      .addCase(fetchEmployeeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Employee
      .addCase(createEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employees.push(action.payload);
        state.success = true;
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Employee
      .addCase(updateEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = state.employees.map(employee =>
          employee._id === action.payload._id ? action.payload : employee
        );
        state.currentEmployee = action.payload;
        state.success = true;
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Employees by Department
      .addCase(fetchEmployeesByDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeesByDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.departmentEmployees = action.payload;
      })
      .addCase(fetchEmployeesByDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Employee Stats
      .addCase(fetchEmployeeStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchEmployeeStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// Selectors
export const selectAllEmployees = (state) => state.employee.employees;
export const selectCurrentEmployee = (state) => state.employee.currentEmployee;
export const selectDepartmentEmployees = (state) => state.employee.departmentEmployees;
export const selectEmployeeStats = (state) => state.employee.stats;
export const selectEmployeeLoading = (state) => state.employee.loading;
export const selectEmployeeError = (state) => state.employee.error;
export const selectEmployeeSuccess = (state) => state.employee.success;
export const selectDepartments = (state) => state.employee.departments;
export const selectCombinedLoading = (state) => state.evaluation.loading || state.employee.loading;

export const { clearCurrentEmployee, clearSuccess, clearError } = employeeSlice.actions;

export default employeeSlice.reducer;
