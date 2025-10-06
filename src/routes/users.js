const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleWares");

router.get("/:email", authMiddleware, userController.getUserByEmail);
router.put("/:email/address", authMiddleware, userController.updateUserAddress);

module.exports = router;
