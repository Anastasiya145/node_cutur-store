const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.get("/category/:categoryName", productController.getProductsByCategory);
router.get("/categories", productController.getAllCategories);

module.exports = router;
