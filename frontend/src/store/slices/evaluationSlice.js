import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Async thunks
export const createEvaluation = createAsyncThunk(
  'evaluation/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/evaluations`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create evaluation');
    }
  }
);

export const updateEvaluation = createAsyncThunk(
  'evaluation/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/evaluations/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update evaluation');
    }
  }
);

export const getEvaluationById = createAsyncThunk(
  'evaluation/getById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/evaluations/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch evaluation');
    }
  }
);

export const getEmployeeEvaluations = createAsyncThunk(
  'evaluation/getByEmployee',
  async (employeeId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/evaluations/employee/${employeeId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch employee evaluations');
    }
  }
);

export const submitFeedback = createAsyncThunk(
  'evaluation/submitFeedback',
  async ({ evaluationId, feedback }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/feedback`, {
        evaluationId,
        feedback
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit feedback');
    }
  }
);

export const getEmployeeReport = createAsyncThunk(
  'evaluation/getEmployeeReport',
  async (employeeId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/reports/employee/${employeeId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch employee report');
    }
  }
);

export const getDepartmentReport = createAsyncThunk(
  'evaluation/getDepartmentReport',
  async (department, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/reports/department/${department}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch department report');
    }
  }
);

const initialState = {
  evaluations: [],
  currentEvaluation: null,
  employeeEvaluations: [],
  employeeReport: null,
  departmentReport: null,
  loading: false,
  error: null,
  success: false
};

const evaluationSlice = createSlice({
  name: 'evaluation',
  initialState,
  reducers: {
    resetSuccess: (state) => {
      state.success = false;
    },
    resetError: (state) => {
      state.error = null;
    },
    clearCurrentEvaluation: (state) => {
      state.currentEvaluation = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Evaluations
      .addCase(fetchEvaluations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvaluations.fulfilled, (state, action) => {
        state.loading = false;
        state.evaluations = action.payload;
      })
      .addCase(fetchEvaluations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Evaluation
      .addCase(createEvaluation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvaluation.fulfilled, (state, action) => {
        state.loading = false;
        state.evaluations.push(action.payload);
        state.success = true;
      })
      .addCase(createEvaluation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Evaluation
      .addCase(updateEvaluation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEvaluation.fulfilled, (state, action) => {
        state.loading = false;
        state.evaluations = state.evaluations.map(evaluation =>
          evaluation._id === action.payload._id ? action.payload : evaluation
        );
        state.currentEvaluation = action.payload;
        state.success = true;
      })
      .addCase(updateEvaluation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Evaluation by ID
      .addCase(getEvaluationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEvaluationById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEvaluation = action.payload;
      })
      .addCase(getEvaluationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Employee Evaluations
      .addCase(getEmployeeEvaluations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEmployeeEvaluations.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeEvaluations = action.payload;
      })
      .addCase(getEmployeeEvaluations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Submit Feedback
      .addCase(submitFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEvaluation = action.payload;
        state.success = true;
      })
      .addCase(submitFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Employee Report
      .addCase(getEmployeeReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEmployeeReport.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeReport = action.payload;
      })
      .addCase(getEmployeeReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Department Report
      .addCase(getDepartmentReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDepartmentReport.fulfilled, (state, action) => {
        state.loading = false;
        state.departmentReport = action.payload;
      })
      .addCase(getDepartmentReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// Selectors
export const selectAllEvaluations = (state) => state.evaluation.evaluations;
export const selectCurrentEvaluation = (state) => state.evaluation.currentEvaluation;
export const selectEvaluationLoading = (state) => state.evaluation.loading;
export const selectEvaluationError = (state) => state.evaluation.error;
export const selectEmployeeReport = (state) => state.evaluation.employeeReport;

// Rename existing thunks to match the imported names
export const fetchEvaluations = createAsyncThunk(
  'evaluation/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/evaluations`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch evaluations');
    }
  }
);

// Removed duplicate thunk as it's already defined as getEvaluationById

export const { resetSuccess, resetError, clearCurrentEvaluation } = evaluationSlice.actions;

export default evaluationSlice.reducer;
