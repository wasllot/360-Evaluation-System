const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/error.middleware');
const { authenticateToken, authorize } = require('../middleware/auth.middleware');
const Template = require('../models/template.model');

// Get all templates
router.get(
  '/',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const templates = await Template.find({ isActive: true })
      .populate('createdBy', 'firstName lastName')
      .sort('-createdAt');
    res.json(templates);
  })
);

// Create new template (admin only)
router.post(
  '/',
  authenticateToken,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const { name, description, categories } = req.body;

    // Validate required fields
    if (!name || !categories || categories.length === 0) {
      return res.status(400).json({
        message: 'Name and at least one category are required'
      });
    }

    // Create template
    const template = new Template({
      name,
      description,
      categories,
      createdBy: req.user._id
    });

    await template.save();

    res.status(201).json({
      message: 'Template created successfully',
      template: {
        _id: template._id,
        name: template.name,
        description: template.description,
        categories: template.categories,
        createdBy: {
          _id: req.user._id,
          firstName: req.user.firstName,
          lastName: req.user.lastName
        },
        createdAt: template.createdAt
      }
    });
  })
);

// Get template by ID
router.get(
  '/:id',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const template = await Template.findOne({
      _id: req.params.id,
      isActive: true
    }).populate('createdBy', 'firstName lastName');

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    res.json(template);
  })
);

// Update template (admin only)
router.put(
  '/:id',
  authenticateToken,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const { name, description, categories } = req.body;
    const template = await Template.findById(req.params.id);

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    // Validate required fields
    if (!name || !categories || categories.length === 0) {
      return res.status(400).json({
        message: 'Name and at least one category are required'
      });
    }

    // Update fields
    template.name = name;
    template.description = description;
    template.categories = categories;

    await template.save();

    res.json({
      message: 'Template updated successfully',
      template: {
        _id: template._id,
        name: template.name,
        description: template.description,
        categories: template.categories,
        createdBy: {
          _id: template.createdBy._id,
          firstName: template.createdBy.firstName,
          lastName: template.createdBy.lastName
        },
        createdAt: template.createdAt,
        updatedAt: template.updatedAt
      }
    });
  })
);

// Delete template (admin only)
router.delete(
  '/:id',
  authenticateToken,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const template = await Template.findById(req.params.id);

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    // Soft delete
    template.isActive = false;
    await template.save();

    res.json({ message: 'Template deleted successfully' });
  })
);

module.exports = router;
