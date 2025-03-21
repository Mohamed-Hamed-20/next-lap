"use client";

import Image from "next/image";
import NavLink from "./NavLink";
import AuthStatus from "./AuthStatus";
import { useState } from "react";
import { Menu, X } from "lucide-react"; 

const navItems = [
  { name: "Home", path: "/" },
  { name: "Product", path: "/product" },
  { name: "About", path: "/about" },
];

const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 bg-white backdrop-blur-md px-6 md:px-20 py-4 rounded shadow-lg z-50 flex justify-between items-center max-w-screen-xl mx-auto">
      {/* Logo */}
      <div>
        <Image src="/logo.png" alt="logo" width={100} height={50} />
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex justify-between gap-10 items-center text-lg font-semibold text-[#010101]">
        <ul className="flex gap-10">
          {navItems.map(({ name, path }) => (
            <NavLink key={name} href={path}>
              {name}
            </NavLink>
          ))}
        </ul>
        <AuthStatus />
      </div>

      {/* Mobile Navigation Toggle Button */}
      <button
        className="md:hidden p-2 rounded-md focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md rounded-md p-4 flex flex-col items-center md:hidden">
          <ul className="flex flex-col gap-6 text-lg font-semibold text-[#010101]">
            {navItems.map(({ name, path }) => (
              <div
                key={name}
                onClick={() => setMenuOpen(false)}
                className="cursor-pointer"
              >
                <NavLink href={path}>{name}</NavLink>
              </div>
            ))}
          </ul>
          <AuthStatus />
        </div>
      )}
    </nav>
  );
};

export default Navigation;
