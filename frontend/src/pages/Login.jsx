import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

function Login() {
  const { isAuthenticated, setIsAuthenticated, setProfile } = useAuth();
  const navigateTo = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  // redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigateTo("/");
    }
  }, [isAuthenticated, navigateTo]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password || !role) {
      return toast.error("Please fill all fields");
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        "/api/users/login",
        { email, password, role }
      );

      toast.success(data.message || "Login successful");

      // cookie handles auth automatically
      setProfile(data.user);
      setIsAuthenticated(true);

      setEmail("");
      setPassword("");
      setRole("");

      navigateTo("/");
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <form onSubmit={handleLogin}>
          <div className="text-xl text-center font-semibold mb-2">
            Ink<span className="text-blue-500">Spire</span>
          </div>

          <h1 className="text-xl font-semibold mb-6 text-center">
            Login
          </h1>

          {/* Role */}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 mb-4 border rounded-md"
          >
            <option value="">Select Role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          {/* Email */}
          <input
            type="email"
            placeholder="Your Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-4 border rounded-md"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 border rounded-md"
          />

          <p className="text-center mb-4">
            New User?{" "}
            <Link to="/register" className="text-blue-600">
              Register Now
            </Link>
          </p>

          <button
            disabled={loading}
            type="submit"
            className="w-full p-2 bg-blue-500 hover:bg-blue-800 rounded-md text-white"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;