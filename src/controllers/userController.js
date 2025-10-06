const userService = require("../services/userService");

// Получить данные пользователя (без пароля)
async function getUserByEmail(req, res) {
  try {
    const { email } = req.params;
    // Проверяем, что пользователь может получить только свои данные
    if (req.user.email !== email && req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }
    const user = await userService.getUserByEmail(email);
    res.json(user);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
}

// Обновить адрес пользователя
async function updateUserAddress(req, res) {
  try {
    const { email } = req.params;
    const { address } = req.body;
    // Проверяем, что пользователь может изменить только свой адрес
    if (req.user.email !== email) {
      return res.status(403).json({ error: "Forbidden" });
    }
    if (!address) {
      return res.status(400).json({ error: "Address is required" });
    }
    const user = await userService.updateUserAddress(email, address);
    res.json(user);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

module.exports = {
  getUserByEmail,
  updateUserAddress,
};
