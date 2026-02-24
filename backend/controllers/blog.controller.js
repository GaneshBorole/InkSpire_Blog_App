import { Blog } from "../models/blog.model.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

export const createBlog = async (req, res) => {
  try {
    if (!req.files || !req.files.blogImage) {
      return res.status(400).json({ message: "Blog image is required" });
    }

    const { blogImage } = req.files;

    const allowedFormats = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedFormats.includes(blogImage.mimetype)) {
      return res.status(400).json({
        message: "Only JPG, PNG, WEBP images are allowed",
      });
    }

    const { title, category, about } = req.body;

    if (!title || !category || !about) {
      return res.status(400).json({
        message: "Title, category and about are required",
      });
    }

    if (!blogImage.tempFilePath) {
      return res.status(400).json({
        message: "File upload failed. Try again.",
      });
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(
      blogImage.tempFilePath,
      { folder: "blogs" }
    );

    if (!cloudinaryResponse) {
      return res.status(500).json({
        message: "Image upload failed",
      });
    }

    const blogData = {
      title,
      about,
      category,
      adminName: req.user?.name || "Admin",
      adminPhoto: req.user?.photo?.url || "",
      createdBy: req.user?._id,
      blogImage: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
    };

    const blog = await Blog.create(blogData);

    res.status(201).json({
      message: "Blog created successfully",
      blog,
    });

  } catch (error) {
    console.error("CREATE BLOG ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // delete image from cloudinary
    if (blog.blogImage?.public_id) {
      await cloudinary.uploader.destroy(blog.blogImage.public_id);
    }

    await blog.deleteOne();

    res.status(200).json({ message: "Blog deleted successfully" });

  } catch (error) {
    console.error("DELETE BLOG ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const allBlogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(allBlogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
};

export const getSingleBlogs = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid blog id" });
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json(blog);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching blog" });
  }
};

export const getMyBlogs = async (req, res) => {
  try {
    const createdBy = req.user?._id;

    const myBlogs = await Blog.find({ createdBy });

    res.status(200).json(myBlogs);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching your blogs" });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid blog id" });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json(updatedBlog);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating blog" });
  }
};