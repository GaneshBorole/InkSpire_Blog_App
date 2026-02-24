import { User } from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcryptjs";
import createTokenAndSaveCookies from "../jwt/AuthToken.js";

export const register = async (req, res) => {
  try {
    if (!req.files || !req.files.photo) {
      return res.status(400).json({ message: "User photo is required" });
    }

    const { photo } = req.files;

    const allowedFormats = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedFormats.includes(photo.mimetype)) {
      return res.status(400).json({
        message: "Only JPG, PNG, WEBP images are allowed",
      });
    }

    const { email, name, password, phone, education, role } = req.body;

    if (!email || !name || !password || !phone || !education || !role) {
      return res.status(400).json({ message: "Please fill required fields" });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
      });
    }

    const phoneExists = await User.findOne({ phone });
    if (phoneExists) {
      return res.status(400).json({
        message: "Phone number already registered",
      });
    }

    if (!photo.tempFilePath) {
      return res.status(400).json({ message: "File upload failed" });
    }

    const upload = await cloudinary.uploader.upload(photo.tempFilePath, {
      folder: "users",
    });

    if (!upload) {
      return res.status(500).json({
        message: "Photo upload failed",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email: normalizedEmail,
      name: name.trim(),
      password: hashedPassword,
      phone,
      education,
      role,
      photo: {
        public_id: upload.public_id,
        url: upload.secure_url,
      },
    });

    const token = await createTokenAndSaveCookies(newUser._id, res);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        education: newUser.education,
        photo: newUser.photo.url,
      },
      token,
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "Please fill required fields" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (user.role !== role) {
      return res.status(400).json({ message: `Role ${role} not found` });
    }

    const token = await createTokenAndSaveCookies(user._id, res);

    res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Logout failed" });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    res.status(200).json({ user: req.user });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

export const getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" });
    res.status(200).json({ admins });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch admins" });
  }
};