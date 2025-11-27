import React, { useState, useEffect } from 'react';
import { Container, Alert } from 'react-bootstrap';
import { FaSignOutAlt, FaTimes } from 'react-icons/fa';
import '../../assets/css/admin/AddProduct.css';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../Api';

const SIZE_KEYS = ['XS', 'S', 'M', 'L', 'XL'];

const createInitialSelectedSizes = () =>
  SIZE_KEYS.reduce((acc, key) => ({ ...acc, [key]: false }), {});

const createInitialSizeColors = () =>
  SIZE_KEYS.reduce((acc, key) => ({ ...acc, [key]: [] }), {});

const createInitialSizeColorInputs = () =>
  SIZE_KEYS.reduce(
    (acc, key) => ({
      ...acc,
      [key]: { color: '#000000', quantity: '' }
    }),
    {}
  );

const AddProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeSection, setActiveSection] = useState('Suits');
  const [images, setImages] = useState([null, null, null, null]);
  const [imageFiles, setImageFiles] = useState([null, null, null, null]);
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
  const [selectedSizes, setSelectedSizes] = useState(() => createInitialSelectedSizes());
  const [sizeColors, setSizeColors] = useState(() => createInitialSizeColors());
  const [sizeColorInputs, setSizeColorInputs] = useState(() => createInitialSizeColorInputs());
  const [colors, setColors] = useState([]);
  const [colorInput, setColorInput] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleImageUpload = (index, event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const newImages = [...images];
      newImages[index] = reader.result;
      setImages(newImages);

      const newImageFiles = [...imageFiles];
      newImageFiles[index] = file;
      setImageFiles(newImageFiles);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData({
      ...productData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSizeChange = (size) => {
    setSelectedSizes((prev) => {
      const nextValue = !prev[size];
      if (!nextValue) {
        setSizeColors((prevColors) => ({ ...prevColors, [size]: [] }));
        setSizeColorInputs((prevInputs) => ({
          ...prevInputs,
          [size]: { color: '#000000', quantity: '' }
        }));
      }
      return {
        ...prev,
        [size]: nextValue
      };
    });
  };

  const handleSizeColorInputChange = (size, field, value) => {
    setSizeColorInputs((prev) => ({
      ...prev,
      [size]: {
        ...prev[size],
        [field]: field === 'quantity' ? value.replace(/[^0-9]/g, '') : value
      }
    }));
  };

  const handleAddSizeColor = (size) => {
    const { color, quantity } = sizeColorInputs[size];
    if (!color) {
      setStatus({ type: 'error', message: 'Please choose a color for this size.' });
      return;
    }
    const numericQuantity = Number(quantity);
    if (!quantity || numericQuantity <= 0) {
      setStatus({ type: 'error', message: 'Enter a valid quantity for the selected color.' });
      return;
    }

    if (sizeColors[size].some((entry) => entry.color === color)) {
      setStatus({ type: 'error', message: 'This color is already added for the selected size.' });
      return;
    }

    setSizeColors((prev) => ({
      ...prev,
      [size]: [...prev[size], { color, quantity: String(numericQuantity) }]
    }));

    setSizeColorInputs((prev) => ({
      ...prev,
      [size]: { color: '#000000', quantity: '' }
    }));
    setStatus({ type: '', message: '' });
  };

  const handleRemoveSizeColor = (size, indexToRemove) => {
    setSizeColors((prev) => ({
      ...prev,
      [size]: prev[size].filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSizeColorQuantityChange = (size, indexToUpdate, value) => {
    setSizeColors((prev) => ({
      ...prev,
      [size]: prev[size].map((entry, index) =>
        index === indexToUpdate
          ? { ...entry, quantity: value.replace(/[^0-9]/g, '') }
          : entry
      )
    }));
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
    localStorage.removeItem('isAdmin');
    window.history.replaceState(null, '', '/');
    navigate('/', { replace: true });
  };

  // Load product for edit mode
  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      setIsEditMode(true);
      setStatus({ type: '', message: '' });

      try {
        const res = await api.get(`/admin/product/${id}`);
        const { product, images: imageUrls, colors: colorList, sizes: sizeList } = res.data;

        setProductData({
          name: product.name || '',
          price: product.price || '',
          category: product.category || 'Suits',
          description1: product.description1 || '',
          description2: product.description2 || '',
          description3: product.description3 || '',
          collection: product.collection || '',
          material: product.material || '',
          technique: product.technique || '',
          packaging: product.packaging || '',
          featureProduct: !!product.is_featured
        });

        // Images: use absolute URLs for preview; existing files remain on server until replaced
        const apiBase = import.meta.env.VITE_API_URL?.replace(/\/$/, '');
        const previewImages = (imageUrls || []).map((file) =>
          apiBase ? `${apiBase}/uploads/${file}` : `/uploads/${file}`
        );
        setImages([
          previewImages[0] || null,
          previewImages[1] || null,
          previewImages[2] || null,
          previewImages[3] || null
        ]);
        setImageFiles([null, null, null, null]);

        // Global colors
        setColors(colorList || []);

        // Sizes
        const baseSelected = createInitialSelectedSizes();
        const baseSizeColors = createInitialSizeColors();

        (sizeList || []).forEach((sizeObj) => {
          const key = sizeObj.size;
          if (!baseSelected.hasOwnProperty(key)) return;

          baseSelected[key] = true;
          baseSizeColors[key] = (sizeObj.colors || [])
            .map((colorEntry) => {
              if (!colorEntry) return null;
              if (typeof colorEntry === 'string') {
                return { color: colorEntry, quantity: '' };
              }
              return {
                color: colorEntry.color || colorEntry.color_name || '',
                quantity:
                  colorEntry.quantity !== undefined && colorEntry.quantity !== null
                    ? String(colorEntry.quantity)
                    : ''
              };
            })
            .filter((entry) => entry.color);
        });

        setSelectedSizes(baseSelected);
        setSizeColors(baseSizeColors);
        setSizeColorInputs(createInitialSizeColorInputs());
      } catch (error) {
        const message = error?.response?.data?.error || 'Failed to load product for editing.';
        setStatus({ type: 'error', message });
      }
    };

    loadProduct();
  }, [id]);

  const resetForm = () => {
    setProductData({
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
    setImages([null, null, null, null]);
    setImageFiles([null, null, null, null]);
    setSelectedSizes(createInitialSelectedSizes());
    setSizeColors(createInitialSizeColors());
    setSizeColorInputs(createInitialSizeColorInputs());
    setColors([]);
    setColorInput('');
    setIsEditMode(false);
  };

  const validateForm = () => {
    const requiredFields = [
      'name',
      'price',
      'description1',
      'description2',
      'description3',
      'collection',
      'material',
      'technique',
      'packaging'
    ];

    const hasBasicFields = requiredFields.every(
      (field) => productData[field] && productData[field].toString().trim() !== ''
    );

    if (!hasBasicFields) {
      return false;
    }

    // In edit mode: allow existing images (from images array) OR new image files
    // In add mode: require at least one new image file
    if (isEditMode) {
      const hasExistingImages = images.some((img) => !!img);
      const hasNewImages = imageFiles.some((file) => !!file);
      if (!hasExistingImages && !hasNewImages) {
        return false;
      }
    } else {
      const hasAtLeastOneImage = imageFiles.some((file) => !!file);
      if (!hasAtLeastOneImage) {
        return false;
      }
    }

    const selectedSizeEntries = Object.entries(selectedSizes).filter(([, isChecked]) => isChecked);
    if (selectedSizeEntries.length === 0) {
      return false;
    }

    for (const [size] of selectedSizeEntries) {
      const colorsForSize = sizeColors[size];
      if (!colorsForSize.length) {
        return false;
      }

      const hasInvalidColor = colorsForSize.some(
        (entry) => !entry.color || !entry.quantity || Number(entry.quantity) <= 0
      );

      if (hasInvalidColor) {
        return false;
      }
    }

    if (colors.length === 0) {
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setStatus({
        type: 'error',
        message: 'Please input all the data before submitting'
      });
      return;
    }

    setStatus({ type: '', message: '' });
    setIsSubmitting(true);

    const formData = new FormData();

    formData.append('name', productData.name);
    formData.append('price', productData.price);
    formData.append('category', productData.category);
    formData.append('description1', productData.description1);
    formData.append('description2', productData.description2);
    formData.append('description3', productData.description3);
    formData.append('collection', productData.collection);
    formData.append('material', productData.material);
    formData.append('technique', productData.technique);
    formData.append('packaging', productData.packaging);
    formData.append('is_featured', productData.featureProduct ? 1 : 0);

    imageFiles.forEach((file) => {
      if (file) {
        formData.append('images', file);
      }
    });

    const sizesPayload = Object.entries(selectedSizes)
      .filter(([, isChecked]) => isChecked)
      .map(([sizeKey]) => ({
        size: sizeKey,
        colors: sizeColors[sizeKey].map(({ color, quantity }) => ({
          color,
          quantity: Number(quantity) || 0
        }))
      }));

    formData.append('colors', JSON.stringify(colors));
    formData.append('sizes', JSON.stringify(sizesPayload));

    try {
      await api.post('/admin/add-product', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setStatus({
        type: 'success',
        message: 'Product added successfully!'
      });
      resetForm();
      // Navigate to shirt-view after successful submission
      setTimeout(() => {
        navigate('/admin/shirt-view');
      }, 1000);
    } catch (error) {
      const message = error?.response?.data?.error || 'Failed to add product. Please try again.';
      setStatus({
        type: 'error',
        message
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!id) return;

    if (!validateForm()) {
      setStatus({
        type: 'error',
        message: 'Please input all the data before submitting'
      });
      return;
    }

    setStatus({ type: '', message: '' });
    setIsSubmitting(true);

    const formData = new FormData();

    formData.append('name', productData.name);
    formData.append('price', productData.price);
    formData.append('category', productData.category);
    formData.append('description1', productData.description1);
    formData.append('description2', productData.description2);
    formData.append('description3', productData.description3);
    formData.append('collection', productData.collection);
    formData.append('material', productData.material);
    formData.append('technique', productData.technique);
    formData.append('packaging', productData.packaging);
    formData.append('is_featured', productData.featureProduct ? 1 : 0);

    imageFiles.forEach((file) => {
      if (file) {
        formData.append('images', file);
      }
    });

    const sizesPayload = Object.entries(selectedSizes)
      .filter(([, isChecked]) => isChecked)
      .map(([sizeKey]) => ({
        size: sizeKey,
        colors: sizeColors[sizeKey].map(({ color, quantity }) => ({
          color,
          quantity: Number(quantity) || 0
        }))
      }));

    formData.append('colors', JSON.stringify(colors));
    formData.append('sizes', JSON.stringify(sizesPayload));

    try {
      await api.put(`/admin/update-product/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setStatus({
        type: 'success',
        message: 'Product updated successfully!'
      });
      // Navigate to shirt-view after successful update
      setTimeout(() => {
        navigate('/admin/shirt-view');
      }, 1000);
    } catch (error) {
      const message = error?.response?.data?.error || 'Failed to update product. Please try again.';
      setStatus({
        type: 'error',
        message
      });
    } finally {
      setIsSubmitting(false);
    }
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
          <h1 className="page-heading">{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>
          {status.message && (
            <Alert variant={status.type === 'success' ? 'success' : 'danger'} className="mb-4">
              {status.message}
            </Alert>
          )}

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

                          const newImageFiles = [...imageFiles];
                          newImageFiles[index] = null;
                          setImageFiles(newImageFiles);
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
              {SIZE_KEYS.map((size) => (
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
                      <div className="size-colors-section">
                        <div className="color-picker-controls">
                          <label className="color-picker-label">Choose Color:</label>
                          <input
                            type="color"
                            value={sizeColorInputs[size].color}
                            onChange={(e) => handleSizeColorInputChange(size, 'color', e.target.value)}
                            className="color-picker-input"
                          />
                          <input
                            type="number"
                            min="1"
                            placeholder="Quantity"
                            value={sizeColorInputs[size].quantity}
                            onChange={(e) => handleSizeColorInputChange(size, 'quantity', e.target.value)}
                            className="quantity-input"
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
                            {sizeColors[size].map((entry, index) => (
                              <span key={`${entry.color}-${index}`} className="size-color-tag">
                                <span
                                  className="color-circle"
                                  style={{ backgroundColor: entry.color }}
                                ></span>
                                <input
                                  type="number"
                                  min="0"
                                  className="quantity-input"
                                  value={entry.quantity}
                                  onChange={(e) =>
                                    handleSizeColorQuantityChange(size, index, e.target.value)
                                  }
                                />
                                <button
                                  type="button"
                                  className="remove-size-color-btn"
                                  onClick={() => handleRemoveSizeColor(size, index)}
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
              {isEditMode && (
                <button
                  className="action-btn update-btn"
                  onClick={handleUpdate}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Updating...' : 'Update'}
                </button>
              )}
              {!isEditMode && (
                <button
                  className="action-btn submit-btn"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              )}
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

