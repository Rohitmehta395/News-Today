// Frontend/src/components/Header/AuthButtons.jsx
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

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm sm:text-base"
          >
            <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">
              <FaUser className="w-3 h-3" />
            </div>
            <span className="hidden sm:block max-w-16 md:max-w-20 truncate font-medium">
              {user?.name?.split(" ")[0] || "User"}
            </span>
            <FaChevronDown
              className={`w-3 h-3 transition-transform duration-300 ${
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
                className={`absolute z-50 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 ${
                  isMobile
                    ? "right-0 top-full mt-2 w-64 max-w-[90vw]"
                    : "right-0 top-full mt-2 w-56"
                } animate-fadeIn`}
              >
                <div className="py-2">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <FaUser className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                          {user?.name || "User"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
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
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-700 dark:hover:to-gray-700 transition-all duration-200"
                    >
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FaPlus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="font-medium">Create Article</span>
                    </Link>

                    <Link
                      to="/my-articles"
                      onClick={closeDropdown}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-700 dark:hover:to-gray-700 transition-all duration-200"
                    >
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FaList className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="font-medium">My Articles</span>
                    </Link>

                    <div className="border-t border-gray-100 dark:border-gray-700 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 w-full text-left"
                      >
                        <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FaSignOutAlt className="w-4 h-4" />
                        </div>
                        <span className="font-medium">Logout</span>
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
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 sm:px-5 py-2 rounded-lg text-xs sm:text-sm hover:shadow-lg transition-all duration-300 hover:scale-105 whitespace-nowrap font-medium"
          >
            <span className="hidden sm:inline">Get Started</span>
            <span className="sm:hidden">Join</span>
          </Link>
          <Link
            to="/login"
            className="font-semibold hover:text-blue-600 dark:hover:text-blue-400 text-xs sm:text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap px-2 transition-colors duration-200"
          >
            Login
          </Link>
        </>
      )}
    </div>
  );
}
