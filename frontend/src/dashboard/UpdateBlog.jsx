import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

function UpdateBlog() {
  const navigateTo = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [about, setAbout] = useState("");

  const [blogImage, setBlogImage] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(false);

  const changePhotoHandler = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setBlogImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // Fetch blog details
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await axios.get(`/api/blogs/${id}`);

        setTitle(data.title);
        setCategory(data.category);
        setAbout(data.about);
        setExistingImage(data.blogImage?.url);
      } catch (error) {
        toast.error("Failed to load blog");
      }
    };

    fetchBlog();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!title || !category || !about) {
      return toast.error("Please fill all fields");
    }

    if (about.length < 20) {
      return toast.error("About must be at least 20 characters");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("about", about);

    // send image only if changed
    if (blogImage) {
      formData.append("blogImage", blogImage);
    }

    try {
      setLoading(true);

      const { data } = await axios.put(
        `/api/blogs/${id}`,
        formData
      );

      toast.success(data.message || "Blog updated");

      navigateTo("/dashboard");

    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Update failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto my-12 p-4">
      <section className="max-w-2xl mx-auto">
        <h3 className="text-2xl font-bold mb-6">UPDATE BLOG</h3>

        <form onSubmit={handleUpdate}>
          {/* Category */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Category</label>
            <select
              className="w-full p-2 border rounded-md"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
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
          <input
            type="text"
            placeholder="Blog Title"
            className="w-full p-2 mb-4 border rounded-md"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Image */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Blog Image</label>

            <img
              src={preview || existingImage || "/imgPL.webp"}
              alt="blog"
              className="w-full h-48 object-cover mb-4 rounded-md"
            />

            <input
              type="file"
              accept="image/*"
              className="w-full p-2 border rounded-md"
              onChange={changePhotoHandler}
            />
          </div>

          {/* About */}
          <textarea
            rows="6"
            className="w-full p-2 mb-4 border rounded-md"
            placeholder="Write something about your blog..."
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          />

          <button
            disabled={loading}
            className="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {loading ? "Updating..." : "UPDATE BLOG"}
          </button>
        </form>
      </section>
    </div>
  );
}

export default UpdateBlog;