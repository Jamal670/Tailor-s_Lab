const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig");
const adminController = require("../controllers/adminController");

router.post("/login", adminController.adminLogin);
router.post("/add-product", upload, adminController.addProduct);
router.get("/get-all-suits", adminController.getAllSuits);
router.get("/get-all-shirts", adminController.getAllShirts);
router.get("/get-all-trousers", adminController.getAllTrousers);
router.delete("/delete-product/:id", adminController.deleteProduct);
router.get("/product/:id", adminController.getProductById);
router.put("/update-product/:id", upload, adminController.updateProduct);

// router.post("/add-product", upload.single("image"), adminController.addProduct);
// router.get("/products", adminController.getProducts);

module.exports = router;
 