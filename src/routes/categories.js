const express = require('express');
const { getAllCategories, createCategory } = require('../controllers/categoryController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', getAllCategories);
router.post('/', authenticateToken, createCategory);

module.exports = router;