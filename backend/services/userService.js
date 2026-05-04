const Product = require('../models/Product');
const Order = require('../models/Order');
const { generateTrackingId, sendOrderEmailToAdmin, sendOrderEmailToCustomer } = require('../controllers/sendMailer');

// Featured Products
exports.getFeaturedProducts = async () => {
    const products = await Product.find({ is_featured: true });
    return products.map(p => ({
        product_id: p._id,
        name: p.name,
        price: p.price,
        image_url: p.images.length > 0 ? (p.images.find(img => img.firstimg)?.image_url || p.images[0].image_url) : null
    }));
};

// Common paginated method
exports.getPaginatedProductsByCategory = async (category, page, limit = 3) => {
    const offset = (page - 1) * limit;

    const totalProducts = await Product.countDocuments({ category: new RegExp(`^${category}$`, 'i') });
    const totalPages = Math.ceil(totalProducts / limit);

    const products = await Product.find({ category: new RegExp(`^${category}$`, 'i') })
        .sort({ _id: -1 })
        .skip(offset)
        .limit(limit);

    return {
        products: products.map(p => ({
            product_id: p._id,
            name: p.name,
            price: p.price,
            description1: p.description1,
            image_url: p.images.length > 0 ? (p.images.find(img => img.firstimg)?.image_url || p.images[0].image_url) : null
        })),
        pagination: {
            currentPage: page,
            totalPages,
            totalProducts,
            productsPerPage: limit
        }
    };
};

exports.getProductDetails = async (id) => {
    const product = await Product.findById(id);
    if (!product) throw new Error('Product not found');

    const productObj = product.toObject();
    productObj.product_id = productObj._id;

    // Map sizes identically to old SQL API
    const mappedSizes = product.sizes.map((s, index) => ({
        size_id: index,
        size: s.size,
        colors: s.colors.map(c => ({
            color: c.color,
            quantity: c.quantity || 0
        }))
    }));

    return {
        product: productObj,
        images: product.images.map(img => img.image_url),
        colors: product.colors,
        sizes: mappedSizes
    };
};

exports.getRelatedProducts = async (category, excludeId) => {
    const query = { category: new RegExp(`^${category}$`, 'i') };
    if (excludeId && excludeId !== '0') {
        query._id = { $ne: excludeId };
    }

    const products = await Product.find(query)
        .sort({ _id: -1 })
        .limit(4);

    return products.map(p => ({
        product_id: p._id,
        name: p.name,
        price: p.price,
        image_url: p.images.length > 0 ? (p.images.find(img => img.firstimg)?.image_url || p.images[0].image_url) : null
    }));
};

exports.createOrder = async (orderData) => {
    const {
        sessionId, firstName, lastName, phone, email, streetAddress, city, country, zipcode,
        paymentMethod, shippingMethod, cartItems = [], totalAmount
    } = orderData;

    if (!firstName || !lastName || !phone || !email || !streetAddress || !city || !country || !zipcode || !paymentMethod || !cartItems.length) {
        throw new Error("Missing required fields or cart is empty");
    }

    const mappedPaymentMethod = paymentMethod === 'card' ? 'CARD' : 'COD';
    const trackingId = generateTrackingId();

    const newOrder = new Order({
        session_id: sessionId || null,
        first_name: firstName,
        last_name: lastName,
        phone,
        email,
        street_address: streetAddress,
        city,
        country,
        zipcode,
        payment_method: mappedPaymentMethod,
        payment_status: mappedPaymentMethod === 'CARD' ? 'PAID' : 'PENDING',
        order_status: 'PENDING',
        total_amount: totalAmount || 0,
        trackingId,
        items: [] // we will push below
    });

    const itemsForEmail = []; // Tracking items to send in email

    for (const item of cartItems) {
        newOrder.items.push({
            product_id: item.product_id,
            size: item.size || null,
            color: item.color || null,
            quantity: item.quantity || 1,
            price: item.price || 0
        });

        // Decrement stock
        if (item.product_id && item.size && item.color) {
            const product = await Product.findById(item.product_id);
            if (product) {
                const sizeDoc = product.sizes.find(s => s.size === item.size);
                if (sizeDoc) {
                    const colorDoc = sizeDoc.colors.find(c => c.color.toLowerCase() === (item.color_hex || item.color).toLowerCase());
                    if (colorDoc) {
                        colorDoc.quantity = Math.max((colorDoc.quantity || 0) - (item.quantity || 1), 0);
                        await product.save();
                    }
                }
                
                itemsForEmail.push({
                    ...item,
                    pro_code: product.pro_code || 'N/A'
                });
            } else {
                itemsForEmail.push({ ...item, pro_code: 'N/A' });
            }
        } else {
            itemsForEmail.push({ ...item, pro_code: 'N/A' });
        }
    }

    await newOrder.save();

    const orderResponse = {
        orderId: newOrder._id,
        trackingId,
        sessionId: sessionId || null,
        firstName, lastName, phone, email, streetAddress, city, country, zipcode,
        paymentMethod: mappedPaymentMethod,
        paymentStatus: mappedPaymentMethod === 'CARD' ? 'PAID' : 'PENDING',
        orderStatus: 'PENDING',
        shippingMethod: shippingMethod || 'free',
        totalAmount: totalAmount || 0,
        createdAt: newOrder.created_at,
        items: cartItems
    };

    const customerData = { firstName, lastName, phone, email, streetAddress, city, country, zipcode, paymentMethod: mappedPaymentMethod };
    const emailOrderData = { totalAmount: totalAmount || 0 };

    sendOrderEmailToAdmin({
        trackingId, orderData: emailOrderData, customerData, items: itemsForEmail
    }).catch(err => console.error("Admin email error:", err));

    sendOrderEmailToCustomer({
        trackingId, customerEmail: email, items: itemsForEmail, totalAmount: totalAmount || 0
    }).catch(err => console.error("Customer email error:", err));

    return orderResponse;
};

exports.getFilteredProducts = async (filters) => {
    const { category = '', colors = '', sizes = '', priceRange = '', page = 1 } = filters;
    
    const limit = 3;
    const currentPage = parseInt(page, 10) || 1;
    const offset = (currentPage - 1) * limit;

    const query = {};

    if (category) {
        query.category = new RegExp(`^${category}$`, 'i');
    }

    const colorArray = colors.split(',').map(c => c.trim()).filter(Boolean);
    if (colorArray.length) {
        query.colors = { $in: colorArray };
    }

    const sizeArray = sizes.split(',').map(s => s.trim()).filter(Boolean);
    if (sizeArray.length) {
        query['sizes.size'] = { $in: sizeArray };
    }

    if (priceRange) {
        if (priceRange.includes('+')) {
            const min = parseFloat(priceRange.replace('+', ''));
            if (!isNaN(min)) query.price = { $gte: min };
        } else {
            const [minStr, maxStr] = priceRange.split('-');
            const min = parseFloat(minStr);
            const max = parseFloat(maxStr);
            query.price = {};
            if (!isNaN(min)) query.price.$gte = min;
            if (!isNaN(max)) query.price.$lte = max;
        }
    }

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.max(Math.ceil(totalProducts / limit), 1);

    const products = await Product.find(query).sort({ _id: -1 }).skip(offset).limit(limit);

    return {
        products: products.map(p => ({
            product_id: p._id,
            name: p.name,
            price: p.price,
            description1: p.description1,
            image_url: p.images.length > 0 ? (p.images.find(img => img.firstimg)?.image_url || p.images[0].image_url) : null
        })),
        pagination: { currentPage, totalPages, totalProducts, productsPerPage: limit }
    };
};
