// src/components/Header/SearchBar.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// 1. A custom hook to track window size. This is key for the responsive behavior.
const useWindowSize = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    // Cleanup the event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowWidth;
};

// ... (StyledSearchIcon component remains the same)
const StyledSearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="29"
    height="29"
    viewBox="0 0 29"
    fill="none"
  >
    <g clipPath="url(#clip0_2_17)">
      <g filter="url(#filter0_d_2_17)">
        <path
          d="M23.7953 23.9182L19.0585 19.1814M19.0585 19.1814C19.8188 18.4211 20.4219 17.5185 20.8333 16.5251C21.2448 15.5318 21.4566 14.4671 21.4566 13.3919C21.4566 12.3167 21.2448 11.252 20.8333 10.2587C20.4219 9.2653 19.8188 8.36271 19.0585 7.60242C18.2982 6.84214 17.3956 6.23905 16.4022 5.82759C15.4089 5.41612 14.3442 5.20435 13.269 5.20435C12.1938 5.20435 11.1291 5.41612 10.1358 5.82759C9.1424 6.23905 8.23981 6.84214 7.47953 7.60242C5.94407 9.13789 5.08145 11.2204 5.08145 13.3919C5.08145 15.5634 5.94407 17.6459 7.47953 19.1814C9.01499 20.7168 11.0975 21.5794 13.269 21.5794C15.4405 21.5794 17.523 20.7168 19.0585 19.1814Z"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
      </g>
    </g>
    <defs>
      <filter
        id="filter0_d_2_17"
        x="-0.418549"
        y="3.70435"
        width="29.7139"
        height="29.7139"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        ></feColorMatrix>
        <feOffset dy="4"></feOffset>
        <feGaussianBlur stdDeviation="2"></feGaussianBlur>
        <feComposite in2="hardAlpha" operator="out"></feComposite>
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
        ></feColorMatrix>
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_2_17"
        ></feBlend>
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_2_17"
          result="shape"
        ></feBlend>
      </filter>
      <clipPath id="clip0_2_17">
        <rect
          width="28.0702"
          height="28.0702"
          fill="white"
          transform="translate(0.403503 0.526367)"
        ></rect>
      </clipPath>
    </defs>
  </svg>
);

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

  // 2. Use the hook and define the breakpoint for desktop view
  const windowWidth = useWindowSize();
  const isDesktop = windowWidth >= 768; // Using 768px as the breakpoint (md in Tailwind)

  // This effect ensures the search bar closes if you resize from mobile to desktop
  useEffect(() => {
    if (isDesktop) {
      setIsSearchOpen(false);
    }
  }, [isDesktop]);

  useEffect(() => {
    // Only focus the input if it's meant to be open
    if ((isDesktop && isSearchOpen) || !isDesktop) {
      inputRef.current?.focus();
    }
  }, [isSearchOpen, isDesktop]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        isDesktop && // Only close on outside click on desktop
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchContainerRef, isDesktop]);

  // ... (all handler functions like handleChange, handleSearch etc. remain the same)
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
      if (isDesktop) setIsSearchOpen(false); // Only close it on desktop
      if (onSearch) onSearch();
    }
  };

  const handleSuggestionClick = (s) => {
    navigate(`/search/${encodeURIComponent(s)}`);
    setSearch("");
    setSuggestions([]);
    if (isDesktop) setIsSearchOpen(false); // Only close it on desktop
    if (onSearch) onSearch();
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const SearchIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <line
        x1="20"
        y1="20"
        x2="16.65"
        y2="16.65"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );

  // 3. This determines if the full form should be visible.
  // It's visible if it's NOT desktop, OR if it IS desktop AND isSearchOpen is true.
  const shouldShowForm = !isDesktop || isSearchOpen;

  return (
    <div
      ref={searchContainerRef}
      className={`relative flex items-center justify-end ${className}`}
    >
      {shouldShowForm ? (
        // RENDER THE FULL SEARCH BAR
        <div className="w-full sm:w-64">
          <form
            onSubmit={handleSearch}
            className="flex items-center border border-gray-300 rounded-full px-4 py-1.5 w-full bg-white shadow-sm"
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Search news..."
              value={search}
              onChange={handleChange}
              className="outline-none text-sm w-full bg-transparent text-gray-700 placeholder-gray-500"
            />
            <button
              type="submit"
              aria-label="Search"
              className="ml-2 flex-shrink-0 hover:opacity-70 text-gray-600"
            >
              <SearchIcon />
            </button>
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
        // RENDER THE STYLED ICON BUTTON (Only on Desktop when closed)
        <button
          onClick={toggleSearch}
          aria-label="Open Search"
          className="w-[50px] h-[50px] rounded-full bg-gradient-to-r from-[#2AF598] to-[#009EFD] cursor-pointer grid place-items-center transition-all duration-300 ease-in-out shadow-lg hover:scale-110 hover:brightness-110 hover:shadow-xl active:scale-95 active:shadow-md active:brightness-90"
        >
          <StyledSearchIcon />
        </button>
      )}
    </div>
  );
}
