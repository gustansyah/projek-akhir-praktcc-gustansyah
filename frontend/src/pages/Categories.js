import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/categories');
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading categories...</div>;
  }

  return (
    <div className="categories-page">
      <div className="page-header">
        <h1>Product Categories</h1>
        <p>Explore our different product categories</p>
      </div>
      
      {categories.length > 0 ? (
        <div className="categories-grid">
          {categories.map(category => (
            <div key={category.id} className="category-card large">
              <h3>{category.name}</h3>
              <p>{category.description}</p>
              <div className="category-meta">
                <p>Created: {new Date(category.createdAt).toLocaleDateString()}</p>
                <button className="btn-primary">Browse Products</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-categories">
          <p>No categories found.</p>
        </div>
      )}
    </div>
  );
};

export default Categories;