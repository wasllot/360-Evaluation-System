import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Snackbar, Alert } from '@mui/material';
import { hideSnackbar, selectSnackbar } from '../../store/slices/uiSlice';

const Notification = () => {
  const dispatch = useDispatch();
  const snackbar = useSelector(selectSnackbar);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(hideSnackbar());
  };

  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={handleClose}
        severity={snackbar.severity}
        variant="filled"
        elevation={6}
        sx={{ width: '100%' }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
};

// Usage examples:
/*
  // In any component:
  import { useDispatch } from 'react-redux';
  import { 
    showSuccessSnackbar, 
    showErrorSnackbar, 
    showWarningSnackbar, 
    showInfoSnackbar 
  } from '../../store/slices/uiSlice';

  const Component = () => {
    const dispatch = useDispatch();

    // Success notification
    dispatch(showSuccessSnackbar('Operation completed successfully'));

    // Error notification
    dispatch(showErrorSnackbar('An error occurred'));

    // Warning notification
    dispatch(showWarningSnackbar('Please review the changes'));

    // Info notification
    dispatch(showInfoSnackbar('New updates available'));
  };
*/

export default Notification;
