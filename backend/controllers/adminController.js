const adminService = require('../services/adminService');

exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        await adminService.adminLogin(email, password);
        res.status(200).json({ message: "Admin login successful!" });
    } catch (error) {
        if (error.message === 'Invalid credentials') {
            return res.status(401).json({ error: error.message });
        }
        console.error("Server Error:", error);
        res.status(500).json({ error: "Something went wrong on the server" });
    }
};

exports.addProduct = async (req, res) => {
    try {
        const images = req.files?.images || [];
        const productId = await adminService.addProduct(req.body, images);
        return res.json({
            message: "Product + Images + Colors + Sizes added successfully",
            product_id: productId
        });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Something went wrong on the server" });
    }
};

exports.getAllSuits = async (req, res) => {
    try {
        const products = await adminService.getProductsByCategory('suits');
        res.status(200).json(products);
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Something went wrong on the server" });
    }
};

exports.getAllShirts = async (req, res) => {
    try {
        const products = await adminService.getProductsByCategory('shirts');
        res.status(200).json(products);
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Something went wrong on the server" });
    }
};

exports.getAllTrousers = async (req, res) => {
    try {
        const products = await adminService.getProductsByCategory('trousers');
        res.status(200).json(products);
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Something went wrong on the server" });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await adminService.deleteProduct(id);
        res.status(200).json({ message: "Product and all related data deleted successfully" });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Something went wrong on the server" });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await adminService.getProductById(id);
        return res.json(data);
    } catch (error) {
        if (error.message === 'Product not found') {
            return res.status(404).json({ error: "Product not found" });
        }
        console.error("Server Error:", error);
        res.status(500).json({ error: "Something went wrong on the server" });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const images = req.files?.images || [];
        await adminService.updateProduct(id, req.body, images);
        return res.json({ message: "Product updated successfully" });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Something went wrong on the server" });
    }
};
