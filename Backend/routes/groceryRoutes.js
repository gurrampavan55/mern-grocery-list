const express = require('express');
const router = express.Router();
const GroceryItem = require('../models/GroceryItem');

// GET all items
router.get('/', async (req, res) => {
  try {
    const items = await GroceryItem.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: items
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET single item
router.get('/:id', async (req, res) => {
  try {
    const item = await GroceryItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }
    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// CREATE new item
router.post('/', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Please provide item text'
      });
    }

    const item = await GroceryItem.create({ text });
    res.status(201).json({
      success: true,
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// UPDATE item
router.put('/:id', async (req, res) => {
  try {
    const { text, completed } = req.body;

    const item = await GroceryItem.findByIdAndUpdate(
      req.params.id,
      { text, completed },
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// DELETE item
router.delete('/:id', async (req, res) => {
  try {
    const item = await GroceryItem.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Item deleted successfully',
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
