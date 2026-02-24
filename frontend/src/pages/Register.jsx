import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthProvider";

function Register() {
  const navigateTo = useNavigate();
  const { setIsAuthenticated, setProfile } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [education, setEducation] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const changePhotoHandler = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // validate type
    if (!file.type.startsWith("image/")) {
      return toast.error("Please upload a valid image");
    }

    // validate size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return toast.error("Image must be less than 2MB");
    }

    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !role || !education) {
      return toast.error("Please fill all required fields");
    }

    if (!photo) {
      return toast.error("Please upload a profile photo");
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("role", role);
    formData.append("education", education);
    formData.append("photo", photo);

    try {
      setLoading(true);

      const { data } = await axios.post(
        "/api/users/register",
        formData
      );

      toast.success(data.message || "Registration successful");

      // auto login after register
      setProfile(data.user);
      setIsAuthenticated(true);

      navigateTo("/");
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <form onSubmit={handleRegister}>
          <div className="text-xl text-center font-semibold mb-2">
            Ink<span className="text-blue-500">Spire</span>
          </div>

          <h1 className="text-xl font-semibold mb-6 text-center">
            Register
          </h1>

          {/* Role */}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 mb-4 border rounded-md"
            required
          >
            <option value="">Select Role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          {/* Name */}
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 mb-4 border rounded-md"
            required
            autoComplete="name"
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Your Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-4 border rounded-md"
            required
            autoComplete="email"
          />

          {/* Phone */}
          <input
            type="tel"
            placeholder="Your Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-2 mb-4 border rounded-md"
            autoComplete="tel"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 border rounded-md"
            required
            autoComplete="new-password"
          />

          {/* Education */}
          <select
            value={education}
            onChange={(e) => setEducation(e.target.value)}
            className="w-full p-2 mb-4 border rounded-md"
            required
          >
            <option value="">Select Your Education</option>
            <option value="BCA">BCA</option>
            <option value="MCA">MCA</option>
            <option value="MBA">MBA</option>
            <option value="BE">BE / B.Tech</option>
          </select>

          {/* Photo */}
          <div className="flex items-center mb-4">
            <img
              src={photoPreview || "https://via.placeholder.com/80"}
              alt="preview"
              className="w-20 h-20 object-cover rounded mr-4"
            />

            <input
              type="file"
              accept="image/*"
              onChange={changePhotoHandler}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <p className="text-center mb-4">
            Already registered?{" "}
            <Link to="/login" className="text-blue-600">
              Login Now
            </Link>
          </p>

          <button
            disabled={loading}
            className="w-full p-2 bg-blue-500 hover:bg-blue-800 rounded-md text-white"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;