const db = require("../config/db");
const fs = require("fs");
const path = require("path");

const { generateProductCode } = require("./sendMailer");

const CATEGORY_PREFIX_MAP = {
    suits: "SU",
    trousers: "TR",
    shirts: "SH"
};

const normalizeSizeColors = (inputColors) => {
    if (!Array.isArray(inputColors)) return [];

    return inputColors
        .map((entry) => {
            if (!entry) return null;

            if (typeof entry === "string") {
                return { color: entry, quantity: 0 };
            }

            if (typeof entry === "object") {
                return {
                    color: entry.color || entry.color_name || entry.hex || "",
                    quantity: Number(entry.quantity) || 0
                };
            }

            return null;
        })
        .filter((item) => item && item.color);
};

// -------------------- Admin Login --------------------
exports.adminLogin = (req, res) => {
    try {
        const { email, password } = req.body;

        const sql = "SELECT * FROM admins WHERE email = ? AND password = ?";

        db.query(sql, [email, password], (err, result) => {
            if (err) {
                console.error("DB Error:", err);
                return res.status(500).json({ error: "Database query failed" });
            }

            if (result.length === 0) {
                return res.status(401).json({ error: "Invalid credentials" });
            }

            res.status(200).json({ message: "Admin login successful!" });
        });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Something went wrong on the server" });
    }
};

// -------------------- Add Product --------------------
exports.addProduct = (req, res) => {
    try {
        const {
            category,
            name,
            price,
            description1,
            description2,
            description3,
            collection,
            material,
            technique,
            packaging,
            is_featured,
            colors,            // ["Red","Blue","Black"]
            sizes              // [{ size: "M", quantity: 10, colors: ["Red","Blue"] }]
        } = req.body;

        const images = req.files?.images || [];

        const parseOrFallback = (value, fallback) => {
            if (!value || value === "undefined") {
                return fallback;
            }

            if (Array.isArray(value)) {
                return value;
            }

            if (typeof value === "object") {
                return value;
            }

            if (typeof value === "string") {
                return JSON.parse(value);
            }

            return fallback;
        };

        let colorList = [];
        let sizeList = [];

        try {
            colorList = parseOrFallback(colors, []);
            sizeList = parseOrFallback(sizes, []);
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError);
            return res.status(400).json({ error: "Invalid colors or sizes format" });
        }

        if (!Array.isArray(colorList) || !Array.isArray(sizeList)) {
            return res.status(400).json({ error: "Colors and sizes must be arrays" });
        }

        // --------------------------------------
        // 1️⃣ Insert Product
        // -------------------------------------- 
        const randomNumber = generateProductCode().toString().padStart(5, "0");
        const categoryKey = (category || "").toLowerCase();
        const prefix = CATEGORY_PREFIX_MAP[categoryKey] || "PR";
        const proCode = `${prefix}-${randomNumber}`;

        const productSql = `
      INSERT INTO products 
      (category, name, price, description1, description2, description3, collection, material, technique, packaging, is_featured, pro_code)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
    `;

        db.query(
            productSql,
            [
                category,
                name,
                price,
                description1,
                description2,
                description3,
                collection,
                material,
                technique,
                packaging,
                is_featured || 0,
                proCode
            ],

            (err, productResult) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ error: "Product insert error" });
                }

                const product_id = productResult.insertId;

                // ------------------------------------------------
                // 2️⃣ Insert Images (product_images)
                // ------------------------------------------------
                if (images.length > 0) {
                    const imageSql = `
            INSERT INTO product_images (product_id, image_url, firstimg) 
            VALUES (?,?,?)
          `;

                    images.forEach((img, index) => {
                        // First image (index 0) gets firstimg = 1, others get 0
                        const firstimg = index === 0 ? 1 : 0;
                        db.query(imageSql, [product_id, img.filename, firstimg]);
                    });
                }

                // ------------------------------------------------
                // 3️⃣ Insert Colors (colors table)
                // ------------------------------------------------
                const colorSql = `
          INSERT INTO colors (product_id, color_name)
          VALUES (?,?)
        `;
                colorList.forEach(color => {
                    db.query(colorSql, [product_id, color]);
                });

                // ------------------------------------------------
                // 4️⃣ Insert Sizes (product_sizes)
                //    And Size → Colors mapping (size_colors)
                // ------------------------------------------------

                sizeList.forEach(size => {
                    const { size: sizeName, colors: sizeColors } = size;
                    if (!sizeName) return;

                    const normalizedColors = normalizeSizeColors(sizeColors);
                    if (!normalizedColors.length) return;

                    const sizeSql = `
            INSERT INTO product_sizes (product_id, size)
            VALUES (?,?)
          `;

                    db.query(sizeSql, [product_id, sizeName], (err, sizeResult) => {
                        if (err) {
                            console.log(err);
                            return;
                        }

                        const size_id = sizeResult.insertId;

                        // Insert colors for each size
                        const sizeColorSql = `
              INSERT INTO size_colors (size_id, color_name, quantity)
              VALUES (?,?,?)
            `;

                        normalizedColors.forEach(({ color, quantity }) => {
                            db.query(sizeColorSql, [size_id, color, quantity]);
                        });
                    });
                });

                return res.json({
                    message: "Product + Images + Colors + Sizes added successfully",
                    product_id: product_id
                });
            }
        );
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Something went wrong on the server" });
    }
};

