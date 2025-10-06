const authService = require("../services/authService");
const jwt = require("jsonwebtoken");

// Валидация вынесена в middleware!

const register = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    const user = await authService.registerUser({
      email,
      password,
      username,
    });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await authService.loginUser({ email, password });

    // Генерируем JWT токен
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({ ...user, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const token = await authService.createPasswordResetToken(email);
    // Здесь можно отправить email с токеном, для теста возвращаем токен
    res.json({ message: "Reset token created", token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    await authService.resetPassword(token, newPassword);
    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { register, login, forgotPassword, resetPassword };
