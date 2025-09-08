const pool = require("../utils/db");

const getAllProducts = async () => {
  const { rows } = await pool.query("SELECT * FROM products");
  return rows;
};

const getProductById = async (id) => {
  const { rows } = await pool.query("SELECT * FROM products WHERE id = $1", [
    id,
  ]);
  return rows[0];
};

const getProductsByCategory = async (category) => {
  const { rows } = await pool.query(
    "SELECT * FROM products WHERE category = $1",
    [category]
  );
  return rows;
};

module.exports = {
  getAllProducts,
  getProductById,
  getProductsByCategory,
};
