const db = require("../config/db");
const fs = require("fs");
const path = require("path");
const { generateTrackingId, sendOrderEmailToAdmin, sendOrderEmailToCustomer } = require("./sendMailer");

// -------------------- Get featured Products from home route --------------------

exports.getFeaturedProducts = (req, res) => {
    const sql = "SELECT p.product_id, p.name, p.price, pi.image_url FROM products p JOIN product_images pi ON p.product_id = pi.product_id WHERE p.is_featured = 1 AND pi.firstimg = 1";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(result);
    });
};

// -------------------- Get Suits Products with Pagination --------------------
exports.getSuitsProducts = (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 3;
        const offset = (page - 1) * limit;

        // Get total count of suits products
        const countSql = `
            SELECT COUNT(DISTINCT p.product_id) as total
            FROM products p
            WHERE LOWER(p.category) = 'suits'
        `;

        db.query(countSql, (err, countResult) => {
            if (err) return res.status(500).json({ error: err.message });

            const totalProducts = countResult[0].total;
            const totalPages = Math.ceil(totalProducts / limit);

            // Get products with pagination
            const productsSql = `
                SELECT 
                    p.product_id,
                    p.name,
                    p.price,
                    p.description1,
                    pi.image_url
                FROM products p
                LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.firstimg = 1
                WHERE LOWER(p.category) = 'suits'
                ORDER BY p.product_id DESC
                LIMIT ? OFFSET ?
            `;

            db.query(productsSql, [limit, offset], (err, productsResult) => {
                if (err) return res.status(500).json({ error: err.message });

                res.status(200).json({
                    products: productsResult,
                    pagination: {
                        currentPage: page,
                        totalPages: totalPages,
                        totalProducts: totalProducts,
                        productsPerPage: limit
                    }
                });
            });
        });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Something went wrong on the server" });
    }
};

// -------------------- Get Shirts Products with Pagination --------------------
exports.getShirtsProducts = (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 3;
        const offset = (page - 1) * limit;

        // Get total count of shirts products
        const countSql = `
            SELECT COUNT(DISTINCT p.product_id) as total
            FROM products p
            WHERE LOWER(p.category) = 'shirts'
        `;

        db.query(countSql, (err, countResult) => {
            if (err) return res.status(500).json({ error: err.message });

            const totalProducts = countResult[0].total;
            const totalPages = Math.ceil(totalProducts / limit);

            // Get products with pagination
            const productsSql = `
                SELECT 
                    p.product_id,
                    p.name,
                    p.price,
                    p.description1,
                    pi.image_url
                FROM products p
                LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.firstimg = 1
                WHERE LOWER(p.category) = 'shirts'
                ORDER BY p.product_id DESC
                LIMIT ? OFFSET ?
            `;

            db.query(productsSql, [limit, offset], (err, productsResult) => {
                if (err) return res.status(500).json({ error: err.message });

                res.status(200).json({
                    products: productsResult,
                    pagination: {
                        currentPage: page,
                        totalPages: totalPages,
                        totalProducts: totalProducts,
                        productsPerPage: limit
                    }
                });
            });
        });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Something went wrong on the server" });
    }
};

// -------------------- Get Trousers Products with Pagination --------------------
exports.getTrousersProducts = (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 3;
        const offset = (page - 1) * limit;

        // Get total count of trousers products
        const countSql = `
            SELECT COUNT(DISTINCT p.product_id) as total
            FROM products p
            WHERE LOWER(p.category) = 'trousers'
        `;

        db.query(countSql, (err, countResult) => {
            if (err) return res.status(500).json({ error: err.message });

            const totalProducts = countResult[0].total;
            const totalPages = Math.ceil(totalProducts / limit);

            // Get products with pagination
            const productsSql = `
                SELECT 
                    p.product_id,
                    p.name,
                    p.price,
                    p.description1,
                    pi.image_url
                FROM products p
                LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.firstimg = 1
                WHERE LOWER(p.category) = 'trousers'
                ORDER BY p.product_id DESC
                LIMIT ? OFFSET ?
            `;

            db.query(productsSql, [limit, offset], (err, productsResult) => {
                if (err) return res.status(500).json({ error: err.message });

                res.status(200).json({
                    products: productsResult,
                    pagination: {
                        currentPage: page,
                        totalPages: totalPages,
                        totalProducts: totalProducts,
                        productsPerPage: limit
                    }
                });
            });
        });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Something went wrong on the server" });
    }
};

