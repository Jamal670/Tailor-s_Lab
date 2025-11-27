import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useLocation, Link } from 'react-router-dom';
import { formatColorLabel } from '../../utils/colorUtils';
import Header from '../../components/headers/Header';
import Footer from '../../components/footers/Footer';
import '../../assets/css/OrderComp.css';

const formatOrder = (order) => {
  const total = Number(order.totalAmount || order.total || 0);
  const createdDate = order.createdAt ? new Date(order.createdAt) : new Date();
  const shippingAmount = order.shippingMethod === 'flat' ? 12 : 0;
  const shippingLabel = order.shippingMethod === 'flat' ? 'Flat rate: $12.00' : 'Free shipping';
  const paymentLabel = order.paymentMethod === 'CARD' ? 'Card payment' : 'Cash on delivery';
  const fullName = `${order.firstName || ''} ${order.lastName || ''}`.trim();

  return {
    orderNumber: order.orderId || order.orderNumber || 'N/A',
    trackingId: order.trackingId || order.tracking_id || 'N/A',
    date: createdDate.toLocaleDateString(),
    total,
    subtotal: Math.max(total - shippingAmount, 0),
    paymentMethod: paymentLabel,
    shipping: shippingLabel,
    billingAddress: {
      name: fullName || 'Customer',
      address: order.streetAddress || '',
      city: order.city || '',
      zipCode: order.zipcode || '',
      country: order.country || '',
      phone: order.phone || '',
      email: order.email || ''
    },
    shippingAddress: {
      name: fullName || 'Customer',
      address: order.streetAddress || '',
      city: order.city || '',
      zipCode: order.zipcode || '',
      country: order.country || ''
    },
    items: order.items || [],
    shippingAmount,
    note: paymentLabel === 'Cash on delivery' ? 'Pay with cash upon delivery.' : 'Paid online.'
  };
};

const OrderComp = () => {
  const location = useLocation();
  const [orderData, setOrderData] = useState(null);

  const getDisplayColor = (item) => {
    if (item?.color) {
      return formatColorLabel(item.color);
    }
    if (item?.color_hex) {
      return formatColorLabel(item.color_hex);
    }
    return 'N/A';
  };

  useEffect(() => {
    if (location.state?.order) {
      const formatted = formatOrder(location.state.order);
      setOrderData(formatted);
      localStorage.setItem('latestOrder', JSON.stringify(formatted));
    } else {
      const stored = localStorage.getItem('latestOrder');
      if (stored) {
        setOrderData(JSON.parse(stored));
      }
    }
  }, [location.state]);

  if (!orderData) {
    return (
      <div className="order-complete-wrapper">
        <Header />
        <section className="page-title-section">
          <Container>
            <h1 className="page-title">Order Complete</h1>
          </Container>
        </section>
        <section className="order-complete-content-section">
          <Container>
            <p style={{ color: '#fff', textAlign: 'center' }}>
              We couldn't find a recent order. Please return to the shop.
            </p>
            <div className="continue-shopping-section">
              <div className="continue-shopping-btn-container">
                <Link to="/">
                  <button className="continue-shopping-btn">Continue shopping</button>
                </Link>
              </div>
            </div>
          </Container>
        </section>
        <Footer />
      </div>
    );
  }

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
                <div className="summary-label">Tracking ID:</div>
                <div className="summary-value">{orderData.trackingId || 'N/A'}</div>
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
              <p>{orderData.note}</p>
            </div>

            {/* Order Details */}
            <div className="order-details-section">
              <h2 className="section-title">Order details</h2>

              <div className="order-details-header">
                <div className="product-header">PRODUCT</div>
                <div className="total-header">TOTAL</div>
              </div>

              {orderData.items.length === 0 ? (
                <div className="order-product-item">
                  <div className="product-info">
                    <div className="product-name">No products found</div>
                  </div>
                </div>
              ) : (
                orderData.items.map((item, index) => (
                  <div className="order-product-item" key={`${item.product_id}-${index}`}>
                    <div className="product-info">
                      <div className="product-image">
                        <img
                          src={
                            item.image_url
                              ? (import.meta.env.VITE_API_URL
                                  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/uploads/${item.image_url}`
                                  : `/uploads/${item.image_url}`)
                              : '/images/feature.png'
                          }
                          alt={item.name}
                        />
                      </div>
                      <div className="product-details">
                        <div className="product-name" style={{ color: '#000' }}>
                          {item.product_id ? (
                            <Link to={`/product/${item.product_id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                              {item.name}
                            </Link>
                          ) : (
                            item.name
                          )} × {item.quantity}
                        </div>
                        <div className="product-meta">
                          {(item.color || item.color_hex) && (
                            <div className="product-color">Color: {getDisplayColor(item)}</div>
                            
                          )}
                          {item.size && <div className="product-size">Size: {item.size}</div>}
                        </div>
                      </div>
                    </div>
                    <div className="product-total">
                      ${(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}
                    </div>
                  </div>
                ))
              )}

              <div className="order-summary-item subtotal-item">
                <div className="summary-label">Subtotal:</div>
                <div className="summary-value">${orderData.subtotal.toFixed(2)}</div>
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
                      {orderData.billingAddress.phone && <p>{orderData.billingAddress.phone}</p>}
                      {orderData.billingAddress.email && <p>{orderData.billingAddress.email}</p>}
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
                  <Link to="/">
                    <button className="continue-shopping-btn">
                      Continue shopping
                    </button>
                  </Link>
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
