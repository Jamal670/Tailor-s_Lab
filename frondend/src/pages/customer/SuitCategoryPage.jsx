import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsCart2 } from 'react-icons/bs';
import { FiFilter } from 'react-icons/fi';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import Header from '../../components/headers/Header';
import Footer from '../../components/footers/Footer';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/suitCategory.css';

const SuitCategoryPage = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 3;

  const toggleFilter = () => {
    setActiveFilter(!activeFilter);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top of products section when changing pages
    document.querySelector('.product-display-section').scrollIntoView({ behavior: 'smooth' });
  };

  const products = [
    {
      id: 1,
      title: "Chocolate Brown Cotton Suit",
      price: "$340.00",
      image: "/images/feature.png",
      description: "Crafted in premium breathable cotton, this chocolate brown suit is where timeless sophistication meets everyday comfort."
    },
    {
      id: 2,
      title: "Navy Blue Wool Suit",
      price: "$420.00",
      image: "/images/feature.png",
      description: "Exceptional durability and refined drape, perfect for formal occasions and business meetings alike."
    },
    {
      id: 3,
      title: "Charcoal Grey Linen Suit",
      price: "$380.00",
      image: "/images/feature.png",
      description: "Lightweight comfort with sophisticated style, ideal for warm-weather formal events."
    },
    {
      id: 4,
      title: "Black Pinstripe Suit",
      price: "$450.00",
      image: "/images/feature.png",
      description: "Classic elegance with a modern twist, featuring subtle pinstripes for a distinguished professional look."
    },
    {
      id: 5,
      title: "Light Grey Summer Suit",
      price: "$320.00",
      image: "/images/feature.png",
      description: "Breathable and lightweight fabric perfect for summer events and outdoor ceremonies."
    },
    {
      id: 6,
      title: "Burgundy Velvet Suit",
      price: "$480.00",
      image: "/images/feature.png",
      description: "Rich velvet texture in a bold burgundy shade, designed for special occasions and evening events."
    },
    {
      id: 7,
      title: "Olive Green Suit",
      price: "$390.00",
      image: "/images/feature.png",
      description: "Unique olive green hue that stands out while maintaining sophistication and versatility."
    },
    {
      id: 8,
      title: "Royal Blue Suit",
      price: "$410.00",
      image: "/images/feature.png",
      description: "Vibrant royal blue that makes a statement while maintaining professional elegance."
    },
    {
      id: 9,
      title: "Tan Linen Blend Suit",
      price: "$360.00",
      image: "/images/feature.png",
      description: "Perfect for destination weddings and summer events with its breathable linen blend fabric."
    },
    {
      id: 10,
      title: "Midnight Black Tuxedo",
      price: "$520.00",
      image: "/images/feature.png",
      description: "Timeless black tuxedo with satin details, designed for formal black-tie events."
    },
    {
      id: 11,
      title: "Slate Grey Suit",
      price: "$400.00",
      image: "/images/feature.png",
      description: "Versatile slate grey that transitions seamlessly from day to evening events."
    },
    {
      id: 12,
      title: "Cream Summer Suit",
      price: "$370.00",
      image: "/images/feature.png",
      description: "Elegant cream suit perfect for summer garden parties and outdoor celebrations."
    }
  ];

  // Calculate pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  return (
    <div className="suit-category-wrapper">
      {/* Header Component */}
      <Header />

      {/* Hero Banner */}
      <section className="suit-hero-section">
        <div className="suit-hero-image">
          <img src="/images/SI.png" alt="Men in Suits" />
        </div>
      </section>

      {/* Brand Logos Section */}
      <section className="brand-logos-section">
        <div className="brand-logos-container">
          <div className="brand-logos-track">
            {[...Array(3)].map((_, repeatIndex) => (
              <React.Fragment key={`repeat-${repeatIndex}`}>
                <div className="brand-logo-item">
                  <img src="/images/1.png" alt="Esquire" />
                </div>
                <div className="brand-logo-item">
                  <img src="/images/2.png" alt="Brides" />
                </div>
                <div className="brand-logo-item">
                  <img src="/images/3.png" alt="Modern Luxury" />
                </div>
                <div className="brand-logo-item">
                  <img src="/images/4.png" alt="Indiegogo" />
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Breadcrumb Navigation */}
      <section className="breadcrumb-sections">
        <Container fluid className="px-4">
          <div className="breadcrumb-navs">
            <div className="breadcrumb-links">
              <Link to="/" style={{ color: '#E2D9C8' }}>Home</Link> / <Link to="/suits" style={{ color: '#E2D9C8' }}>Suits</Link>
            </div>
            <div className="filter-button" onClick={toggleFilter}>
              <FiFilter /> Filters
            </div>
          </div>
        </Container>
      </section>

      {/* Product Display Section */}
      <section className="product-display-section">
        <Container>
          {/* Filter Panel - conditionally shown */}
          {activeFilter && (
            <Row className="mb-4">
              <Col lg={12}>
                <div className="filter-container">
                  <h4>Filter By</h4>
                  <div className="filter-options-container">
                    <div className="filter-group">
                      <h5>Color</h5>
                      <div className="filter-options">
                        <label className="filter-option">
                          <input type="checkbox" name="color" value="black" />
                          <span className="checkmark"></span>
                          Black
                        </label>
                        <label className="filter-option">
                          <input type="checkbox" name="color" value="brown" />
                          <span className="checkmark"></span>
                          Brown
                        </label>
                        <label className="filter-option">
                          <input type="checkbox" name="color" value="navy" />
                          <span className="checkmark"></span>
                          Navy
                        </label>
                        <label className="filter-option">
                          <input type="checkbox" name="color" value="gray" />
                          <span className="checkmark"></span>
                          Gray
                        </label>
                      </div>
                    </div>

                    <div className="filter-group">
                      <h5>Material</h5>
                      <div className="filter-options">
                        <label className="filter-option">
                          <input type="checkbox" name="material" value="cotton" />
                          <span className="checkmark"></span>
                          Cotton
                        </label>
                        <label className="filter-option">
                          <input type="checkbox" name="material" value="wool" />
                          <span className="checkmark"></span>
                          Wool
                        </label>
                        <label className="filter-option">
                          <input type="checkbox" name="material" value="linen" />
                          <span className="checkmark"></span>
                          Linen
                        </label>
                      </div>
                    </div>

                    <div className="filter-group">
                      <h5>Price Range</h5>
                      <div className="filter-options">
                        <label className="filter-option">
                          <input type="checkbox" name="price" value="0-300" />
                          <span className="checkmark"></span>
                          $0 - $300
                        </label>
                        <label className="filter-option">
                          <input type="checkbox" name="price" value="300-500" />
                          <span className="checkmark"></span>
                          $300 - $500
                        </label>
                        <label className="filter-option">
                          <input type="checkbox" name="price" value="500+" />
                          <span className="checkmark"></span>
                          $500+
                        </label>
                      </div>
                    </div>
                  </div>

                  <Button variant="dark" className="apply-filter-btn">Apply Filters</Button>
                </div>
              </Col>
            </Row>
          )}

          {/* Product Display */}
          <Row className="justify-content-center">
            <Col xs={12}>
              <div className="product-container">
                {currentProducts.map(product => (
                  <div className="product-card" key={product.id}>
                    <div className="product-images">
                      <img src={product.image} alt={product.title} />
                    </div>
                    <div className="product-details-container">
                      <h2 className="product-title">{product.title}</h2>
                      <div className="product-prices">{product.price}</div>
                      <div className="product-description">
                        <p>{product.description}</p>
                      </div>
                      <Button variant="dark" className="shop-now-btn" onClick={() => navigate(`/product`)}>
                        <BsCart2 className="cart-icon" /> Shop Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Pagination Navigator */}
      <section className="pagination-section">
        <div className="pagination-container">
          <button
            className="pagination-arrow"
            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <IoIosArrowBack />
          </button>

          {[...Array(totalPages)].map((_, index) => {
            const pageNumber = index + 1;
            // Format page number to have leading zero for single digits
            const formattedPageNumber = pageNumber < 10 ? `0${pageNumber}` : pageNumber;
            return (
              <button
                key={pageNumber}
                className={`pagination-number ${currentPage === pageNumber ? 'active' : ''}`}
                onClick={() => handlePageChange(pageNumber)}
              >
                {formattedPageNumber}
              </button>
            );
          })}

          <button
            className="pagination-arrow"
            onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <IoIosArrowForward />
          </button>
        </div>
      </section>

      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default SuitCategoryPage;