// -------------------- Get All Products by Category --------------------
const getProductsByCategory = (req, res, category) => {
    try {
        const sql = `
      SELECT 
        p.product_id,
        p.name,
        p.price,
        p.pro_code,
        IFNULL(SUM(sc.quantity), 0) AS total_quantity
      FROM products p
      LEFT JOIN product_sizes ps ON p.product_id = ps.product_id
      LEFT JOIN size_colors sc ON ps.size_id = sc.size_id
      WHERE LOWER(p.category) = ?
      GROUP BY p.product_id, p.name, p.price, p.pro_code
      ORDER BY p.product_id DESC
    `;

        db.query(sql, [category.toLowerCase()], (err, result) => {
            if (err) {
                console.error("DB Error:", err);
                return res.status(500).json({ error: "Database query failed" });
            }
            res.status(200).json(result);
        });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Something went wrong on the server" });
    }
};

// -------------------- Get All Suits --------------------
exports.getAllSuits = (req, res) => getProductsByCategory(req, res, "suits");
// -------------------- Get All Shirts --------------------
exports.getAllShirts = (req, res) => getProductsByCategory(req, res, "shirts");
// -------------------- Get All Trousers --------------------
exports.getAllTrousers = (req, res) => getProductsByCategory(req, res, "trousers");

