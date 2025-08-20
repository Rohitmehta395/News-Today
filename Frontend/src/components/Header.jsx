import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

export default function Header({ nav = [] }) {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim() !== "") {
      // ✅ Route format: /search/:query
      navigate(`/search/${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
  };

  return (
    <header className="bg-white border-b">
      {/* Top bar */}
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Left: menu + search */}
        <div className="flex items-center gap-4 text-black">
          {/* Menu icon */}
          <button aria-label="Menu" className="p-1 hover:opacity-70">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="6" width="18" height="2" fill="currentColor" />
              <rect x="3" y="11" width="18" height="2" fill="currentColor" />
              <rect x="3" y="16" width="18" height="2" fill="currentColor" />
            </svg>
          </button>

          {/* Search Form */}
          <form
            onSubmit={handleSearch}
            className="flex items-center border rounded px-2"
          >
            <input
              type="text"
              placeholder="Search news..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
        </div>

        {/* Center: boxed “NEWS TODAY” logo */}
        <Link
          to="/"
          aria-label="Go to homepage"
          className="flex items-center gap-[6px]"
        >
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

        {/* Right: Auth */}
        <div className="flex items-center gap-3">
          <button className="bg-black text-white px-4 py-1 rounded hover:bg-gray-800">
            Register
          </button>
          <button className="font-semibold hover:underline">Sign In</button>
        </div>
      </div>

      {/* Bottom nav */}
      <nav className="border-t">
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
    </header>
  );
}
