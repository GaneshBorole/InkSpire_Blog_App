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

// 🔥 REQUIRED for Render / Railway / Heroku
app.set("trust proxy", 1);

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: process.env.FRONTEND_URL, // NO trailing slash
  credentials: true,
}));

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp/",
}));

// DB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

// Routes
app.use("/api/users", userRoute);
app.use("/api/blogs", blogRoute);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
