import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const { getCartItemsCount, toggleCart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          🛒 E-commerce Store
        </Link>
        
        <div className="nav-menu">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/products" className="nav-link">Products</Link>
          <Link to="/categories" className="nav-link">Categories</Link>
          
          {/* Cart Button */}
          <button onClick={toggleCart} className="cart-button">
            🛒 Cart ({getCartItemsCount()})
          </button>
          
          {currentUser ? (
            <div className="nav-user">
              <span className="nav-welcome">Welcome, {currentUser.username}!</span>
              <button onClick={handleLogout} className="nav-button">Logout</button>
            </div>
          ) : (
            <div className="nav-auth">
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;