"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";
import { track } from "@vercel/analytics";
import { NAV_LINK } from "../lib/styles";

const RECRUITING_PHONE_DISPLAY = "(601) 300-5529";
const RECRUITING_PHONE_TEL = "+16013005529";

// Reusable nav link with aria-current="page" applied when the pathname
// matches. Helps screen readers announce the active section and gives us
// a hook to style the active state if we want to later.
const NavLink = ({ href, label, pathname }) => {
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={NAV_LINK}
    >
      {label}
    </Link>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const toggleMenu = () => setIsOpen(!isOpen);

  // Auto-close the mobile menu whenever the route changes. Navbar lives in
  // the root layout so its state survives client-side navigations — without
  // this, tapping a nav link on mobile leaves the open menu covering the
  // page the user just navigated to.
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navItems = (
    <>
      <NavLink href="/about" label="About Us" pathname={pathname} />
      <NavLink href="/operations" label="Operations" pathname={pathname} />
      {/* "Driving Jobs" over "Careers": matches what drivers actually search
          and the page's own title tag. Route stays /careers (SEO/links). */}
      <NavLink href="/careers" label="Driving Jobs" pathname={pathname} />
      <NavLink href="/contact" label="Contact Us" pathname={pathname} />
    </>
  );

  return (
    <header className="bg-white shadow-md h-28 relative z-50">
      <div className="max-w-screen-xl mx-auto px-6 flex items-center justify-between h-full">
        <Link href="/" className="flex items-center h-full" aria-label="Forbes Logistix — home">
          {/* Logo asset is square (~800x800) on transparent background. Sizing
              via h-20 keeps it within the 112px-tall header with breathing
              room; w-auto preserves the asset's true aspect ratio so it
              doesn't squish (the prior JPEG was rendered into a 160x112 box). */}
          <Image
            src="/assets/forbesLogo.png"
            alt="Forbes Logistix"
            width={200}
            height={200}
            className="h-20 w-auto"
            priority
          />
        </Link>

        <nav className="hidden md:flex gap-10 text-[17px] font-medium tracking-wide items-center">
          {navItems}
          <a
            href={`tel:${RECRUITING_PHONE_TEL}`}
            onClick={() => track("call_tap", { placement: "navbar" })}
            className="font-semibold hover:underline underline-offset-4 whitespace-nowrap"
          >
            {RECRUITING_PHONE_DISPLAY}
          </a>
          <Link
            href="/apply"
            className="border border-black text-black hover:bg-black hover:text-white px-6 py-2 rounded-2xl font-semibold shadow-lg hover:scale-105 transition-all duration-300"
          >
            Apply
          </Link>
        </nav>

        <div className="flex items-center gap-3 md:hidden">
          <Link
            href="/apply"
            className="border border-black text-black hover:bg-black hover:text-white px-4 py-2 text-sm rounded-xl font-semibold shadow transition-all duration-300"
          >
            Apply
          </Link>
          {/* p-2 grows the hit area to ~44px without shifting layout */}
          <button
            className="text-3xl text-black p-2 -m-1"
            onClick={toggleMenu}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? <X aria-hidden /> : <Menu aria-hidden />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          id="mobile-menu"
          className="md:hidden absolute top-28 left-0 w-full bg-white shadow-md px-6 py-6 flex flex-col gap-6 text-[17px] font-medium tracking-wide"
        >
          {navItems}
          {/* Conversion actions belong in the menu too — a driver who opens
              it shouldn't have to close it and hunt for the phone number. */}
          <a
            href={`tel:${RECRUITING_PHONE_TEL}`}
            onClick={() => track("call_tap", { placement: "mobile_menu" })}
            className="flex items-center gap-2 font-bold py-1"
          >
            <Phone aria-hidden className="w-4 h-4" /> Call Recruiting · {RECRUITING_PHONE_DISPLAY}
          </a>
          <Link
            href="/apply"
            className="border border-black text-center px-6 py-3 rounded-2xl font-semibold"
          >
            Apply
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
