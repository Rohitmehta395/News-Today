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

  // ✅ fetch suggestions while typing
  const handleChange = async (e) => {
    const query = e.target.value;
    setSearch(query);

    if (query.length > 1) {
      try {
        // 🔥 use `q` to match backend
        const res = await fetch(
          `http://localhost:5000/api/suggest?q=${encodeURIComponent(query)}`
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
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Left Section: Menu + Search */}
        <div className="flex items-center gap-4 text-black">
          {/* Hamburger - only mobile */}
          <button
            aria-label="Menu"
            className="p-1 hover:opacity-70 md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="6" width="18" height="2" fill="currentColor" />
              <rect x="3" y="11" width="18" height="2" fill="currentColor" />
              <rect x="3" y="16" width="18" height="2" fill="currentColor" />
            </svg>
          </button>

          {/* Search (desktop) */}
          <div className="relative">
            <form
              onSubmit={handleSearch}
              className="hidden sm:flex items-center border rounded px-2"
            >
              <input
                type="text"
                placeholder="Search news..."
                value={search}
                onChange={handleChange}
                className="outline-none px-2 py-1 text-sm"
              />
              <button
                type="submit"
                aria-label="Search"
                className="p-1 hover:opacity-70"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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
              <ul className="absolute top-full left-0 w-full bg-white border rounded shadow-md mt-1 z-50 text-sm">
                {suggestions.map((s, i) => (
                  <li
                    key={i}
                    onClick={() => handleSuggestionClick(s)}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-[6px]">
          <span className="bg-black text-white font-bold text-2xl px-3 py-1">
            N
          </span>
          <span className="bg-black text-white font-bold text-2xl px-3 py-1">
            T
          </span>
          <span className="bg-black text-white font-bold text-2xl px-3 py-1">
            Y
          </span>
        </Link>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-gray-700 hidden sm:block">
                Hi, {user?.name?.split(" ")[0] || "User"}
              </span>
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="bg-gray-900 text-white px-4 py-1 rounded hover:bg-gray-800"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="bg-black text-white px-4 py-1 rounded hover:bg-gray-800"
              >
                Register
              </Link>
              <Link to="/login" className="font-semibold hover:underline">
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Desktop Nav */}
      <nav className="border-t hidden md:block">
        <ul className="max-w-6xl mx-auto flex gap-6 px-4 py-2 text-sm font-medium overflow-x-auto whitespace-nowrap">
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `pb-1 ${
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
            <li key={cat}>
              <NavLink
                to={`/category/${cat}`}
                className={({ isActive }) =>
                  `pb-1 ${
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
      </nav>

      {/* Mobile Dropdown Nav */}
      {menuOpen && (
        <nav className="md:hidden border-t">
          <ul className="flex flex-col gap-4 px-4 py-3 text-sm font-medium">
            {/* Mobile Search */}
            <form
              onSubmit={handleSearch}
              className="flex items-center border rounded px-2"
            >
              <input
                type="text"
                placeholder="Search news..."
                value={search}
                onChange={handleChange}
                className="outline-none px-2 py-1 text-sm w-full"
              />
              <button
                type="submit"
                aria-label="Search"
                className="p-1 hover:opacity-70"
              >
                🔍
              </button>
            </form>

            {/* Mobile suggestions */}
            {suggestions.length > 0 && (
              <ul className="bg-white border rounded shadow-md mt-1 z-50 text-sm">
                {suggestions.map((s, i) => (
                  <li
                    key={i}
                    onClick={() => handleSuggestionClick(s)}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}

            <li>
              <NavLink
                to="/"
                end
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `pb-1 ${
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
              <li key={cat}>
                <NavLink
                  to={`/category/${cat}`}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `pb-1 ${
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
        </nav>
      )}
    </header>
  );
}
