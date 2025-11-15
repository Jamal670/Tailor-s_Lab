import React, { useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../../assets/css/home.css';
import { FaCut, FaShoppingCart } from 'react-icons/fa';
import { BsFillSquareFill } from "react-icons/bs";
import { GiSewingMachine, GiSewingNeedle } from "react-icons/gi";
import { PiShirtFolded } from "react-icons/pi";
import { GiDiamonds } from "react-icons/gi";
import Header from '../../components/headers/Header';
import Footer from '../../components/footers/Footer';

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
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

  // Brand logos for the loop
  const brandLogos = [
    "/images/1.png",
    "/images/2.png",
    "/images/3.png",
    "/images/4.png"
  ];

  // Features data
  const featuresData = [
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
    },
    {
      id: 5,
      name: "Gray Herringbone Suit",
      price: "$390.00",
      image: "/images/feature.png"
    }
  ];

  return (
    <div className="home-wrapper">
      {/* Header Component */}
      <Header />

      {/* Hero Section */}
      <section className="hero-section" id="home">
        <div className="hero-content">
          <div className="hero-text">
            <p className="couture">Signature</p>
            <h1 className="suits">SUITS</h1>
            <Button variant="light" className="shop-now-btnn" onClick={scrollToCollection}>Shop Now</Button>
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
                At Tailor Lab, we believe the suit should be more than a uniform; it should be an
                expression of individuality. That's why we don't replicate tradition or follow trends. We
                design differently, experimenting and reimagining what modern tailoring can be.
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
          <div className="features-slider">
            <div className="features-track">
              {featuresData.map((feature) => (
                <div className="feature-item" key={feature.id}>
                  <div className="feature-image">
                    <img src={feature.image} alt={feature.name} />
                  </div>
                  <div className="feature-overlay">
                    <div className="feature-details">
                      <h4>{feature.name}</h4>
                      <div className="feature-price">{feature.price}</div>
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