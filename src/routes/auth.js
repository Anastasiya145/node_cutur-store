const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
} = require("../middlewares/validateAuth");

router.post("/register", validateRegister, authController.register);
router.post("/auth", validateLogin, authController.login);
router.post(
  "/forgot-password",
  validateForgotPassword,
  authController.forgotPassword
);
router.post(
  "/reset-password",
  validateResetPassword,
  authController.resetPassword
);

module.exports = router;
