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
    const { user_email, status, items } = req.body;
    if (!user_email || !status || !items) {
      return res.status(400).json({ error: "Missing required order fields" });
    }
    const order = await orderService.createOrder({
      user_email,
      status,
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
поп;

// давай улучшим систему запиши заказов на сервере
// жду твои советы

// я думаю что нужно вместо айтемс массив , отправлять массив айди и потом на бек реализовать чтобы по айди он сам записывал заказанные товары в таблицу commandes из таблицы products

// так же с фронта надо передавать количество каждого заказаного товара и уменшать их в таблице продактс

// жду твои
