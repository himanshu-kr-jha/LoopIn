import React, { useState } from "react";
import axios from "axios";

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
      localStorage.setItem("token", res.data.token);
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-indigo-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
        <div className="flex justify-center mb-6">
          <button
            className={`w-1/2 py-2 text-sm font-medium border-b-2 transition-all ${
              activeTab === "user"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-blue-600"
            }`}
            onClick={() => handleTabSwitch("user")}
          >
            User Login
          </button>
          <button
            className={`w-1/2 py-2 text-sm font-medium border-b-2 transition-all ${
              activeTab === "admin"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-blue-600"
            }`}
            onClick={() => handleTabSwitch("admin")}
          >
            Society Admin Login
          </button>
        </div>

        {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}
        {message && <p className="text-green-500 text-sm mb-3 text-center">{message}</p>}

        {activeTab === "user" ? (
          <div className="flex flex-col items-center">
            <button
              onClick={handleGoogleLogin}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md shadow-md transition"
            >
              Login with Google
            </button>
          </div>
        ) : (
          <form onSubmit={handleAdminLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Society Email</label>
              <input
                type="email"
                name="societyEmail"
                value={adminData.societyEmail}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
              <input
                type="email"
                name="userEmail"
                value={adminData.userEmail}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={adminData.password}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
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
