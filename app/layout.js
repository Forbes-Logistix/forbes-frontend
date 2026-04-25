import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const metadata = {
  metadataBase: new URL("https://www.forbeslogistix.com"),
  title: {
    default: "Forbes Logistix — Flatbed driving jobs in the Southeast",
    template: "%s",
  },
  description:
    "Driver-founded flatbed carrier in Jackson, MS hiring company drivers and owner-operators. Real pay, modern equipment, home most weekends.",
  applicationName: "Forbes Logistix",
  openGraph: {
    type: "website",
    siteName: "Forbes Logistix",
    url: "https://www.forbeslogistix.com",
    images: [{ url: "/assets/forbesLogo.jpeg" }],
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/favicon.ico", apple: "/favicon.ico" },
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
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
