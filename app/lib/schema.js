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
};

// Reference to the Organization for use inside JobPosting.hiringOrganization.
export const HIRING_ORGANIZATION = {
  "@type": "Organization",
  name: "Forbes Logistix",
  sameAs: SITE_URL,
};

// jobLocation block reused across both job postings.
export const JOB_LOCATION = {
  "@type": "Place",
  address: POSTAL_ADDRESS,
};

// Returns ISO YYYY-MM-DD for "today" and "today + 90 days". Used to compute
// JobPosting.datePosted and JobPosting.validThrough at build/render time.
// Re-evaluated each Vercel deploy, which is frequent enough.
export function jobDates() {
  const today = new Date();
  const ninetyDays = new Date(today);
  ninetyDays.setDate(ninetyDays.getDate() + 90);
  return {
    datePosted: today.toISOString().split("T")[0],
    validThrough: ninetyDays.toISOString().split("T")[0],
  };
}
