import React, { useEffect, useState, useRef } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../../assets/css/home.css';
import { FaCut, FaShoppingCart, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { BsFillSquareFill } from "react-icons/bs";
import { GiSewingMachine, GiSewingNeedle } from "react-icons/gi";
import { PiShirtFolded } from "react-icons/pi";
import { GiDiamonds } from "react-icons/gi";
import Header from '../../components/headers/Header';
import Footer from '../../components/footers/Footer';
import api from '../../Api';

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);
  
  // Function to scroll to collection section
  const scrollToCollection = () => {
    document.getElementById('collection').scrollIntoView({ behavior: 'smooth' });
  };

  // Handle navigation state to scroll to collection section
  useEffect(() => {
    if (location.state?.scrollToCollection) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const collectionSection = document.getElementById('collection');
        if (collectionSection) {
          collectionSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      // Clear the state to prevent scrolling on subsequent renders
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);

  // Fetch featured products on component mount
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/user/get-featured-products');
        setFeaturedProducts(response.data || []);
      } catch (error) {
        console.error('Error fetching featured products:', error);
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  // Brand logos for the loop
  const brandLogos = [
    "/images/1.png",
    "/images/2.png",
    "/images/3.png",
    "/images/4.png"
  ];

  // Get image URL helper
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "/images/feature.png";
    const apiBase = import.meta.env.VITE_API_URL?.replace(/\/$/, '');
    return apiBase ? `${apiBase}/uploads/${imageUrl}` : `/uploads/${imageUrl}`;
  };

  // Scroll functions for features slider
  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: -320,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: 320,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="home-wrapper">
      {/* Header Component */}
      <Header />

      {/* Hero Section */}
      <section className="hero-section" id="home">
        <video className="hero-video" autoPlay muted loop playsInline>
          <source src="/images/home_video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="hero-content">
          <div className="hero-text">
            <h6 className="hero-subtitle">TAILOR&apos;S LAB</h6>
            <p className="hero-heading">Crafted for Legends</p>
            <Button variant="light" className="shop-now-btnnn" onClick={scrollToCollection}>Shop Now</Button>
          </div>
        </div>
      </section>

      {/* Brand Logos Section */}
      <section className="brand-logos-section">
        <div className="brand-logos-container">
          <div className="brand-logos-track">
            {[...Array(3)].map((_, repeatIndex) => (
              <React.Fragment key={`repeat-${repeatIndex}`}>
                {brandLogos.map((logo, index) => (
                  <div className="brand-logo-item" key={`${repeatIndex}-${index}`}>
                    <img src={logo} alt={`Brand Logo ${index + 1}`} />
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="about-section" id="about">
        <Container>
          <h2 className="section-title">ABOUT US</h2>
          <Row>
            <Col md={12}>
              <p className="about-text">
                At Tailors Lab, we believe the suit should be more than a uniform, it should be an expression of individuality. That’s why we don’t replicate tradition or follow trends. We design differently, experimenting and reimagining what modern tailoring can be.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Collection Section */}
      <section className="collection-section" id="collection">
        <Container>
          <h2 className="section-title">COLLECTION</h2>
          <Row className="collection-items">
            <Col md={6} lg={6} className="mb-4">
              <div className="collection-item suits-item">
                <div className="collection-content">
                  <div className="collection-card">
                    <h3>Suits</h3>
                    <Button variant="outline-light" className="explore-btn" onClick={() => navigate('/suits')}>Explore all</Button>
                  </div>
                </div>
              </div>
            </Col>
            <Col md={6} lg={6} className="mb-4">
              <Row>
                <Col xs={12} className="mb-4">
                  <div className="collection-item shirts-item">
                    <div className="collection-content">
                      <div className="collection-card">
                        <h3>Shirts</h3>
                        <Button variant="outline-light" className="explore-btn" onClick={() => navigate('/shirts')}>Explore all</Button>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col xs={12}>
                  <div className="collection-item trousers-item">
                    <div className="collection-content">
                      <div className="collection-card">
                        <h3>Trousers</h3>
                        <Button variant="outline-light" className="explore-btn" onClick={() => navigate('/trousers')}>Explore all</Button>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <Container>
          <h2 className="section-title" style={{ color: "#E2D9C8", fontSize: "3rem" }}>FEATURES</h2>
          {loading ? (
            <div style={{ textAlign: 'center', color: '#E2D9C8', padding: '2rem' }}>
              Loading featured products...
            </div>
          ) : featuredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#E2D9C8', padding: '2rem' }}>
              No featured products available
            </div>
          ) : (
            <div className="features-slider-wrapper">
              <button className="slider-nav-btn slider-nav-left" onClick={scrollLeft} aria-label="Scroll left">
                <FaChevronLeft />
              </button>
              <div className="features-slider" ref={sliderRef}>
                <div className="features-track">
                  {featuredProducts.map((product) => (
                    <div 
                    className="feature-item" 
                    key={product.product_id}
                    onClick={() => navigate(`/product/${product.product_id}`)}
                    style={{ cursor: 'pointer' }}
                    >
                      <div className="feature-image">
                        <img src={getImageUrl(product.image_url)} alt={product.name} />
                      </div>
                      <div className="feature-overlay">
                        <div className="feature-details">
                          <h4>{product.name}</h4>
                          <div className="feature-price">
                            ${typeof product.price === 'number' ? Number(product.price).toFixed(2) : product.price}
                          </div>
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
              <button className="slider-nav-btn slider-nav-right" onClick={scrollRight} aria-label="Scroll right">
                <FaChevronRight />
              </button>
            </div>
          )}
        </Container>
      </section>

      {/* Why Us Section */}
      <section className="why-us-section" id="why-us">
        <Container>
          <h2 className="section-title" style={{ color: "#E2D9C8" }}>Why Us</h2>
          <div className="why-us-container">
            <div className="why-us-items">
              <div className="why-us-item">
                <div className="icon-box">
                  <BsFillSquareFill />
                </div>
                <p>Premium Fabrics, Sourced Globally</p>
              </div>
              <div className="why-us-item">
                <div className="icon-box">
                  <GiSewingMachine />
                </div>
                <p>Flawless Tailoring & Fit</p>
              </div>
              <div className="why-us-item">
                <div className="icon-box">
                  <GiSewingNeedle />
                </div>
                <p>Exclusive Designer Detailing</p>
              </div>
              <div className="why-us-item">
                <div className="icon-box">
                  <PiShirtFolded />
                </div>
                <p>Luxury Experience</p>
              </div>
            </div>
            <div className="why-us-image">
              <img src="/images/whyus.png" alt="Why Choose Us" className="img-fluid" />
            </div>
          </div>
          <div className="why-us-cta">
            <p className="cta-text">Ready to take your suits game to the next level?</p>
            <Button variant="light" className="why-shop-btn" onClick={scrollToCollection}>Shop Now</Button>
          </div>
        </Container>
      </section>

      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default Home;