import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

// ✅ set global axios settings
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "https://inkspire-blog-app.onrender.com";

export const AuthProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔐 Fetch logged-in user
  const fetchProfile = async () => {
    try {
      const { data } = await axios.get("/api/users/me");

      setProfile(data.user);
      setIsAuthenticated(true);
    } catch (error) {
      setProfile(null);
      setIsAuthenticated(false);
    }
  };

  // 📝 Fetch blogs
  const fetchBlogs = async () => {
    try {
      const { data } = await axios.get("/api/blogs");
      setBlogs(data);
    } catch (error) {
      console.error("Failed to load blogs");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchProfile(), fetchBlogs()]);
      setLoading(false);
    };

    loadData();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        blogs,
        setBlogs,
        profile,
        setProfile,
        isAuthenticated,
        setIsAuthenticated,
        loading,
        fetchProfile,
        fetchBlogs,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);