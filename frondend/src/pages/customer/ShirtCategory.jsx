import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsCart2 } from 'react-icons/bs';
import { FiFilter } from 'react-icons/fi';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import Header from '../../components/headers/Header';
import Footer from '../../components/footers/Footer';
import { useNavigate } from 'react-router-dom';
import api from '../../Api';
import '../../assets/css/suitCategory.css';

const ShirtCategory = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalProducts: 0,
    currentPage: 1
  });
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState('');

  const colorOptions = ['Black', 'Brown', 'Navy', 'Gray', 'White', 'Blue'];
  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL'];
  const priceOptions = [
    { label: '$0 - $300', value: '0-300' },
    { label: '$300 - $500', value: '300-500' },
    { label: '$500+', value: '500+' }
  ];

  // Fetch products when page changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const hasFilters = selectedColors.length > 0 || selectedSizes.length > 0 || selectedPriceRange;
        let response;

        if (hasFilters) {
          const params = new URLSearchParams();
          params.append('category', 'shirts');
          params.append('page', currentPage);
          if (selectedColors.length) params.append('colors', selectedColors.join(','));
          if (selectedSizes.length) params.append('sizes', selectedSizes.join(','));
          if (selectedPriceRange) params.append('priceRange', selectedPriceRange);
          response = await api.get(`/user/filter-products?${params.toString()}`);
        } else {
          response = await api.get(`/user/get-shirts-products?page=${currentPage}`);
        }

        setProducts(response.data.products || []);
        setPagination(
          response.data.pagination || {
            totalPages: 1,
            totalProducts: 0,
            currentPage: 1
          }
        );
      } catch (error) {
        console.error('Error fetching shirts products:', error);
        setProducts([]);
        setPagination({
          totalPages: 1,
          totalProducts: 0,
          currentPage: 1
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, selectedColors, selectedSizes, selectedPriceRange]);

  const toggleFilter = () => {
    setActiveFilter(!activeFilter);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  const handleColorToggle = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((item) => item !== color) : [...prev, color]
    );
    setCurrentPage(1);
  };

  const handleSizeToggle = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((item) => item !== size) : [...prev, size]
    );
    setCurrentPage(1);
  };

  const handlePriceSelect = (range) => {
    setSelectedPriceRange((prev) => (prev === range ? '' : range));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedColors([]);
    setSelectedSizes([]);
    setSelectedPriceRange('');
    setCurrentPage(1);
  };

  const filtersApplied =
    selectedColors.length > 0 || selectedSizes.length > 0 || selectedPriceRange;
    // Scroll to top of products section when changing pages
    setTimeout(() => {
      const section = document.querySelector('.product-display-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Get image URL helper
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "/images/feature.png";
    const apiBase = import.meta.env.VITE_API_URL?.replace(/\/$/, '');
    return apiBase ? `${apiBase}/uploads/${imageUrl}` : `/uploads/${imageUrl}`;
  };

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
              <Link to="/" style={{ color: '#E2D9C8' }}>Home</Link> / <Link to="/shirts" style={{ color: '#E2D9C8' }}>Shirts</Link>
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
                        {colorOptions.map((color) => (
                          <label className="filter-option" key={color}>
                            <input
                              type="checkbox"
                              checked={selectedColors.includes(color)}
                              onChange={() => handleColorToggle(color)}
                            />
                            <span className="checkmark"></span>
                            {color}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="filter-group">
                      <h5>Size</h5>
                      <div className="filter-options">
                        {sizeOptions.map((size) => (
                          <label className="filter-option" key={size}>
                            <input
                              type="checkbox"
                              checked={selectedSizes.includes(size)}
                              onChange={() => handleSizeToggle(size)}
                            />
                            <span className="checkmark"></span>
                            {size}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="filter-group">
                      <h5>Price Range</h5>
                      <div className="filter-options">
                        {priceOptions.map((option) => (
                          <label className="filter-option" key={option.value}>
                            <input
                              type="checkbox"
                              checked={selectedPriceRange === option.value}
                              onChange={() => handlePriceSelect(option.value)}
                            />
                            <span className="checkmark"></span>
                            {option.label}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {filtersApplied && (
                    <Button variant="dark" className="apply-filter-btn" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  )}
                </div>
              </Col>
            </Row>
          )}

          {/* Product Display */}
          <Row className="justify-content-center">
            <Col xs={12}>
              {loading ? (
                <div style={{ textAlign: 'center', color: '#E2D9C8', padding: '2rem' }}>
                  Loading products...
                </div>
              ) : products.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#E2D9C8', padding: '2rem' }}>
                  No products available
                </div>
              ) : (
                <div className="product-container">
                  {products.map(product => (
                    <div className="product-card" key={product.product_id}>
                      <div className="product-images">
                        <img src={getImageUrl(product.image_url)} alt={product.name} />
                      </div>
                      <div className="product-details-container">
                        <h2 className="product-title">{product.name}</h2>
                        <div className="product-prices">
                          ${typeof product.price === 'number' ? Number(product.price).toFixed(2) : product.price}
                        </div>
                        <div className="product-description">
                          <p>{product.description1 || 'No description available'}</p>
                        </div>
                        <Button variant="dark" className="shop-now-btn" onClick={() => navigate(`/product/${product.product_id}`)}>
                          <BsCart2 className="cart-icon" /> Shop Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </section>

      {/* Pagination Navigator */}
      {!loading && pagination.totalPages > 0 && (
        <section className="pagination-section">
          <div className="pagination-container">
            <button
              className="pagination-arrow"
              onClick={() => pagination.currentPage > 1 && handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
            >
              <IoIosArrowBack />
            </button>

            {[...Array(pagination.totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              // Format page number to have leading zero for single digits
              const formattedPageNumber = pageNumber < 10 ? `0${pageNumber}` : pageNumber;
              return (
                <button
                  key={pageNumber}
                  className={`pagination-number ${pagination.currentPage === pageNumber ? 'active' : ''}`}
                  onClick={() => handlePageChange(pageNumber)}
                >
                  {formattedPageNumber}
                </button>
              );
            })}

            <button
              className="pagination-arrow"
              onClick={() => pagination.currentPage < pagination.totalPages && handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
            >
              <IoIosArrowForward />
            </button>
          </div>
        </section>
      )}

      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default ShirtCategory;
