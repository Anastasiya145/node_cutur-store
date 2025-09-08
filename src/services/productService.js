const sequelize = require("../utils/db");

const getAllProducts = async () => {
  const [rows] = await sequelize.query("SELECT * FROM products");
  return rows;
};

const getProductById = async (id) => {
  const [rows] = await sequelize.query("SELECT * FROM products WHERE id = $1", { bind: [id] });
  return rows[0];
};

const getProductsByCategory = async (category) => {
  const [rows] = await sequelize.query("SELECT * FROM products WHERE category = $1", {
    bind: [category],
  });
  return rows;
};

const getAllCategories = async () => {
  const [rows] = await sequelize.query("SELECT DISTINCT category FROM products");
  return rows.map((row) => row.category);
};

module.exports = {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  getAllCategories,
};
