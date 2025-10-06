const sequelize = require("../utils/db");

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
    "UPDATE users SET address = $1, updated_at = CURRENT_TIMESTAMP WHERE email = $2 RETURNING id, email, username, role, address, updated_at",
    { bind: [address, email] }
  );
  if (!result.length) throw new Error("User not found");
  return result[0];
}

async function updateUsername(email, username) {
  const [result] = await sequelize.query(
    "UPDATE users SET username = $1, updated_at = CURRENT_TIMESTAMP WHERE email = $2 RETURNING id, email, username, role, address, updated_at",
    { bind: [username, email] }
  );
  if (!result.length) throw new Error("User not found");
  return result[0];
}

module.exports = {
  getUserByEmail,
  updateUserAddress,
  updateUsername,
};
