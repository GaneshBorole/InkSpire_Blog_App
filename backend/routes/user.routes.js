import express from "express";
import {
  register,
  login,
  logout,
  getMyProfile,
  getAdmins,
} from "../controllers/user.controller.js";

import { isAuthenticated, isAdmin } from "../middleware/authUser.js";

const router = express.Router();

// 🔓 Public routes
router.post("/register", register);
router.post("/login", login);

// 🔐 Auth routes
router.post("/logout", isAuthenticated, logout);
router.get("/me", isAuthenticated, getMyProfile);

// 🔐 Admin only
router.get("/admins", isAuthenticated, isAdmin("admin"), getAdmins);

export default router;