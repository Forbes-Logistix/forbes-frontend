"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
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

// The two hiring divisions, nested under the "Driving Jobs" tab (desktop
// dropdown + grouped mobile section). Single list so the two menus can't
// drift apart.
const JOB_LINKS = [
  { href: "/careers", label: "Flatbed (Southeast)" },
  { href: "/reefer", label: "Reefer (Dallas)", isNew: true },
  { href: "/flatbed-owner-operator-jobs-mississippi", label: "Owner-Operators" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [jobsOpen, setJobsOpen] = useState(false);
  const pathname = usePathname();
  const jobsRef = useRef(null);
  const toggleMenu = () => setIsOpen(!isOpen);

  // Auto-close both menus whenever the route changes. Navbar lives in
  // the root layout so its state survives client-side navigations — without
  // this, tapping a nav link on mobile leaves the open menu covering the
  // page the user just navigated to.
  useEffect(() => {
    setIsOpen(false);
    setJobsOpen(false);
  }, [pathname]);

  // Desktop dropdown: close on outside click and Escape.
  useEffect(() => {
    if (!jobsOpen) return;
    const onDoc = (e) => {
      if (jobsRef.current && !jobsRef.current.contains(e.target)) setJobsOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setJobsOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [jobsOpen]);

  const onJobsRoute = JOB_LINKS.some((j) => pathname === j.href);

  return (
    <header className="bg-white shadow-md h-28 relative z-50">
      <div className="max-w-screen-xl mx-auto px-6 flex items-center justify-between h-full">
        <Link href="/" className="flex items-center h-full" aria-label="Forbes Logistix home">
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
          <NavLink href="/about" label="About Us" pathname={pathname} />
          <NavLink href="/operations" label="Operations" pathname={pathname} />

          {/* "Driving Jobs" tab with the two divisions nested under it. */}
          <div className="relative" ref={jobsRef}>
            <button
              onClick={() => setJobsOpen(!jobsOpen)}
              aria-expanded={jobsOpen}
              aria-haspopup="true"
              aria-current={onJobsRoute ? "page" : undefined}
              className={`${NAV_LINK} inline-flex items-center gap-1`}
            >
              Driving Jobs
              <ChevronDown
                aria-hidden
                className={`w-4 h-4 transition-transform duration-200 ${jobsOpen ? "rotate-180" : ""}`}
              />
            </button>
            {jobsOpen && (
              <div className="absolute left-0 top-full mt-3 w-60 bg-white border border-black/10 rounded-xl shadow-xl py-2 flex flex-col">
                {JOB_LINKS.map((j) => (
                  <Link
                    key={j.href}
                    href={j.href}
                    aria-current={pathname === j.href ? "page" : undefined}
                    className="px-5 py-3 font-medium hover:bg-gray-50"
                  >
                    {j.label}
                    {j.isNew && (
                      <span className="ml-2 text-[11px] font-bold uppercase tracking-wider bg-black text-white rounded-full px-2 py-0.5 align-middle">
                        New
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <NavLink href="/contact" label="Contact Us" pathname={pathname} />
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
          <NavLink href="/about" label="About Us" pathname={pathname} />
          <NavLink href="/operations" label="Operations" pathname={pathname} />

          {/* Driving Jobs group — same nesting as the desktop tab. */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
              Driving Jobs
            </p>
            <div className="flex flex-col gap-4 pl-3 border-l-2 border-black/10">
              {JOB_LINKS.map((j) => (
                <Link
                  key={j.href}
                  href={j.href}
                  aria-current={pathname === j.href ? "page" : undefined}
                  className={NAV_LINK}
                >
                  {j.label}
                  {j.isNew && (
                    <span className="ml-2 text-[11px] font-bold uppercase tracking-wider bg-black text-white rounded-full px-2 py-0.5 align-middle">
                      New
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>

          <NavLink href="/contact" label="Contact Us" pathname={pathname} />
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
