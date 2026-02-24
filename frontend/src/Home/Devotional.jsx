import React from "react";
import { useAuth } from "../context/AuthProvider";
import { Link } from "react-router-dom";

function Devotional() {
  const { blogs, loading } = useAuth();

  const devotionalBlogs = blogs?.filter(
    (blog) => blog.category?.toLowerCase() === "devotion"
  );

  if (loading) {
    return (
      <p className="text-center mt-16 text-gray-600">
        Loading devotional blogs...
      </p>
    );
  }

  if (!devotionalBlogs || devotionalBlogs.length === 0) {
    return (
      <p className="text-center mt-16 text-gray-500">
        No devotional blogs available.
      </p>
    );
  }

  return (
    <div className="container mx-auto my-12 p-4">
      <h1 className="text-2xl font-bold mb-2 text-center">Devotional</h1>

      <p className="text-center mb-8 text-gray-600 max-w-xl mx-auto">
        The concept of gods varies widely across different cultures,
        religions, and belief systems.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {devotionalBlogs.map((blog) => (
          <Link
            to={`/blogs/${blog._id}`}
            key={blog._id}
            className="relative rounded-lg overflow-hidden shadow-md group"
          >
            <img
              src={blog?.blogImage?.url || "/imgPL.webp"}
              alt={blog?.title}
              className="w-full h-48 object-cover group-hover:scale-110 transition duration-300"
            />

            {/* overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent"></div>

            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h2 className="text-lg font-semibold line-clamp-2">
                {blog?.title}
              </h2>
              <p className="text-xs opacity-80">
                {blog?.category}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Devotional;