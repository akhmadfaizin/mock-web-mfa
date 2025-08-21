"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Search } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    "Showcase",
    "Docs",
    "Blog",
    "Analytics",
    "Templates",
    "Enterprise",
  ];

  const renderMenu = (isMobile = false) => (
    <ul
      className={`flex ${
        isMobile ? "flex-col gap-4 w-full" : "items-center gap-4"
      }`}
    >
      {menuItems.map((item) => (
        <li key={item} className="cursor-pointer">
          {item}
        </li>
      ))}
    </ul>
  );

  const loginButton = (
    <Link href="/login">
      <button className="bg-[#fefefe] text-[#666666] md:px-4 px-0 py-2 rounded cursor-pointer">
        Login
      </button>
    </Link>
  );

  return (
    <nav className="bg-[#fefefe] text-[#666666] p-4">
      <div className="flex justify-between items-center border-b-2 border-[#ececec] pb-4">
        {/* Desktop Navbar Left Section */}
        <div className="hidden md:flex items-center gap-8">
          <div className="text-lg font-bold">AKFA</div>
          {renderMenu()}
        </div>

        {/* Desktop Navbar Right Section */}
        <div className="hidden md:flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search documentation..."
            className="px-2 py-1 rounded text-black"
          />
          {loginButton}
        </div>

        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between w-full">
          <div className="font-bold text-[#1f7dda]">AKFA</div>
          <button aria-label="Toggle menu" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
              <span className="flex items-center gap-2">
                <Search size={24} />
                <X size={24} />
              </span>
            ) : (
              <Menu size={24} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 space-y-2">
          {renderMenu(true)}
          {loginButton}
        </div>
      )}
    </nav>
  );
}
