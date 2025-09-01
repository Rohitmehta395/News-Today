// src/components/Header/SearchBar.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

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

  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  const shouldShowForm = !isDesktop || isSearchOpen;

  return (
    <div
      ref={searchContainerRef}
      className={`relative flex items-center justify-end ${className}`}
    >
      {shouldShowForm ? (
        <div className="w-full sm:w-64">
          <form
            onSubmit={handleSearch}
            className="flex items-center border border-gray-300 rounded-full px-3 py-1 w-full bg-white shadow-sm h-9"
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Search..."
              value={search}
              onChange={handleChange}
              className="outline-none border-none text-sm w-full bg-transparent text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-0"
            />

            <FaSearch
              onClick={handleSearch}
              className="ml-2 text-gray-600 cursor-pointer hover:opacity-70"
            />
          </form>

          {suggestions.length > 0 && (
            <ul className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg mt-2 z-50 text-sm max-h-60 overflow-y-auto">
              {suggestions.map((s, i) => (
                <li
                  key={i}
                  onClick={() => handleSuggestionClick(s)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <FaSearch
          onClick={toggleSearch}
          className="w-[36px] h-[36px] p-2 rounded-full bg-gradient-to-r from-[#2AF598] to-[#009EFD] text-white cursor-pointer transition-all duration-300 shadow-lg hover:scale-110 active:scale-95"
        />
      )}
    </div>
  );
}
