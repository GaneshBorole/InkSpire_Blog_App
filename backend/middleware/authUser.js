import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

// 🔐 Authentication Middleware
export const isAuthenticated = async (req, res, next) => {
  try {
    if (!process.env.JWT_SECRET_KEY) {
      return res.status(500).json({
        error: "JWT secret key missing in server configuration",
      });
    }

    // get token from cookie OR Authorization header
    const token =
      req.cookies?.jwt ||
      (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user;

    next();

  } catch (error) {
    console.error("AUTH ERROR:", error.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// 🔐 Authorization Middleware
export const isAdmin = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Role '${req.user.role}' is not authorized`,
      });
    }

    next();
  };
};