import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";

function CreateBlog() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [about, setAbout] = useState("");

  const [blogImage, setBlogImage] = useState(null);
  const [blogImagePreview, setBlogImagePreview] = useState("");

  const [loading, setLoading] = useState(false);

  const changePhotoHandler = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setBlogImage(file);
    setBlogImagePreview(URL.createObjectURL(file));
  };

  const handleCreateBlog = async (e) => {
    e.preventDefault();

    if (!title || !category || !about || !blogImage) {
      return toast.error("Please fill all fields");
    }

    if (about.length < 20) {
      return toast.error("About must be at least 20 characters");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("about", about);
    formData.append("blogImage", blogImage);

    try {
      setLoading(true);

      const { data } = await axios.post(
        "https://inkspire-blog-app.onrender.com/api/blogs",
        formData,
        { withCredentials: true }
      );

      toast.success(data.message || "Blog created successfully");

      setTitle("");
      setCategory("");
      setAbout("");
      setBlogImage(null);
      setBlogImagePreview("");

    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to create blog"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-4xl mx-auto p-6 border rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold mb-8">Create Blog</h3>

        <form onSubmit={handleCreateBlog} className="space-y-6">
          {/* Category */}
          <div>
            <label className="block text-lg">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">Select Category</option>
              <option value="Devotion">Devotion</option>
              <option value="Sports">Sports</option>
              <option value="Coding">Coding</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Business">Business</option>
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-lg">Title</label>
            <input
              type="text"
              placeholder="Enter your blog title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-lg">Blog Image</label>

            <div className="flex justify-center mb-3">
              <img
                src={blogImagePreview || "/imgPL.webp"}
                alt="preview"
                className="w-full max-w-sm rounded-md object-cover"
              />
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={changePhotoHandler}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          {/* About */}
          <div>
            <label className="block text-lg">About</label>
            <textarea
              rows="5"
              placeholder="Write something about your blog"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          >
            {loading ? "Posting..." : "Post Blog"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateBlog;