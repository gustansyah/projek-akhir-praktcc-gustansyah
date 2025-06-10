import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        axios.get('http://localhost:3000/api/products'),
        axios.get('http://localhost:3000/api/categories')
      ]);
      
      setProducts(productsRes.data.products.slice(0, 4)); // Show first 4 products
      setCategories(categoriesRes.data.categories);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home">
      <div className="hero">
        <h1>Welcome to E-commerce Store</h1>
        <p>Discover amazing products at great prices</p>
        <div className="hero-stats">
          <div className="stat">
            <h3>{categories.length}</h3>
            <p>Categories</p>
          </div>
          <div className="stat">
            <h3>{products.length}+</h3>
            <p>Products</p>
          </div>
        </div>
      </div>

      <section className="featured-categories">
        <h2>Shop by Category</h2>
        <div className="categories-grid">
          {categories.map(category => (
            <div key={category.id} className="category-card">
              <h3>{category.name}</h3>
              <p>{category.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="featured-products">
        <h2>Featured Products</h2>
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              {product.imageUrl && (
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="product-image"
                />
              )}
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <p className="product-price">${product.price}</p>
                <p className="product-category">
                  Category: {product.Category?.name}
                </p>
                <p className="product-stock">Stock: {product.stock}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;