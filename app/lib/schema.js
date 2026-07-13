// Shared building blocks for JSON-LD structured data on the site.
// Used by app/layout.js (Organization), app/contact/page.js
// (LocalBusiness), and app/careers/page.js (two JobPostings).
//
// Single source of truth for the address/phone/url. Update here if the
// company moves or changes contact info, and all three schemas update.

export const SITE_URL = "https://www.forbeslogistix.com";
export const LOGO_URL = `${SITE_URL}/assets/forbesLogo.png`;

export const TELEPHONE = "+1-601-300-5529";
export const RECRUITING_EMAIL = "recruiting@forbeslogistix.com";

export const POSTAL_ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: "3180 Utica Ave",
  addressLocality: "Jackson",
  addressRegion: "MS",
  postalCode: "39209",
  addressCountry: "US",
};

export const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Forbes Logistix",
  url: SITE_URL,
  logo: LOGO_URL,
  telephone: TELEPHONE,
  email: RECRUITING_EMAIL,
  address: POSTAL_ADDRESS,
  slogan: "Run with the Buffalo",
  founder: { "@type": "Person", name: "Chase Forbes" },
  areaServed: "Southeastern United States",
};

// Reference to the Organization for use inside JobPosting.hiringOrganization.
export const HIRING_ORGANIZATION = {
  "@type": "Organization",
  name: "Forbes Logistix",
  sameAs: SITE_URL,
};

// jobLocation block reused across both flatbed job postings (Jackson terminal).
export const JOB_LOCATION = {
  "@type": "Place",
  address: POSTAL_ADDRESS,
};

// Dallas reefer division — city-level location (no street address published;
// the division is new and domiciled out of Dallas).
export const DALLAS_JOB_LOCATION = {
  "@type": "Place",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dallas",
    addressRegion: "TX",
    addressCountry: "US",
  },
};

// The date the postings actually went live on the site. Google guidance:
// JobPosting.datePosted should be the real original posting date — bump this
// constant only when a role materially changes or is re-opened. (It used to
// be computed as "today" at build time, which silently reset on every deploy.)
// 2026-06-11: bumped — baseSalary ($2,500/wk current earnings) added to the
// company-driver posting and the OO settlement framing was rewritten.
export const JOB_DATE_POSTED = "2026-06-11";

// Dallas reefer posting went live 2026-07-13 (new division, comp TBD —
// no baseSalary until the owner sets the package).
export const REEFER_DATE_POSTED = "2026-07-13";

// JobPosting.validThrough — rolling 90-day window from now. The careers page
// exports `revalidate`, so ISR re-evaluates this daily and the window keeps
// sliding. Previously this froze at the last deploy: with no deploys after
// 2026-05-08 the postings would have expired from Google for Jobs on
// 2026-08-06 without anyone noticing.
export function validThroughISO() {
  const d = new Date();
  d.setDate(d.getDate() + 90);
  return d.toISOString().split("T")[0];
}
