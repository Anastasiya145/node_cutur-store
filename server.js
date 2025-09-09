const express = require("express");
const cors = require("cors");
const productController = require("./src/controllers/productController");

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) ||
        origin === "https://anastasiya145.github.io"
      ) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
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
