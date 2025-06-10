const express = require('express');
const { getAllProducts, createProduct } = require('../controllers/productController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', getAllProducts);
router.post('/', authenticateToken, createProduct);

module.exports = router;