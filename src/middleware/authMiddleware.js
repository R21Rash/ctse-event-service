const axios = require("axios");

const AUTH_SERVICE_URL =
  process.env.AUTH_SERVICE_URL || "http://localhost:3000";

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    // Inter-service communication: call Auth Service to validate the token
    const response = await axios.get(`${AUTH_SERVICE_URL}/api/auth/validate`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.valid) {
      req.user = {
        userId: response.data.userId,
        username: response.data.username,
      };
      next();
    } else {
      res.status(401).json({ error: "Invalid token" });
    }
  } catch {
    res.status(401).json({ error: "Token validation failed" });
  }
};

module.exports = { verifyToken };
