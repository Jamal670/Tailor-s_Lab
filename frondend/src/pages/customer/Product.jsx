import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { BsCart2 } from 'react-icons/bs';
import { FaShoppingCart, FaFacebookF, FaPinterestP, FaLinkedinIn, FaInstagram } from 'react-icons/fa';
import Header from '../../components/headers/Header';
import Footer from '../../components/footers/Footer';
import api from '../../Api';
import { addToCart, getCartItems } from '../../utils/cartUtils';
import { formatColorLabel } from '../../utils/colorUtils';
import '../../assets/css/Product.css';

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [stockMessage, setStockMessage] = useState('');

  // Fetch product details
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/user/get-product-details/${id}`);
        const { product: productData, images: productImages, colors: productColors, sizes: productSizes } = response.data;
        
        setProduct(productData);
        setImages(productImages || []);
        setColors(productColors || []);
        setSizes(productSizes || []);
        
        // Set default selections based on available stock
        const validSizes = (productSizes || []).filter(sizeHasAvailableColors);
        if (validSizes.length > 0) {
          setSelectedSize(validSizes[0].size);
          const sizeColors = transformSizeColors(validSizes[0]);
          setSelectedColor(sizeColors[0]?.color || '');
        } else if (productColors && productColors.length > 0) {
          setSelectedColor(productColors[0]);
        } else {
          setSelectedSize('');
          setSelectedColor('');
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  // Fetch related products
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!product || !product.category || !id) return;
      
      try {
        const response = await api.get(`/user/get-related-products/${product.category}?id=${id}`);
        setRelatedProducts(response.data || []);
      } catch (error) {
        console.error('Error fetching related products:', error);
        setRelatedProducts([]);
      }
    };

    if (product && id) {
      fetchRelatedProducts();
    }
  }, [product, id]);

  const sizeHasAvailableColors = (sizeEntry) => transformSizeColors(sizeEntry).length > 0;

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setStockMessage('');
  };

  const handleSizeSelect = (size) => {
    if (!availableSizes.includes(size)) return;
    setSelectedSize(size);
  };

  const handleImageSelect = (index) => {
    setSelectedImageIndex(index);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      setStockMessage('');
    }
  };

  const increaseQuantity = () => {
    if (!availableQuantity) {
      setStockMessage('Selected size/color is out of stock.');
      return;
    }
    if (quantity >= availableQuantity) {
      setStockMessage('');
      return;
    }
    setQuantity(quantity + 1);
    setStockMessage('');
  };

  // Handle Add to Cart
  const handleAddToCart = () => {
    if (!product) return;

    if (!selectedSize || !selectedColor || availableQuantity === 0) {
      alert('Selected size/color is out of stock.');
      return;
    }

    if (quantity > availableQuantity || quantity === 0) {
      alert('You cannot select more than the available quantity for this color.');
      return;
    }

    const cartItems = getCartItems();
    const colorLabel = selectedColor ? formatColorLabel(selectedColor) : '';
    const existingItem = cartItems.find(
      (item) =>
        item.product_id === product.product_id &&
        item.size === selectedSize &&
        (item.color === colorLabel || item.color_hex === selectedColor)
    );
    const existingQuantity = existingItem?.quantity || 0;
    if (existingQuantity + quantity > availableQuantity) {
      alert(`Only ${availableQuantity} unit(s) available for the selected size and color.`);
      return;
    }

    const firstImage = images[0] || '';

    const cartItem = {
      product_id: product.product_id,
      name: product.name,
      price: product.price,
      image_url: firstImage,
      category: product.category || '',
      size: selectedSize || '',
      color: colorLabel,
      color_hex: selectedColor || '',
      quantity: quantity,
      maxQuantity: availableQuantity
    };

    addToCart(cartItem);
    setStockMessage('');
    
    // Show success message (optional - you can add a toast notification here)
    alert(`${product.name} added to cart!`);
  };

  // Get image URL helper
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "/images/feature.png";
    const apiBase = import.meta.env.VITE_API_URL?.replace(/\/$/, '');
    return apiBase ? `${apiBase}/uploads/${imageUrl}` : `/uploads/${imageUrl}`;
  };

  const transformSizeColors = (sizeEntry) => {
    if (!sizeEntry || !Array.isArray(sizeEntry.colors)) return [];
    return (sizeEntry.colors || [])
      .map((entry) => {
        if (!entry) return null;
        const colorValue = typeof entry === 'string' ? entry : (entry.color || entry.color_name || '');
        const qtyValue =
          typeof entry === 'object' ? Number(entry.quantity) || 0 : 0;
        return {
          color: colorValue,
          quantity: qtyValue
        };
      })
      .filter((entry) => entry && entry.color && entry.quantity > 0);
  };

  const getSizeColorOptions = (sizeValue) => {
    if (!sizeValue) return [];
    const sizeObj = sizes.find((s) => s.size === sizeValue);
    return transformSizeColors(sizeObj);
  };

  const currentSizeColors = useMemo(
    () => getSizeColorOptions(selectedSize),
    [selectedSize, sizes]
  );

  const getSelectedColorData = () =>
    currentSizeColors.find((entry) => entry.color === selectedColor);

  const availableQuantity = getSelectedColorData()?.quantity || 0;

  useEffect(() => {
    if (!availableQuantity) {
      if (selectedColor) {
        setStockMessage('Selected size/color is out of stock.');
      }
      setQuantity(0);
      return;
    }
    if (quantity === 0) {
      setQuantity(1);
      setStockMessage('');
      return;
    }
    if (quantity > availableQuantity) {
      setQuantity(availableQuantity);
      setStockMessage('Quantity adjusted to available stock.');
    } else {
      setStockMessage('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableQuantity]);

  useEffect(() => {
    if (!sizes.length) return;
    if (currentSizeColors.length > 0) {
      const hasSelected = currentSizeColors.some(
        (entry) => entry.color === selectedColor
      );
      if (!hasSelected) {
        setSelectedColor(currentSizeColors[0].color);
        setQuantity(1);
      }
    } else {
      setSelectedColor('');
      setQuantity(0);
    }
  }, [currentSizeColors, selectedColor, sizes.length]);

  const availableSizes = useMemo(
    () => sizes.filter(sizeHasAvailableColors).map((s) => s.size),
    [sizes]
  );

  useEffect(() => {
    if (!availableSizes.length) {
      setSelectedSize('');
      setSelectedColor('');
      setQuantity(0);
      return;
    }
    if (!availableSizes.includes(selectedSize)) {
      setSelectedSize(availableSizes[0]);
    }
  }, [availableSizes, selectedSize]);

  const getColorStyle = (color) => {
    if (!color) return {};
    const normalized = color.trim().toLowerCase();
    const isWhite =
      normalized === '#fff' || normalized === '#ffffff' || normalized === 'white';
    return {
      backgroundColor: color,
      border: isWhite ? '1px solid #ccc' : 'none'
    };
  };

  if (loading) {
    return (
      <div className="product-wrapper">
        <Header />
        <div style={{ textAlign: 'center', color: '#E2D9C8', padding: '4rem' }}>
          Loading product details...
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-wrapper">
        <Header />
        <div style={{ textAlign: 'center', color: '#E2D9C8', padding: '4rem' }}>
          Product not found
        </div>
        <Footer />
      </div>
    );
  }

  const mainImage = images[selectedImageIndex] || images[0] || '';

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
                      {images.slice(0, 3).map((img, index) => (
                        <div 
                          key={index}
                          className={`thumbnail-item ${selectedImageIndex === index ? 'active' : ''}`}
                          onClick={() => handleImageSelect(index)}
                        >
                          <img src={getImageUrl(img)} alt={`Product thumbnail ${index + 1}`} />
                        </div>
                      ))}
                    </div>
                    <div className="product-main-image">
                      <img src={getImageUrl(mainImage)} alt={product.name} />
                    </div>
                  </Col>
                  <Col md={6} className="product-details">
                    <h1 className="product-title">{product.name}</h1>
                    <div className="product-prices">
                      ${typeof product.price === 'number' ? Number(product.price).toFixed(2) : product.price}
                    </div>
                    <div className="product-description">
                      <p>{product.description1 || 'No description available'}</p>
                    </div>
                    
                    <div className="product-options">
                      {availableSizes.length > 0 && (
                        <div className="option-item">
                          <h4>Size</h4>
                          <div className="size-options">
                            {availableSizes.map((size) => (
                              <button 
                                key={size}
                                className={`size-btn ${selectedSize === size ? 'active' : ''}`} 
                                onClick={() => handleSizeSelect(size)}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="option-item">
                        <h4>Color</h4>
                        {currentSizeColors.length > 0 ? (
                          <div className="color-options">
                            {currentSizeColors.map(({ color, quantity: colorQty }) => (
                              <button 
                                key={color}
                                className={`color-btn ${selectedColor === color ? 'active' : ''}`} 
                                onClick={() => handleColorSelect(color)}
                                aria-label={`Color ${color} (Qty: ${colorQty})`}
                                style={getColorStyle(color)}
                              ></button>
                            ))}
                          </div>
                        ) : (
                          <p className="color-hint">Select a size to view available colors.</p>
                        )}
                      </div>

                      <div className="quantity-cart-section">
                        <div className="quantity-container" style={{ border: '1px solid #E2D9C8' }}>
                          <button className="quantity-btn minus" onClick={decreaseQuantity} style={{ border: '1px solid #E2D9C8', color: '#E2D9C8' }} >-</button>
                          <div className="quantity-value">{quantity}</div>
                          <button className="quantity-btn plus" onClick={increaseQuantity} style={{ border: '1px solid #E2D9C8', color: '#E2D9C8' }} >+</button>
                        </div>
                        
                        
                        <Button className="add-to-cart-btn" variant="dark" onClick={handleAddToCart}>
                          <BsCart2 className="cart-icons" /> Add to cart
                        </Button>
                      </div>
                        {selectedColor && availableQuantity > 0 && (
                          <p className="color-stock-info">Stock Left: {availableQuantity}</p>
                        )}
                        {stockMessage && (
                          <p className="stock-warning">{stockMessage}</p>
                        )}
                    </div>
                    
                    <div className="product-meta">
                      <div className="size-guide">
                        <a href="#">Size Guide <span className="size-guide-icon">📏</span></a>
                        <span className="sku">SKU: {product.pro_code || 'N/A'}</span>
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
                  <div className="description-content-wrapper">
                    <div className="description-text">
                      <h2 className="tab-title">{product.name}</h2>
                      <p>{product.description1 || product.description2 || product.description3 || 'No description available'}</p>
                    </div>
                    <div className="description-images">
                      {images.slice(0, 2).map((img, index) => (
                        <div key={index} className="description-image">
                          <img src={getImageUrl(img)} alt={`${product.name} view ${index + 1}`} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Row 2: Description Box (Left) + Image with Details (Right) - Desktop/Tablet */}
                  <Row className="description-row-2 desktop-row-2">
                    <Col md={6} className="description-image-details-column">
                      <div className="image-details-wrapper">
                        {images[2] && (
                          <div className="row-2-product-image">
                            <img src={getImageUrl(images[2])} alt={product.name} />
                          </div>
                        )}
                        <div className="row-2-description-details">
                          {product.collection && (
                            <div className="description-detail-item">
                              <h3>Collection</h3>
                              <p>{product.collection}</p>
                            </div>
                          )}
                          {availableSizes.length > 0 && (
                            <div className="description-detail-item">
                              <h3>Size</h3>
                              <p>{availableSizes.join(', ')}</p>
                            </div>
                          )}
                          {product.material && (
                            <div className="description-detail-item">
                              <h3>Materials</h3>
                              <p>{product.material}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </Col> 
                    
                    <Col md={6} className="description-box-column">
                      <div className="description-box-container">
                        <div className="description-box-text">
                          <p>{product.description2 || product.description3 || product.description1 || 'No additional description available'}</p>
                        </div>
                      </div>
                    </Col>
                  </Row>

                  {/* Row 2: Mobile Only - Details Section */}
                  <div className="mobile-row-2-details">
                    <div className="mobile-description-details">
                      {product.collection && (
                        <div className="description-detail-item">
                          <h3>Collection</h3>
                          <p>{product.collection}</p>
                        </div>
                      )}
                      {availableSizes.length > 0 && (
                        <div className="description-detail-item">
                          <h3>Size</h3>
                          <p>{availableSizes.join(', ')}</p>
                        </div>
                      )}
                      {product.material && (
                        <div className="description-detail-item">
                          <h3>Materials</h3>
                          <p>{product.material}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Information Tab Content */}
              {activeTab === 'additional' && (
                <div className="tab-content additional-content">
                  <div className="additional-info-wrapper">
                    {colors.length > 0 && (
                      <div className="additional-info-item">
                        <div className="info-label">Color</div>
                        <div className="info-value">{colors.join(', ')}</div>
                      </div>
                    )}
                    {availableSizes.length > 0 && (
                      <div className="additional-info-item">
                        <div className="info-label">Size</div>
                        <div className="info-value">{availableSizes.join(', ')}</div>
                      </div>
                    )}
                    {product.technique && (
                      <div className="additional-info-item">
                        <div className="info-label">Technique</div>
                        <div className="info-value">{product.technique}</div>
                      </div>
                    )}
                    {product.packaging && (
                      <div className="additional-info-item">
                        <div className="info-label">Packaging</div>
                        <div className="info-value">{product.packaging}</div>
                      </div>
                    )}
                    
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
      {relatedProducts.length > 0 && (
        <section className="features-section">
          <Container>
            <h2 className="section-title" style={{ color: "#E2D9C8", fontSize: "3rem" }}>RELATED PRODUCTS</h2>
            <div className="features-slider">
              <div className="features-track">
                {relatedProducts.map((relatedProduct) => (
                  <div 
                    className="feature-item" 
                    key={relatedProduct.product_id}
                    onClick={() => navigate(`/product/${relatedProduct.product_id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="feature-image">
                      <img src={getImageUrl(relatedProduct.image_url)} alt={relatedProduct.name} />
                    </div>
                    <div className="feature-overlay">
                      <div className="feature-details">
                        <h4>{relatedProduct.name}</h4>
                        <div className="feature-price">
                          ${typeof relatedProduct.price === 'number' ? Number(relatedProduct.price).toFixed(2) : relatedProduct.price}
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
          </Container>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default Product;
