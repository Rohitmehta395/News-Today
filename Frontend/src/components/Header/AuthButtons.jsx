// src/components/Header/AuthButtons.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function AuthButtons() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
      {isAuthenticated ? (
        <>
          <span className="text-xs sm:text-sm text-gray-700 hidden md:block max-w-20 truncate">
            Hi, {user?.name?.split(" ")[0] || "User"}
          </span>
          <button
            onClick={handleLogout}
            className="bg-gray-900 text-white px-3 sm:px-4 py-1 rounded text-sm hover:bg-gray-800 transition-colors whitespace-nowrap"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link
            to="/register"
            className="bg-black text-white px-3 sm:px-4 py-1 rounded text-sm hover:bg-gray-800 transition-colors whitespace-nowrap"
          >
            Register
          </Link>
          <Link
            to="/login"
            className="font-semibold hover:underline text-sm text-gray-700 whitespace-nowrap"
          >
            Login
          </Link>
        </>
      )}
    </div>
  );
}
