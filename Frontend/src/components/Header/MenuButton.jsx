// Frontend/src/components/Header/MenuButton.jsx
import React from "react";

export default function MenuButton({ isOpen, onClick }) {
  return (
    <button
      aria-label="Menu"
      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg lg:hidden flex-shrink-0 transition-colors duration-200"
      onClick={onClick}
    >
      <div className="w-5 h-5 flex flex-col justify-center gap-1">
        <span
          className={`h-0.5 w-full bg-gray-700 dark:bg-gray-300 transition-all duration-300 ${
            isOpen ? "rotate-45 translate-y-1.5" : ""
          }`}
        />
        <span
          className={`h-0.5 w-full bg-gray-700 dark:bg-gray-300 transition-all duration-300 ${
            isOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`h-0.5 w-full bg-gray-700 dark:bg-gray-300 transition-all duration-300 ${
            isOpen ? "-rotate-45 -translate-y-1.5" : ""
          }`}
        />
      </div>
    </button>
  );
}
