// Frontend/src/components/Header/SearchBar.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaTimes } from "react-icons/fa";

const useWindowSize = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowWidth;
};

export default function SearchBar({
  isMobile = false,
  onSearch,
  className = "",
}) {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const navigate = useNavigate();
  const inputRef = useRef(null);
  const searchContainerRef = useRef(null);
  const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const windowWidth = useWindowSize();
  const isDesktop = windowWidth >= 768;

  useEffect(() => {
    if (isDesktop) setIsSearchOpen(false);
  }, [isDesktop]);

  useEffect(() => {
    if ((isDesktop && isSearchOpen) || !isDesktop) {
      inputRef.current?.focus();
    }
  }, [isSearchOpen, isDesktop]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        isDesktop &&
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDesktop]);

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
      if (isDesktop) setIsSearchOpen(false);
      if (onSearch) onSearch();
    }
  };

  const handleSuggestionClick = (s) => {
    navigate(`/search/${encodeURIComponent(s)}`);
    setSearch("");
    setSuggestions([]);
    if (isDesktop) setIsSearchOpen(false);
    if (onSearch) onSearch();
  };

  const clearSearch = () => {
    setSearch("");
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  const shouldShowForm = !isDesktop || isSearchOpen;

  return (
    <div
      ref={searchContainerRef}
      className={`relative flex items-center justify-end ${className}`}
    >
      {shouldShowForm ? (
        <div className="w-full sm:w-72">
          <form
            onSubmit={handleSearch}
            className={`flex items-center rounded-full px-4 py-0.5 w-full transition-all duration-300 ${
              isFocused
                ? "bg-white dark:bg-gray-800 shadow-lg ring-2 ring-blue-500 dark:ring-blue-400"
                : "bg-gray-100 dark:bg-gray-800 shadow-sm"
            }`}
          >
            <FaSearch className="text-gray-400 dark:text-gray-500 mr-3 flex-shrink-0" />

            <input
              ref={inputRef}
              type="text"
              placeholder="Search news..."
              value={search}
              onChange={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="outline-none border-none text-sm w-full bg-transparent text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-0"
            />

            {search && (
              <button
                type="button"
                onClick={clearSearch}
                className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            )}
          </form>

          {suggestions.length > 0 && (
            <ul className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl mt-2 z-50 text-sm max-h-60 overflow-y-auto">
              {suggestions.map((s, i) => (
                <li
                  key={i}
                  onClick={() => handleSuggestionClick(s)}
                  className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0 text-gray-700 dark:text-gray-200 transition-colors"
                >
                  <FaSearch className="inline mr-2 text-gray-400 dark:text-gray-500 text-xs" />
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <button
          onClick={toggleSearch}
          className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-600 flex items-center justify-center text-white cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 active:scale-95"
          aria-label="Open search"
        >
          <FaSearch className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
