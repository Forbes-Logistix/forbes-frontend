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
  "New dedicated reefer division running outbound from Dallas. Hiring now — W-2 company driver seats open today. Call recruiting to talk real numbers.";

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

// Deliberately honest posting: the division is new and comp is still being
// finalized, so there is NO baseSalary here —
// it gets added the day the owner sets the package. Everything stated is
// owner-confirmed: company drivers, dedicated reefer, Dallas outbound,
// hiring now (time-boxed "two weeks" copy removed 2026-07-14 per owner —
// keep this page free of countdown claims that go stale).
const REEFER_DESCRIPTION = `
<p>Forbes Logistix is hiring W-2 company drivers for a new dedicated reefer division running outbound from Dallas, Texas.</p>
<p><strong>What we can tell you today:</strong></p>
<ul>
  <li>Dedicated reefer freight, Dallas outbound lanes</li>
  <li>Hiring now &mdash; seats are open</li>
  <li>Compensation is being finalized &mdash; call recruiting to talk real numbers</li>
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
