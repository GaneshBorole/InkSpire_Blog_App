import axios from "axios";
import React, { useEffect, useState } from "react";

function Creators() {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCreators = async () => {
    try {
      const { data } = await axios.get("/api/users/admins");
      setCreators(data.admins || []);
    } catch (error) {
      console.error("Failed to load creators");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreators();
  }, []);

  if (loading) {
    return (
      <p className="text-center mt-16 text-gray-600">
        Loading creators...
      </p>
    );
  }

  if (!creators.length) {
    return (
      <p className="text-center mt-16 text-gray-500">
        No creators available.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-6 my-20 bg-gray-100 px-4 py-10">
      {creators.map((creator) => {
        const avatar = creator.photo?.url || "/imgPL.webp";

        return (
          <div
            key={creator._id}
            className="bg-white shadow-lg rounded-lg overflow-hidden w-72 hover:shadow-xl transition"
          >
            {/* Cover */}
            <div className="relative">
              <div className="h-24 bg-linear-to-r from-blue-500 to-indigo-600"></div>

              {/* Avatar */}
              <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-10">
                <img
                  src={avatar}
                  alt={creator.name}
                  className="w-20 h-20 rounded-full border-4 border-white object-cover shadow"
                />
              </div>
            </div>

            {/* Info */}
            <div className="pt-14 pb-6 px-4 text-center">
              <h2 className="text-lg font-semibold text-gray-800">
                {creator.name}
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                {creator.email}
              </p>

              <p className="text-gray-500 text-sm">
                {creator.phone}
              </p>

              <span className="inline-block mt-2 px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full capitalize">
                {creator.role}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Creators;