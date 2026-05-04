import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { IoRemoveOutline, IoAddOutline } from "react-icons/io5";
import { useNavigate, Link } from "react-router-dom";
import Header from "../../components/headers/Header";
import Footer from "../../components/footers/Footer";
import "../../assets/css/CheckoutInfo.css";
import {
  getCartItems,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
} from "../../utils/cartUtils";
import api from "../../Api";
import { formatColorLabel } from "../../utils/colorUtils";

const initialFormState = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  streetAddress: "",
  city: "",
  country: "",
  zipcode: "",
};

const CheckoutInfo = () => {
  const navigate = useNavigate();
  const [shippingMethod, setShippingMethod] = useState("flat");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

  const handleShippingMethodChange = (e) => {
    setShippingMethod(e.target.value);
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePlaceOrder = async () => {
    if (!cartItems.length) {
      setErrorMessage("Your cart is empty.");
      return;
    }

    const requiredFields = [
      "firstName",
      "lastName",
      "phone",
      "email",
      "streetAddress",
      "city",
      "country",
      "zipcode",
    ];
    for (const field of requiredFields) {
      if (!formData[field]) {
        setErrorMessage("Please fill in all required fields.");
        return;
      }
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const payload = {
      sessionId: null,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      email: formData.email,
      streetAddress: formData.streetAddress,
      city: formData.city,
      country: formData.country,
      zipcode: formData.zipcode,
      paymentMethod,
      shippingMethod,
      totalAmount: total,
      cartItems: cartItems.map((item) => ({
        product_id: item.product_id,
        name: item.name,
        size: item.size,
        color: item.color,
        color_hex: item.color_hex || "",
        category: item.category,
        quantity: item.quantity,
        price: item.price,
        image_url: item.image_url,
      })),
    };

    try {
      const { data } = await api.post("/user/orders", payload);
      clearCart();
      setCartItems([]);
      setFormData(initialFormState);
      localStorage.setItem("latestOrder", JSON.stringify(data.order));
      navigate("/order-complete", { state: { order: data.order } });
    } catch (error) {
      console.error("Order submission error:", error);
      setErrorMessage(
        error.response?.data?.error ||
          "Failed to place order. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate totals
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const shippingCost = shippingMethod === "flat" ? 12.0 : 0;
  const total = subtotal + shippingCost;

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "/images/feature.png";
    const apiBase = import.meta.env.VITE_API_URL?.replace(/\/$/, "");
    return apiBase ? `${apiBase}/uploads/${imageUrl}` : `/uploads/${imageUrl}`;
  };

  const getDisplayColor = (item) => {
    if (item.color) {
      return formatColorLabel(item.color);
    }
    if (item.color_hex) {
      return formatColorLabel(item.color_hex);
    }
    return "N/A";
  };

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
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="lastName">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Doe"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
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
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="emailAddress">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="john.doe@example.com"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
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
                        name="streetAddress"
                        value={formData.streetAddress}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="townCity">
                      <Form.Label>Town/City</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="New York"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
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
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="zipCode">
                      <Form.Label>Zip Code</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="10001"
                        name="zipcode"
                        value={formData.zipcode}
                        onChange={handleInputChange}
                        required
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
                  {cartItems.length === 0 ? (
                    <div className="empty-order-summary">
                      Your cart is empty
                    </div>
                  ) : (
                    cartItems.map((item, index) => (
                      <div className="product-info" key={index}>
                        <button
                          className="remove-product"
                          onClick={() => handleRemoveItem(index)}
                        >
                          ×
                        </button>
                        <div className="product-image">
                          <img
                            src={getImageUrl(item.image_url)}
                            alt={item.name}
                          />
                        </div>
                        <div className="product-details">
                          <h4
                            className="product-name"
                            style={{ color: "#000" }}
                          >
                            {item.product_id ? (
                              <Link
                                to={`/product/${item.product_id}`}
                                style={{
                                  color: "inherit",
                                  textDecoration: "none",
                                }}
                              >
                                {item.name}
                              </Link>
                            ) : (
                              item.name
                            )}
                          </h4>
                          {(item.size || item.color) && (
                            <div className="product-variants">
                              {item.size && <span>Size: {item.size}</span>}
                              {item.size && item.color && <span> • </span>}
                              {(item.color || item.color_hex) && (
                                <span>Color: {getDisplayColor(item)}</span>
                              )}
                            </div>
                          )}
                          <div className="quantity-selector">
                            <button
                              className="quantity-btn"
                              onClick={() =>
                                handleQuantityChange(index, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                            >
                              <IoRemoveOutline />
                            </button>
                            <span
                              className="quantity-value"
                              style={{ color: "#000" }}
                            >
                              {item.quantity}
                            </span>
                            <button
                              className="quantity-btn"
                              onClick={() =>
                                handleQuantityChange(index, item.quantity + 1)
                              }
                            >
                              <IoAddOutline />
                            </button>
                          </div>
                        </div>
                        {/* <div className="product-price">
                          <span className="subtotal-label">SUBTOTAL</span>
                          <span className="subtotal-value">${(item.price * item.quantity).toFixed(2)}</span>
                        </div> */}
                      </div>
                    ))
                  )}
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
                        id="flat-rate"
                        name="shipping"
                        value="flat"
                        checked={true}
                        disabled
                        onChange={handleShippingMethodChange}
                      />
                      <label htmlFor="flat-rate" style={{ color: "#000" }}>
                        Flat rate: $12.00
                      </label>
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
                      checked={paymentMethod === "bank"}
                      disabled
                      onChange={handlePaymentMethodChange}
                    />
                    <label htmlFor="direct-bank" style={{ color: "#aaa" }}>
                      Direct bank transfer (coming soon)
                    </label>
                  </div>

                  <div className="payment-option">
                    <input
                      type="radio"
                      id="check-payments"
                      name="payment"
                      value="check"
                      checked={paymentMethod === "check"}
                      disabled
                      onChange={handlePaymentMethodChange}
                    />
                    <label htmlFor="check-payments" style={{ color: "#aaa" }}>
                      Check payments (coming soon)
                    </label>
                  </div>

                  <div className="payment-option">
                    <input
                      type="radio"
                      id="cash-delivery"
                      name="payment"
                      value="cash"
                      checked={true}
                      disabled
                      onChange={handlePaymentMethodChange}
                    />
                    <label htmlFor="cash-delivery" style={{ color: "#000" }}>
                      Cash on delivery
                    </label>
                  </div>

                  {paymentMethod === "cash" && (
                    <div className="payment-description">
                      Pay with cash upon delivery.
                    </div>
                  )}

                  {errorMessage && (
                    <div className="order-error">{errorMessage}</div>
                  )}

                  {cartItems.length > 0 && (
                    <button
                      className="place-order-btn"
                      type="button"
                      onClick={handlePlaceOrder}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "PLACING ORDER..." : "PLACE ORDER"}
                    </button>
                  )}
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
