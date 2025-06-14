const { Product, Category } = require('./models');

const seedData = async () => {
  try {
    // Clear existing data
    await Product.destroy({ where: {} });
    await Category.destroy({ where: {} });

    // Create categories
    const categories = await Category.bulkCreate([
      {
        name: 'Electronics',
        description: 'Electronic devices and gadgets'
      },
      {
        name: 'Home & Kitchen',
        description: 'Home appliances and kitchen tools'
      },
      {
        name: 'Fashion',
        description: 'Clothing and accessories'
      }
    ]);

    // Create products with realistic prices and images
    const products = await Product.bulkCreate([
      {
        name: 'Laptop Gaming',
        description: 'High-performance gaming laptop with RTX 4060',
        price: 15000000, // 15 juta rupiah
        stock: 10,
        image_url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=300&fit=crop',
        categoryId: categories[0].id
      },
      {
        name: 'Smartphone',
        description: 'Latest smartphone with advanced camera features',
        price: 8000000, // 8 juta rupiah
        stock: 25,
        image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
        categoryId: categories[0].id
      },
      {
        name: 'Coffee Maker',
        description: 'Automatic drip coffee maker for perfect brew',
        price: 2500000, // 2.5 juta rupiah
        stock: 15,
        image_url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
        categoryId: categories[1].id
      },
      {
        name: 'Wireless Headphones',
        description: 'Premium noise-cancelling wireless headphones',
        price: 1500000, // 1.5 juta rupiah
        stock: 20,
        image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
        categoryId: categories[0].id
      },
      {
        name: 'Smart Watch',
        description: 'Fitness tracking smart watch with heart rate monitor',
        price: 3000000, // 3 juta rupiah
        stock: 12,
        image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
        categoryId: categories[0].id
      },
      {
        name: 'Air Fryer',
        description: 'Healthy cooking with oil-free air fryer',
        price: 1200000, // 1.2 juta rupiah
        stock: 18,
        image_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
        categoryId: categories[1].id
      }
    ]);

    console.log('✅ Sample data created successfully!');
    console.log(`📦 Created ${categories.length} categories`);
    console.log(`🛍️ Created ${products.length} products`);
    
  } catch (error) {
    console.error('❌ Error creating sample data:', error);
  }
};

module.exports = seedData;