// -------------------- Get Single Product Details by ID --------------------
exports.getProductDetails = (req, res) => {
    const { id } = req.params;

    try {
        // 1️⃣ Get product basic info
        const productSql = `SELECT * FROM products WHERE product_id = ?`;

        // 2️⃣ Get all images (first image prioritized)
        const imagesSql = `
            SELECT image_url, firstimg 
            FROM product_images 
            WHERE product_id = ? 
            ORDER BY firstimg DESC, image_url
        `;

        // 3️⃣ Get all colors (general color info, optional)
        const colorsSql = `
            SELECT DISTINCT color_name 
            FROM colors 
            WHERE product_id = ?
        `;

        // 4️⃣ Get all sizes
        const sizesSql = `
            SELECT size_id, size 
            FROM product_sizes 
            WHERE product_id = ? 
            ORDER BY size
        `;

        // 5️⃣ Get size-color combinations with quantity
        const sizeColorsSql = `
            SELECT sc.size_id, sc.color_name, sc.quantity, ps.size
            FROM size_colors sc
            JOIN product_sizes ps ON sc.size_id = ps.size_id
            WHERE ps.product_id = ?
        `;

        db.query(productSql, [id], (err, productRows) => {
            if (err) return res.status(500).json({ error: err.message });
            if (productRows.length === 0) {
                return res.status(404).json({ error: "Product not found" });
            }

            const product = productRows[0];

            db.query(imagesSql, [id], (err, imageRows) => {
                if (err) return res.status(500).json({ error: err.message });

                db.query(colorsSql, [id], (err, colorRows) => {
                    if (err) return res.status(500).json({ error: err.message });

                    db.query(sizesSql, [id], (err, sizeRows) => {
                        if (err) return res.status(500).json({ error: err.message });

                        db.query(sizeColorsSql, [id], (err, sizeColorRows) => {
                            if (err) return res.status(500).json({ error: err.message });

                            // Map colors to each size individually
                            const sizeColorMap = {};
                            sizeColorRows.forEach(row => {
                                if (!sizeColorMap[row.size_id]) {
                                    sizeColorMap[row.size_id] = [];
                                }
                                sizeColorMap[row.size_id].push({
                                    color: row.color_name,
                                    quantity: row.quantity || 0
                                });
                            });

                            // Combine sizes with their color quantities
                            const sizes = sizeRows.map(size => {
                                const colorEntries = sizeColorMap[size.size_id] || [];
                                return {
                                    size_id: size.size_id,
                                    size: size.size,
                                    colors: colorEntries
                                };
                            });

                            res.status(200).json({
                                product: product,
                                images: imageRows.map(row => row.image_url),
                                colors: colorRows.map(row => row.color_name), // optional extra info
                                sizes: sizes
                            });
                        });
                    });
                });
            });
        });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Something went wrong on the server" });
    }
};

// -------------------- Get Related Products --------------------
exports.getRelatedProducts = (req, res) => {
    const { category } = req.params; // get category directly from params
    const { id } = req.query; // get product ID from query to exclude it

    try {
        const relatedProductsSql = `
            SELECT 
                p.product_id,
                p.name,
                p.price,
                pi.image_url
            FROM products p
            LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.firstimg = 1
            WHERE LOWER(p.category) = ? AND p.product_id != ?
            ORDER BY p.product_id DESC
            LIMIT 4
        `;

        db.query(relatedProductsSql, [category.toLowerCase(), id || 0], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json(result);
        });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Something went wrong on the server" });
    }
};

