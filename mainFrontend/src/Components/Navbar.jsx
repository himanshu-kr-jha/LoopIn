import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const res = await fetch("http://localhost:5000/user/profile", {
        credentials: "include",
      });
      setIsLoggedIn(res.ok);
    } catch (err) {
      console.error("Error checking login status:", err);
      setIsLoggedIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:5000/auth/logout", {
        method: "GET",
        credentials: "include",
      });
      const res2 = await fetch("http://localhost:5001/api/user/logout", {
        method: "POST",
        credentials: "include",
      });
      if (res.ok && res2.ok) {
        setIsLoggedIn(false);
        navigate("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-2xl font-bold text-cyan-400">
            Loop<span className="text-white">In</span>
          </Link>
        </div>

        <div className="flex items-center space-x-6">
          <Link
            to="/society/all"
            className="text-white hover:text-cyan-400 transition"
          >
            Society
          </Link>
          <Link
            to="/chat/home"
            className="text-white hover:text-cyan-400 transition"
          >
            Chat
          </Link>

          {isLoggedIn ? (
            <>
              <Link
                to="/profile"
                className="text-white hover:text-cyan-400 transition text-lg"
              >
                <i className="fas fa-user-circle"></i>
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition"
              >
                Logout
              </button>
            </>
          ) : (
            <a
              href="http://localhost:5173/login"
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-1.5 rounded text-sm transition"
            >
              Login
            </a>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
