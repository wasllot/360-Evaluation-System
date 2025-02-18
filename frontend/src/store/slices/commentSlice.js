import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import commentService from '../../services/comment.service';

// Async thunks
export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (evaluationId, { rejectWithValue }) => {
    try {
      const comments = await commentService.getComments(evaluationId);
      return comments;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createComment = createAsyncThunk(
  'comments/createComment',
  async ({ evaluationId, content, parentCommentId }, { rejectWithValue }) => {
    try {
      const comment = await commentService.createComment(
        evaluationId,
        content,
        parentCommentId
      );
      return comment;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateComment = createAsyncThunk(
  'comments/updateComment',
  async ({ commentId, content }, { rejectWithValue }) => {
    try {
      const updatedComment = await commentService.updateComment(
        commentId,
        content
      );
      return updatedComment;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async (commentId, { rejectWithValue }) => {
    try {
      await commentService.deleteComment(commentId);
      return commentId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const commentSlice = createSlice({
  name: 'comments',
  initialState: {
    comments: [],
    loading: false,
    error: null,
    currentEvaluationId: null
  },
  reducers: {
    clearComments: (state) => {
      state.comments = [];
      state.currentEvaluationId = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Comments
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
        state.currentEvaluationId = action.meta.arg;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Comment
      .addCase(createComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments.unshift(action.payload);
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Comment
      .addCase(updateComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = state.comments.map(comment =>
          comment._id === action.payload._id ? action.payload : comment
        );
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Comment
      .addCase(deleteComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = state.comments.filter(
          comment => comment._id !== action.payload
        );
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearComments } = commentSlice.actions;
export default commentSlice.reducer;
