const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import database models
const { sequelize, testConnection } = require('./models');

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');

// Import seed data
const seedData = require('./seedData');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Fullstack E-commerce API',
    version: '1.0.0',
    status: 'Server is running successfully!',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      categories: '/api/categories',
      health: '/health',
      dbTest: '/db-test'
    }
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'OK',
    message: 'Server is healthy'
  });
});

// Test database connection route
app.get('/db-test', async (req, res) => {
  try {
    const { Sequelize } = require('sequelize');
    const sequelize = new Sequelize(
      process.env.DB_NAME || 'fullstack_ecommerce',
      process.env.DB_USER || 'root',
      process.env.DB_PASSWORD || '',
      {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        logging: false
      }
    );
    await sequelize.authenticate();
    await sequelize.close();
    res.json({
      success: true,
      message: 'Database connection successful!',
      database: process.env.DB_NAME || 'fullstack_ecommerce',
      host: process.env.DB_HOST || 'localhost'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Database connection and server start
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    
    // Sync database (create tables)
    await sequelize.sync({ force: true }); // force: true akan recreate tables
    console.log('✅ Database synchronized successfully');
    console.log('📋 Tables created: users, categories, products');
    
    // Add sample data with images and realistic prices
    await seedData();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Visit: http://localhost:${PORT}`);
      console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📚 API Endpoints:`);
      console.log(`   Auth: http://localhost:${PORT}/api/auth`);
      console.log(`   Products: http://localhost:${PORT}/api/products`);
      console.log(`   Categories: http://localhost:${PORT}/api/categories`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error.message);
    console.log('💡 Make sure MySQL is running and database models are correct');
  }
};

startServer();