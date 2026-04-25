"use client";

import { useState } from "react";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  const navItems = (
    <>
      <Link
        href="/about"
        className="relative text-black transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-full after:h-[1.5px] after:bg-black after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left"
      >
        About Us
      </Link>
      <Link
        href="/operations"
        className="relative text-black transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-full after:h-[1.5px] after:bg-black after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left"
      >
        Operations
      </Link>
      <Link
        href="/careers"
        className="relative text-black transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-full after:h-[1.5px] after:bg-black after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left"
      >
        Careers
      </Link>
      <Link
        href="/contact"
        className="relative text-black transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-full after:h-[1.5px] after:bg-black after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left"
      >
        Contact Us
      </Link>
    </>
  );

  return (
    <header className="bg-white shadow-md h-28 relative z-50">
      <div className="max-w-screen-xl mx-auto px-6 flex items-center justify-between h-full">
        <Link href="/" className="flex flex-col justify-center h-full">
          <img src="/assets/forbesLogo.jpeg" alt="Forbes Logistix" className="h-full w-40 object-contain" />
        </Link>

        <nav className="hidden md:flex gap-10 text-[17px] font-medium tracking-wide items-center">
          {navItems}
          <Link
            href="/careers"
            className="border border-black text-black hover:bg-black hover:text-white px-6 py-2 rounded-2xl font-semibold shadow-lg hover:scale-105 transition-all duration-300"
          >
            Apply Now
          </Link>
        </nav>

        <div className="flex items-center gap-3 md:hidden">
          <Link
            href="/careers"
            className="border border-black text-black hover:bg-black hover:text-white px-4 py-1 text-sm rounded-xl font-semibold shadow transition-all duration-300"
          >
            Apply
          </Link>
          <button
            className="text-3xl text-black focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden absolute top-28 left-0 w-full bg-white shadow-md px-6 py-6 flex flex-col gap-6 text-[17px] font-medium tracking-wide">
          {navItems}
        </div>
      )}
    </header>
  );
};

export default Navbar;
