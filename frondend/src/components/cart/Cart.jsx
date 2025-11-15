import React from 'react';
import { IoClose } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import './Cart.css';

const Cart = ({ isOpen, onClose, cartItems = [] }) => {
  // Calculate subtotal
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="cart-header">
        <h2>Shopping cart</h2>
        <button className="close-btn" onClick={onClose}>
          <IoClose size={24} />
          Close
        </button>
      </div>

      <div className="cart-items">
        {cartItems.length === 0 ? (
          <div className="empty-cart">Your cart is empty</div>
        ) : (
          cartItems.map((item, index) => (
            <div className="cart-item" key={index}>
              <div className="item-image">
                <img src={item.image} alt={item.name} />
                <button className="remove-item">×</button>
              </div>
              <div className="item-details">
                <h4>{item.name}</h4>
                <div className="item-meta">{item.quantity} × ${item.price.toFixed(2)}</div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="cart-footer">
        <div className="subtotal">
          <span>Subtotal:</span>
          <span className="subtotal-amount">${subtotal.toFixed(2)}</span>
        </div>
          <Link to="/checkout" onClick={onClose}>
            <button className="view-cart-btn">VIEW CART</button>
          </Link>
        <div className="cart-actions">
          <Link to="/cart/checkout-info" onClick={onClose}>
            <button className="checkout-btn">CHECKOUT</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
