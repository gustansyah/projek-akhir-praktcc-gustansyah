const { Sequelize } = require('sequelize');
require('dotenv').config();

// Cloud SQL connection configuration
const isProduction = process.env.NODE_ENV === 'production';

const sequelize = new Sequelize(
  process.env.DB_NAME || 'fullstack_ecommerce',
  process.env.DB_USER || (isProduction ? 'appuser' : 'root'),
  process.env.DB_PASSWORD || (isProduction ? 'AppUser123Pass' : ''),
  {
    host: isProduction 
      ? `/cloudsql/prak-g-kelompok12:us-central1:fullstack-ecommerce-db`
      : 'localhost',
    dialect: 'mysql',
    logging: false,
    dialectOptions: isProduction ? {
      socketPath: `/cloudsql/prak-g-kelompok12:us-central1:fullstack-ecommerce-db`
    } : {},
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Import models
const User = require('./User')(sequelize);
const Product = require('./Product')(sequelize);
const Category = require('./Category')(sequelize);

// Define associations
Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

module.exports = {
  sequelize,
  User,
  Product,
  Category,
  testConnection
};