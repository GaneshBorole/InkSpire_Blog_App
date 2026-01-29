import express from "express";
import dotenv from "dotenv"
import mongoose from "mongoose";
import cors from "cors";
dotenv.config();
const app = express();
import userRoute from  "./routes/user.routes.js"
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from "cloudinary";
import blogRoute from "./routes/blog.routes.js";
import cookieparser from "cookie-parser";
const port = process.env.PORT;
const MONGO_URL=process.env.MONGO_URI;

// Middleware
app.use(express.json());
app.use(cookieparser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Origin","X-Requested-With","Content-Type", "Authorization"],
    credentials: true, 
    optionsSuccessStatus:200,
}));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
//DB connection
try {
    mongoose.connect(MONGO_URL);
    console.log("MongoDB connected");   
} catch (error) {
    console.log(error);
}
// Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

//Routes define
app.use("/api/users",userRoute);
app.use("/api/blogs",blogRoute);
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
