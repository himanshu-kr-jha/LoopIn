import React, { useState } from "react";
import axios from "axios";
import "./css/tabbedlogin.css";

const TabbedLogin = () => {
  const [activeTab, setActiveTab] = useState("user");
  const [adminData, setAdminData] = useState({
    societyEmail: "",
    userEmail: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setError("");
    setMessage("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdminData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const res = await axios.post("http://localhost:5000/society/admin/login", adminData);
      setMessage(res.data.message);
      localStorage.setItem("token", res.data.token); // optional
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google"; // Adjust based on your Google OAuth route
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex justify-center mb-4">
          <button
            className={`px-4 py-2 font-semibold rounded-t-md ${
              activeTab === "user" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => handleTabSwitch("user")}
          >
            User Login
          </button>
          <button
            className={`px-4 py-2 font-semibold rounded-t-md ml-2 ${
              activeTab === "admin" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => handleTabSwitch("admin")}
          >
            Society Admin Login
          </button>
        </div>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {message && <p className="text-green-500 text-sm mb-2">{message}</p>}

        {activeTab === "user" ? (
          <div className="flex flex-col items-center">
            <button
              onClick={handleGoogleLogin}
              className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600"
            >
              Login with Google
            </button>
          </div>
        ) : (
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-sm">Society Email</label>
              <input
                type="email"
                name="societyEmail"
                value={adminData.societyEmail}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm">Admin Email</label>
              <input
                type="email"
                name="userEmail"
                value={adminData.userEmail}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm">Password</label>
              <input
                type="password"
                name="password"
                value={adminData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
              Login as Admin
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default TabbedLogin;
