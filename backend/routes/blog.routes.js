import express from "express";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getSingleBlogs,
  getMyBlogs,
  updateBlog,
} from "../controllers/blog.controller.js";

import { isAuthenticated, isAdmin } from "../middleware/authUser.js";

const router = express.Router();

// 🔓 Public Routes
router.get("/", getAllBlogs);          // GET all blogs
router.get("/:id", getSingleBlogs);   // GET single blog

// 🔐 Authenticated Routes
router.get("/my/blogs", isAuthenticated, getMyBlogs);

// 🔐 Admin Routes
router.post("/", isAuthenticated, isAdmin("admin"), createBlog);
router.put("/:id", isAuthenticated, isAdmin("admin"), updateBlog);
router.delete("/:id", isAuthenticated, isAdmin("admin"), deleteBlog);

export default router;