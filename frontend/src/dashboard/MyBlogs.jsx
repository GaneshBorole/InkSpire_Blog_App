import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

function MyBlogs() {
  const [myBlogs, setMyBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyBlogs = async () => {
    try {
      const { data } = await axios.get("/api/blogs/my/blogs");
      setMyBlogs(data);
    } catch (error) {
      toast.error("Failed to load your blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBlogs();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?"
    );

    if (!confirmDelete) return;

    try {
      const { data } = await axios.delete(`/api/blogs/${id}`);

      toast.success(data.message || "Blog deleted");

      setMyBlogs((prev) => prev.filter((blog) => blog._id !== id));
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete blog"
      );
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-20 text-gray-600">
        Loading your blogs...
      </div>
    );
  }

  return (
    <div className="container mx-auto my-12 p-4">
      {myBlogs.length === 0 ? (
        <p className="text-center text-gray-500">
          You have not posted any blogs yet.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 md:ml-60">
          {myBlogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white shadow-lg rounded-lg overflow-hidden"
            >
              {blog?.blogImage?.url && (
                <img
                  src={blog.blogImage.url}
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-4">
                <span className="text-sm text-gray-600">
                  {blog.category}
                </span>

                <h4 className="text-xl font-semibold my-2">
                  {blog.title}
                </h4>

                <div className="flex justify-between mt-4">
                  <Link
                    to={`/blogs/update/${blog._id}`}
                    className="text-blue-500 bg-white rounded-md shadow px-3 py-1 border hover:underline"
                  >
                    UPDATE
                  </Link>

                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="text-red-500 bg-white rounded-md shadow px-3 py-1 border hover:underline"
                  >
                    DELETE
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBlogs;