// src/components/Header.jsx
import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Header({ nav = [] }) {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  // ✅ Base API URL (no trailing /api here)
  const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  // ✅ fetch suggestions while typing
  const handleChange = async (e) => {
    const query = e.target.value;
    setSearch(query);

    if (query.length > 1) {
      try {
        const res = await fetch(
          `${API_BASE}/api/suggest?q=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        setSuggestions(data);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim() !== "") {
      navigate(`/search/${encodeURIComponent(search.trim())}`);
      setSearch("");
      setSuggestions([]);
      if (menuOpen) setMenuOpen(false);
    }
  };

  const handleSuggestionClick = (s) => {
    navigate(`/search/${encodeURIComponent(s)}`);
    setSearch("");
    setSuggestions([]);
    if (menuOpen) setMenuOpen(false);
  };

  return (
    <header className="bg-white border-b relative">
      <div className="max-w-6xl mx-auto px-4 py-3">
        {/* Main Header Row */}
        <div className="flex items-center justify-between">
          {/* Left Section: Menu + Search (Desktop) */}
          <div className="flex items-center gap-3 flex-1 max-w-md">
            {/* Hamburger - mobile only */}
            <button
              aria-label="Menu"
              className="p-1 hover:opacity-70 lg:hidden flex-shrink-0"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="6" width="18" height="2" fill="currentColor" />
                <rect x="3" y="11" width="18" height="2" fill="currentColor" />
                <rect x="3" y="16" width="18" height="2" fill="currentColor" />
              </svg>
            </button>

            {/* Search (desktop) */}
            <div className="relative hidden sm:block flex-1 max-w-xs">
              <form
                onSubmit={handleSearch}
                className="flex items-center border rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500"
              >
                <input
                  type="text"
                  placeholder="Search news..."
                  value={search}
                  onChange={handleChange}
                  className="outline-none text-sm w-full bg-transparent"
                />
                <button
                  type="submit"
                  aria-label="Search"
                  className="ml-2 flex-shrink-0 hover:opacity-70"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="11"
                      cy="11"
                      r="7"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <line
                      x1="20"
                      y1="20"
                      x2="16.65"
                      y2="16.65"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </button>
              </form>

              {/* Suggestions dropdown */}
              {suggestions.length > 0 && (
                <ul className="absolute top-full left-0 right-0 bg-white border rounded-md shadow-lg mt-1 z-50 text-sm max-h-60 overflow-y-auto">
                  {suggestions.map((s, i) => (
                    <li
                      key={i}
                      onClick={() => handleSuggestionClick(s)}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Logo - Center */}
          <Link to="/" className="flex items-center gap-1 mx-4 flex-shrink-0">
            <span className="bg-black text-white font-bold text-xl sm:text-2xl px-2 sm:px-3 py-1">
              N
            </span>
            <span className="bg-black text-white font-bold text-xl sm:text-2xl px-2 sm:px-3 py-1">
              T
            </span>
            <span className="bg-black text-white font-bold text-xl sm:text-2xl px-2 sm:px-3 py-1">
              Y
            </span>
          </Link>

          {/* Auth Buttons - Right */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {isAuthenticated ? (
              <>
                <span className="text-xs sm:text-sm text-gray-700 hidden md:block max-w-20 truncate">
                  Hi, {user?.name?.split(" ")[0] || "User"}
                </span>
                <button
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="bg-gray-900 text-white px-3 sm:px-4 py-1 rounded text-sm hover:bg-gray-800 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="bg-black text-white px-3 sm:px-4 py-1 rounded text-sm hover:bg-gray-800 transition-colors"
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className="font-semibold hover:underline text-sm hidden xs:block"
                >
                  Sign In
                </Link>
                <Link
                  to="/login"
                  className="font-semibold hover:underline text-sm xs:hidden"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Search Row */}
        <div className="mt-3 sm:hidden">
          <div className="relative">
            <form
              onSubmit={handleSearch}
              className="flex items-center border rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500"
            >
              <input
                type="text"
                placeholder="Search news..."
                value={search}
                onChange={handleChange}
                className="outline-none text-sm w-full bg-transparent"
              />
              <button
                type="submit"
                aria-label="Search"
                className="ml-2 flex-shrink-0 hover:opacity-70"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle
                    cx="11"
                    cy="11"
                    r="7"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <line
                    x1="20"
                    y1="20"
                    x2="16.65"
                    y2="16.65"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </button>
            </form>

            {/* Mobile suggestions */}
            {suggestions.length > 0 && (
              <ul className="absolute top-full left-0 right-0 bg-white border rounded-md shadow-lg mt-1 z-50 text-sm max-h-60 overflow-y-auto">
                {suggestions.map((s, i) => (
                  <li
                    key={i}
                    onClick={() => handleSuggestionClick(s)}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Nav */}
      <nav className="border-t hidden lg:block">
        <div className="max-w-6xl mx-auto">
          <ul className="flex gap-6 px-4 py-2 text-sm font-medium overflow-x-auto scrollbar-hide">
            <li className="flex-shrink-0">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `pb-1 block whitespace-nowrap transition-colors ${
                    isActive
                      ? "border-b-2 border-red-600 text-black"
                      : "hover:text-red-600"
                  }`
                }
              >
                Home
              </NavLink>
            </li>
            {nav.map((cat) => (
              <li key={cat} className="flex-shrink-0">
                <NavLink
                  to={`/category/${cat}`}
                  className={({ isActive }) =>
                    `pb-1 block whitespace-nowrap transition-colors ${
                      isActive
                        ? "border-b-2 border-red-600 text-black"
                        : "hover:text-red-600"
                    }`
                  }
                >
                  {cat[0].toUpperCase() + cat.slice(1)}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Dropdown Nav */}
      {menuOpen && (
        <div className="lg:hidden border-t bg-white absolute top-full left-0 right-0 z-40 shadow-lg">
          <nav className="max-w-6xl mx-auto">
            <ul className="flex flex-col px-4 py-3 text-sm font-medium">
              <li className="border-b border-gray-100 pb-3 mb-3">
                <NavLink
                  to="/"
                  end
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `block py-2 transition-colors ${
                      isActive
                        ? "text-red-600 font-semibold"
                        : "hover:text-red-600"
                    }`
                  }
                >
                  Home
                </NavLink>
              </li>

              {nav.map((cat) => (
                <li
                  key={cat}
                  className="border-b border-gray-100 last:border-b-0"
                >
                  <NavLink
                    to={`/category/${cat}`}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `block py-3 transition-colors ${
                        isActive
                          ? "text-red-600 font-semibold"
                          : "hover:text-red-600"
                      }`
                    }
                  >
                    {cat[0].toUpperCase() + cat.slice(1)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
