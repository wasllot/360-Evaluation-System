import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  evaluationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Evaluation',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  parentCommentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for faster queries
commentSchema.index({ evaluationId: 1, createdAt: -1 });
commentSchema.index({ parentCommentId: 1 });

// Middleware to update updatedAt field
commentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
