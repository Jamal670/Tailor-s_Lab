import React, { useState } from 'react';
import { Container, Row, Col, Button, Tab, Nav } from 'react-bootstrap';
import { FaShoppingCart, FaFacebookF, FaPinterestP, FaLinkedinIn, FaInstagram } from 'react-icons/fa';
import Header from '../../components/headers/Header';
import Footer from '../../components/footers/Footer';
import '../../assets/css/Product.css';

const Product = () => {
  const [selectedColor, setSelectedColor] = useState('blue');
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  // Related products data
  const relatedProducts = [
    {
      id: 1,
      name: "Chocolate Brown Cotton Suit",
      price: "$340.00",
      image: "/images/feature.png"
    },
    {
      id: 2,
      name: "Classic Black Wool Suit",
      price: "$420.00",
      image: "/images/feature.png"
    },
    {
      id: 3,
      name: "Navy Blue Pinstripe Suit",
      price: "$380.00",
      image: "/images/feature.png"
    },
    {
      id: 4,
      name: "Gray Herringbone Suit",
      price: "$390.00",
      image: "/images/feature.png"
    }
  ];

  return (
    <div className="product-wrapper">
      <Header />

      {/* Main Product Section */}
      <div className="product-main-section">
        <Container>
          <div className="product-content">
            <Row className="justify-content-center">
              <Col md={10} lg={10}>
                <Row className="product-inner-content">
                  <Col md={6} className="product-gallery">
                    <div className="product-thumbnails">
                      <div className="thumbnail-item active">
                        <img src="/images/Trouser.png" alt="Product thumbnail" />
                      </div>
                      <div className="thumbnail-item">
                        <img src="/images/Trouser.png" alt="Product thumbnail" />
                      </div>
                      <div className="thumbnail-item">
                        <img src="/images/Trouser.png" alt="Product thumbnail" />
                      </div>
                    </div>
                    <div className="product-main-image">
                      <img src="/images/Trouser.png" alt="White Colored Trouser" />
                    </div>
                  </Col>
                  <Col md={6} className="product-details">
                <h1 className="product-title">White Colored Trouser</h1>
                <div className="product-prices">$340.00</div>
                <div className="product-description">
                  <p>
                    Crafted in premium breathable cotton, this chocolate brown suit is where timeless sophistication meets everyday comfort. The deep, earthy tone carries a subtle richness that makes it perfect for both daytime elegance and evening charm.
                  </p>
                </div>
                
                <div className="product-options">
                  <div className="option-item">
                    <h4>Size</h4>
                    <div className="size-options">
                      <button 
                        className={`size-btn ${selectedSize === 'XS' ? 'active' : ''}`} 
                        onClick={() => handleSizeSelect('XS')}
                      >
                        XS
                      </button>
                      <button 
                        className={`size-btn ${selectedSize === 'S' ? 'active' : ''}`} 
                        onClick={() => handleSizeSelect('S')}
                      >
                        S
                      </button>
                      <button 
                        className={`size-btn ${selectedSize === 'M' ? 'active' : ''}`} 
                        onClick={() => handleSizeSelect('M')}
                      >
                        M
                      </button>
                      <button 
                        className={`size-btn ${selectedSize === 'L' ? 'active' : ''}`} 
                        onClick={() => handleSizeSelect('L')}
                      >
                        L
                      </button>
                    </div>
                  </div>
                  
                  <div className="option-item">
                    <h4>Color</h4>
                    <div className="color-options">
                      <button 
                        className={`color-btn blue ${selectedColor === 'blue' ? 'active' : ''}`} 
                        onClick={() => handleColorSelect('blue')}
                        aria-label="Blue"
                      ></button>
                      <button 
                        className={`color-btn green ${selectedColor === 'green' ? 'active' : ''}`} 
                        onClick={() => handleColorSelect('green')}
                        aria-label="Green"
                      ></button>
                      <button 
                        className={`color-btn white ${selectedColor === 'white' ? 'active' : ''}`} 
                        onClick={() => handleColorSelect('white')}
                        aria-label="White"
                      ></button>
                      <button 
                        className={`color-btn red ${selectedColor === 'red' ? 'active' : ''}`} 
                        onClick={() => handleColorSelect('red')}
                        aria-label="Red"
                      ></button>
                    </div>
                  </div>

                  <div className="quantity-cart-section">
                    <div className="quantity-container">
                      <button className="quantity-btn minus" onClick={decreaseQuantity}>-</button>
                      <div className="quantity-value">{quantity}</div>
                      <button className="quantity-btn plus" onClick={increaseQuantity}>+</button>
                    </div>
                    
                    <Button className="add-to-cart-btn" variant="dark">
                      <FaShoppingCart /> Add to cart
                    </Button>
                  </div>
                </div>
                
                <div className="product-meta">
                  <div className="size-guide">
                    <a href="#">Size Guide <span className="size-guide-icon">📏</span></a>
                    <span className="sku">SKU: TS-12345</span>
                  </div>
                  <div className="social-share">
                    <span>Share</span>
                    <a href="#" className="share-icon facebook"><FaFacebookF /></a>
                    <a href="#" className="share-icon pinterest"><FaPinterestP /></a>
                    <a href="#" className="share-icon linkedin"><FaLinkedinIn /></a>
                    <a href="#" className="share-icon instagram"><FaInstagram /></a>
                  </div>
                </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </Container>
      </div>

      {/* Product Tabs Section */}
      <div className="product-tabs-section">
        <Container>
          <div className="product-tabs-container">
            <div className="product-tabs-header">
              <div className={`tab-link ${activeTab === 'description' ? 'active' : ''}`} 
                   onClick={() => setActiveTab('description')}>
                Description
              </div>
              <div className={`tab-link ${activeTab === 'additional' ? 'active' : ''}`}
                   onClick={() => setActiveTab('additional')}>
                Additional Information
              </div>
              <div className={`tab-link ${activeTab === 'reviews' ? 'active' : ''}`}
                   onClick={() => setActiveTab('reviews')}>
                Reviews (2)
              </div>
            </div>
            
            <div className="product-tabs-content">
              {/* Description Tab Content */}
              {activeTab === 'description' && (
                <div className="tab-content description-content">
                  <h2 className="tab-title">White Colored Trouser</h2>
                  <div className="description-content-wrapper">
                    <div className="description-text">
                      <p>Crafted in premium breathable cotton, this chocolate brown suit is where timeless sophistication meets everyday comfort. The deep, earthy tone carries a subtle richness that makes it perfect for both daytime elegance and evening charm.</p>
                    </div>
                    <div className="description-images">
                      <div className="description-image">
                        <img src="/images/Trouser.png" alt="White Colored Trouser" />
                      </div>
                      <div className="description-image">
                        <img src="/images/Trouser.png" alt="White Colored Trouser" />
                      </div>
                    </div>
                  </div>

                  <div className="description-details">
                    <div className="description-detail collection">
                      <h3>Collection</h3>
                      <p>Morph</p>
                    </div>
                    <div className="description-detail sizes">
                      <h3>Size</h3>
                      <p>XS, S, M, L, XL</p>
                    </div>
                    <div className="description-detail materials">
                      <h3>Materials</h3>
                      <p>100% Cotton</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Information Tab Content */}
              {activeTab === 'additional' && (
                <div className="tab-content additional-content">
                  <div className="additional-info-wrapper">
                    <div className="additional-info-item">
                      <div className="info-label">Color</div>
                      <div className="info-value">Chocolate Brown, Midnight Navy, Charcoal Grey</div>
                    </div>
                    <div className="additional-info-item">
                      <div className="info-label">Size</div>
                      <div className="info-value">XL,X,S,M,L</div>
                    </div>
                    <div className="additional-info-item">
                      <div className="info-label">Technique</div>
                      <div className="info-value">Handmade</div>
                    </div>
                    <div className="additional-info-item">
                      <div className="info-label">Packaging</div>
                      <div className="info-value">Custom</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Reviews Tab Content */}
              {activeTab === 'reviews' && (
                <div className="tab-content reviews-content">
                  <div className="reviews-list">
                    <div className="review-item">
                      <div className="reviewer-info">
                        <div className="reviewer-avatar">
                          <img src="/images/RI.png" alt="John Simon" />
                        </div>
                        <div className="reviewer-details">
                          <h4 className="reviewer-name">John Simon</h4>
                          <div className="reviewer-rating">
                            <span className="star">★</span>
                            <span className="star">★</span>
                            <span className="star">★</span>
                            <span className="star">★</span>
                            <span className="star empty">★</span>
                          </div>
                        </div>
                      </div>
                      <div className="review-text">
                        <p>Perfect fit and premium fabric—these trousers feel custom-made. TailorsLab never disappoints.</p>
                      </div>
                    </div>
                    
                    <div className="review-item">
                      <div className="reviewer-info">
                        <div className="reviewer-avatar">
                          <img src="/images/RI.png" alt="John Simon" />
                        </div>
                        <div className="reviewer-details">
                          <h4 className="reviewer-name">John Simon</h4>
                          <div className="reviewer-rating">
                            <span className="star">★</span>
                            <span className="star">★</span>
                            <span className="star">★</span>
                            <span className="star">★</span>
                            <span className="star empty">★</span>
                          </div>
                        </div>
                      </div>
                      <div className="review-text">
                        <p>Perfect fit and premium fabric—these trousers feel custom-made. TailorsLab never disappoints.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Container>
      </div>

      {/* Related Products Section */}
      <section className="features-section">
        <Container>
          <h2 className="section-title" style={{ color: "#E2D9C8", fontSize: "3rem" }}>RELATED PRODUCTS</h2>
          <div className="features-slider">
            <div className="features-track">
              {relatedProducts.map((product) => (
                <div className="feature-item" key={product.id}>
                  <div className="feature-image">
                    <img src={product.image} alt={product.name} />
                  </div>
                  <div className="feature-overlay">
                    <div className="feature-details">
                      <h4>{product.name}</h4>
                      <div className="feature-price">{product.price}</div>
                    </div>
                    <div className="cart-container">
                      <Button variant="light" className="add-to-cart-btn">
                        <FaShoppingCart style={{ color: 'white', fill: 'white' }} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </div>
  );
};

export default Product;