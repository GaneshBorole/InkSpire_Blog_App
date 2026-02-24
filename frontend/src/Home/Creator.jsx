import axios from "axios";
import React, { useEffect, useState } from "react";

function Creators() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdmins = async () => {
    try {
      const { data } = await axios.get("/api/users/admins");
      setAdmins(data.admins || []);
    } catch (error) {
      console.error("Failed to load creators");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-600">
        Loading creators...
      </p>
    );
  }

  if (!admins.length) {
    return (
      <p className="text-center mt-10 text-gray-500">
        No creators available.
      </p>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-6 text-center">
        Popular Creators
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {admins.slice(0, 8).map((admin) => (
          <div key={admin._id} className="text-center">
            <img
              src={admin.photo?.url || "/imgPL.webp"}
              alt={admin.name}
              className="w-32 h-32 mx-auto rounded-full object-cover border shadow"
            />

            <p className="mt-3 font-medium">{admin.name}</p>
            <p className="text-gray-500 text-sm capitalize">
              {admin.role}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Creators;