const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "No token" });
  const token = auth.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET);
  next();
}

module.exports = authMiddleware;
