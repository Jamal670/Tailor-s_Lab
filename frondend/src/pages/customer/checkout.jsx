import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { IoRemoveOutline, IoAddOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import Header from '../../components/headers/Header';
import Footer from '../../components/footers/Footer';
import '../../assets/css/checkout.css';
import { 
  getCartItems, 
  getCartTotal, 
  removeFromCart, 
  updateCartItemQuantity 
} from '../../utils/cartUtils';
import { formatColorLabel } from '../../utils/colorUtils';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [shippingMethod, setShippingMethod] = useState('free');

  useEffect(() => {
    const items = getCartItems();
    setCartItems(items);
  }, []);

  const handleQuantityChange = (index, newQuantity) => {
    const item = cartItems[index];
    if (!item) return;

    const maxQty = Number(item.maxQuantity);
    const resolvedMax = Number.isFinite(maxQty) && maxQty > 0 ? maxQty : null;
    let nextQuantity = Math.max(1, newQuantity);

    if (resolvedMax && nextQuantity > resolvedMax) {
      nextQuantity = resolvedMax;
      alert(`Only ${resolvedMax} unit(s) available for ${item.name}.`);
    }

    const updatedItems = updateCartItemQuantity(index, nextQuantity);
    setCartItems([...updatedItems]);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = removeFromCart(index);
    setCartItems([...updatedItems]);
  };

  const handleCouponChange = (e) => {
    setCouponCode(e.target.value);
  };

  const applyCoupon = () => {
    console.log('Applying coupon:', couponCode);
    // Implement coupon logic here
  };

  const handleShippingMethodChange = (e) => {
    setShippingMethod(e.target.value);
  };

  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shippingCost = shippingMethod === 'flat' ? 12.00 : 0;
  const total = subtotal + shippingCost;

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "/images/feature.png";
    const apiBase = import.meta.env.VITE_API_URL?.replace(/\/$/, '');
    return apiBase ? `${apiBase}/uploads/${imageUrl}` : `/uploads/${imageUrl}`;
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

  return (
    <div className="checkout-wrapper">
      {/* Header Component */}
      <Header />

      {/* Page Title */}
      <section className="page-title-sections">
        <Container>
          <h1 className="page-title">Cart</h1>
        </Container>
      </section>

      {/* Checkout Progress */}
      <section className="checkout-progress-sections">
        <Container>
          <div className="checkout-progress">
            <div className="progress-item active">Shopping Cart</div>
            <div className="progress-arrow">→</div>
            <div className="progress-item">Checkout</div>
            <div className="progress-arrow">→</div>
            <div className="progress-item">Order Complete</div>
          </div>
        </Container>
      </section>

      {/* Checkout Content */}
      <section className="checkout-content-section">
        <Container>
          <Row>
            <Col lg={8} md={7}>
              {/* Product Table */}
              <div className="checkout-table-container">
                <table className="checkout-table">
                  <thead>
                    <tr>
                      <th className="product-col">Product</th>
                      <th className="price-col">Price</th>
                      <th className="quantity-col">Quantity</th>
                      <th className="subtotal-col">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="empty-cart-row">Your cart is empty</td>
                      </tr>
                    ) : (
                      cartItems.map((item, index) => (
                        <tr className="product-row" key={index}>
                          <td className="product-col">
                            <div className="product-info">
                              <button className="remove-product" onClick={() => handleRemoveItem(index)}>×</button>
                              <div className="product-image">
                                <img src={getImageUrl(item.image_url)} alt={item.name} />
                              </div>
                              <div className="product-details-block">
                                <div className="product-name">
                                  {item.product_id ? (
                                    <Link
                                      to={`/product/${item.product_id}`}
                                      style={{ color: 'inherit', textDecoration: 'none' }}
                                    >
                                      {item.name}
                                    </Link>
                                  ) : (
                                    item.name
                                  )}
                                </div>
                                {(item.size || item.color) && (
                                  <div className="product-variants">
                                    {item.size && <span>Size: {item.size}</span>}
                                    {item.size && item.color && <span> • </span>}
                                    {(item.color || item.color_hex) && (
                                      <span>Color: {getDisplayColor(item)}</span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="price-col">${Number(item.price).toFixed(2)}</td>
                          <td className="quantity-col">
                            <div className="quantity-selector" style={{ border: '1px solid #E2D9C8' }}>
                              <button 
                                className="quantity-btn" style={{ border: '1px solid #E2D9C8', color: '#E2D9C8' }}  
                                onClick={() => handleQuantityChange(index, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <IoRemoveOutline />
                              </button>
                              <span className="quantity-value">{item.quantity}</span>
                              <button 
                                className="quantity-btn " style={{ border: '1px solid #E2D9C8', color: '#E2D9C8' }}  
                                onClick={() => handleQuantityChange(index, item.quantity + 1)}
                              >
                                <IoAddOutline />
                              </button>
                            </div>
                          </td>
                          <td className="subtotal-col">${(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Coupon Code */}
              <div className="coupon-container">
                <input 
                  type="text" 
                  className="coupon-input" 
                  placeholder="Coupon Code" 
                  value={couponCode}
                  onChange={handleCouponChange}
                />
                <button className="apply-coupon-btn" onClick={applyCoupon}>
                  Apply
                </button>
              </div>
            </Col>

            <Col lg={4} md={5}>
              {/* Cart Totals */}
              <div className="cart-totals">
                <h2 className="totals-title">CART TOTALS</h2>
                
                <div className="totals-row subtotal-row">
                  <span className="totals-label">Subtotal</span>
                  <span className="totals-value">${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="totals-row shipping-row">
                  <span className="totals-label">Shipping</span>
                </div>
                
                <div className="shipping-option-row">
                  <div className="shipping-option">
                    <input 
                      type="radio" 
                      id="free-shipping" 
                      name="shipping" 
                      value="free" 
                      checked={shippingMethod === 'free'}
                      onChange={handleShippingMethodChange}
                    />
                    <label htmlFor="free-shipping">Free shipping</label>
                  </div>
                </div>
                
                <div className="shipping-option-row">
                  <div className="shipping-option">
                    <input 
                      type="radio" 
                      id="flat-rate" 
                      name="shipping" 
                      value="flat" 
                      checked={shippingMethod === 'flat'}
                      onChange={handleShippingMethodChange}
                    />
                    <label htmlFor="flat-rate">Flat rate: $12.00</label>
                  </div>
                </div>
                
                <div className="shipping-option-row">
                  <div className="shipping-destination">
                    Shipping to CA.
                  </div>
                </div>
                
                <div className="shipping-option-row">
                <div className="contact-info-destination">
                Change address
                  </div>
                </div>
                
                <div className="totals-row total-row">
                  <span className="totals-label">Total</span>
                  <span className="totals-value">${total.toFixed(2)}</span>
                </div>
                
                  <a href="/cart/checkout-info">
                    <button className="proceed-btn">
                      PROCEED TO CHECKOUT
                    </button>
                  </a>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default Checkout;
