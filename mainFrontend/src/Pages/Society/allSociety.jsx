import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Society = () => {
  const [societies, setSocieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSocieties = async () => {
      try {
        const response = await fetch('http://localhost:5000/society/all');
        const data = await response.json();
        setSocieties(data.societies);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching societies:', error);
        setLoading(false);
      }
    };

    fetchSocieties();
  }, []);

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Societies</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {societies.map((society) => (
          <div
            key={society._id}
            onClick={() => navigate(`/society/${society._id}`)}
            className="cursor-pointer bg-white rounded-xl shadow-md overflow-hidden transition-transform transform hover:scale-105"
          >
            <img
              src={society.coverImage || "https://images.unsplash.com/photo-1726862803549-5bf70e76a1d2?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGNvdmVyJTIwaW1hZ2V8ZW58MHx8MHx8fDA%3D"}
              alt={`${society.name} cover`}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-indigo-600">{society.name}</h2>
              <p className="text-gray-700 mb-2">{society.description}</p>
              {society.societyEmail && (
                <p className="text-sm text-gray-500">📧 {society.societyEmail}</p>
              )}
              <div className="mt-4">
                <p className="text-sm text-gray-700"><strong>Followers:</strong> {society.followers.length}</p>
                <p className="text-sm text-gray-700"><strong>Events:</strong> {society.events.length}</p>
                <p className="text-sm text-gray-700"><strong>Recruitments:</strong> {society.recruitments.length}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Society;
