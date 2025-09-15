const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.get("/commandes", orderController.getAllOrders);
router.get("/commandes/:userEmail", orderController.getOrdersByUserEmail);
router.get("/commande/:id", orderController.getOrderById);

// create order
router.post("/commande", orderController.createOrder);

module.exports = router;
