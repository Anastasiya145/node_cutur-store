const e = require("express");

const errorMessages = {
  // Auth валидация
  requiredEmail: "Email is required",
  requiredPassword: "Password is required",
  requiredUsername: "Username is required",
  requiredEmailPassword: "Email and password are required",
  requiredAll: "Email, password, and username are required",
  invalidEmail: "Invalid email format",
  shortPassword: "Password must be at least 6 characters",
  requiredTokenPassword: "Token and new password required",

  // User операции
  userNotFound: "User not found",
  userNotRegistered: "Пользователь не зарегистрирован",
  emailAlreadyExists: "Email already registered",
  invalidEmailOrPassword: "Invalid email or password",

  // Address операции
  addressRequired: "Address is required",

  // Username операции
  usernameRequired: "Username is required",
  usernameMinLength: "Username must be at least 2 characters",

  // Order операции
  orderNotFound: "Order not found",
  productNotFound: "Product not found",
  insufficientStock: "Insufficient stock for product",
  orderCancelTimeExpired: "Order can only be cancelled within 24 hours",

  // Auth токены
  noToken: "No token",
  invalidToken: "Invalid token",
  forbidden: "Forbidden",

  // General
  unexpectedError: "An unexpected error occurred",

  // Password операции
  requiredCurrentAndNewPassword:
    "Current password and new password are required",
  invalidCurrentPassword: "Current password is incorrect",
};

module.exports = errorMessages;
