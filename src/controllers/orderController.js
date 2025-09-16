const orderService = require("../services/orderService");
const jwt = require("jsonwebtoken");

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
    // Только владелец или админ может смотреть свои заказы
    if (req.user.email !== userEmail) {
      return res.status(403).json({ error: "Forbidden" });
    }
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
    // Только владелец или админ может смотреть заказ
    if (req.user.email !== order.user_email) {
      return res.status(403).json({ error: "Forbidden" });
    }
    res.json(order);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function createOrder(req, res) {
  try {
    // email только из токена!
    const user_email = req.user.email;
    const { items } = req.body;
    if (!user_email || !items) {
      return res.status(400).json({ error: "Missing required order fields" });
    }
    const order = await orderService.createOrder({
      user_email,
      items,
    });
    res.status(201).json(order);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function deleteOrder(req, res) {
  try {
    const { id } = req.params;
    const user_email = req.user.email;
    const result = await orderService.deleteOrder(id, user_email);
    res.json(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

module.exports = {
  getAllOrders,
  getOrdersByUserEmail,
  getOrderById,
  createOrder,
  deleteOrder,
};
