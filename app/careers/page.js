import CareersClient from "./CareersClient";

const TITLE = "Company Driver & Owner-Operator Jobs | Forbes Logistix";
const DESCRIPTION =
  "Company drivers: earn $90,000+ with 30% of line haul, $3,000 sign-on, $100 tarp pay, and home most weekends. Owner-operators keep 90% of total billed revenue.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://www.forbeslogistix.com/careers" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://www.forbeslogistix.com/careers",
    images: [{ url: "/assets/photos/truck-loading.jpg" }],
  },
};

export default function CareersPage() {
  return <CareersClient />;
}
