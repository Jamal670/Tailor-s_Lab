import React, { useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { IoRemoveOutline, IoAddOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import Header from '../../components/headers/Header';
import Footer from '../../components/footers/Footer';
import '../../assets/css/CheckoutInfo.css';

const CheckoutInfo = () => {
  const [quantity, setQuantity] = useState(1);
  const [shippingMethod, setShippingMethod] = useState('free');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  
  // Sample product data
  const product = {
    name: "Active-T-Shirt - Black, M",
    price: 18.00,
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

  const handleShippingMethodChange = (e) => {
    setShippingMethod(e.target.value);
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  // Calculate totals
  const subtotal = product.price * quantity;
  const shippingCost = shippingMethod === 'flat' ? 12.00 : 0;
  const total = subtotal + shippingCost;

  return (
    <div className="checkout-info-wrapper">
      {/* Header Component */}
      <Header />

      {/* Page Title */}
      <section className="page-title-section">
        <Container>
          <h1 className="page-title">Checkout</h1>
        </Container>
      </section>

      {/* Checkout Progress */}
      <section className="checkout-progress-sections">
        <Container>
          <div className="checkout-progress">
            <div className="progress-item">Shopping Cart</div>
            <div className="progress-arrow">→</div>
            <div className="progress-item active">Checkout</div>
            <div className="progress-arrow">→</div>
            <div className="progress-item">Order Complete</div>
          </div>
        </Container>
      </section>

      {/* Checkout Info Content */}
      <section className="checkout-info-content-section">
        <Container>
          <Row>
            <Col lg={6} md={12} className="customer-info-col">
              {/* Customer Information Form */}
              <Form className="customer-info-form">
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="firstName">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="John"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="lastName">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="Doe"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="phoneNo">
                      <Form.Label>Phone no</Form.Label>
                      <Form.Control 
                        type="tel" 
                        placeholder="+91 9876543210"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="emailAddress">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control 
                        type="email" 
                        placeholder="john.doe@example.com"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="streetAddress">
                      <Form.Label>Street Address</Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="123 Main St"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="townCity">
                      <Form.Label>Town/City</Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="New York"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="country">
                      <Form.Label>Country</Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="United States"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="zipCode">
                      <Form.Label>Zip Code</Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="10001"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Col>

            <Col lg={6} md={12}>
              {/* Order Summary */}
              <div className="order-summary">
                <h2 className="summary-title">PRODUCT</h2>
                <div className="order-product">
                  <div className="product-info">
                    <div className="product-image">
                      <img src={product.image} alt={product.name} />
                    </div>
                    <div className="product-details">
                      <h4 className="product-name">{product.name}</h4>
                      <div className="quantity-selector">
                        <button className="quantity-btn" onClick={decreaseQuantity}>
                          <IoRemoveOutline />
                        </button>
                        <span className="quantity-value">{quantity}</span>
                        <button className="quantity-btn" onClick={increaseQuantity}>
                          <IoAddOutline />
                        </button>
                      </div>
                    </div>
                    <div className="product-price">
                      <span className="subtotal-label">SUBTOTAL</span>
                      <span className="subtotal-value">${subtotal.toFixed(2)}</span>
                    </div>
                    <button className="remove-product">×</button>
                  </div>
                </div>

                <div className="order-totals">
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

                  <div className="totals-row total-row">
                    <span className="totals-label">Total</span>
                    <span className="totals-value">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="payment-methods">
                  <div className="payment-option">
                    <input 
                      type="radio" 
                      id="direct-bank" 
                      name="payment" 
                      value="bank" 
                      checked={paymentMethod === 'bank'}
                      onChange={handlePaymentMethodChange}
                    />
                    <label htmlFor="direct-bank">Direct bank transfer</label>
                  </div>

                  <div className="payment-option">
                    <input 
                      type="radio" 
                      id="check-payments" 
                      name="payment" 
                      value="check" 
                      checked={paymentMethod === 'check'}
                      onChange={handlePaymentMethodChange}
                    />
                    <label htmlFor="check-payments">Check payments</label>
                  </div>

                  <div className="payment-option">
                    <input 
                      type="radio" 
                      id="cash-delivery" 
                      name="payment" 
                      value="cash" 
                      checked={paymentMethod === 'cash'}
                      onChange={handlePaymentMethodChange}
                    />
                    <label htmlFor="cash-delivery">Cash on delivery</label>
                  </div>

                  {paymentMethod === 'cash' && (
                    <div className="payment-description">
                      Pay with cash upon delivery.
                    </div>
                  )}

                  <Link to="/order-complete" className="order-link">
                  <a href="/order-complete">
                    <button className="place-order-btn">
                      PLACE ORDER
                    </button>
                  </a>
                  </Link>
                </div>
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

export default CheckoutInfo;
