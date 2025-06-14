const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const app = express();
const PORT = process.env.PORT || 8080;

// Cloud SQL Configuration
const dbConfig = {
  host: process.env.DB_HOST || '34.101.136.51',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'SecurePassword123!',
  database: process.env.DB_NAME || 'fullstack_ecommerce',
  port: 3306,
  ssl: {
    rejectUnauthorized: false
  },
  connectTimeout: 60000,
  acquireTimeout: 60000,
  timeout: 60000
};

console.log('🔗 Connecting to Cloud SQL:', {
  host: dbConfig.host,
  database: dbConfig.database,
  user: dbConfig.user
});

// Database connection
let db;

// Fallback in-memory data
let users = [
  { id: 1, username: "admin", email: "admin@example.com", createdAt: new Date().toISOString() }
];

let products = [
  { id: 1, name: "Laptop Gaming", price: 15000000, category: "Electronics", description: "High-performance gaming laptop", stock: 10, categoryId: 1 },
  { id: 2, name: "Smartphone", price: 8000000, category: "Electronics", description: "Latest smartphone with advanced features", stock: 25, categoryId: 1 },
  { id: 3, name: "Coffee Maker", price: 2500000, category: "Home & Kitchen", description: "Automatic coffee maker", stock: 15, categoryId: 2 },
  { id: 4, name: "Wireless Headphones", price: 1500000, category: "Electronics", description: "Noise-cancelling wireless headphones", stock: 20, categoryId: 1 },
  { id: 5, name: "Smart Watch", price: 3000000, category: "Electronics", description: "Fitness tracking smart watch", stock: 12, categoryId: 1 },
  { id: 6, name: "Air Fryer", price: 1800000, category: "Home & Kitchen", description: "Modern air fryer for healthy cooking", stock: 8, categoryId: 2 }
];

let categories = [
  { id: 1, name: "Electronics", description: "Electronic devices and gadgets" },
  { id: 2, name: "Home & Kitchen", description: "Home appliances and kitchen tools" },
  { id: 3, name: "Fashion", description: "Clothing and accessories" },
  { id: 4, name: "Sports", description: "Sports equipment and gear" }
];

// Database initialization
async function initDatabase() {
  try {
    db = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to Cloud SQL MySQL');
    
    // Create tables if not exist
    await createTables();
    await seedData();
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    console.log('📝 Using in-memory storage as fallback');
    db = null;
  }
}

