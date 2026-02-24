import React, { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CiMenuBurger } from "react-icons/ci";
import { BiSolidLeftArrowAlt } from "react-icons/bi";
import toast from "react-hot-toast";

function Sidebar({ setComponent }) {
  const { profile, setIsAuthenticated } = useAuth();
  const navigateTo = useNavigate();
  const [show, setShow] = useState(false);

  const handleComponents = (value) => {
    setComponent(value);
    setShow(false); // close sidebar on mobile
  };

  const gotoHome = () => {
    navigateTo("/");
    setShow(false);
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/users/logout");

      toast.success(data.message || "Logged out successfully");

      setIsAuthenticated(false);
      navigateTo("/login");
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to logout"
      );
    }
  };

  const avatar = profile?.photo?.url || "/imgPL.webp";

  return (
    <>
      {/* Mobile menu icon */}
      <div
        className="sm:hidden fixed top-4 left-4 z-50 cursor-pointer"
        onClick={() => setShow(!show)}
      >
        <CiMenuBurger className="text-2xl" />
      </div>

      {/* Sidebar */}
      <div
        className={`w-64 h-full shadow-lg fixed top-0 left-0 bg-gray-50 transition-transform duration-300 transform sm:translate-x-0 ${
          show ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close icon mobile */}
        <div
          className="sm:hidden absolute top-4 right-4 cursor-pointer"
          onClick={() => setShow(false)}
        >
          <BiSolidLeftArrowAlt className="text-2xl" />
        </div>

        {/* Profile */}
        <div className="text-center mt-6">
          <img
            className="w-24 h-24 rounded-full mx-auto mb-2 object-cover border"
            src={avatar}
            alt={profile?.name || "User"}
          />
          <p className="text-lg font-semibold">
            {profile?.name || "User"}
          </p>
        </div>

        {/* Menu */}
        <ul className="space-y-5 mx-4 mt-8">
          <button
            onClick={() => handleComponents("My Blogs")}
            className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700 transition"
          >
            MY BLOGS
          </button>

          <button
            onClick={() => handleComponents("Create Blog")}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition"
          >
            CREATE BLOG
          </button>

          <button
            onClick={() => handleComponents("My Profile")}
            className="w-full px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-700 transition"
          >
            MY PROFILE
          </button>

          <button
            onClick={gotoHome}
            className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition"
          >
            HOME
          </button>

          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-700 transition"
          >
            LOGOUT
          </button>
        </ul>
      </div>
    </>
  );
}

export default Sidebar;