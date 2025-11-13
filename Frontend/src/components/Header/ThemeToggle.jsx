// Frontend/src/components/Header/ThemeToggle.jsx
import React from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext.jsx";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <FaMoon className="w-5 h-5 text-gray-700 dark:text-gray-300 transition-transform duration-300 hover:scale-110" />
      ) : (
        <FaSun className="w-5 h-5 text-yellow-400 transition-transform duration-300 hover:scale-110 hover:rotate-90" />
      )}
    </button>
  );
}
