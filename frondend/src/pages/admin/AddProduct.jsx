import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import { FaSignOutAlt, FaTimes } from 'react-icons/fa';
import '../../assets/css/admin/AddProduct.css';
import { useNavigate } from 'react-router-dom';     
const AddProduct = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('Suits');
  const [images, setImages] = useState([null, null, null, null]);
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    category: 'Suits',
    description1: '',
    description2: '',
    description3: '',
    collection: '',
    material: '',
    technique: '',
    packaging: '',
    featureProduct: false
  });
  const [selectedSizes, setSelectedSizes] = useState({
    XS: false,
    S: false,
    M: false,
    L: false
  });
  const [sizeQuantities, setSizeQuantities] = useState({
    XS: '',
    S: '',
    M: '',
    L: ''
  });
  const [sizeColors, setSizeColors] = useState({
    XS: [],
    S: [],
    M: [],
    L: []
  });
  const [sizeColorPickers, setSizeColorPickers] = useState({
    XS: '#000000',
    S: '#000000',
    M: '#000000',
    L: '#000000'
  });
  const [colors, setColors] = useState([]);
  const [colorInput, setColorInput] = useState('');

  const handleImageUpload = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImages = [...images];
        newImages[index] = reader.result;
        setImages(newImages);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData({
      ...productData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSizeChange = (size) => {
    setSelectedSizes({
      ...selectedSizes,
      [size]: !selectedSizes[size]
    });
  };

  const handleQuantityChange = (size, value) => {
    setSizeQuantities({
      ...sizeQuantities,
      [size]: value
    });
  };

  const handleSizeColorPickerChange = (size, value) => {
    setSizeColorPickers({
      ...sizeColorPickers,
      [size]: value
    });
  };

  const handleAddSizeColor = (size) => {
    const color = sizeColorPickers[size];
    if (color && !sizeColors[size].includes(color)) {
      setSizeColors({
        ...sizeColors,
        [size]: [...sizeColors[size], color]
      });
    }
  };

  const handleRemoveSizeColor = (size, colorToRemove) => {
    setSizeColors({
      ...sizeColors,
      [size]: sizeColors[size].filter(color => color !== colorToRemove)
    });
  };

  const handleColorAdd = (e) => {
    if (e.key === 'Enter' && colorInput.trim() !== '') {
      e.preventDefault();
      setColors([...colors, colorInput.trim()]);
      setColorInput('');
    }
  };

  const handleColorRemove = (index) => {
    const newColors = colors.filter((_, i) => i !== index);
    setColors(newColors);
  };

  const handleLogout = () => {
    console.log('Logout');
    // Add logout logic here
  };

  const handleSubmit = () => {
    console.log('Submit product:', {
      ...productData,
      images,
      sizes: selectedSizes,
      quantities: sizeQuantities,
      sizeColors,
      colors
    });
    // Add submit logic here
  };

  const handleUpdate = () => {
    console.log('Update product:', {
      ...productData,
      images,
      sizes: selectedSizes,
      quantities: sizeQuantities,
      sizeColors,
      colors
    });
    // Add update logic here
  };

  const handleCancel = () => {
    console.log('Cancel');
    // Add cancel logic here
    navigate(-1);
  };

  return (
    <div className="admin-wrapper">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-content">
          <div className="sidebar-logo">
            <img src="/images/brandlogo.png" alt="Tailor Lab Logo" />
          </div>
          
          <nav className="sidebar-nav">
            <div 
              className={`nav-item ${activeSection === 'Suits' ? 'active' : ''}`}
              onClick={() => navigate('/admin/shirt-view')}
            >
              Suits
            </div>
            <div 
              className={`nav-item ${activeSection === 'Shirts' ? 'active' : ''}`}
              onClick={() => navigate('/admin/shirt-view')}
            >
              Shirts
            </div>
            <div 
              className={`nav-item ${activeSection === 'Trousers' ? 'active' : ''}`}
              onClick={() => navigate('/admin/shirt-view')}
            >
              Trousers
            </div>
          </nav>

          <div className="sidebar-footer">
            <div className="logout-item" onClick={handleLogout}>
              <FaSignOutAlt className="logout-icon" />
              <span>Logout</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main-content">
        <Container fluid className="admin-container">
          <h1 className="page-heading">Add New Product</h1>

          {/* Image Upload Section */}
          <div className="form-section">
            <h3 className="section-title">Choose Image</h3>
            <div className="image-upload-row">
              {images.map((image, index) => (
                <div key={index} className="image-upload-item">
                  {image ? (
                    <div className="image-preview">
                      <img src={image} alt={`Upload ${index + 1}`} />
                      <button 
                        className="remove-image-btn"
                        onClick={() => {
                          const newImages = [...images];
                          newImages[index] = null;
                          setImages(newImages);
                        }}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ) : (
                    <label className="image-upload-placeholder">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(index, e)}
                        style={{ display: 'none' }}
                      />
                      <div className="upload-icon">+</div>
                      <span>Upload Image</span>
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Product Details Section */}
          <div className="form-section">
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={productData.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Price</label>
                <input
                  type="number"
                  name="price"
                  value={productData.price}
                  onChange={handleInputChange}
                  placeholder="Enter price"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  name="category"
                  value={productData.category}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="Suits">Suits</option>
                  <option value="Shirts">Shirts</option>
                  <option value="Trousers">Trousers</option>
                </select>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="form-section">
            <h3 className="section-title">Description</h3>
            <div className="description-container">
              <div className="description-item">
                <label className="description-label">Description 1</label>
                <textarea
                  name="description1"
                  value={productData.description1}
                  onChange={handleInputChange}
                  placeholder="Enter first description paragraph"
                  className="form-textarea"
                  rows="5"
                />
              </div>
              <div className="description-item">
                <label className="description-label">Description 2</label>
                <textarea
                  name="description2"
                  value={productData.description2}
                  onChange={handleInputChange}
                  placeholder="Enter second description paragraph"
                  className="form-textarea"
                  rows="5"
                />
              </div>
              <div className="description-item">
                <label className="description-label">Description 3</label>
                <textarea
                  name="description3"
                  value={productData.description3}
                  onChange={handleInputChange}
                  placeholder="Enter third description paragraph"
                  className="form-textarea"
                  rows="5"
                />
              </div>
            </div>
          </div>

          {/* Sizes Section */}
          <div className="form-section">
            <h3 className="section-title">Sizes</h3>
            <div className="sizes-container">
              {['XS', 'S', 'M', 'L'].map((size) => (
                <div key={size} className="size-item-wrapper">
                  <label className="size-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedSizes[size]}
                      onChange={() => handleSizeChange(size)}
                    />
                    <span>{size}</span>
                  </label>
                  {selectedSizes[size] && (
                    <div className="size-details">
                      <div className="quantity-wrapper">
                        <label className="quantity-label">Quantity:</label>
                        <input
                          type="number"
                          placeholder="Enter quantity"
                          value={sizeQuantities[size]}
                          onChange={(e) => handleQuantityChange(size, e.target.value)}
                          className="quantity-input"
                        />
                      </div>
                      <div className="size-colors-section">
                        <div className="color-picker-controls">
                          <label className="color-picker-label">Choose Color:</label>
                          <input
                            type="color"
                            value={sizeColorPickers[size]}
                            onChange={(e) => handleSizeColorPickerChange(size, e.target.value)}
                            className="color-picker-input"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddSizeColor(size)}
                            className="add-color-btn"
                          >
                            Add Color
                          </button>
                        </div>
                        {sizeColors[size].length > 0 && (
                          <div className="size-color-tags">
                            {sizeColors[size].map((color, index) => (
                              <span key={index} className="size-color-tag">
                                <span
                                  className="color-circle"
                                  style={{ backgroundColor: color }}
                                ></span>
                                <button
                                  type="button"
                                  className="remove-size-color-btn"
                                  onClick={() => handleRemoveSizeColor(size, color)}
                                >
                                  ❌
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Colors Section */}
          <div className="form-section">
            <h3 className="section-title">Colors</h3>
            <div className="colors-container">
              <input
                type="text"
                value={colorInput}
                onChange={(e) => setColorInput(e.target.value)}
                onKeyDown={handleColorAdd}
                placeholder="Type color name and press Enter"
                className="color-input"
              />
              <div className="color-tags">
                {colors.map((color, index) => (
                  <span key={index} className="color-tag">
                    {color}
                    <button
                      className="remove-color-btn"
                      onClick={() => handleColorRemove(index)}
                    >
                      ❌
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="form-section">
            <h3 className="section-title">Additional Information</h3>
            <div className="additional-info-container">
              <div className="form-row">
                <div className="form-group">
                  <label>Collection</label>
                  <input
                    type="text"
                    name="collection"
                    value={productData.collection}
                    onChange={handleInputChange}
                    placeholder="Enter collection name"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Material</label>
                  <input
                    type="text"
                    name="material"
                    value={productData.material}
                    onChange={handleInputChange}
                    placeholder="Enter material"
                    className="form-input"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Technique</label>
                  <input
                    type="text"
                    name="technique"
                    value={productData.technique}
                    onChange={handleInputChange}
                    placeholder="Enter technique"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Packaging</label>
                  <input
                    type="text"
                    name="packaging"
                    value={productData.packaging}
                    onChange={handleInputChange}
                    placeholder="Enter packaging details"
                    className="form-input"
                  />
                </div>
              </div>
              
            </div>
          </div>

          {/* Action Buttons Section */}
          <div className="form-section action-buttons-section">
            <div className="action-buttons-row">
            <div className="form-row">
                <div className="form-group ">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="featureProduct"
                      checked={productData.featureProduct}
                      onChange={handleInputChange}
                      className="feature-checkbox"
                    />
                    <span>Feature Product</span>
                  </label>
                </div>
              </div>
              <button className="action-btn update-btn" onClick={handleUpdate}>
                Update
              </button>
              <button className="action-btn submit-btn" onClick={handleSubmit}>
                Submit
              </button>
              <button className="action-btn cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
};

export default AddProduct;

