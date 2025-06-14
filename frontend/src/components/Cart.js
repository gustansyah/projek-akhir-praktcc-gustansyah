import React from 'react';
import { useCart } from '../contexts/CartContext';
import './Cart.css';

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    isCartOpen,
    toggleCart
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="cart-overlay" onClick={toggleCart}>
      <div className="cart-sidebar" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2>Shopping Cart</h2>
          <button className="cart-close" onClick={toggleCart}>
            ✕
          </button>
        </div>

        <div className="cart-content">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <p>Your cart is empty</p>
              <button className="btn-primary" onClick={toggleCart}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map(item => (
                  <div key={item.id} className="cart-item">
                    {item.imageUrl && (
                      <img 
                        src={item.imageUrl} 
                        alt={item.name}
                        className="cart-item-image"
                      />
                    )}
                    <div className="cart-item-details">
                      <h4>{item.name}</h4>
                      <p className="cart-item-category">{item.Category?.name}</p>
                      <p className="cart-item-price">${item.price}</p>
                    </div>
                    <div className="cart-item-controls">
                      <div className="quantity-controls">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="quantity-btn"
                        >
                          -
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="quantity-btn"
                        >
                          +
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="remove-btn"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-footer">
                <div className="cart-total">
                  <h3>Total: ${getCartTotal().toFixed(2)}</h3>
                </div>
                <div className="cart-actions">
                  <button 
                    onClick={clearCart}
                    className="btn-secondary"
                  >
                    Clear Cart
                  </button>
                  <button className="btn-primary">
                    Checkout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;