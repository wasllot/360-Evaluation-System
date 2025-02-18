const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// Verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Authentication token is required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Role-based authorization
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'You do not have permission to perform this action' 
      });
    }

    next();
  };
};

// Check if user is evaluating themselves
const isSelfEvaluation = (req, res, next) => {
  const evaluationId = req.params.id;
  const userId = req.user._id;

  if (evaluationId !== userId.toString()) {
    return res.status(403).json({ 
      message: 'You can only access your own evaluation' 
    });
  }

  next();
};

// Check if user is a manager of the employee
const isManager = async (req, res, next) => {
  try {
    const employeeId = req.params.id;
    const managerId = req.user._id;

    const employee = await User.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Add your logic here to check if the user is a manager of the employee
    // This might involve checking department, reporting structure, etc.

    next();
  } catch (error) {
    return res.status(500).json({ message: 'Error checking manager status' });
  }
};

module.exports = {
  authenticateToken,
  authorize,
  isSelfEvaluation,
  isManager
};
