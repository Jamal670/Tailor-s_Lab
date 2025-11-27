import React from 'react';
import { IoClose } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { removeFromCart, updateCartItemQuantity } from '../../utils/cartUtils';
import { formatColorLabel } from '../../utils/colorUtils';
import './Cart.css';

const Cart = ({ isOpen, onClose, cartItems = [], onCartUpdate }) => {
  // Get image URL helper
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "/images/feature.png";
    const apiBase = import.meta.env.VITE_API_URL?.replace(/\/$/, '');
    return apiBase ? `${apiBase}/uploads/${imageUrl}` : `/uploads/${imageUrl}`;
  };

  // Handle remove item
  const handleRemoveItem = (index) => {
    removeFromCart(index);
    if (onCartUpdate) {
      onCartUpdate();
    }
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // Handle quantity change
  const handleQuantityChange = (index, newQuantity) => {
    updateCartItemQuantity(index, newQuantity);
    if (onCartUpdate) {
      onCartUpdate();
    }
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const getDisplayColor = (item) => {
    if (item.color) {
      return formatColorLabel(item.color);
    }
    if (item.color_hex) {
      return formatColorLabel(item.color_hex);
    }
    return 'N/A';
  };

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
                <img src={getImageUrl(item.image_url)} alt={item.name} />
                <button className="remove-item" onClick={() => handleRemoveItem(index)}>×</button>
              </div>
              <div className="item-details">
                <h4>
                  {item.product_id ? (
                    <Link
                      to={`/product/${item.product_id}`}
                      onClick={onClose}
                      style={{ color: 'inherit', textDecoration: 'none' }}
                    >
                      {item.name}
                    </Link>
                  ) : (
                    item.name
                  )}
                </h4>
                {(item.size || item.color) && (
                  <div className="item-options">
                    {item.size && <span>Size: {item.size}</span>}
                    {item.size && item.color && <span> • </span>}
                    {(item.color || item.color_hex) && (
                      <span>Color: {getDisplayColor(item)}</span>
                    )}
                  </div>
                )}
                <div className="item-quantity-controls">
                  <button 
                    className="quantity-btn-minus" 
                    onClick={() => handleQuantityChange(index, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="item-quantity">{item.quantity}</span>
                  <button 
                    className="quantity-btn-plus" 
                    onClick={() => handleQuantityChange(index, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <div className="item-meta">${(item.price * item.quantity).toFixed(2)}</div>
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
