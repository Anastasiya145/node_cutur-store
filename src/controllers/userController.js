const userService = require("../services/userService");
const errorMessages = require("../middlewares/errorsMessages");

// Получить данные пользователя (без пароля)
async function getUserByEmail(req, res) {
  try {
    const { email } = req.params;
    // Проверяем, что пользователь может получить только свои данные
    if (req.user.email !== email && req.user.role !== "admin") {
      return res.status(403).json({ error: errorMessages.forbidden });
    }
    const user = await userService.getUserByEmail(email);
    res.json(user);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
}

async function updateUserAddress(req, res) {
  try {
    const { email } = req.params;
    const { address } = req.body;
    // Проверяем, что пользователь может изменить только свой адрес
    if (req.user.email !== email) {
      return res.status(403).json({ error: errorMessages.forbidden });
    }
    if (!address) {
      return res.status(400).json({ error: errorMessages.addressRequired });
    }
    await userService.updateUserAddress(email, address);
    res.json({ message: "Address updated successfully" });
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
      return res.status(403).json({ error: errorMessages.forbidden });
    }
    if (!username || username.trim().length === 0) {
      return res.status(400).json({ error: errorMessages.usernameRequired });
    }
    if (username.trim().length < 2) {
      return res.status(400).json({ error: errorMessages.usernameMinLength });
    }
    await userService.updateUsername(email, username.trim());
    res.json({ message: "Username updated successfully" });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

module.exports = {
  getUserByEmail,
  updateUserAddress,
  updateUsername,
};
