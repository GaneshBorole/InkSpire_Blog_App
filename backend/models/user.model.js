import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      validate: [validator.isEmail, "Please enter a valid email"],
    },

    // ✅ store as string (better for real-world usage)
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: [10, "Phone number must be at least 10 digits"],
    },

    photo: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },

    education: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      required: true,
      enum: ["user", "admin"],
      default: "user",
    },

    password: {
      type: String,
      required: true,
      select: false,
      minlength: [8, "Password must be at least 8 characters"],
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

export const User = mongoose.model("User", userSchema);