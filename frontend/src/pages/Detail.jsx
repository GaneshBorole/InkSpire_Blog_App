import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

function Detail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBlog = async () => {
    try {
      const { data } = await axios.get(`/api/blogs/${id}`);
      setBlog(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load blog");
      setBlog(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-600">
        Loading blog...
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        Blog not found.
      </div>
    );
  }

  const image = blog?.blogImage?.url || "/imgPL.webp";
  const authorPhoto = blog?.adminPhoto || "/imgPL.webp";

  return (
    <section className="container mx-auto px-4 py-10 max-w-5xl">
      {/* Category */}
      <p className="text-blue-600 uppercase text-xs font-bold mb-3 tracking-wide">
        {blog.category}
      </p>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
        {blog.title}
      </h1>

      {/* Author */}
      <div className="flex items-center mb-8">
        <img
          src={authorPhoto}
          alt={blog.adminName}
          className="w-12 h-12 rounded-full mr-4 object-cover"
        />
        <p className="text-lg font-semibold">{blog.adminName}</p>
      </div>

      {/* Blog Image */}
      <img
        src={image}
        alt={blog.title}
        className="w-full max-h-105 object-cover rounded-lg shadow-md mb-8"
      />

      {/* Blog Content */}
      <article className="text-lg leading-relaxed text-gray-700 whitespace-pre-line">
        {blog.about}
      </article>
    </section>
  );
}

export default Detail;