const { Product, Category } = require('../models');

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{ 
        model: Category, 
        attributes: ['id', 'name'] 
      }],
      where: { isActive: true }
    });
    
    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch products', 
      error: error.message 
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, categoryId, imageUrl } = req.body;
    
    if (!name || !price || !categoryId) {
      return res.status(400).json({ 
        success: false,
        message: 'Name, price, and categoryId are required' 
      });
    }

    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(400).json({ 
        success: false,
        message: 'Category not found' 
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      stock: stock || 0,
      categoryId,
      imageUrl
    });

    const createdProduct = await Product.findByPk(product.id, {
      include: [{ model: Category, attributes: ['id', 'name'] }]
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: createdProduct
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to create product', 
      error: error.message 
    });
  }
};

module.exports = {
  getAllProducts,
  createProduct
};