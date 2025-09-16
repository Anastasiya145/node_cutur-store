const userService = require("../services/userService");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      return res
        .status(400)
        .json({ error: "Email, password, and username are required" });
    }
    // Email validation
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    // Password validation (min 6 chars)
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }
    const user = await userService.registerUser({
      email,
      password,
      username,
    });
    // Генерация JWT токена
    const token = jwt.sign(
      { email: user.email, username: user.username },
      process.env.JWT_SECRET || "secret_key",
      { expiresIn: "7d" }
    );
    res.status(201).json({ ...user, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const user = await userService.loginUser({ email, password });
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
    const token = await userService.createPasswordResetToken(email);
    // Здесь можно отправить email с токеном, для теста возвращаем токен
    res.json({ message: "Reset token created", token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ error: "Token and new password required" });
    }
    await userService.resetPassword(token, newPassword);
    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { register, login, forgotPassword, resetPassword };
