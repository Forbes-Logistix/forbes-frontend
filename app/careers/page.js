import CareersClient from "./CareersClient";

export const metadata = {
  title: "Careers — Flatbed driving jobs at Forbes Logistix",
  description:
    "Hiring company drivers and owner-operators in the Southeast. $90,000+/year, 30% of line haul, $3,000 sign-on, $100 tarp pay, weekly direct deposit, home most weekends.",
  alternates: { canonical: "https://www.forbeslogistix.com/careers" },
  openGraph: {
    title: "Careers — Flatbed driving jobs at Forbes Logistix",
    description:
      "Hiring company drivers and owner-operators in the Southeast. $90,000+/year, 30% of line haul, $3,000 sign-on, $100 tarp pay, weekly direct deposit, home most weekends.",
    url: "https://www.forbeslogistix.com/careers",
  },
};

export default function CareersPage() {
  return <CareersClient />;
}
