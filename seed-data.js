const { Category, Product, sequelize } = require('./src/models');

async function seedData() {
  try {
    // Seed Categories
    const categories = await Category.bulkCreate([
      { name: 'Electronics', description: 'Gadgets, devices, and electronic accessories.' },
      { name: 'Clothing', description: 'Fashion apparel for men, women, and children.' },
      { name: 'Home & Kitchen', description: 'Essentials for your home and kitchen needs.' },
      { name: 'Books', description: 'A wide range of books from various genres.' },
      { name: 'Sports & Outdoors', description: 'Equipment and gear for sports and outdoor activities.' }
    ]);

    console.log('Categories created:', categories.length);

    // Seed Products
    const products = await Product.bulkCreate([
      { name: 'Smartphone X', description: 'Latest model smartphone with advanced features.', price: 799.99, stock: 50, categoryId: 1 },
      { name: 'Laptop Pro', description: 'High-performance laptop for professionals.', price: 1200.00, stock: 30, categoryId: 1 },
      { name: 'Wireless Earbuds', description: 'Premium sound quality with noise cancellation.', price: 129.99, stock: 100, categoryId: 1 },
      { name: 'Men\'s T-Shirt', description: 'Comfortable cotton t-shirt for everyday wear.', price: 25.00, stock: 200, categoryId: 2 },
      { name: 'Women\'s Jeans', description: 'Stylish denim jeans for women.', price: 55.00, stock: 150, categoryId: 2 },
      { name: 'Coffee Maker', description: 'Automatic coffee maker with programmable settings.', price: 89.99, stock: 75, categoryId: 3 },
      { name: 'Blender Pro', description: 'Powerful blender for smoothies and shakes.', price: 65.50, stock: 60, categoryId: 3 },
      { name: 'The Great Novel', description: 'A captivating story that will keep you hooked.', price: 15.99, stock: 300, categoryId: 4 },
      { name: 'Yoga Mat', description: 'Non-slip yoga mat for all types of yoga.', price: 30.00, stock: 120, categoryId: 5 },
      { name: 'Camping Tent', description: 'Spacious tent for 2-3 people, easy to set up.', price: 150.00, stock: 40, categoryId: 5 }
    ]);

    console.log('Products created:', products.length);
    console.log('Seeding completed successfully!');
    
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await sequelize.close();
  }
}

seedData();