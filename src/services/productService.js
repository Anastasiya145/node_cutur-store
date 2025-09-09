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
      TRIM(category) as title,
      TRIM(category) as name,
      COUNT(*) as itemCount
    FROM products
    WHERE category IS NOT NULL AND TRIM(category) <> ''
    GROUP BY TRIM(category)
    ORDER BY title
  `);
  return rows.map((row, idx) => ({
    id: idx + 1,
    title: row.title,
    name: row.name,
    itemCount: Number(row.itemCount),
  }));
};

module.exports = {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  getAllCategories,
};
