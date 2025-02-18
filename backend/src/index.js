import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import 'dotenv/config';

import authRoutes from './routes/auth.routes.js';
import employeeRoutes from './routes/employee.routes.js';
import evaluationRoutes from './routes/evaluation.routes.js';
import feedbackRoutes from './routes/feedback.routes.js';
import reportRoutes from './routes/report.routes.js';
import templateRoutes from './routes/template.routes.js';
import commentRoutes from './routes/comment.routes.js';

import { errorHandler } from './middleware/error.middleware.js';

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api', commentRoutes);
app.use('/api/templates', templateRoutes);

// Error handling
app.use(errorHandler);

// Database connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
