const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { asyncHandler } = require('../middleware/error.middleware');
const { authenticateToken, authorize } = require('../middleware/auth.middleware');
const Evaluation = require('../models/evaluation.model');

// Validation middleware
const feedbackValidation = [
  body('evaluationId').isMongoId().withMessage('Valid evaluation ID is required'),
  body('feedback').isString().trim().notEmpty().withMessage('Feedback content is required'),
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
];

// Submit feedback for an evaluation
router.post('/', 
  authenticateToken,
  feedbackValidation,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { evaluationId, feedback, rating } = req.body;

    // Find the evaluation
    const evaluation = await Evaluation.findById(evaluationId);
    if (!evaluation) {
      return res.status(404).json({ message: 'Evaluation not found' });
    }

    // Check if user is authorized to provide feedback
    if (evaluation.evaluator.toString() !== req.user._id.toString() && 
        evaluation.employee.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to provide feedback for this evaluation' });
    }

    // Add feedback to evaluation
    evaluation.feedback = feedback;
    if (rating) {
      evaluation.responses.push({
        questionId: 'overall',
        rating: rating,
        comment: feedback
      });
    }
    evaluation.updatedAt = Date.now();

    await evaluation.save();
    res.json(evaluation);
}));

// Get feedback for an evaluation
router.get('/:evaluationId',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const evaluation = await Evaluation.findById(req.params.evaluationId)
      .select('feedback responses')
      .populate('employee', 'name email')
      .populate('evaluator', 'name email');

    if (!evaluation) {
      return res.status(404).json({ message: 'Evaluation not found' });
    }

    // Check if user is authorized to view feedback
    if (evaluation.evaluator.toString() !== req.user._id.toString() && 
        evaluation.employee.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin' &&
        req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Not authorized to view this feedback' });
    }

    res.json({
      feedback: evaluation.feedback,
      responses: evaluation.responses,
      employee: evaluation.employee,
      evaluator: evaluation.evaluator
    });
}));

// Update feedback
router.put('/:evaluationId',
  authenticateToken,
  feedbackValidation,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { feedback, rating } = req.body;
    const evaluation = await Evaluation.findById(req.params.evaluationId);

    if (!evaluation) {
      return res.status(404).json({ message: 'Evaluation not found' });
    }

    // Check if user is authorized to update feedback
    if (evaluation.evaluator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this feedback' });
    }

    evaluation.feedback = feedback;
    if (rating) {
      // Update or add overall rating
      const overallRatingIndex = evaluation.responses.findIndex(r => r.questionId === 'overall');
      if (overallRatingIndex >= 0) {
        evaluation.responses[overallRatingIndex].rating = rating;
        evaluation.responses[overallRatingIndex].comment = feedback;
      } else {
        evaluation.responses.push({
          questionId: 'overall',
          rating: rating,
          comment: feedback
        });
      }
    }
    evaluation.updatedAt = Date.now();

    await evaluation.save();
    res.json(evaluation);
}));

module.exports = router;
