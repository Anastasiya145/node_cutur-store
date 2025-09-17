const e = require("express");

const errorMessages = {
  requiredEmail: "Email is required",
  requiredPassword: "Password is required",
  requiredUsername: "Username is required",
  requiredEmailPassword: "Email and password are required",
  requiredAll: "Email, password, and username are required",
  invalidEmail: "Invalid email format",
  shortPassword: "Password must be at least 6 characters",
  requiredTokenPassword: "Token and new password required",
};

module.exports = errorMessages;
