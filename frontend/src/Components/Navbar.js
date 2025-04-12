import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../utils/Navbar.css";

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

      if (res.ok) {
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
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm px-4 py-2">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold fs-4 text-info" to="/home">
          Loop<span className="text-light">In</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNav"
        >
          <ul className="navbar-nav me-3">
            <li className="nav-item">
              <Link
                className="nav-link text-light"
                to="http://localhost:5000/society"
              >
                Society
              </Link>
            </li>
          </ul>

          <ul className="navbar-nav align-items-center gap-2">
            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link to="/profile" className="nav-link text-light">
                    <i className="fas fa-user-circle fa-lg"></i>
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <a
                  className="btn btn-outline-info btn-sm"
                  href="http://localhost:5000/auth/google"
                >
                  Login
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
