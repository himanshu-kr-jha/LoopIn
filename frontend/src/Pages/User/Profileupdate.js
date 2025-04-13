import React, { useState } from "react";
import axios from "axios";

const Profileupdate = () => {
  const [formData, setFormData] = useState({
    contact: "",
    department: "",
    year: "",
    resumeUrl: "",
    linkedinUrl: "",
    portfolioUrl: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/user/profile/update", formData, {
        withCredentials: true, // Important if using cookies/session-based auth
      });
      setMessage(response.data.message);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to update profile. Try again."
      );
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Update Profile
      </h2>
      {message && <div className="text-green-600 mb-3">{message}</div>}
      {error && <div className="text-red-500 mb-3">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="contact"
          placeholder="Contact"
          value={formData.contact}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
        />
        <input
          type="text"
          name="department"
          placeholder="Department"
          value={formData.department}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
        />
        <input
          type="text"
          name="year"
          placeholder="Year"
          value={formData.year}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
        />
        <input
          type="url"
          name="resumeUrl"
          placeholder="Resume URL"
          value={formData.resumeUrl}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
        />
        <input
          type="url"
          name="linkedinUrl"
          placeholder="LinkedIn URL"
          value={formData.linkedinUrl}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
        />
        <input
          type="url"
          name="portfolioUrl"
          placeholder="Portfolio URL"
          value={formData.portfolioUrl}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
        />

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default Profileupdate;
