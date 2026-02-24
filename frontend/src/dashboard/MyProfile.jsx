import React from "react";
import { useAuth } from "../context/AuthProvider";

function MyProfile() {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-600">
        Loading profile...
      </p>
    );
  }

  if (!profile) {
    return (
      <p className="text-center mt-10 text-red-500">
        Unable to load profile.
      </p>
    );
  }

  const avatar =
    profile.photo?.url || "/imgPL.webp";

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-md">

        {/* Cover */}
        <div className="relative">
          <div className="h-40 bg-linear-to-r from-blue-500 to-indigo-600"></div>

          {/* Avatar */}
          <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-12">
            <img
              src={avatar}
              alt={profile.name || "User"}
              className="w-24 h-24 rounded-full border-4 border-white shadow object-cover"
            />
          </div>
        </div>

        {/* Info */}
        <div className="pt-16 pb-8 px-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            {profile.name || "User"}
          </h2>

          <p className="text-gray-600 mt-2">
            {profile.email}
          </p>

          <p className="text-gray-600 mt-1">
            {profile.phone}
          </p>

          <p className="text-gray-600 mt-1 capitalize">
            {profile.role}
          </p>
        </div>
      </div>
    </div>
  );
}

export default MyProfile;