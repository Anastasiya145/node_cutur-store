const sequelize = require("../utils/db");

async function getAllOrders() {
  const [orders] = await sequelize.query(
    "SELECT * FROM orders ORDER BY date DESC"
  );
  return orders;
}

async function getOrdersByUserEmail(userEmail) {
  const [orders] = await sequelize.query(
    "SELECT * FROM orders WHERE user_email = $1 ORDER BY date DESC",
    { bind: [userEmail] }
  );
  return orders;
}

async function getOrderById(id) {
  const [orders] = await sequelize.query("SELECT * FROM orders WHERE id = $1", {
    bind: [id],
  });
  return orders[0] || null;
}

async function createOrder({ user_email, date, status, total, items }) {
  const [result] = await sequelize.query(
    `INSERT INTO orders (user_email, date, status, total, items)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    { bind: [user_email, date, status, total, JSON.stringify(items)] }
  );
  return result[0];
}

module.exports = {
  getAllOrders,
  getOrdersByUserEmail,
  getOrderById,
  createOrder,
};
