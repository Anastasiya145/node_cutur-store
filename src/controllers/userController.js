const userService = require("../services/userService"); // исправьте импорт

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

// Обновить имя пользователя
async function updateUsername(req, res) {
  try {
    const { email } = req.params;
    const { username } = req.body;
    // Проверяем, что пользователь может изменить только своё имя
    if (req.user.email !== email) {
      return res.status(403).json({ error: "Forbidden" });
    }
    if (!username || username.trim().length === 0) {
      return res.status(400).json({ error: "Username is required" });
    }
    if (username.length < 2) {
      return res
        .status(400)
        .json({ error: "Username must be at least 2 characters" });
    }
    const user = await userService.updateUsername(email, username.trim());
    res.json(user);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

module.exports = {
  getUserByEmail,
  updateUserAddress,
  updateUsername,
};
