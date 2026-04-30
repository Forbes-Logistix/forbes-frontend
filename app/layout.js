import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ORGANIZATION_SCHEMA } from "./lib/schema";

export const metadata = {
  metadataBase: new URL("https://www.forbeslogistix.com"),
  title: {
    default: "Flatbed Driving Jobs in the Southeast | Forbes Logistix",
    template: "%s",
  },
  description:
    "Driver-founded flatbed carrier hiring company drivers and owner-operators across the Southeast. Real pay, home weekends, modern equipment, and direct recruiting contact.",
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
    // used here — logos render poorly as social previews.
    images: [{ url: "/assets/photos/truck-loading.jpg" }],
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
        {children}
        <Footer />
      </body>
    </html>
  );
}
