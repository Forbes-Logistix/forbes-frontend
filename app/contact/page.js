import ContactClient from "./ContactClient";
import {
  POSTAL_ADDRESS,
  TELEPHONE,
  SITE_URL,
} from "../lib/schema";

const TITLE = "Recruiting Contact | Forbes Logistix";
const DESCRIPTION =
  "Call or email Forbes Logistix recruiting for company driver and owner-operator opportunities across the Southeast.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://www.forbeslogistix.com/contact" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://www.forbeslogistix.com/contact",
    images: [{ url: "/assets/photos/terminal.jpg" }],
  },
};

// LocalBusiness schema for the Jackson Terminal. Helps Google show the
// terminal in map results and the local pack.
//
// openingHours intentionally omitted: the site previously listed
// "Open 24 hours a day, 7 days a week" which conflated dispatch (24/7)
// with recruiting (weekdays). The on-page block was removed; mirroring
// the same restraint here so Google doesn't render an "Always open" badge
// that would re-introduce the same confusion.
const LOCAL_BUSINESS_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Forbes Logistix — Jackson Terminal",
  image: `${SITE_URL}/assets/photos/terminal.jpg`,
  address: POSTAL_ADDRESS,
  telephone: TELEPHONE,
  url: SITE_URL,
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS_SCHEMA) }}
      />
      <ContactClient />
    </>
  );
}
