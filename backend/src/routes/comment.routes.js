import express from 'express';
import {
  getComments,
  createComment,
  updateComment,
  deleteComment
} from '../controllers/comment.controller.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get comments for an evaluation
router.get('/evaluations/:evaluationId/comments', protect, getComments);

// Create a new comment
router.post('/evaluations/:evaluationId/comments', protect, createComment);

// Update a comment
router.put('/comments/:id', protect, authorize('user', 'admin'), updateComment);

// Delete a comment
router.delete('/comments/:id', protect, authorize('user', 'admin'), deleteComment);

export default router;