// -------------------- Create Order --------------------
exports.createOrder = (req, res) => {
    const {
        sessionId,
        firstName,
        lastName,
        phone,
        email,
        streetAddress,
        city,
        country,
        zipcode,
        paymentMethod,
        shippingMethod,
        cartItems = [],
        totalAmount
    } = req.body;

    if (
        !firstName ||
        !lastName ||
        !phone ||
        !email ||
        !streetAddress ||
        !city ||
        !country ||
        !zipcode ||
        !paymentMethod ||
        !cartItems.length
    ) {
        return res.status(400).json({ error: "Missing required fields or cart is empty" });
    }

    const mappedPaymentMethod = paymentMethod === 'card' ? 'CARD' : 'COD';
    const trackingId = generateTrackingId();

    const orderSql = `
        INSERT INTO orders 
        (session_id, first_name, last_name, phone, email, street_address, city, country, zipcode, payment_method, payment_status, order_status, total_amount, trackingId) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const orderValues = [
        sessionId || null,
        firstName,
        lastName,
        phone,
        email,
        streetAddress,
        city,
        country,
        zipcode,
        mappedPaymentMethod,
        mappedPaymentMethod === 'CARD' ? 'PAID' : 'PENDING',
        'PENDING',
        totalAmount || 0,
        trackingId
    ];

    db.beginTransaction(err => {
        if (err) {
            console.error("Transaction Error:", err);
            return res.status(500).json({ error: "Database transaction failed" });
        }

        db.query(orderSql, orderValues, (orderErr, orderResult) => {
            if (orderErr) {
                console.error("Order Insert Error:", orderErr);
                return db.rollback(() => {
                    res.status(500).json({ error: "Failed to create order" });
                });
            }

            const orderId = orderResult.insertId;

            const orderItemsValues = cartItems.map(item => [
                orderId,
                item.product_id,
                item.size || null,
                item.color || null,
                item.quantity || 1,
                item.price || 0
            ]);

            const orderItemsSql = `
                INSERT INTO order_items (order_id, product_id, size, color, quantity, price)
                VALUES ?
            `;

            if (!orderItemsValues.length) {
                return db.rollback(() => {
                    res.status(400).json({ error: "No order items to insert" });
                });
            }

            db.query(orderItemsSql, [orderItemsValues], (itemsErr) => {
                if (itemsErr) {
                    console.error("Order Items Insert Error:", itemsErr);
                    return db.rollback(() => {
                        res.status(500).json({ error: "Failed to add order items" });
                    });
                }

                const cartItemsWithHex = cartItems.map(item => ({
                    ...item,
                    color_hex: (item.color_hex || item.color || '').toLowerCase()
                }));

                const decrementStockForItem = (index) => {
                    if (index >= cartItemsWithHex.length) {
                        return db.commit(commitErr => {
                            if (commitErr) {
                                console.error("Commit Error:", commitErr);
                                return db.rollback(() => {
                                    res.status(500).json({ error: "Failed to finalize order" });
                                });
                            }

                            // Fetch product codes for email
                            const productIds = cartItems.map(item => item.product_id).filter(Boolean);
                            if (productIds.length > 0) {
                                const productCodesSql = `SELECT product_id, pro_code FROM products WHERE product_id IN (?)`;
                                db.query(productCodesSql, [productIds], (codeErr, codeRows) => {
                                    const codeMap = {};
                                    if (!codeErr && codeRows) {
                                        codeRows.forEach(row => {
                                            codeMap[row.product_id] = row.pro_code || 'N/A';
                                        });
                                    }

                                    const itemsWithCodes = cartItems.map(item => ({
                                        ...item,
                                        pro_code: codeMap[item.product_id] || 'N/A'
                                    }));

                                    const orderResponse = {
                                        orderId,
                                        trackingId,
                                        sessionId: sessionId || null,
                                        firstName,
                                        lastName,
                                        phone,
                                        email,
                                        streetAddress,
                                        city,
                                        country,
                                        zipcode,
                                        paymentMethod: mappedPaymentMethod,
                                        paymentStatus: mappedPaymentMethod === 'CARD' ? 'PAID' : 'PENDING',
                                        orderStatus: 'PENDING',
                                        shippingMethod: shippingMethod || 'free',
                                        totalAmount: totalAmount || 0,
                                        createdAt: new Date(),
                                        items: cartItems
                                    };

                                    // Send emails (non-blocking)
                                    const customerData = {
                                        firstName,
                                        lastName,
                                        phone,
                                        email,
                                        streetAddress,
                                        city,
                                        country,
                                        zipcode,
                                        paymentMethod: mappedPaymentMethod
                                    };

                                    const orderData = {
                                        totalAmount: totalAmount || 0
                                    };

                                    sendOrderEmailToAdmin({
                                        trackingId,
                                        orderData,
                                        customerData,
                                        items: itemsWithCodes
                                    }).catch(err => console.error("Admin email error:", err));

                                    sendOrderEmailToCustomer({
                                        trackingId,
                                        customerEmail: email,
                                        items: itemsWithCodes,
                                        totalAmount: totalAmount || 0
                                    }).catch(err => console.error("Customer email error:", err));

                                    res.status(201).json({
                                        success: true,
                                        message: "Order placed successfully",
                                        order: orderResponse
                                    });
                                });
                            } else {
                                const orderResponse = {
                                    orderId,
                                    trackingId,
                                    sessionId: sessionId || null,
                                    firstName,
                                    lastName,
                                    phone,
                                    email,
                                    streetAddress,
                                    city,
                                    country,
                                    zipcode,
                                    paymentMethod: mappedPaymentMethod,
                                    paymentStatus: mappedPaymentMethod === 'CARD' ? 'PAID' : 'PENDING',
                                    orderStatus: 'PENDING',
                                    shippingMethod: shippingMethod || 'free',
                                    totalAmount: totalAmount || 0,
                                    createdAt: new Date(),
                                    items: cartItems
                                };

                                res.status(201).json({
                                    success: true,
                                    message: "Order placed successfully",
                                    order: orderResponse
                                });
                            }
                        });
                    }

                    const item = cartItemsWithHex[index];
                    const colorValue = item.color_hex;

                    if (!item.product_id || !item.size || !colorValue) {
                        return decrementStockForItem(index + 1);
                    }

                    const sizeSql = `
                        SELECT size_id FROM product_sizes
                        WHERE product_id = ? AND size = ?
                        LIMIT 1
                    `;

                    db.query(sizeSql, [item.product_id, item.size], (sizeErr, sizeRows) => {
                        if (sizeErr) {
                            console.error("Size Fetch Error:", sizeErr);
                            return db.rollback(() => {
                                res.status(500).json({ error: "Failed to update inventory" });
                            });
                        }

                        if (!sizeRows.length) {
                            return decrementStockForItem(index + 1);
                        }

                        const sizeId = sizeRows[0].size_id;
                        const updateSql = `
                            UPDATE size_colors
                            SET quantity = GREATEST(quantity - ?, 0)
                            WHERE size_id = ? AND LOWER(color_name) = ?
                        `;

                        db.query(updateSql, [item.quantity || 0, sizeId, colorValue], (updateErr) => {
                            if (updateErr) {
                                console.error("Inventory Update Error:", updateErr);
                                return db.rollback(() => {
                                    res.status(500).json({ error: "Failed to update inventory" });
                                });
                            }

                            decrementStockForItem(index + 1);
                        });
                    });
                };

                decrementStockForItem(0);
            });
        });
    });
};

// -------------------- Dynamic Filter Products --------------------
exports.getFilteredProducts = (req, res) => {
    try {
        const {
            category = '',
            colors = '',
            sizes = '',
            priceRange = '',
            page = 1
        } = req.query;

        const limit = 3;
        const currentPage = parseInt(page, 10) || 1;
        const offset = (currentPage - 1) * limit;

        const joins = [
            'LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.firstimg = 1'
        ];
        const whereClauses = ['1=1'];
        const params = [];

        if (category) {
            whereClauses.push('LOWER(p.category) = ?');
            params.push(category.toLowerCase());
        }

        const colorArray = colors
            .split(',')
            .map((c) => c.trim())
            .filter(Boolean);

        if (colorArray.length) {
            joins.push('JOIN colors c ON c.product_id = p.product_id');
            whereClauses.push(`c.color_name IN (?)`);
            params.push(colorArray);
        }

        const sizeArray = sizes
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);

        if (sizeArray.length) {
            joins.push('JOIN product_sizes ps ON ps.product_id = p.product_id');
            whereClauses.push(`ps.size IN (?)`);
            params.push(sizeArray);
        }

        if (priceRange) {
            if (priceRange.includes('+')) {
                const min = parseFloat(priceRange.replace('+', ''));
                if (!isNaN(min)) {
                    whereClauses.push('p.price >= ?');
                    params.push(min);
                }
            } else {
                const [minStr, maxStr] = priceRange.split('-');
                const min = parseFloat(minStr);
                const max = parseFloat(maxStr);
                if (!isNaN(min)) {
                    whereClauses.push('p.price >= ?');
                    params.push(min);
                }
                if (!isNaN(max)) {
                    whereClauses.push('p.price <= ?');
                    params.push(max);
                }
            }
        }

        const joinsClause = joins.join(' ');
        const whereClause = `WHERE ${whereClauses.join(' AND ')}`;

        const countSql = `
            SELECT COUNT(DISTINCT p.product_id) AS total
            FROM products p
            ${joinsClause}
            ${whereClause}
        `;

        const productSql = `
            SELECT DISTINCT 
                p.product_id,
                p.name,
                p.price,
                p.description1,
                pi.image_url
            FROM products p
            ${joinsClause}
            ${whereClause}
            ORDER BY p.product_id DESC
            LIMIT ? OFFSET ?
        `;

        db.query(countSql, [...params], (countErr, countResult) => {
            if (countErr) return res.status(500).json({ error: countErr.message });

            const totalProducts = countResult?.[0]?.total || 0;
            const totalPages = Math.max(Math.ceil(totalProducts / limit), 1);

            db.query(productSql, [...params, limit, offset], (productErr, productResult) => {
                if (productErr) return res.status(500).json({ error: productErr.message });

                res.status(200).json({
                    products: productResult || [],
                    pagination: {
                        currentPage,
                        totalPages,
                        totalProducts,
                        productsPerPage: limit
                    }
                });
            });
        });
    } catch (error) {
        console.error("Filter Products Error:", error);
        res.status(500).json({ error: "Something went wrong while filtering products" });
    }
};