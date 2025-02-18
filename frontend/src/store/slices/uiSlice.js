import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
  globalLoading: false,
  snackbar: {
    open: false,
    message: '',
    severity: 'info' // 'error' | 'warning' | 'info' | 'success'
  },
  confirmDialog: {
    open: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    onConfirm: null,
    onCancel: null
  }
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        read: false,
        timestamp: new Date().toISOString(),
        ...action.payload
      });
    },
    markNotificationAsRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    showSnackbar: (state, action) => {
      state.snackbar = {
        open: true,
        message: action.payload.message,
        severity: action.payload.severity || 'info'
      };
    },
    hideSnackbar: (state) => {
      state.snackbar.open = false;
    },
    showConfirmDialog: (state, action) => {
      state.confirmDialog = {
        open: true,
        title: action.payload.title || '',
        message: action.payload.message || '',
        confirmText: action.payload.confirmText || 'Confirm',
        cancelText: action.payload.cancelText || 'Cancel',
        onConfirm: action.payload.onConfirm || null,
        onCancel: action.payload.onCancel || null
      };
    },
    hideConfirmDialog: (state) => {
      state.confirmDialog = {
        ...initialState.confirmDialog,
        open: false
      };
    }
  }
});

// Selectors
export const selectNotifications = (state) => state.ui.notifications;
export const selectUnreadNotifications = (state) => 
  state.ui.notifications.filter(n => !n.read);
export const selectGlobalLoading = (state) => state.ui.globalLoading;
export const selectSnackbar = (state) => state.ui.snackbar;
export const selectConfirmDialog = (state) => state.ui.confirmDialog;

// Action creators
export const {
  setGlobalLoading,
  addNotification,
  markNotificationAsRead,
  clearNotifications,
  showSnackbar,
  hideSnackbar,
  showConfirmDialog,
  hideConfirmDialog
} = uiSlice.actions;

// Thunks
export const showSuccessSnackbar = (message) => (dispatch) => {
  dispatch(showSnackbar({ message, severity: 'success' }));
};

export const showErrorSnackbar = (message) => (dispatch) => {
  dispatch(showSnackbar({ message, severity: 'error' }));
};

export const showWarningSnackbar = (message) => (dispatch) => {
  dispatch(showSnackbar({ message, severity: 'warning' }));
};

export const showInfoSnackbar = (message) => (dispatch) => {
  dispatch(showSnackbar({ message, severity: 'info' }));
};

export const confirmAction = (options) => (dispatch) => {
  return new Promise((resolve) => {
    dispatch(showConfirmDialog({
      ...options,
      onConfirm: () => {
        resolve(true);
        dispatch(hideConfirmDialog());
      },
      onCancel: () => {
        resolve(false);
        dispatch(hideConfirmDialog());
      }
    }));
  });
};

export default uiSlice.reducer;
