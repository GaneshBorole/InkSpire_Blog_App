import axios from "../api/axios";
import React, { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get("/api/users/me");
        setProfile(data.user);
        setIsAuthenticated(true);
      } catch {
        setProfile(null);
        setIsAuthenticated(false);
      }
    };

    const fetchBlogs = async () => {
      try {
        const { data } = await axios.get("/api/blogs/allBlog");
        setBlogs(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfile();
    fetchBlogs();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        blogs,
        profile,
        setProfile,
        isAuthenticated,
        setIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);