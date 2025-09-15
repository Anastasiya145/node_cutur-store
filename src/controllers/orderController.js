const orderService = require("../services/orderService");

async function getAllOrders(req, res) {
  try {
    const orders = await orderService.getAllOrders();
    res.json(orders);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function getOrdersByUserEmail(req, res) {
  try {
    const { userEmail } = req.params;
    const orders = await orderService.getOrdersByUserEmail(userEmail);
    res.json(orders);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function getOrderById(req, res) {
  try {
    const { id } = req.params;
    const order = await orderService.getOrderById(id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function createOrder(req, res) {
  try {
    const { user_email, date, status, total, items } = req.body;
    if (!user_email || !date || !status || !total || !items) {
      return res.status(400).json({ error: "Missing required order fields" });
    }
    const order = await orderService.createOrder({
      user_email,
      date,
      status,
      total,
      items,
    });
    res.status(201).json(order);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

module.exports = {
  getAllOrders,
  getOrdersByUserEmail,
  getOrderById,
  createOrder,
};
