import AboutClient from "./AboutClient";

export const metadata = {
  title: "About Forbes Logistix — Veteran-owned flatbed carrier in Jackson, MS",
  description:
    "Veteran-owned, asset-based open-deck carrier headquartered in Jackson, MS. Founded by a former driver. 3-acre terminal with a 25,000 sq ft warehouse and shop.",
  alternates: { canonical: "https://www.forbeslogistix.com/about" },
  openGraph: {
    title: "About Forbes Logistix — Veteran-owned flatbed carrier in Jackson, MS",
    description:
      "Veteran-owned, asset-based open-deck carrier headquartered in Jackson, MS. Founded by a former driver. 3-acre terminal with a 25,000 sq ft warehouse and shop.",
    url: "https://www.forbeslogistix.com/about",
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
