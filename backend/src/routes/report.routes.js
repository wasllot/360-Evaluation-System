const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/error.middleware');
const { authenticateToken, authorize } = require('../middleware/auth.middleware');
const Evaluation = require('../models/evaluation.model');
const User = require('../models/user.model');

// Helper function to calculate average ratings
const calculateAverageRatings = (evaluations) => {
  const ratings = evaluations.reduce((acc, evaluation) => {
    evaluation.responses.forEach(response => {
      if (!acc[response.questionId]) {
        acc[response.questionId] = {
          total: 0,
          count: 0,
          ratings: []
        };
      }
      acc[response.questionId].total += response.rating;
      acc[response.questionId].count += 1;
      acc[response.questionId].ratings.push(response.rating);
    });
    return acc;
  }, {});

  return Object.entries(ratings).map(([questionId, data]) => ({
    questionId,
    averageRating: data.total / data.count,
    totalResponses: data.count,
    ratings: data.ratings,
    distribution: data.ratings.reduce((dist, rating) => {
      dist[rating] = (dist[rating] || 0) + 1;
      return dist;
    }, {})
  }));
};

// Get employee report
router.get('/employee/:id', 
  authenticateToken,
  asyncHandler(async (req, res) => {
    // Check authorization
    if (req.user._id.toString() !== req.params.id && 
        req.user.role !== 'admin' && 
        req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Not authorized to view this report' });
    }

    const employee = await User.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Get all evaluations for the employee
    const evaluations = await Evaluation.find({ 
      employee: req.params.id,
      status: 'completed'
    })
    .populate('evaluator', 'name role department')
    .populate('template', 'name description questions');

    // Calculate metrics
    const averageRatings = calculateAverageRatings(evaluations);
    
    // Calculate overall statistics
    const overallStats = {
      totalEvaluations: evaluations.length,
      completedEvaluations: evaluations.filter(e => e.status === 'completed').length,
      averageOverallRating: averageRatings.find(r => r.questionId === 'overall')?.averageRating || 0,
      departmentAverage: 0, // To be implemented with department comparison
      lastEvaluationDate: evaluations.length > 0 ? 
        evaluations.sort((a, b) => b.updatedAt - a.updatedAt)[0].updatedAt : 
        null
    };

    // Prepare evaluation timeline
    const timeline = evaluations.map(eval => ({
      id: eval._id,
      date: eval.updatedAt,
      evaluator: eval.evaluator,
      template: eval.template.name,
      averageRating: eval.responses.reduce((acc, r) => acc + r.rating, 0) / eval.responses.length
    }));

    // Prepare detailed feedback
    const feedback = evaluations.map(eval => ({
      id: eval._id,
      date: eval.updatedAt,
      evaluator: eval.evaluator,
      feedback: eval.feedback,
      responses: eval.responses
    }));

    res.json({
      employee: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        department: employee.department,
        position: employee.position
      },
      statistics: overallStats,
      ratings: averageRatings,
      timeline,
      feedback,
      evaluations: evaluations.map(eval => ({
        id: eval._id,
        date: eval.updatedAt,
        template: eval.template.name,
        evaluator: eval.evaluator,
        status: eval.status
      }))
    });
}));

// Get department report
router.get('/department/:department',
  authenticateToken,
  authorize(['admin', 'manager']),
  asyncHandler(async (req, res) => {
    const { department } = req.params;
    
    // Get all employees in department
    const employees = await User.find({ department });
    
    // Get all completed evaluations for department employees
    const evaluations = await Evaluation.find({
      employee: { $in: employees.map(e => e._id) },
      status: 'completed'
    })
    .populate('employee', 'name position')
    .populate('evaluator', 'name role');

    // Calculate department metrics
    const departmentStats = {
      totalEmployees: employees.length,
      totalEvaluations: evaluations.length,
      averageRating: calculateAverageRatings(evaluations)
        .find(r => r.questionId === 'overall')?.averageRating || 0,
      evaluationCompletion: {
        completed: evaluations.length,
        pending: await Evaluation.countDocuments({
          employee: { $in: employees.map(e => e._id) },
          status: 'pending'
        })
      }
    };

    // Calculate individual employee stats
    const employeeStats = await Promise.all(employees.map(async employee => {
      const employeeEvals = evaluations.filter(e => 
        e.employee._id.toString() === employee._id.toString()
      );
      
      return {
        employee: {
          id: employee._id,
          name: employee.name,
          position: employee.position
        },
        evaluations: employeeEvals.length,
        averageRating: employeeEvals.length > 0 ?
          employeeEvals.reduce((acc, eval) => 
            acc + (eval.responses.reduce((sum, r) => sum + r.rating, 0) / eval.responses.length)
          , 0) / employeeEvals.length : 0
      };
    }));

    res.json({
      department,
      statistics: departmentStats,
      employees: employeeStats,
      recentEvaluations: evaluations
        .sort((a, b) => b.updatedAt - a.updatedAt)
        .slice(0, 10)
        .map(eval => ({
          id: eval._id,
          employee: eval.employee,
          evaluator: eval.evaluator,
          date: eval.updatedAt,
          averageRating: eval.responses.reduce((acc, r) => acc + r.rating, 0) / eval.responses.length
        }))
    });
}));

module.exports = router;
