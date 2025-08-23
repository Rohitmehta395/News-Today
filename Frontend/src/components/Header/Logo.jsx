// src/components/Header/Logo.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to="/" className="flex items-center gap-1 flex-shrink-0">
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
  );
}
