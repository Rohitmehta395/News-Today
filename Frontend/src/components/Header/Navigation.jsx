// src/components/Header/Navigation.jsx
import React from "react";
import { NavLink } from "react-router-dom";

export default function Navigation({ nav = [], isMobile = false, onNavigate }) {
  if (isMobile) {
    return (
      <div className="lg:hidden border-t bg-white absolute top-full left-0 right-0 z-40 shadow-lg">
        <nav className="max-w-7xl mx-auto">
          <ul className="flex flex-col px-4 py-3 text-sm font-medium">
            <li className="border-b border-gray-100 pb-3 mb-3">
              <NavLink
                to="/"
                end
                onClick={onNavigate}
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
                  onClick={onNavigate}
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
    );
  }

  // Desktop Navigation
  return (
    <nav className="border-t hidden lg:block">
      <div className="max-w-7xl mx-auto">
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
  );
}
