import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const createTokenAndSaveCookies = async (userId, res) => {
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error("JWT_SECRET_KEY is missing in environment variables");
  }

  const token = jwt.sign(
    { userId },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "30d" }
  );

  // 🍪 cookie settings for production (Render + Vercel)
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", 
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    path: "/",
  });

  // OPTIONAL: store token (not required for JWT auth)
  // await User.findByIdAndUpdate(userId, { token });

  return token;
};

export default createTokenAndSaveCookies;