// src/components/Header/Header.jsx
import React, { useState } from "react";
import SearchBar from "./SearchBar.jsx";
import Logo from "./Logo.jsx";
import AuthButtons from "./AuthButtons.jsx";
import Navigation from "./Navigation.jsx";
import MenuButton from "./MenuButton.jsx";

export default function Header({ nav = [] }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="bg-white border-b relative">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Main Header Row */}
        <div className="flex items-center justify-between">
          {/* LEFT: Logo + Menu Button */}
          <div className="flex items-center gap-3">
            <div className="block lg:hidden">
              <MenuButton
                isOpen={menuOpen}
                onClick={() => setMenuOpen(!menuOpen)}
              />
            </div>
            <Logo />
          </div>

          {/* RIGHT: Search + Auth Buttons */}
          <div className="flex items-center gap-2 relative">
            {/* Desktop Search Icon - hidden on mobile */}
            <div className="hidden md:block relative">
              <SearchBar onSearch={closeMenu} />
            </div>
            <AuthButtons />
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-4 md:hidden">
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
