const userService = require("../services/userService");
const { sendContactEmailToAdmin } = require("./sendMailer");

exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await userService.getFeaturedProducts();
    res.status(200).json(products);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Something went wrong on the server" });
  }
};

exports.getSuitsProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const data = await userService.getPaginatedProductsByCategory(
      "suits",
      page,
    );
    res.status(200).json(data);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Something went wrong on the server" });
  }
};

exports.getShirtsProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const data = await userService.getPaginatedProductsByCategory(
      "shirts",
      page,
    );
    res.status(200).json(data);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Something went wrong on the server" });
  }
};

exports.getTrousersProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const data = await userService.getPaginatedProductsByCategory(
      "trousers",
      page,
    );
    res.status(200).json(data);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Something went wrong on the server" });
  }
};

exports.getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await userService.getProductDetails(id);
    res.status(200).json(data);
  } catch (error) {
    if (error.message === "Product not found") {
      return res.status(404).json({ error: "Product not found" });
    }
    console.error("Server Error:", error);
    res.status(500).json({ error: "Something went wrong on the server" });
  }
};

exports.getRelatedProducts = async (req, res) => {
  try {
    const { category } = req.params;
    const { id } = req.query;
    const data = await userService.getRelatedProducts(category, id);
    res.status(200).json(data);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Something went wrong on the server" });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const orderData = await userService.createOrder(req.body);
    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: orderData,
    });
  } catch (error) {
    if (error.message === "Missing required fields or cart is empty") {
      return res.status(400).json({ error: error.message });
    }
    console.error("Server Error:", error);
    res.status(500).json({ error: "Something went wrong on the server" });
  }
};

exports.getFilteredProducts = async (req, res) => {
  try {
    const data = await userService.getFilteredProducts(req.query);
    res.status(200).json(data);
  } catch (error) {
    console.error("Filter Products Error:", error);
    res
      .status(500)
      .json({ error: "Something went wrong while filtering products" });
  }
};

exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ error: "Name, email, and message are required" });
    }

    const result = await sendContactEmailToAdmin(req.body);
    if (result.success) {
      res
        .status(200)
        .json({ success: true, message: "Message sent successfully" });
    } else {
      res.status(500).json({ error: "Failed to send message" });
    }
  } catch (error) {
    console.error("Contact Form Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
