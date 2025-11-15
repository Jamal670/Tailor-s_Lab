import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { IoRemoveOutline, IoAddOutline } from 'react-icons/io5';
import Header from '../../components/headers/Header';
import Footer from '../../components/footers/Footer';
import '../../assets/css/checkout.css';

const Checkout = () => {
  const [quantity, setQuantity] = useState(1);
  const [couponCode, setCouponCode] = useState('');
  const [shippingMethod, setShippingMethod] = useState('free');
  
  // Sample product data
  const product = {
    name: "White Colored Trouser",
    price: 340.00,
    image: "/images/Trouser.png"
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
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
  const subtotal = product.price * quantity;
  const shippingCost = shippingMethod === 'flat' ? 12.00 : 0;
  const total = subtotal + shippingCost;

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
                    <tr className="product-row">
                      <td className="product-col">
                        <div className="product-info">
                          <button className="remove-product">×</button>
                          <div className="product-image">
                            <img src={product.image} alt={product.name} />
                          </div>
                          <div className="product-name">{product.name}</div>
                        </div>
                      </td>
                      <td className="price-col">${product.price.toFixed(2)}</td>
                      <td className="quantity-col">
                        <div className="quantity-selector">
                          <button className="quantity-btn" onClick={decreaseQuantity}>
                            <IoRemoveOutline />
                          </button>
                          <span className="quantity-value">{quantity}</span>
                          <button className="quantity-btn" onClick={increaseQuantity}>
                            <IoAddOutline />
                          </button>
                        </div>
                      </td>
                      <td className="subtotal-col">${subtotal.toFixed(2)}</td>
                    </tr>
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
