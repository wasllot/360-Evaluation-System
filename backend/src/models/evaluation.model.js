const mongoose = require('mongoose');

const criteriaSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['technical_skills', 'soft_skills', 'leadership', 'productivity', 'teamwork']
  },
  name: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String
  }
});

const evaluationSchema = new mongoose.Schema({
  template: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template',
    required: true
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  evaluator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  period: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed'],
    default: 'pending'
  },
  type: {
    type: String,
    enum: ['self', 'peer', 'manager'],
    required: true
  },
  criteria: [criteriaSchema],
  overallScore: {
    type: Number,
    min: 1,
    max: 5
  },
  generalComments: {
    type: String
  },
  strengthAreas: [String],
  improvementAreas: [String],
  submittedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Calculate overall score before saving
evaluationSchema.pre('save', function(next) {
  if (this.criteria && this.criteria.length > 0) {
    const totalScore = this.criteria.reduce((sum, criterion) => sum + criterion.score, 0);
    this.overallScore = parseFloat((totalScore / this.criteria.length).toFixed(2));
  }
  next();
});

module.exports = mongoose.model('Evaluation', evaluationSchema);
