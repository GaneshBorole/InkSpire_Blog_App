import axios from "../api/axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Register() {
  const navigateTo = useNavigate();

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

    // validate file type
    if (!file.type.startsWith("image/")) {
      return toast.error("Please upload a valid image");
    }

    // validate size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      return toast.error("Image must be under 2MB");
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

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("password", password);
      formData.append("role", role);
      formData.append("education", education);
      formData.append("photo", photo);

      const { data } = await axios.post(
        "/api/users/register",
        formData
      );

      toast.success(
        data.message || "Registration successful! Please login."
      );

      // clear form
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setRole("");
      setEducation("");
      setPhoto(null);
      setPhotoPreview("");

      // redirect to login
      navigateTo("/login");

    } catch (error) {
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
          >
            <option value="">Select Role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          {/* Name */}
          <input
            type="text"
            placeholder="Your Name"
            className="w-full p-2 mb-4 border rounded-md"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 mb-4 border rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Phone */}
          <input
            type="tel"
            placeholder="Phone Number"
            className="w-full p-2 mb-4 border rounded-md"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 mb-4 border rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Education */}
          <select
            value={education}
            onChange={(e) => setEducation(e.target.value)}
            className="w-full p-2 mb-4 border rounded-md"
          >
            <option value="">Select Education</option>
            <option value="BCA">BCA</option>
            <option value="MCA">MCA</option>
            <option value="MBA">MBA</option>
            <option value="BE">BE / B.Tech</option>
          </select>

          {/* Photo Upload */}
          <div className="flex items-center mb-4">
            <img
              src={photoPreview || "/imgPL.webp"}
              alt="preview"
              className="w-20 h-20 object-cover rounded mr-4"
            />
            <input
              type="file"
              accept="image/*"
              onChange={changePhotoHandler}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <p className="text-center mb-4">
            Already registered?{" "}
            <Link to="/login" className="text-blue-600">
              Login
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