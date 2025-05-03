import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const SocietyDetail = () => {
  const { id } = useParams();
  const [society, setSociety] = useState(null);

  useEffect(() => {
    const fetchSociety = async () => {
      try {
        const res = await fetch(`http://localhost:5000/society/${id}`);
        const data = await res.json();
        setSociety(data.society);
      } catch (error) {
        console.error("Error fetching society details:", error);
      }
    };
    fetchSociety();
  }, [id]);

  if (!society) return <div className="p-6 text-center">Loading Society...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-4xl font-bold text-indigo-600 mb-4 text-center">{society.name}</h1>

        <img
          src={society.coverImage || "https://images.unsplash.com/photo-1726862803549-5bf70e76a1d2?w=900&auto=format&fit=crop&q=60"}
          alt="cover"
          className="w-full h-64 object-cover rounded-lg mb-6"
        />

        <p className="text-lg text-gray-800 mb-4">{society.description}</p>

        {society.societyEmail && (
          <p className="text-md text-gray-600 mb-2">
            📧 <strong>Email:</strong> {society.societyEmail}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-100 p-4 rounded-lg text-center">
            <p className="text-xl font-semibold text-indigo-700">{society.followers.length}</p>
            <p className="text-gray-700">Followers</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg text-center">
            <p className="text-xl font-semibold text-indigo-700">{society.events.length}</p>
            <p className="text-gray-700">Events</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg text-center">
            <p className="text-xl font-semibold text-indigo-700">{society.recruitments.length}</p>
            <p className="text-gray-700">Recruitments</p>
          </div>
        </div>

        {/* Followers */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Followers</h2>
          {society.followers.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {society.followers.map((follower, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <img
                    src={follower.profileimage || "https://via.placeholder.com/80x80.png?text=User"}
                    alt="Follower"
                    className="w-16 h-16 rounded-full object-cover shadow-md"
                  />
                  <span className="text-sm mt-1">{follower.name || "Unnamed"}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No followers to show.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SocietyDetail;