async function createTables() {
  try {
    // Create users table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create categories table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create products table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(15,2) NOT NULL,
        category VARCHAR(255) NOT NULL,
        description TEXT,
        stock INT DEFAULT 0,
        image_url VARCHAR(500),
        categoryId INT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (categoryId) REFERENCES categories(id)
      )
    `);

    console.log('✅ Database tables created successfully');
  } catch (error) {
    console.error('❌ Error creating tables:', error);
  }
}

async function seedData() {
  try {
    // Check if data already exists
    const [categoryRows] = await db.execute('SELECT COUNT(*) as count FROM categories');
    if (categoryRows[0].count > 0) {
      console.log('📊 Data already exists, skipping seed');
      return;
    }

    // Insert categories
    const categoriesData = [
      [1, 'Electronics', 'Electronic devices and gadgets'],
      [2, 'Home & Kitchen', 'Home appliances and kitchen tools'],
      [3, 'Fashion', 'Clothing and accessories'],
      [4, 'Sports', 'Sports equipment and gear']
    ];

    for (const category of categoriesData) {
      await db.execute(
        'INSERT INTO categories (id, name, description) VALUES (?, ?, ?)',
        category
      );
    }

    // Insert products
    const productsData = [
      [1, 'Laptop Gaming', 15000000, 'Electronics', 'High-performance gaming laptop', 10, 1],
      [2, 'Smartphone', 8000000, 'Electronics', 'Latest smartphone with advanced features', 25, 1],
      [3, 'Coffee Maker', 2500000, 'Home & Kitchen', 'Automatic coffee maker', 15, 2],
      [4, 'Wireless Headphones', 1500000, 'Electronics', 'Noise-cancelling wireless headphones', 20, 1],
      [5, 'Smart Watch', 3000000, 'Electronics', 'Fitness tracking smart watch', 12, 1],
      [6, 'Air Fryer', 1800000, 'Home & Kitchen', 'Modern air fryer for healthy cooking', 8, 2]
    ];

    for (const product of productsData) {
      await db.execute(
        'INSERT INTO products (id, name, price, category, description, stock, categoryId) VALUES (?, ?, ?, ?, ?, ?, ?)',
        product
      );
    }

    console.log('✅ Database seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
}

// Initialize database
initDatabase();

// UPDATED CORS CONFIGURATION
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'https://ecommerce-frontend-870672317435.asia-southeast2.run.app',
    'https://kelompok12-ecommerce-new.uc.r.appspot.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
}));

// Add explicit OPTIONS handler
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Utility function to generate mock JWT token
const generateToken = (userId) => {
  return `mock-jwt-token-${userId}-${Date.now()}`;
};

// Basic routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Fullstack E-commerce API with Cloud SQL',
    version: '2.0.0',
    status: 'Server is running successfully!',
    environment: process.env.NODE_ENV || 'production',
    port: PORT,
    database: db ? 'Cloud SQL MySQL' : 'In-Memory Storage',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      categories: '/api/categories',
      health: '/health',
      test: '/api/test'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'OK',
    message: 'Server is healthy',
    database: db ? 'Connected to Cloud SQL' : 'Using in-memory storage',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, and password are required'
      });
    }

    if (db) {
      // Use Cloud SQL
      try {
        // Check if user exists
        const [existingUsers] = await db.execute(
          'SELECT * FROM users WHERE email = ? OR username = ?',
          [email, username]
        );

        if (existingUsers.length > 0) {
          return res.status(400).json({
            success: false,
            message: 'User with this email or username already exists'
          });
        }

        // Insert new user
        const [result] = await db.execute(
          'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
          [username, email, password]
        );

        const newUser = {
          id: result.insertId,
          username,
          email,
          createdAt: new Date().toISOString()
        };

        const token = generateToken(newUser.id);

        res.status(201).json({
          success: true,
          message: 'User registered successfully',
          user: newUser,
          token: token
        });
      } catch (dbError) {
        console.error('Database error:', dbError);
        throw dbError;
      }
    } else {
      // Fallback to in-memory storage
      const existingUser = users.find(u => u.email === email || u.username === username);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this email or username already exists'
        });
      }

      const newUser = {
        id: users.length + 1,
        username,
        email,
        createdAt: new Date().toISOString()
      };
      users.push(newUser);

      const token = generateToken(newUser.id);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: newUser,
        token: token
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    if (db) {
      // Use Cloud SQL
      const [userRows] = await db.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      if (userRows.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      const user = userRows[0];
      const token = generateToken(user.id);

      res.json({
        success: true,
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          createdAt: user.createdAt
        },
        token: token
      });
    } else {
      // Fallback to in-memory storage
      const user = users.find(u => u.email === email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      const token = generateToken(user.id);

      res.json({
        success: true,
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          createdAt: user.createdAt
        },
        token: token
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

// Product routes
app.get('/api/products', async (req, res) => {
  try {
    const { category, search, limit } = req.query;

    if (db) {
      // Use Cloud SQL
      let query = 'SELECT * FROM products WHERE 1=1';
      let params = [];

      if (category) {
        query += ' AND category LIKE ?';
        params.push(`%${category}%`);
      }

      if (search) {
        query += ' AND name LIKE ?';
        params.push(`%${search}%`);
      }

      if (limit) {
        query += ' LIMIT ?';
        params.push(parseInt(limit));
      }

      const [rows] = await db.execute(query, params);
      res.json({
        success: true,
        data: rows,
        total: rows.length,
        message: 'Products retrieved successfully from Cloud SQL'
      });
    } else {
      // Fallback to in-memory storage
      let filteredProducts = [...products];
      
      if (category) {
        filteredProducts = filteredProducts.filter(p =>
          p.category.toLowerCase().includes(category.toLowerCase())
        );
      }

      if (search) {
        filteredProducts = filteredProducts.filter(p =>
          p.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      if (limit) {
        filteredProducts = filteredProducts.slice(0, parseInt(limit));
      }

      res.json({
        success: true,
        data: filteredProducts,
        total: filteredProducts.length,
        message: 'Products retrieved successfully from memory'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve products',
      error: error.message
    });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);

    if (db) {
      // Use Cloud SQL
      const [rows] = await db.execute('SELECT * FROM products WHERE id = ?', [productId]);
      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      res.json({
        success: true,
        data: rows[0],
        message: 'Product retrieved successfully from Cloud SQL'
      });
    } else {
      // Fallback to in-memory storage
      const product = products.find(p => p.id === productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      res.json({
        success: true,
        data: product,
        message: 'Product retrieved successfully from memory'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve product',
      error: error.message
    });
  }
});

// Category routes
app.get('/api/categories', async (req, res) => {
  try {
    if (db) {
      // Use Cloud SQL
      const [rows] = await db.execute('SELECT * FROM categories');
      res.json({
        success: true,
        data: rows,
        total: rows.length,
        message: 'Categories retrieved successfully from Cloud SQL'
      });
    } else {
      // Fallback to in-memory storage
      res.json({
        success: true,
        data: categories,
        total: categories.length,
        message: 'Categories retrieved successfully from memory'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve categories',
      error: error.message
    });
  }
});

app.get('/api/categories/:id', async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);

    if (db) {
      // Use Cloud SQL
      const [rows] = await db.execute('SELECT * FROM categories WHERE id = ?', [categoryId]);
      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }
      res.json({
        success: true,
        data: rows[0],
        message: 'Category retrieved successfully from Cloud SQL'
      });
    } else {
      // Fallback to in-memory storage
      const category = categories.find(c => c.id === categoryId);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }
      res.json({
        success: true,
        data: category,
        message: 'Category retrieved successfully from memory'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve category',
      error: error.message
    });
  }
});

// User routes (for profile management)
app.get('/api/users/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    // Extract user ID from mock token
    const userId = parseInt(token.split('-')[3]);

    if (db) {
      // Use Cloud SQL
      const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [userId]);
      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const user = rows[0];
      res.json({
        success: true,
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          createdAt: user.createdAt
        },
        message: 'Profile retrieved successfully from Cloud SQL'
      });
    } else {
      // Fallback to in-memory storage
      const user = users.find(u => u.id === userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          createdAt: user.createdAt
        },
        message: 'Profile retrieved successfully from memory'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile',
      error: error.message
    });
  }
});

// Test route
app.get('/api/test', async (req, res) => {
  try {
    let stats = {
      users: users.length,
      products: products.length,
      categories: categories.length
    };

    if (db) {
      // Get real stats from Cloud SQL
      const [userCount] = await db.execute('SELECT COUNT(*) as count FROM users');
      const [productCount] = await db.execute('SELECT COUNT(*) as count FROM products');
      const [categoryCount] = await db.execute('SELECT COUNT(*) as count FROM categories');
      
      stats = {
        users: userCount[0].count,
        products: productCount[0].count,
        categories: categoryCount[0].count
      };
    }

    res.json({
      success: true,
      message: 'API is working perfectly!',
      data: {
        server: 'Express.js',
        database: db ? 'Cloud SQL MySQL' : 'In-Memory Storage',
        authentication: 'Mock JWT',
        deployment: 'Google Cloud Run',
        cors: 'Enabled',
        endpoints: stats
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Test failed',
      error: error.message
    });
  }
});

// Stats route
app.get('/api/stats', async (req, res) => {
  try {
    let stats = {
      totalUsers: users.length,
      totalProducts: products.length,
      totalCategories: categories.length
    };

    if (db) {
      // Get real stats from Cloud SQL
      const [userCount] = await db.execute('SELECT COUNT(*) as count FROM users');
      const [productCount] = await db.execute('SELECT COUNT(*) as count FROM products');
      const [categoryCount] = await db.execute('SELECT COUNT(*) as count FROM categories');
      
      stats = {
        totalUsers: userCount[0].count,
        totalProducts: productCount[0].count,
        totalCategories: categoryCount[0].count
      };
    }

    res.json({
      success: true,
      data: {
        ...stats,
        serverUptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        database: db ? 'Cloud SQL MySQL' : 'In-Memory Storage'
      },
      message: 'Statistics retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve statistics',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
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
    message: `Route ${req.method} ${req.originalUrl} not found`,
    availableEndpoints: {
      auth: '/api/auth/register, /api/auth/login',
      products: '/api/products, /api/products/:id',
      categories: '/api/categories, /api/categories/:id',
      user: '/api/users/profile',
      utility: '/health, /api/test, /api/stats'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`🗄️  Database: ${db ? 'Cloud SQL MySQL' : 'In-Memory Storage (Fallback)'}`);
  console.log(`🌐 CORS enabled for frontend domains`);
  console.log(`✅ Server started successfully`);
  console.log(`📚 API Documentation available at: http://localhost:${PORT}`);
});