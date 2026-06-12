import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MotionProvider from "./components/MotionProvider";
import { ORGANIZATION_SCHEMA } from "./lib/schema";

export const metadata = {
  metadataBase: new URL("https://www.forbeslogistix.com"),
  title: {
    default: "Flatbed Driving Jobs in the Southeast | Forbes Logistix",
    template: "%s",
  },
  // SERP click-through is the lever here: lead with the numbers a driver
  // scans for (weekly pay, sign-on, the 90% OO split).
  description:
    "Driver-founded flatbed carrier in Jackson, MS. Company drivers make $2,500+/week with a $3,000 sign-on and home weekends. Owner-operators keep 90%.",
  applicationName: "Forbes Logistix",
  // Default canonical for any route that doesn't set its own — currently only
  // the home page (app/page.js is a client component and can't export metadata).
  // Every other page.js overrides with its own alternates.canonical.
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Forbes Logistix",
    url: "https://www.forbeslogistix.com",
    // Default og:image is a real photo (matches the per-page pattern in
    // /apply, /careers, /operations). The site logo is intentionally NOT
    // used here — logos render poorly as social previews. The /assets/og/
    // variants are pre-sized 1200x630 crops (~130 KB) — the raw photos are
    // multi-megabyte and bypass next/image when fetched by social scrapers.
    images: [{ url: "/assets/og/truck-loading-og.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/favicon.ico", apple: "/apple-touch-icon.png" },
  verification: {
    google: "HjB7Z7Vt33q0tR3UBZyzKyWryGMhtrIK1X5TyZK6tsE",
  },
};

export const viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Site-wide Organization JSON-LD. Rendered once in the root layout
            so it appears on every page. Helps Google associate the brand
            (name, logo, phone, address) across the whole site. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_SCHEMA) }}
        />
        <Navbar />
        {/* Single <main> landmark for every route (terms/privacy previously
            declared their own — those are now plain divs). MotionProvider
            makes framer-motion respect prefers-reduced-motion site-wide. */}
        <main>
          <MotionProvider>{children}</MotionProvider>
        </main>
        <Footer />
        {/* Vercel Web Analytics (cookie-less; enabled on the project
            2026-06-11). Custom events for tel: taps come with the mobile
            conversion PR. */}
        <Analytics />
      </body>
    </html>
  );
}
