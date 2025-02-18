import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchComments, 
  createComment,
  clearComments
} from '../../store/slices/commentSlice';
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Typography
} from '@mui/material';
import Comment from './Comment';

const CommentSection = ({ evaluationId }) => {
  const dispatch = useDispatch();
  const { comments, loading, error } = useSelector(state => state.comment);
  const [newComment, setNewComment] = useState('');
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(fetchComments(evaluationId));

    return () => {
      dispatch(clearComments());
    };
  }, [evaluationId, dispatch]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      await dispatch(createComment({
        evaluationId,
        content: newComment
      }));
      setNewComment('');
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Comentarios ({comments.length})
      </Typography>

      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      <Box mb={3}>
        <form onSubmit={handleCommentSubmit}>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Escribe un comentario..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={!user}
          />
          <Box mt={1} display="flex" justifyContent="flex-end">
            <Button
              type="submit"
              variant="contained"
              disabled={!newComment.trim() || !user}
            >
              Enviar
            </Button>
          </Box>
        </form>
      </Box>

      <Box>
        {comments.map(comment => (
          <Comment key={comment._id} comment={comment} />
        ))}
      </Box>
    </Box>
  );
};

export default CommentSection;
