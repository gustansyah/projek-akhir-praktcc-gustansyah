const { Sequelize } = require('sequelize');
require('dotenv').config(); // Pastikan ini ada untuk membaca .env di lokal

// Cloud SQL connection configuration
const isProduction = process.env.NODE_ENV === 'production';

let sequelize;

if (isProduction) {
  // Konfigurasi untuk produksi di Google Cloud Run
  // Cloud Run akan menyediakan DB_SOCKET_PATH melalui --add-cloudsql-instances
  // DB_HOST_PROD tidak diperlukan jika menggunakan socketPath
  sequelize = new Sequelize(
    process.env.DB_NAME_PROD,       // Nama database di Cloud SQL
    process.env.DB_USER_PROD,       // Username database di Cloud SQL
    process.env.DB_PASSWORD_PROD,   // Password database di Cloud SQL
    {
      dialect: 'mysql',
      logging: false,
      timezone: '+07:00', // Sesuaikan dengan zona waktu Anda
      dialectOptions: {
        // Penting: socketPath akan otomatis diset oleh Cloud Run jika --add-cloudsql-instances digunakan
        // Formatnya: /cloudsql/PROJECT_ID:REGION:INSTANCE_ID
        socketPath: process.env.DB_SOCKET_PATH // Ini akan diset oleh Cloud Run
      },
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
} else {
  // Konfigurasi untuk development lokal
  sequelize = new Sequelize(
    process.env.DB_NAME || 'fullstack_ecommerce', // Nama database lokal
    process.env.DB_USER || 'root',                // Username database lokal
    process.env.DB_PASSWORD || '',                // Password database lokal
    {
      host: process.env.DB_HOST || 'localhost',   // Host database lokal
      dialect: 'mysql',
      logging: false,
      timezone: '+07:00', // Sesuaikan dengan zona waktu Anda
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
}

// Import models
const User = require('./User')(sequelize);
const Product = require('./Product')(sequelize);
const Category = require('./Category')(sequelize);

// Define associations
Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

// Test database connection (fungsi ini dipanggil di server.js)
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1); // Keluar jika koneksi gagal
  }
};

module.exports = {
  sequelize,
  User,
  Product,
  Category,
  testConnection // Tetap export jika server.js memanggilnya
};