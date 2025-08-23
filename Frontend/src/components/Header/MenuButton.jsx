// src/components/Header/MenuButton.jsx
import React from "react";

export default function MenuButton({ isOpen, onClick }) {
  return (
    <button
      aria-label="Menu"
      className="p-1 hover:opacity-70 lg:hidden flex-shrink-0"
      onClick={onClick}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="6" width="18" height="2" fill="currentColor" />
        <rect x="3" y="11" width="18" height="2" fill="currentColor" />
        <rect x="3" y="16" width="18" height="2" fill="currentColor" />
      </svg>
    </button>
  );
}
