import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from "cloudinary";

import userRoute from "./routes/user.routes.js";
import blogRoute from "./routes/blog.routes.js";

dotenv.config();

const app = express();

// 🌍 REQUIRED for Render / Railway / Heroku
app.set("trust proxy", 1);

// ✅ ENV VALIDATION
const requiredEnv = [
  "MONGO_URI",
  "JWT_SECRET_KEY",
  "CLOUD_NAME",
  "CLOUD_API_KEY",
  "CLOUD_SECRET_KEY",
  "FRONTEND_URL",
];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Missing environment variable: ${key}`);
    process.exit(1);
  }
});

// 🔹 Middleware
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// ✅ CORS (supports Vercel frontend)
;app.use(
  cors({
    origin: process.env.FRONTEND_URL, // exact frontend URL
    credentials: true,
  })
);

// ✅ File Upload (Render compatible)
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    createParentPath: true,
  })
);

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "blogApp",
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

// ✅ Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

console.log("✅ Cloudinary configured");

// 🔹 Routes
app.use("/api/users", userRoute);
app.use("/api/blogs", blogRoute);

// 🟢 Health Check (Render uses this)
app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

// 🟢 Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// ❌ Global Error Handler (important)
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err.stack);
  res.status(500).json({
    message: "Something went wrong",
  });
});

// 🔹 Start Server
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});