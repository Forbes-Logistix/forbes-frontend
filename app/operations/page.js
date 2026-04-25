import OperationsClient from "./OperationsClient";

const TITLE = "Open-Deck Freight, Equipment & Driver Experience | Forbes Logistix";
const DESCRIPTION =
  "See how Forbes Logistix runs: flatbeds and step-decks, weekly settlements, direct dispatch, Jackson terminal support, and real home time.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://www.forbeslogistix.com/operations" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://www.forbeslogistix.com/operations",
    images: [{ url: "/assets/photos/truck-precast.jpg" }],
  },
};

export default function OperationsPage() {
  return <OperationsClient />;
}
