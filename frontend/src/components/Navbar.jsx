import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineMenu } from "react-icons/ai";
import { IoCloseSharp } from "react-icons/io5";
import { FiMaximize, FiMinimize } from "react-icons/fi";
import { useAuth } from "../context/AuthProvider";
import axios from "../api/axios";
import toast from "react-hot-toast";

function Navbar() {
  const [show, setShow] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { profile, isAuthenticated, setIsAuthenticated, setProfile } = useAuth();
  const navigateTo = useNavigate();

  const handleLogout = async () => {
    try {
      const { data } = await axios.get("/api/users/logout");

      toast.success(data.message);

      setProfile(null);
      setIsAuthenticated(false);

      navigateTo("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <nav className="shadow-lg px-4 py-2">
      <div className="flex items-center justify-between container mx-auto">
        <div className="font-semibold text-xl">
          Ink<span className="text-blue-500">Spire</span>
        </div>

        {/* Desktop Links */}
        <ul className="hidden md:flex space-x-6">
          <Link to="/">HOME</Link>
          <Link to="/blogs">BLOGS</Link>
          <Link to="/creators">CREATORS</Link>
          <Link to="/about">ABOUT</Link>
          <Link to="/contact">CONTACT</Link>
        </ul>

        {/* Right Section */}
        <div className="hidden md:flex items-center space-x-3">
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded hover:bg-gray-200"
          >
            {isFullscreen ? <FiMinimize /> : <FiMaximize />}
          </button>

          {isAuthenticated && profile?.role === "admin" && (
            <Link
              to="/dashboard"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              DASHBOARD
            </Link>
          )}

          {!isAuthenticated ? (
            <Link
              to="/login"
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              LOGIN
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              LOGOUT
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden" onClick={() => setShow(!show)}>
          {show ? <IoCloseSharp size={24} /> : <AiOutlineMenu size={24} />}
        </div>
      </div>

      {/* Mobile Menu */}
      {show && (
        <ul className="flex flex-col items-center space-y-4 py-4 md:hidden">
          <Link to="/" onClick={() => setShow(false)}>HOME</Link>
          <Link to="/blogs" onClick={() => setShow(false)}>BLOGS</Link>
          <Link to="/creators" onClick={() => setShow(false)}>CREATORS</Link>
          <Link to="/about" onClick={() => setShow(false)}>ABOUT</Link>
          <Link to="/contact" onClick={() => setShow(false)}>CONTACT</Link>

          {!isAuthenticated ? (
            <Link to="/login">LOGIN</Link>
          ) : (
            <button onClick={handleLogout}>LOGOUT</button>
          )}
        </ul>
      )}
    </nav>
  );
}

export default Navbar;