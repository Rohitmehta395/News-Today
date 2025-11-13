// Frontend/src/components/Header/Header.jsx
import React, { useState } from "react";
import SearchBar from "./SearchBar.jsx";
import Logo from "./Logo.jsx";
import AuthButtons from "./AuthButtons.jsx";
import Navigation from "./Navigation.jsx";
import MenuButton from "./MenuButton.jsx";
import ThemeToggle from "./ThemeToggle.jsx";

export default function Header({ nav = [] }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* Main Header Row */}
        <div className="flex items-center justify-between gap-4">
          {/* LEFT: Menu Button + Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="block lg:hidden">
              <MenuButton
                isOpen={menuOpen}
                onClick={() => setMenuOpen(!menuOpen)}
              />
            </div>
            <Logo />
          </div>

          {/* RIGHT: Search + Theme Toggle + Auth Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Search */}
            <div className="hidden md:block">
              <SearchBar onSearch={closeMenu} />
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Auth Buttons */}
            <AuthButtons />
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-3 md:hidden">
          <SearchBar isMobile={true} onSearch={closeMenu} />
        </div>
      </div>

      {/* Navigation */}
      <Navigation nav={nav} />

      {/* Mobile Navigation Menu */}
      {menuOpen && (
        <Navigation nav={nav} isMobile={true} onNavigate={closeMenu} />
      )}
    </header>
  );
}
