const sequelize = require("../utils/db");

const getAllProducts = async () => {
  const [rows] = await sequelize.query("SELECT * FROM products");
  return rows;
};

const getProductById = async (id) => {
  const [rows] = await sequelize.query("SELECT * FROM products WHERE id = $1", {
    bind: [id],
  });
  return rows[0];
};

const getProductsByCategory = async (category) => {
  const [rows] = await sequelize.query(
    "SELECT * FROM products WHERE category = $1",
    {
      bind: [category],
    }
  );
  return rows;
};

const getAllCategories = async () => {
  const [rows] = await sequelize.query(`
    SELECT
      category as title,
      category as name,
      COUNT(*) as itemCount
    FROM products
    GROUP BY category
    ORDER BY category
  `);
  return rows.map((row, idx) => ({
    id: idx + 1,
    title: row.title,
    name: row.name,
    itemCount: Number(row.itemCount) || 0,
  }));
};

module.exports = {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  getAllCategories,
};
