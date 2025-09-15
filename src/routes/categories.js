const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.get("/:categoryName", productController.getProductsByCategory);
router.get("/", productController.getAllCategories);

module.exports = router;
