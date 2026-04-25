import AboutClient from "./AboutClient";

const TITLE = "About Forbes Logistix | Driver-Founded Open-Deck Carrier";
const DESCRIPTION =
  "Veteran-owned, asset-based open-deck carrier headquartered in Jackson, Mississippi with a terminal and warehouse built to support drivers and freight.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://www.forbeslogistix.com/about" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://www.forbeslogistix.com/about",
    images: [{ url: "/assets/photos/terminal.jpg" }],
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
