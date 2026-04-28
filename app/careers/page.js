import CareersClient from "./CareersClient";
import { HIRING_ORGANIZATION, JOB_LOCATION, jobDates } from "../lib/schema";

const TITLE = "Company Driver & Owner-Operator Jobs | Forbes Logistix";
const DESCRIPTION =
  "Company drivers: strong flatbed pay, 30% of line haul, $3,000 sign-on, $100 tarp pay, and home weekends. Owner-operators keep 90% of total billed revenue.";

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

// JobPosting descriptions are HTML-formatted (Google for Jobs accepts HTML
// in description and renders the structure). Content is paraphrased from
// the on-page copy in CareersClient.js — see "For Company Drivers" and
// "For Owner-Operators" sections. Update both this file and the on-page
// copy together to keep them in sync.
const COMPANY_DRIVER_DESCRIPTION = `
<p>Forbes Logistix is hiring W-2 company flatbed drivers for open-deck freight across the Southeast.</p>
<p><strong>What you earn:</strong></p>
<ul>
  <li>30% of line haul</li>
  <li>At least $1,000/week when available for dispatch</li>
  <li>$3,000 sign-on bonus</li>
  <li>$100 tarp pay</li>
  <li>Weekly direct deposit</li>
  <li>Health insurance</li>
  <li>Annual safety bonuses</li>
  <li>Home weekends</li>
  <li>Modern, well-maintained equipment</li>
</ul>
<p><strong>Requirements:</strong></p>
<ul>
  <li>Valid Class A CDL, at least 23 years old</li>
  <li>At least 1 year of verifiable OTR experience</li>
  <li>Clean MVR &mdash; no major violations</li>
  <li>Pass DOT physical and drug screen</li>
  <li>Current DOT medical card</li>
  <li>Comfortable with tarping and load securement</li>
</ul>
<p>Forbes Logistix is a Marine Corps veteran-owned, driver-founded carrier headquartered in Jackson, Mississippi.</p>
`.trim();

const OWNER_OPERATOR_DESCRIPTION = `
<p>Forbes Logistix contracts open-deck owner-operators across the Southeast.</p>
<p><strong>What you earn:</strong></p>
<ul>
  <li>90% of total billed revenue</li>
  <li>Weekly settlements</li>
  <li>Real open-deck freight</li>
  <li>Direct communication with dispatch</li>
</ul>
<p>Talk to recruiting about settlement details, equipment standards, and onboarding.</p>
<p>Forbes Logistix is a Marine Corps veteran-owned, driver-founded carrier headquartered in Jackson, Mississippi.</p>
`.trim();

export default function CareersPage() {
  const { datePosted, validThrough } = jobDates();

  const companyDriverJob = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: "Company Flatbed Driver",
    description: COMPANY_DRIVER_DESCRIPTION,
    datePosted,
    validThrough,
    employmentType: "FULL_TIME",
    industry: "Trucking",
    hiringOrganization: HIRING_ORGANIZATION,
    jobLocation: JOB_LOCATION,
    applicantLocationRequirements: { "@type": "Country", name: "US" },
    directApply: false,
  };

  const ownerOperatorJob = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: "Owner-Operator (Open-Deck Flatbed)",
    description: OWNER_OPERATOR_DESCRIPTION,
    datePosted,
    validThrough,
    employmentType: "CONTRACTOR",
    industry: "Trucking",
    hiringOrganization: HIRING_ORGANIZATION,
    jobLocation: JOB_LOCATION,
    applicantLocationRequirements: { "@type": "Country", name: "US" },
    directApply: false,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(companyDriverJob) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ownerOperatorJob) }}
      />
      <CareersClient />
    </>
  );
}
