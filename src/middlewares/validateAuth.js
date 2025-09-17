const errorMessages = require("../middlewares/errorsMessages");

function isEmailValid(email) {
  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  return emailRegex.test(email);
}

function isPasswordValid(password) {
  return password && password.length >= 6;
}

function validateRegister(req, res, next) {
  const { email, password, username } = req.body;
  if (!email || !password || !username) {
    return res.status(400).json({ error: errorMessages.requiredAll });
  }
  if (!isEmailValid(email)) {
    return res.status(400).json({ error: errorMessages.invalidEmail });
  }
  if (!isPasswordValid(password)) {
    return res.status(400).json({ error: errorMessages.shortPassword });
  }
  next();
}

function validateLogin(req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: errorMessages.requiredEmailPassword });
  }
  if (!isEmailValid(email)) {
    return res.status(400).json({ error: errorMessages.invalidEmail });
  }
  next();
}

function validateForgotPassword(req, res, next) {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: errorMessages.requiredEmail });
  }
  if (!isEmailValid(email)) {
    return res.status(400).json({ error: errorMessages.invalidEmail });
  }
  next();
}

function validateResetPassword(req, res, next) {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return res.status(400).json({ error: errorMessages.requiredTokenPassword });
  }
  if (!isPasswordValid(newPassword)) {
    return res.status(400).json({ error: errorMessages.shortPassword });
  }
  next();
}

module.exports = {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
};
