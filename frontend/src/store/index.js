import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import employeeReducer from './slices/employeeSlice';
import evaluationReducer from './slices/evaluationSlice';
import templateReducer from './slices/templateSlice';
import uiReducer from './slices/uiSlice';
import commentReducer from './slices/commentSlice';

// Axios interceptor for adding auth token
import axios from 'axios';

// Configure axios defaults
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Add a request interceptor
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const store = configureStore({
  reducer: {
    auth: authReducer,
    employee: employeeReducer,
    evaluation: evaluationReducer,
    template: templateReducer,
    ui: uiReducer,
    comment: commentReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these paths in the state
        ignoredActions: ['auth/login/fulfilled'],
        ignoredPaths: ['auth.user']
      }
    }),
  devTools: process.env.NODE_ENV !== 'production'
});

export default store;
