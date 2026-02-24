import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [5, "Title must be at least 5 characters"],
      maxlength: [150, "Title cannot exceed 150 characters"],
    },

    blogImage: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },

    category: {
      type: String,
      required: true,
      trim: true,
      index: true, // improves category filtering speed
    },

    about: {
      type: String,
      required: true,
      minlength: [20, "Should contain at least 20 characters"],
    },

    adminName: {
      type: String,
      trim: true,
    },

    adminPhoto: {
      type: String,
    },

    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

// 🔎 Enable text search (future feature)
blogSchema.index({ title: "text", about: "text", category: "text" });

export const Blog = mongoose.model("Blog", blogSchema);