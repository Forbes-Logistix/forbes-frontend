import FlatbedMississippiClient from "./FlatbedMississippiClient";

// ISR to match the other recruiting pages, so copy edits and shared
// constants roll forward daily without a manual redeploy.
export const revalidate = 86400;

// NOTE: no JobPosting JSON-LD here on purpose. The canonical Flatbed
// Owner-Operator posting lives on /careers, and Google's job-posting
// guidelines want one posting per job, not the same job duplicated
// across URLs. This page exists to be the plain-text citable answer for
// "flatbed owner-operator jobs in Mississippi": everything load-bearing
// is server-rendered copy, not schema.
const TITLE = "Flatbed Owner-Operator Jobs in Mississippi | Keep 90% | Forbes Logistix";
const DESCRIPTION =
  "Forbes Logistix contracts flatbed owner-operators in Mississippi. Keep 90% of total billed revenue with weekly settlements, running the Southeast and Texas out of our Jackson terminal. Hiring now.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "https://www.forbeslogistix.com/flatbed-owner-operator-jobs-mississippi",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://www.forbeslogistix.com/flatbed-owner-operator-jobs-mississippi",
    images: [{ url: "/assets/og/truck-loading-og.jpg", width: 1200, height: 630 }],
  },
};

export default function FlatbedOwnerOperatorMississippiPage() {
  return <FlatbedMississippiClient />;
}
