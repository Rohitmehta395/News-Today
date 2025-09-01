// Frontend/src/components/Header/AuthButtons.jsx - RESPONSIVE IMPROVED
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  FaChevronDown,
  FaPlus,
  FaList,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";

export default function AuthButtons() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef(null);

  // Check if mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    setDropdownOpen(false);
  };

  const closeDropdown = () => setDropdownOpen(false);

  return (
    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
      {isAuthenticated ? (
        <div className="relative" ref={dropdownRef}>
          {/* User Menu Button */}
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 bg-gray-900 text-white px-3 sm:px-4 py-2 rounded hover:bg-gray-800 transition-colors text-sm sm:text-base"
          >
            <span className="hidden sm:block max-w-16 md:max-w-20 truncate">
              {user?.name?.split(" ")[0] || "User"}
            </span>
            <span className="sm:hidden">
              <FaUser className="w-4 h-4" />
            </span>
            <FaChevronDown
              className={`w-3 h-3 transition-transform ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <>
              {/* Mobile Overlay */}
              {isMobile && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-25 z-40"
                  onClick={closeDropdown}
                />
              )}

              {/* Dropdown Content */}
              <div
                className={`absolute z-50 bg-white rounded-lg shadow-lg border border-gray-200 ${
                  isMobile
                    ? "right-0 top-full mt-2 w-64 max-w-[90vw]"
                    : "right-0 top-full mt-2 w-48"
                }`}
              >
                <div className="py-2">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                        <FaUser className="w-4 h-4 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 text-sm truncate">
                          {user?.name || "User"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <Link
                      to="/create-article"
                      onClick={closeDropdown}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <FaPlus className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span>Create Article</span>
                    </Link>

                    <Link
                      to="/my-articles"
                      onClick={closeDropdown}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <FaList className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span>My Articles</span>
                    </Link>

                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                      >
                        <FaSignOutAlt className="w-4 h-4 flex-shrink-0" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <>
          <Link
            to="/register"
            className="bg-black text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded text-xs sm:text-sm hover:bg-gray-800 transition-colors whitespace-nowrap"
          >
            <span className="hidden sm:inline">Register</span>
            <span className="sm:hidden">Join</span>
          </Link>
          <Link
            to="/login"
            className="font-semibold hover:underline text-xs sm:text-sm text-gray-700 whitespace-nowrap px-2"
          >
            Login
          </Link>
        </>
      )}
    </div>
  );
}
