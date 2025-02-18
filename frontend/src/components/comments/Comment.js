import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteComment, updateComment } from '../../store/slices/commentSlice';
import { 
  Avatar,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Paper
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import moment from 'moment';
import 'moment/dist/locale/es';


moment.locale('es');

const Comment = ({ comment }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setIsEditing(true);
    handleMenuClose();
  };

  const handleDelete = () => {
    dispatch(deleteComment(comment._id));
    handleMenuClose();
  };

  const handleSaveEdit = async () => {
    await dispatch(updateComment({
      commentId: comment._id,
      content: editedContent
    }));
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedContent(comment.content);
    setIsEditing(false);
  };

  return (
    <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
      <Box display="flex" justifyContent="space-between">
        <Box display="flex" alignItems="center" gap={1}>
          <Avatar 
            src={comment.userId.avatar}
            alt={`${comment.userId.firstName} ${comment.userId.lastName}`}
          />
          <Box>
            <Typography variant="subtitle2">
              {comment.userId.firstName} {comment.userId.lastName}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {moment(comment.createdAt).fromNow()}
            </Typography>
          </Box>
        </Box>
        
        {user._id === comment.userId._id && (
          <IconButton
            size="small"
            onClick={handleMenuClick}
          >
            <MoreVertIcon />
          </IconButton>
        )}
      </Box>

      <Box mt={1}>
        {isEditing ? (
          <>
            <TextField
              fullWidth
              multiline
              rows={2}
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <Box mt={1} display="flex" gap={1}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleSaveEdit}
                >
                  Guardar
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleCancelEdit}
                >
                  Cancelar
                </Button>


            </Box>
          </>
        ) : (
          <Typography variant="body1">
            {comment.content}
          </Typography>
        )}
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
                  <EditIcon fontSize="small" sx={{ mr: 1 }} />
                  Editar


        </MenuItem>
        <MenuItem onClick={handleDelete}>
                  <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                  Eliminar


        </MenuItem>
      </Menu>
    </Paper>
  );
};

export default Comment;