// -------------------- Delete Product --------------------
exports.deleteProduct = (req, res) => {
    try {
        const { id } = req.params; // product_id

        // Step 0: First, get all image filenames before deleting from database
        const getImagesSql = `SELECT image_url FROM product_images WHERE product_id = ?`;
        db.query(getImagesSql, [id], (err, imageRows) => {
            if (err) return res.status(500).json({ error: err.message });

            // Delete image files from /uploads folder
            const uploadsDir = path.join(__dirname, "../uploads");
            imageRows.forEach((row) => {
                const imagePath = path.join(uploadsDir, row.image_url);
                if (fs.existsSync(imagePath)) {
                    try {
                        fs.unlinkSync(imagePath);
                    } catch (fileErr) {
                        console.error(`Error deleting file ${row.image_url}:`, fileErr);
                    }
                }
            });

            // Step 1: Delete size_colors linked via product_sizes
            const deleteSizeColors = `DELETE FROM size_colors 
                                    WHERE size_id IN (SELECT size_id FROM product_sizes WHERE product_id = ?)`;

            db.query(deleteSizeColors, [id], (err) => {
                if (err) return res.status(500).json({ error: err.message });

                // Step 2: Delete product_sizes
                const deleteProductSizes = `DELETE FROM product_sizes WHERE product_id = ?`;
                db.query(deleteProductSizes, [id], (err) => {
                    if (err) return res.status(500).json({ error: err.message });

                    // Step 3: Delete colors
                    const deleteColors = `DELETE FROM colors WHERE product_id = ?`;
                    db.query(deleteColors, [id], (err) => {
                        if (err) return res.status(500).json({ error: err.message });

                        // Step 4: Delete product_images
                        const deleteImages = `DELETE FROM product_images WHERE product_id = ?`;
                        db.query(deleteImages, [id], (err) => {
                            if (err) return res.status(500).json({ error: err.message });

                            // Step 5: Delete cart_items
                            const deleteCartItems = `DELETE FROM cart_items WHERE product_id = ?`;
                            db.query(deleteCartItems, [id], (err) => {
                                if (err) return res.status(500).json({ error: err.message });

                                // Step 6: Delete order_items
                                const deleteOrderItems = `DELETE FROM order_items WHERE product_id = ?`;
                                db.query(deleteOrderItems, [id], (err) => {
                                    if (err) return res.status(500).json({ error: err.message });

                                    // Step 7: Finally, delete product itself
                                    const deleteProduct = `DELETE FROM products WHERE product_id = ?`;
                                    db.query(deleteProduct, [id], (err) => {
                                        if (err) return res.status(500).json({ error: err.message });

                                        res.status(200).json({ message: "Product and all related data deleted successfully" });
                                    });
                                });
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

// -------------------- Get Single Product by ID --------------------
exports.getProductById = (req, res) => {
    const { id } = req.params;

    try {
        const productSql = `SELECT * FROM products WHERE product_id = ?`;
        const imagesSql = `SELECT image_url FROM product_images WHERE product_id = ?`;
        const colorsSql = `SELECT color_name FROM colors WHERE product_id = ?`;
        const sizesSql = `
          SELECT 
            ps.size_id,
            ps.size,
            sc.color_name,
            sc.quantity AS color_quantity
          FROM product_sizes ps
          LEFT JOIN size_colors sc ON ps.size_id = sc.size_id
          WHERE ps.product_id = ?`;

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

                        const images = imageRows.map(row => row.image_url);
                        const colors = colorRows.map(row => row.color_name);

                        const sizeMap = {};
                        sizeRows.forEach(row => {
                            if (!sizeMap[row.size_id]) {
                                sizeMap[row.size_id] = {
                                    size_id: row.size_id,
                                    size: row.size,
                                    colors: []
                                };
                            }
                            if (row.color_name) {
                                sizeMap[row.size_id].colors.push({
                                    color: row.color_name,
                                    quantity: row.color_quantity || 0
                                });
                            }
                        });

                        const sizes = Object.values(sizeMap);

                        return res.json({
                            product,
                            images,
                            colors,
                            sizes
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

// -------------------- Update Product --------------------
exports.updateProduct = (req, res) => {
    const { id } = req.params;

    try {
        const {
            category,
            name,
            price,
            description1,
            description2,
            description3,
            collection,
            material,
            technique,
            packaging,
            is_featured,
            colors,
            sizes
        } = req.body;

        const images = req.files?.images || [];

        const parseOrFallback = (value, fallback) => {
            if (!value || value === "undefined") {
                return fallback;
            }

            if (Array.isArray(value)) {
                return value;
            }

            if (typeof value === "object") {
                return value;
            }

            if (typeof value === "string") {
                return JSON.parse(value);
            }

            return fallback;
        };

        let colorList = [];
        let sizeList = [];

        try {
            colorList = parseOrFallback(colors, []);
            sizeList = parseOrFallback(sizes, []);
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError);
            return res.status(400).json({ error: "Invalid colors or sizes format" });
        }

        if (!Array.isArray(colorList) || !Array.isArray(sizeList)) {
            return res.status(400).json({ error: "Colors and sizes must be arrays" });
        }

        // 1) Update main product
        const updateProductSql = `
          UPDATE products
          SET category = ?, name = ?, price = ?, description1 = ?, description2 = ?, description3 = ?,
              collection = ?, material = ?, technique = ?, packaging = ?, is_featured = ?
          WHERE product_id = ?
        `;

        db.query(
            updateProductSql,
            [
                category,
                name,
                price,
                description1,
                description2,
                description3,
                collection,
                material,
                technique,
                packaging,
                is_featured || 0,
                id
            ],
            (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: "Product update error" });
                }

                // 2) Replace colors and sizes mappings
                const deleteSizeColors = `DELETE FROM size_colors 
                                          WHERE size_id IN (SELECT size_id FROM product_sizes WHERE product_id = ?)`;
                db.query(deleteSizeColors, [id], (err) => {
                    if (err) return res.status(500).json({ error: err.message });

                    const deleteProductSizes = `DELETE FROM product_sizes WHERE product_id = ?`;
                    db.query(deleteProductSizes, [id], (err) => {
                        if (err) return res.status(500).json({ error: err.message });

                        const deleteColors = `DELETE FROM colors WHERE product_id = ?`;
                        db.query(deleteColors, [id], (err) => {
                            if (err) return res.status(500).json({ error: err.message });

                            // 3) Re-insert colors
                            const colorSql = `
                              INSERT INTO colors (product_id, color_name)
                              VALUES (?,?)
                            `;
                            colorList.forEach(color => {
                                db.query(colorSql, [id, color]);
                            });

                            // 4) Re-insert sizes and size_colors
                            sizeList.forEach(size => {
                                const { size: sizeName, colors: sizeColors } = size;
                                if (!sizeName) return;

                                const normalizedColors = normalizeSizeColors(sizeColors);
                                if (!normalizedColors.length) return;

                                const sizeSql = `
                                  INSERT INTO product_sizes (product_id, size)
                                  VALUES (?,?)
                                `;

                                db.query(sizeSql, [id, sizeName], (err, sizeResult) => {
                                    if (err) {
                                        console.error(err);
                                        return;
                                    }

                                    const size_id = sizeResult.insertId;

                                    const sizeColorSql = `
                                      INSERT INTO size_colors (size_id, color_name, quantity)
                                      VALUES (?,?,?)
                                    `;

                                    normalizedColors.forEach(({ color, quantity }) => {
                                        db.query(sizeColorSql, [size_id, color, quantity]);
                                    });
                                });
                            });

                            // 5) Optionally replace images if new ones were uploaded
                            if (images.length > 0) {
                                const deleteImages = `DELETE FROM product_images WHERE product_id = ?`;
                                db.query(deleteImages, [id], (err) => {
                                    if (err) return res.status(500).json({ error: err.message });

                                    const imageSql = `
                                      INSERT INTO product_images (product_id, image_url, firstimg)
                                      VALUES (?,?,?)
                                    `;

                                    images.forEach((img, index) => {
                                        // First image (index 0) gets firstimg = 1, others get 0
                                        const firstimg = index === 0 ? 1 : 0;
                                        db.query(imageSql, [id, img.filename, firstimg]);
                                    });

                                    return res.json({ message: "Product updated successfully" });
                                });
                            } else {
                                // No new images, keep existing ones
                                return res.json({ message: "Product updated successfully" });
                            }
                        });
                    });
                });
            }
        );
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Something went wrong on the server" });
    }
};
