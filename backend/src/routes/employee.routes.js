const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { asyncHandler } = require('../middleware/error.middleware');
const { authenticateToken, authorize } = require('../middleware/auth.middleware');
const User = require('../models/user.model');

// Validation middleware
const employeeValidation = [
  body('firstName').isString().trim().notEmpty().withMessage('First name is required'),
  body('lastName').isString().trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('department').isString().trim().notEmpty().withMessage('Department is required'),
  body('role').optional().isIn(['admin', 'manager', 'employee']).withMessage('Invalid role')
];

// Get all employees
router.get('/', 
  authenticateToken,
  asyncHandler(async (req, res) => {
    const query = {};
    
    // Filter by department if specified
    if (req.query.department) {
      query.department = req.query.department;
    }

    // Filter by role if specified
    if (req.query.role) {
      query.role = req.query.role;
    }

    // If manager, only show employees in their department
    if (req.user.role === 'manager') {
      query.department = req.user.department;
    }

    const employees = await User.find(query)
      .select('-password')
      .sort({ department: 1, name: 1 });

    res.json(employees);
}));

// Get employee by ID
router.get('/:id',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const employee = await User.findById(req.params.id).select('-password');
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Check authorization
    if (req.user.role !== 'admin' && 
        req.user.role !== 'manager' && 
        req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized to view this employee' });
    }

    // If manager, can only view employees in their department
    if (req.user.role === 'manager' && employee.department !== req.user.department) {
      return res.status(403).json({ message: 'Not authorized to view employees from other departments' });
    }

    res.json(employee);
}));

// Create new employee (Admin only)
router.post('/',
  authenticateToken,
  authorize(['admin']),
  employeeValidation,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const employee = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password, // Will be hashed in user model pre-save
      department: req.body.department,
      role: req.body.role || 'employee'
    });

    await employee.save();
    
    const employeeResponse = employee.toObject();
    delete employeeResponse.password;
    
    res.status(201).json(employeeResponse);
}));

// Update employee
router.put('/:id',
  authenticateToken,
  employeeValidation,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const employee = await User.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Check authorization
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized to update this employee' });
    }

    // If not admin, cannot change role or department
    if (req.user.role !== 'admin') {
      delete req.body.role;
      delete req.body.department;
    }

    // Check if email is being changed and if it's already taken
    if (req.body.email && req.body.email !== employee.email) {
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }
    }

    const updatedEmployee = await User.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updatedAt: Date.now()
      },
      { new: true }
    ).select('-password');

    res.json(updatedEmployee);
}));

// Get employees by department
router.get('/department/:department',
  authenticateToken,
  authorize(['admin', 'manager']),
  asyncHandler(async (req, res) => {
    // If manager, can only view their own department
    if (req.user.role === 'manager' && req.params.department !== req.user.department) {
      return res.status(403).json({ message: 'Not authorized to view employees from other departments' });
    }

    const employees = await User.find({ department: req.params.department })
      .select('-password')
      .sort({ name: 1 });

    res.json(employees);
}));

// Get department statistics
router.get('/department/:department/stats',
  authenticateToken,
  authorize(['admin', 'manager']),
  asyncHandler(async (req, res) => {
    // If manager, can only view their own department
    if (req.user.role === 'manager' && req.params.department !== req.user.department) {
      return res.status(403).json({ message: 'Not authorized to view other department statistics' });
    }

    const stats = await User.aggregate([
      { $match: { department: req.params.department } },
      { $group: {
        _id: '$department',
        totalEmployees: { $sum: 1 },
        roles: {
          $push: '$role'
        }
      }},
      { $addFields: {
        managers: {
          $size: {
            $filter: {
              input: '$roles',
              as: 'role',
              cond: { $eq: ['$$role', 'manager'] }
            }
          }
        },
        employees: {
          $size: {
            $filter: {
              input: '$roles',
              as: 'role',
              cond: { $eq: ['$$role', 'employee'] }
            }
          }
        }
      }}
    ]);

    if (stats.length === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.json(stats[0]);
}));

module.exports = router;
