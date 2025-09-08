const express = require("express");
const productController = require("./src/controllers/productController");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
});
app.get("/products", productController.getAllProducts);
app.get("/products/:id", productController.getProductById);
app.get("/categories", productController.getAllCategories);
app.get("/categories/:categoryName", productController.getProductsByCategory);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
