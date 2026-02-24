import React from "react";
import { useAuth } from "../context/AuthProvider";
import { Link } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

function Trending() {
  const { blogs, loading } = useAuth();

  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 5 },
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 4 },
    tablet: { breakpoint: { max: 1024, min: 640 }, items: 2 },
    mobile: { breakpoint: { max: 640, min: 0 }, items: 1 },
  };

  if (loading) {
    return (
      <p className="text-center mt-16 text-gray-600">
        Loading trending blogs...
      </p>
    );
  }

  if (!blogs || blogs.length === 0) {
    return (
      <p className="text-center mt-16 text-gray-500">
        No trending blogs available.
      </p>
    );
  }

  return (
    <div className="container mx-auto my-10">
      <h1 className="text-2xl font-semibold mb-6 text-center">
        Trending
      </h1>

      <Carousel
        responsive={responsive}
        infinite
        autoPlay
        autoPlaySpeed={3500}
        keyBoardControl
        showDots={false}
        containerClass="pb-4"
        itemClass="px-2"
      >
        {blogs.slice(0, 8).map((blog) => (
          <div
            key={blog._id}
            className="bg-white border rounded-lg shadow hover:shadow-lg transition"
          >
            <Link to={`/blogs/${blog._id}`}>
              {/* Image */}
              <div className="relative">
                <img
                  src={blog?.blogImage?.url || "/imgPL.webp"}
                  alt={blog.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />

                <span className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs">
                  {blog.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-4 bg-gray-50 rounded-b-lg h-32 flex flex-col justify-between">
                <h2 className="font-semibold line-clamp-2">
                  {blog.title}
                </h2>

                <div className="flex items-center mt-2">
                  <img
                    src={blog?.adminPhoto || "/imgPL.webp"}
                    alt={blog.adminName}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <p className="ml-3 text-gray-500 text-sm">
                    {blog.adminName || "Admin"}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export default Trending;