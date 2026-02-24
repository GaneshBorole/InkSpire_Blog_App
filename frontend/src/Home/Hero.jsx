import React from "react";
import { useAuth } from "../context/AuthProvider";
import { Link } from "react-router-dom";

function Hero() {
  const { blogs, loading } = useAuth();

  if (loading) {
    return (
      <p className="text-center mt-16 text-gray-600">
        Loading featured blogs...
      </p>
    );
  }

  if (!blogs || blogs.length === 0) {
    return (
      <p className="text-center mt-16 text-gray-500">
        No blogs available.
      </p>
    );
  }

  return (
    <div className="container mx-auto my-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      {blogs.slice(0, 4).map((blog) => (
        <Link
          to={`/blogs/${blog._id}`}
          key={blog._id}
          className="bg-white rounded-lg overflow-hidden hover:shadow-xl transform hover:scale-105 transition duration-300"
        >
          {/* Image Section */}
          <div className="relative group">
            <img
              src={blog?.blogImage?.url || "/imgPL.webp"}
              alt={blog?.title}
              className="w-full h-56 object-cover"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent"></div>

            {/* Title */}
            <h1 className="absolute bottom-4 left-4 right-4 text-white text-lg font-bold group-hover:text-yellow-400 transition">
              {blog.title}
            </h1>
          </div>

          {/* Author Section */}
          <div className="p-4 flex items-center">
            <img
              src={blog?.adminPhoto || "/imgPL.webp"}
              alt={blog?.adminName || "author"}
              className="w-12 h-12 rounded-full border-2 border-yellow-400 object-cover"
            />

            <div className="ml-3">
              <p className="text-md font-semibold text-gray-800">
                {blog.adminName || "Admin"}
              </p>
              <p className="text-xs text-gray-400">New</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default Hero;