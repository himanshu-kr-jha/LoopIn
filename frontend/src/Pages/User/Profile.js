import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/user/profile", {
        withCredentials: true,
      });
      setData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setData({ error: "Failed to load profile" });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!data) return <div className="text-center mt-10">Loading...</div>;
  if (data.error)
    return <div className="text-center text-red-600 mt-10">{data.error}</div>;

  const { data: user, profile } = data;

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white rounded-xl shadow-lg">
      <div className="flex flex-col items-center mb-6">
        <img
          src={user.profileimage}
          alt="Profile"
          className="w-28 h-28 object-cover rounded-full border-4 border-gray-300"
        />
        <h2 className="text-2xl font-semibold mt-4">{user.name}</h2>
        <p className="text-gray-500">{user.role}</p>
        <p className="text-sm text-gray-400 mt-1">
          Joined on {new Date(user.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">Contact Info</h3>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          {profile?.contact && (
            <p>
              <strong>Contact:</strong> {profile.contact}
            </p>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-1">Academic Details</h3>
          <p>
            <strong>Department:</strong> {profile?.department || "N/A"}
          </p>
          <p>
            <strong>Year:</strong> {profile?.year || "N/A"}
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-1">Links</h3>
          <ul className="space-y-2">
            {profile?.resumeUrl && (
              <li>
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Resume
                </a>
              </li>
            )}
            {profile?.linkedinUrl && (
              <li>
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  LinkedIn Profile
                </a>
              </li>
            )}
            {profile?.portfolioUrl && (
              <li>
                <a
                  href={profile.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Portfolio
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;
