import ReeferClient from "./ReeferClient";
import {
  HIRING_ORGANIZATION,
  DALLAS_JOB_LOCATION,
  REEFER_DATE_POSTED,
  validThroughISO,
} from "../lib/schema";

// ISR keeps the JobPosting validThrough window rolling, same as /careers.
export const revalidate = 86400;

const TITLE = "Reefer Driving Jobs in Dallas, TX — Now Hiring | Forbes Logistix";
const DESCRIPTION =
  "New dedicated reefer division running outbound from Dallas. W-2 company driver seats starting in the next two weeks — founding drivers help shape the package.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://www.forbeslogistix.com/reefer" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://www.forbeslogistix.com/reefer",
    images: [{ url: "/assets/og/truck-loading-og.jpg", width: 1200, height: 630 }],
  },
};

// Deliberately honest posting: the division is new and comp is being
// finalized with the founding drivers, so there is NO baseSalary here —
// it gets added the day the owner sets the package. Everything stated is
// owner-confirmed (2026-07-13): company drivers, dedicated reefer, Dallas
// outbound, seats starting within ~two weeks.
const REEFER_DESCRIPTION = `
<p>Forbes Logistix is hiring W-2 company drivers for a new dedicated reefer division running outbound from Dallas, Texas.</p>
<p><strong>What we can tell you today:</strong></p>
<ul>
  <li>Dedicated reefer freight, Dallas outbound lanes</li>
  <li>Seats start in the next two weeks</li>
  <li>Compensation is being finalized with the founding drivers &mdash; call recruiting to talk real numbers</li>
  <li>Valid Class A CDL required</li>
</ul>
<p>Forbes Logistix is a Marine Corps veteran-owned, driver-founded carrier. Our flatbed fleet publishes exact pay; this division will too, the day the package is set.</p>
`.trim();

export default function ReeferPage() {
  const reeferJob = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: "Company Reefer Driver — Dedicated Dallas Outbound",
    description: REEFER_DESCRIPTION,
    datePosted: REEFER_DATE_POSTED,
    validThrough: validThroughISO(),
    employmentType: "FULL_TIME",
    industry: "Trucking",
    hiringOrganization: HIRING_ORGANIZATION,
    jobLocation: DALLAS_JOB_LOCATION,
    directApply: false,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reeferJob) }}
      />
      <ReeferClient />
    </>
  );
}
