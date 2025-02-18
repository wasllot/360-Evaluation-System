import asyncHandler from 'express-async-handler';
import Comment from '../models/comment.model.js';
import Evaluation from '../models/evaluation.model.js';

// @desc    Get comments for an evaluation
// @route   GET /evaluations/:evaluationId/comments
// @access  Private
const getComments = asyncHandler(async (req, res) => {
  const { evaluationId } = req.params;
  
  // Check if evaluation exists
  const evaluation = await Evaluation.findById(evaluationId);
  if (!evaluation) {
    res.status(404);
    throw new Error('Evaluation not found');
  }

  // Get comments sorted by creation date
  const comments = await Comment.find({ evaluationId })
    .sort({ createdAt: -1 })
    .populate('userId', 'firstName lastName avatar');

  res.json(comments);
});

// @desc    Create a new comment
// @route   POST /evaluations/:evaluationId/comments
// @access  Private
const createComment = asyncHandler(async (req, res) => {
  const { evaluationId } = req.params;
  const { content, parentCommentId } = req.body;
  const userId = req.user.id;

  // Check if evaluation exists
  const evaluation = await Evaluation.findById(evaluationId);
  if (!evaluation) {
    res.status(404);
    throw new Error('Evaluation not found');
  }

  // Validate content
  if (!content || content.trim().length === 0) {
    res.status(400);
    throw new Error('Comment content is required');
  }

  // Create new comment
  const comment = await Comment.create({
    evaluationId,
    userId,
    content,
    parentCommentId
  });

  // Populate user info in response
  const populatedComment = await Comment.findById(comment._id)
    .populate('userId', 'firstName lastName avatar');

  res.status(201).json(populatedComment);
});

// @desc    Update a comment
// @route   PUT /comments/:id
// @access  Private
const updateComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  const comment = await Comment.findById(id);
  
  // Check if comment exists
  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  // Check if user is authorized to update
  if (comment.userId.toString() !== userId && !req.user.isAdmin) {
    res.status(403);
    throw new Error('Not authorized to update this comment');
  }

  // Validate content
  if (!content || content.trim().length === 0) {
    res.status(400);
    throw new Error('Comment content is required');
  }

  // Update comment
  comment.content = content;
  const updatedComment = await comment.save();

  res.json(updatedComment);
});

// @desc    Delete a comment
// @route   DELETE /comments/:id
// @access  Private
const deleteComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const comment = await Comment.findById(id);
  
  // Check if comment exists
  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  // Check if user is authorized to delete
  if (comment.userId.toString() !== userId && !req.user.isAdmin) {
    res.status(403);
    throw new Error('Not authorized to delete this comment');
  }

  await comment.remove();
  res.json({ message: 'Comment removed' });
});

export {
  getComments,
  createComment,
  updateComment,
  deleteComment
};
