// Shared className constants for elements used in multiple places.
// Lives here (not in globals.css) so the Tailwind JIT picks them up
// without us having to allowlist arbitrary class strings.

// Animated underline-on-hover link, black text, used in the navbar primary
// nav and the footer's main + legal nav. Pulled out so the (long) string
// only lives in one place — keeps Navbar.js and Footer.js readable and
// keeps the underline animation consistent across the site.
export const NAV_LINK = [
  "relative text-black transition-colors duration-300",
  "after:content-[''] after:absolute after:left-0 after:bottom-[-2px]",
  "after:w-full after:h-[1.5px] after:bg-black after:scale-x-0",
  "hover:after:scale-x-100 after:transition-transform after:duration-300",
  "after:origin-left",
].join(" ");
