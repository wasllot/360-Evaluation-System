import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks
export const fetchTemplates = createAsyncThunk(
  'template/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/templates');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch templates');
    }
  }
);

export const fetchTemplateById = createAsyncThunk(
  'template/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/templates/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch template');
    }
  }
);

export const createTemplate = createAsyncThunk(
  'template/create',
  async (templateData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/templates', templateData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create template');
    }
  }
);

export const updateTemplate = createAsyncThunk(
  'template/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/templates/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update template');
    }
  }
);

export const deleteTemplate = createAsyncThunk(
  'template/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/templates/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete template');
    }
  }
);

const initialState = {
  templates: [],
  currentTemplate: null,
  loading: false,
  error: null,
  success: false
};

const templateSlice = createSlice({
  name: 'template',
  initialState,
  reducers: {
    clearCurrentTemplate: (state) => {
      state.currentTemplate = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Templates
      .addCase(fetchTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = action.payload;
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Template by ID
      .addCase(fetchTemplateById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTemplateById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTemplate = action.payload;
      })
      .addCase(fetchTemplateById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Template
      .addCase(createTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.templates.push(action.payload);
        state.success = true;
      })
      .addCase(createTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Update Template
      .addCase(updateTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = state.templates.map(template =>
          template._id === action.payload._id ? action.payload : template
        );
        state.currentTemplate = action.payload;
        state.success = true;
      })
      .addCase(updateTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Delete Template
      .addCase(deleteTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = state.templates.filter(template => 
          template._id !== action.payload
        );
        state.success = true;
      })
      .addCase(deleteTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  }
});

// Selectors
export const selectAllTemplates = (state) => state.template.templates;
export const selectCurrentTemplate = (state) => state.template.currentTemplate;
export const selectTemplateLoading = (state) => state.template.loading;
export const selectTemplateError = (state) => state.template.error;
export const selectTemplateSuccess = (state) => state.template.success;

export const { clearCurrentTemplate, clearError, clearSuccess } = templateSlice.actions;

export default templateSlice.reducer;
