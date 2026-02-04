import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

function Detail() {
  const { id } = useParams();
  const [blogs, setblogs] = useState(null);

  useEffect(() => {
    if (!id) return;

    setblogs(null); // 🔥 reset old blog

    const fetchblogs = async () => {
      try {
        const { data } = await axios.get(
          `https://inkspire-blog-app.onrender.com/api/blogs/singleBlog/${id}`,
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );

        setblogs(data.blog ?? data);
      } catch (error) {
        console.log(error);
        toast.error("Failed to load blog");
      }
    };

    fetchblogs();
  }, [id]);

  if (!blogs) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading blog...
      </div>
    );
  }

  return (
    <section className="container mx-auto p-4">
      <div className="text-blue-500 uppercase text-xs font-bold mb-4">
        {blogs.category}
      </div>

      <h1 className="text-4xl font-bold mb-6">{blogs.title}</h1>

      <div className="flex items-center mb-6">
        {blogs.adminPhoto && (
          <img
            src={blogs.adminPhoto}
            alt="author"
            className="w-12 h-12 rounded-full mr-4"
          />
        )}
        <p className="text-lg font-semibold">{blogs.adminName}</p>
      </div>

      <div className="flex flex-col md:flex-row">
        {blogs?.blogImage?.url && (
          <img
            src={blogs.blogImage.url}
            alt="blog"
            className="md:w-95 w-full h-100 mb-6 rounded-lg shadow-lg border"
          />
        )}

        <div className="md:w-1/2 w-full md:pl-6">
          <p className="text-lg mb-6">{blogs.about}</p>
        </div>
      </div>
    </section>
  );
}

export default Detail;
