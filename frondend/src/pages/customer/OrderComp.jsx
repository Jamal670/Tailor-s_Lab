import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Header from '../../components/headers/Header';
import Footer from '../../components/footers/Footer';
import '../../assets/css/OrderComp.css';

const OrderComp = () => {
  // Sample order data
  const orderData = {
    orderNumber: '1013',
    date: 'September 4, 2025',
    total: 18.00,
    paymentMethod: 'Cash on delivery',
    product: {
      name: 'Active-T-Shirt - Black, M',
      color: 'Black',
      size: 'M',
      quantity: 1,
      price: 18.00
    },
    shipping: 'Free shipping',
    billingAddress: {
      name: 'Ali Ahmed',
      address: 'Gulberg greens, Islamabad, Pakistan',
      city: 'Islamabad',
      zipCode: '43000',
      country: 'Pakistan',
      phone: '+923187978407',
      email: 'ali631073@gmail.com'
    },
    shippingAddress: {
      name: 'Ali Ahmed',
      address: 'Gulberg greens, Islamabad, Pakistan',
      city: 'Islamabad',
      zipCode: '43000',
      country: 'Pakistan'
    }
  };

  return (
    <div className="order-complete-wrapper">
      {/* Header Component */}
      <Header />

      {/* Page Title */}
      <section className="page-title-section">
        <Container>
          <h1 className="page-title">Order Complete</h1>
        </Container>
      </section>

      {/* Checkout Progress */}
      <section className="checkout-progress-sections">
        <Container>
          <div className="checkout-progress">
            <div className="progress-item">Shopping Cart</div>
            <div className="progress-arrow">→</div>
            <div className="progress-item">Checkout</div>
            <div className="progress-arrow">→</div>
            <div className="progress-item active">Order Complete</div>
          </div>
        </Container>
      </section>

      {/* Order Complete Content */}
      <section className="order-complete-content-section">
        <Container>
          <div className="order-complete-container">
            {/* Thank You Message */}
            <div className="thank-you-message">
              <p>Thank you. Your order has been received.</p>
            </div>

            {/* Order Summary */}
            <div className="order-summary-grid">
              <div className="order-summary-item">
                <div className="summary-label">Order number:</div>
                <div className="summary-value">{orderData.orderNumber}</div>
              </div>
              <div className="order-summary-item">
                <div className="summary-label">Date:</div>
                <div className="summary-value">{orderData.date}</div>
              </div>
              <div className="order-summary-item">
                <div className="summary-label">Total:</div>
                <div className="summary-value">${orderData.total.toFixed(2)}</div>
              </div>
              <div className="order-summary-item">
                <div className="summary-label">Payment method:</div>
                <div className="summary-value">{orderData.paymentMethod}</div>
              </div>
            </div>

            <div className="payment-note">
              <p>Pay with cash upon delivery.</p>
            </div>

            {/* Order Details */}
            <div className="order-details-section">
              <h2 className="section-title">Order details</h2>

              <div className="order-details-header">
                <div className="product-header">PRODUCT</div>
                <div className="total-header">TOTAL</div>
              </div>

              <div className="order-product-item">
                <div className="product-info">
                  <div className="product-name">{orderData.product.name} × {orderData.product.quantity}</div>
                  <div className="product-meta">
                    <div className="product-color">Color: {orderData.product.color}</div>
                    <div className="product-size">Size: {orderData.product.size}</div>
                  </div>
                </div>
                <div className="product-total">${orderData.product.price.toFixed(2)}</div>
              </div>

              <div className="order-summary-item subtotal-item">
                <div className="summary-label">Subtotal:</div>
                <div className="summary-value">${orderData.total.toFixed(2)}</div>
              </div>

              <div className="order-summary-item shipping-item">
                <div className="summary-label">Shipping:</div>
                <div className="summary-value">{orderData.shipping}</div>
              </div>

              <div className="order-summary-item payment-item">
                <div className="summary-label">Payment method:</div>
                <div className="summary-value">{orderData.paymentMethod}</div>
              </div>

              <div className="order-summary-item total-item">
                <div className="summary-label">Total:</div>
                <div className="summary-value">${orderData.total.toFixed(2)}</div>
              </div>
            </div>

            {/* Address Information */}
            <div className="address-section">
              <Row>
                <Col md={6}>
                  <div className="billing-address">
                    <h3 className="address-title">Billing address</h3>
                    <div className="address-content">
                      <p>{orderData.billingAddress.name}</p>
                      <p>{orderData.billingAddress.address}</p>
                      <p>{orderData.billingAddress.city}</p>
                      <p>{orderData.billingAddress.zipCode}</p>
                      <p>{orderData.billingAddress.country}</p>
                      <p>{orderData.billingAddress.phone}</p>
                      <p>{orderData.billingAddress.email}</p>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="shipping-address">
                    <h3 className="address-title">Shipping address</h3>
                    <div className="address-content">
                      <p>{orderData.shippingAddress.name}</p>
                      <p>{orderData.shippingAddress.address}</p>
                      <p>{orderData.shippingAddress.city}</p>
                      <p>{orderData.shippingAddress.zipCode}</p>
                      <p>{orderData.shippingAddress.country}</p>
                    </div>
                  </div>
                </Col>
              </Row>
              <div className="continue-shopping-section">
  <div className="continue-shopping-btn-container">
    <a href="/">
      <button className="continue-shopping-btn">
        Continue shopping
      </button>
    </a>
  </div>
</div>
            </div>
          </div>

        </Container>
      </section>


      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default OrderComp;
