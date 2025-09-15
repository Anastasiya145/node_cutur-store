const crypto = require("crypto");
async function createPasswordResetToken(email) {
  const [users] = await sequelize.query(
    "SELECT * FROM users WHERE email = $1",
    { bind: [email] }
  );
  if (!users.length) throw new Error("User not found");
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 час
  await sequelize.query(
    "UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE email = $3",
    { bind: [token, expires, email] }
  );
  return token;
}

async function resetPassword(token, newPassword) {
  const [users] = await sequelize.query(
    "SELECT * FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()",
    { bind: [token] }
  );
  if (!users.length) throw new Error("Invalid or expired token");
  const hash = await bcrypt.hash(newPassword, 10);
  await sequelize.query(
    "UPDATE users SET password = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2",
    { bind: [hash, users[0].id] }
  );
}
const bcrypt = require("bcrypt");
const sequelize = require("../utils/db");

async function registerUser({ email, password, username, address }) {
  const [existing] = await sequelize.query(
    "SELECT id FROM users WHERE email = $1",
    { bind: [email] }
  );
  if (existing.length) throw new Error("Email already registered");
  const hash = await bcrypt.hash(password, 10);
  await sequelize.query(
    "INSERT INTO users (email, password, username, address) VALUES ($1, $2, $3, $4)",
    { bind: [email, hash, username, address] }
  );
  return { email, username };
}

async function loginUser({ email, password }) {
  const [users] = await sequelize.query(
    "SELECT * FROM users WHERE email = $1",
    { bind: [email] }
  );
  if (!users.length) throw new Error("Invalid email or password");
  const user = users[0];
  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid email or password");
  return { email: user.email, username: user.username };
}

module.exports = {
  registerUser,
  loginUser,
  createPasswordResetToken,
  resetPassword,
};
