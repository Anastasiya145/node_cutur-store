const crypto = require("crypto");
const bcrypt = require("bcrypt");
const sequelize = require("../utils/db");
const errorMessages = require("../middlewares/errorsMessages");

async function getUserByEmail(email) {
  const [users] = await sequelize.query(
    "SELECT id, email, username, role, address, created_at, updated_at FROM users WHERE email = $1",
    { bind: [email] }
  );
  if (!users.length) throw new Error("User not found");
  return users[0];
}

async function updateUserAddress(email, address) {
  const [result] = await sequelize.query(
    "UPDATE users SET address = $1, updated_at = CURRENT_TIMESTAMP WHERE email = $2 RETURNING id",
    { bind: [address, email] }
  );
  if (!result.length) throw new Error("User not found");
  return true; // только подтверждение успеха
}

async function updateUsername(email, username) {
  const [result] = await sequelize.query(
    "UPDATE users SET username = $1, updated_at = CURRENT_TIMESTAMP WHERE email = $2 RETURNING id",
    { bind: [username, email] }
  );
  if (!result.length) throw new Error("User not found");
  return true;
}

async function updatePassword(email, currentPassword, newPassword) {
  // Сначала получаем пользователя с паролем для проверки
  const [users] = await sequelize.query(
    "SELECT id, password FROM users WHERE email = $1",
    { bind: [email] }
  );

  if (!users.length) {
    throw new Error(errorMessages.userNotFound);
  }

  const user = users[0];

  // Проверяем текущий пароль
  const isCurrentPasswordValid = await bcrypt.compare(
    currentPassword,
    user.password
  );
  if (!isCurrentPasswordValid) {
    throw new Error(errorMessages.invalidCurrentPassword);
  }

  // Хешируем новый пароль
  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  // Обновляем пароль
  const [result] = await sequelize.query(
    "UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE email = $2 RETURNING id",
    { bind: [hashedNewPassword, email] }
  );

  if (!result.length) {
    throw new Error(errorMessages.userNotFound);
  }

  return true;
}

module.exports = {
  getUserByEmail,
  updateUserAddress,
  updateUsername,
  updatePassword,
};
