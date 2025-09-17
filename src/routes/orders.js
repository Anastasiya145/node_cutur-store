const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middlewares/authMiddleWares");

// router.get("/commandes", orderController.getAllOrders);
router.get("/commandes", authMiddleware, orderController.getUsersOrders);
router.get("/commande/:id", authMiddleware, orderController.getOrderById);
router.post("/commande", authMiddleware, orderController.createOrder);
router.delete("/commande/:id", authMiddleware, orderController.deleteOrder);

module.exports = router;
