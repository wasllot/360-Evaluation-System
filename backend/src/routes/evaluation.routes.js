const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { asyncHandler } = require('../middleware/error.middleware');
const { authenticateToken, authorize } = require('../middleware/auth.middleware');
const Evaluation = require('../models/evaluation.model');
const User = require('../models/user.model');

// Validation middleware
const evaluationValidation = [
  body('employee').isMongoId().withMessage('Valid employee ID is required'),
  body('type').isIn(['self', 'peer', 'manager']).withMessage('Valid evaluation type is required'),
  body('criteria.*.category').isIn(['technical_skills', 'soft_skills', 'leadership', 'productivity', 'teamwork']).withMessage('Valid category is required'),
  body('criteria.*.score').isInt({ min: 1, max: 5 }).withMessage('Score must be between 1 and 5'),
  body('criteria.*.comment').optional().isString().trim(),
];

// Get all evaluations
router.get('/', authenticateToken, asyncHandler(async (req, res) => {
  const evaluations = await Evaluation.find()
    .populate('employee', 'firstName lastName email department')
    .populate('evaluator', 'firstName lastName email');
  res.json(evaluations);
}));

// Get evaluation by id
router.get('/:id', authenticateToken, asyncHandler(async (req, res) => {
  const evaluation = await Evaluation.findById(req.params.id)
    .populate('employee', 'firstName lastName email department')
    .populate('evaluator', 'firstName lastName email')
    .populate('template', 'name description questions');
  
  if (!evaluation) {
    return res.status(404).json({ message: 'Evaluation not found' });
  }
  res.json(evaluation);
}));

// Get evaluations by employee id
router.get('/employee/:id', authenticateToken, asyncHandler(async (req, res) => {
  const evaluations = await Evaluation.find({ employee: req.params.id })
    .populate('evaluator', 'firstName lastName email');
  res.json(evaluations);
}));

// Create new evaluation
router.post('/', 
  authenticateToken, 
  evaluationValidation,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const evaluation = new Evaluation({
      ...req.body,
      evaluator: req.user._id,
      status: 'pending'
    });

    await evaluation.save();
    res.status(201).json(evaluation);
}));

// Update evaluation
router.put('/:id', 
  authenticateToken,
  evaluationValidation,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const evaluation = await Evaluation.findById(req.params.id);
    if (!evaluation) {
      return res.status(404).json({ message: 'Evaluation not found' });
    }

    // Only allow updates if user is the evaluator or an admin
    if (evaluation.evaluator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this evaluation' });
    }

    const updatedEvaluation = await Evaluation.findByIdAndUpdate(
      req.params.id,
      { 
        ...req.body,
        status: req.body.responses?.length > 0 ? 'completed' : 'in_progress',
        updatedAt: Date.now()
      },
      { new: true }
    );

    res.json(updatedEvaluation);
}));

module.exports = router;
