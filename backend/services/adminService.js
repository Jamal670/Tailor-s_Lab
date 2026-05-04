const Admin = require('../models/Admin');
const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');
const { generateProductCode } = require('../controllers/sendMailer'); // keeping this import

const CATEGORY_PREFIX_MAP = {
  suits: 'SU',
  trousers: 'TR',
  shirts: 'SH'
};

const normalizeSizeColors = (inputColors) => {
  if (!Array.isArray(inputColors)) return [];
  return inputColors
    .map((entry) => {
      if (!entry) return null;
      if (typeof entry === 'string') return { color: entry, quantity: 0 };
      if (typeof entry === 'object') {
        return {
          color: entry.color || entry.color_name || entry.hex || '',
          quantity: Number(entry.quantity) || 0
        };
      }
      return null;
    })
    .filter((item) => item && item.color);
};

exports.adminLogin = async (email, password) => {
  const admin = await Admin.findOne({ email, password });
  if (!admin) throw new Error('Invalid credentials');
  return admin;
};

exports.addProduct = async (productData, imagesData) => {
  const { category, name, price, description1, description2, description3, collection, material, technique, packaging, is_featured, colors, sizes } = productData;

  const parseOrFallback = (value, fallback) => {
    if (!value || value === 'undefined') return fallback;
    if (Array.isArray(value)) return value;
    if (typeof value === 'object') return value;
    if (typeof value === 'string') return JSON.parse(value);
    return fallback;
  };

  let colorList = parseOrFallback(colors, []);   
  let sizeList = parseOrFallback(sizes, []);

  const normalizedSizes = sizeList.map(size => {
    return {
      size: size.size,
      colors: normalizeSizeColors(size.colors)
    };
  }).filter(s => s.size);

  const images = imagesData.map((img, index) => ({
    image_url: img.filename,
    firstimg: index === 0
  }));

  const randomNumber = generateProductCode().toString().padStart(5, '0');
  const categoryKey = (category || '').toLowerCase();
  const prefix = CATEGORY_PREFIX_MAP[categoryKey] || 'PR';
  const proCode = `${prefix}-${randomNumber}`;

  const newProduct = new Product({
    category,
    name,
    price,
    description1,
    description2,
    description3,
    product_collection: collection,
    material,
    technique,
    packaging,
    is_featured: is_featured || false,
    pro_code: proCode,
    colors: colorList,
    sizes: normalizedSizes,
    images
  });

  await newProduct.save();
  return newProduct._id;
};

exports.getProductsByCategory = async (category) => {
  const products = await Product.find({ category: new RegExp(`^${category}$`, 'i') }).sort({ _id: -1 });
  
  // Format to match old SQL response:
  return products.map(p => {
    // calculate total quantity
    let total_quantity = 0;
    p.sizes.forEach(s => {
      s.colors.forEach(c => {
        total_quantity += c.quantity || 0;
      });
    });

    return {
      product_id: p._id,
      name: p.name,
      price: p.price,
      pro_code: p.pro_code,
      total_quantity,
      // adding for convenience if frontend needs it
      category: p.category, 
      images: p.images
    };
  });
};

exports.deleteProduct = async (id) => {
  const product = await Product.findById(id);
  if (!product) throw new Error('Product not found');

  // Delete images
  if (product.images && product.images.length > 0) {
    const uploadsDir = path.join(__dirname, '../uploads');
    product.images.forEach(img => {
      const imagePath = path.join(uploadsDir, img.image_url);
      if (fs.existsSync(imagePath)) {
        try {
          fs.unlinkSync(imagePath);
        } catch (err) {
          console.error(`Error deleting file ${img.image_url}:`, err);
        }
      }
    });
  }

  await Product.findByIdAndDelete(id);
};

exports.getProductById = async (id) => {
  const product = await Product.findById(id);
  if (!product) throw new Error('Product not found');
  
  // Match old response payload for frontend compatibility
  const productObj = product.toObject();
  productObj.product_id = productObj._id;
  
  return {
    product: productObj,
    images: product.images.map(img => img.image_url),
    colors: product.colors,
    sizes: product.sizes.map((s, idx) => ({
      size_id: idx, // fake ID for frontend array keys
      size: s.size,
      colors: s.colors
    }))
  };
};

exports.updateProduct = async (id, productData, imagesData) => {
  const { category, name, price, description1, description2, description3, collection, material, technique, packaging, is_featured, colors, sizes } = productData;

  const parseOrFallback = (value, fallback) => {
    if (!value || value === 'undefined') return fallback;
    if (Array.isArray(value)) return value;
    if (typeof value === 'object') return value;
    if (typeof value === 'string') return JSON.parse(value);
    return fallback;
  };

  let colorList = parseOrFallback(colors, []);
  let sizeList = parseOrFallback(sizes, []);

  const normalizedSizes = sizeList.map(size => {
    return {
      size: size.size,
      colors: normalizeSizeColors(size.colors)
    };
  }).filter(s => s.size);

  const updateFields = {
    category,
    name,
    price,
    description1,
    description2,
    description3,
    product_collection: collection,
    material,
    technique,
    packaging,
    is_featured: is_featured || false,
    colors: colorList,
    sizes: normalizedSizes
  };

  const product = await Product.findById(id);
  if (!product) throw new Error('Product not found');

  if (imagesData && imagesData.length > 0) {
    // Delete old images from disk
    if (product.images && product.images.length > 0) {
      const uploadsDir = path.join(__dirname, '../uploads');
      product.images.forEach(img => {
        const imagePath = path.join(uploadsDir, img.image_url);
        if (fs.existsSync(imagePath)) {
          try { fs.unlinkSync(imagePath); } catch (e) {}
        }
      });
    }

    updateFields.images = imagesData.map((img, index) => ({
      image_url: img.filename,
      firstimg: index === 0
    }));
  }

  await Product.findByIdAndUpdate(id, updateFields);
};
