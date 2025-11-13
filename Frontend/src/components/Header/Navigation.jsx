// Frontend/src/components/Header/Navigation.jsx
import React from "react";
import { NavLink } from "react-router-dom";

export default function Navigation({ nav = [], isMobile = false, onNavigate }) {
  if (isMobile) {
    return (
      <>
        {/* Overlay */}
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onNavigate}
        />

        {/* Mobile Menu */}
        <div className="lg:hidden fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-50 shadow-2xl transform transition-transform duration-300">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Menu
            </h2>
          </div>

          <nav className="overflow-y-auto h-full pb-20">
            <ul className="flex flex-col px-2 py-3 space-y-1">
              <li>
                <NavLink
                  to="/"
                  end
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-blue-600 text-white font-semibold shadow-lg"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`
                  }
                >
                  🏠 Home
                </NavLink>
              </li>

              {nav.map((cat) => (
                <li key={cat}>
                  <NavLink
                    to={`/category/${cat}`}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      `block px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-blue-600 text-white font-semibold shadow-lg"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`
                    }
                  >
                    {getCategoryEmoji(cat)}{" "}
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </>
    );
  }

  // Desktop Navigation
  return (
    <nav className="border-t border-gray-200 dark:border-gray-700 hidden lg:block bg-gray-50 dark:bg-gray-800/50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <ul className="flex gap-1 px-4 py-2 overflow-x-auto scrollbar-hide">
          <li className="flex-shrink-0">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg block whitespace-nowrap transition-all duration-200 font-medium ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-blue-600 text-white shadow-md"
                    : "text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700"
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
                  `px-4 py-2 rounded-lg block whitespace-nowrap transition-all duration-200 font-medium ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-blue-600 text-white shadow-md"
                      : "text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700"
                  }`
                }
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

// Helper function to get emoji for category
function getCategoryEmoji(category) {
  const emojis = {
    business: "💼",
    technology: "💻",
    sports: "⚽",
    entertainment: "🎬",
    health: "🏥",
    science: "🔬",
    general: "📰",
  };
  return emojis[category] || "📰";
}
