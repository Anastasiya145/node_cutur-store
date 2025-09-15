const express = require("express");
const cors = require("cors");

const productRoutes = require("./src/routes/products");
const categoriesRoutes = require("./src/routes/categories");
const contactRoutes = require("./src/routes/contact");
const authRoutes = require("./src/routes/auth");
const ordersRoutes = require("./src/routes/orders");

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

app.use("/products", productRoutes);
app.use("/categories", categoriesRoutes);
app.use("/", contactRoutes);
app.use("/", authRoutes);
app.use("/", ordersRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
