const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/get-featured-products", userController.getFeaturedProducts);
router.get("/get-suits-products", userController.getSuitsProducts);
router.get("/get-shirts-products", userController.getShirtsProducts);
router.get("/get-trousers-products", userController.getTrousersProducts);
router.get("/get-product-details/:id", userController.getProductDetails);
router.get(
  "/get-related-products/:category",
  userController.getRelatedProducts,
);
router.post("/orders", userController.createOrder);
router.get("/filter-products", userController.getFilteredProducts);
router.post("/contact", userController.submitContactForm);

module.exports = router;
