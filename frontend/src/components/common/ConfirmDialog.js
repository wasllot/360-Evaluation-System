import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { hideConfirmDialog, selectConfirmDialog } from '../../store/slices/uiSlice';

const ConfirmDialog = () => {
  const dispatch = useDispatch();
  const {
    open,
    title,
    message,
    confirmText,
    cancelText,
    onConfirm,
    onCancel
  } = useSelector(selectConfirmDialog);

  const handleClose = () => {
    if (onCancel) {
      onCancel();
    }
    dispatch(hideConfirmDialog());
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    dispatch(hideConfirmDialog());
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2
        }
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" component="div">
            {title}
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={handleClose}
          color="inherit"
          variant="outlined"
        >
          {cancelText || 'Cancel'}
        </Button>
        <Button
          onClick={handleConfirm}
          color="primary"
          variant="contained"
          autoFocus
        >
          {confirmText || 'Confirm'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Usage examples:
/*
  // In any component:
  import { useDispatch } from 'react-redux';
  import { confirmAction } from '../../store/slices/uiSlice';

  const Component = () => {
    const dispatch = useDispatch();

    const handleDelete = async () => {
      const confirmed = await dispatch(confirmAction({
        title: 'Delete Item',
        message: 'Are you sure you want to delete this item? This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      })).unwrap();

      if (confirmed) {
        // Proceed with deletion
        console.log('Item deleted');
      }
    };

    const handlePublish = async () => {
      const confirmed = await dispatch(confirmAction({
        title: 'Publish Evaluation',
        message: 'This will make the evaluation visible to all participants. Continue?',
        confirmText: 'Publish',
        cancelText: 'Review'
      })).unwrap();

      if (confirmed) {
        // Proceed with publishing
        console.log('Evaluation published');
      }
    };

    return (
      <div>
        <Button onClick={handleDelete}>Delete Item</Button>
        <Button onClick={handlePublish}>Publish Evaluation</Button>
      </div>
    );
  };
*/

export default ConfirmDialog;
