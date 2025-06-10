const { Category } = require('../models');

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { isActive: true }
    });
    
    res.json({
      success: true,
      count: categories.length,
      categories
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch categories', 
      error: error.message 
    });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ 
        success: false,
        message: 'Category name is required' 
      });
    }

    const existingCategory = await Category.findOne({ where: { name } });
    if (existingCategory) {
      return res.status(400).json({ 
        success: false,
        message: 'Category with this name already exists' 
      });
    }

    const category = await Category.create({ name, description });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to create category', 
      error: error.message 
    });
  }
};

module.exports = {
  getAllCategories,
  createCategory
};