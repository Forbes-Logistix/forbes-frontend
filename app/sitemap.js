const SITE = "https://www.forbeslogistix.com";

// /apply is intentionally absent: the page is noindexed (form-only), and a
// sitemap should list only canonical, indexable URLs: submitting a noindexed
// URL sends Google contradictory signals.
//
// lastModified values are REAL content-change dates, maintained by hand:
// update the matching constant when a page's content materially changes.
// (They were previously `new Date()` at build time, which falsely claimed
// every page changed on every deploy; then omitted entirely. Honest dates
// help Google prioritize recrawling pages that actually changed.)
const MODIFIED = {
  home: "2026-06-11", // recruiting content pass: pay story, hero CTA, proof bar
  careers: "2026-09-04", // OO section: Mississippi wording + MS landing-page cross-link
  reefer: "2026-07-13", // Dallas reefer division launched
  flatbedOoMs: "2026-09-04", // Mississippi flatbed owner-operator landing page launched
  about: "2026-06-11", // recruiting CTA strip added
  operations: "2026-06-11", // pay line + recruiting CTA strip
  contact: "2026-06-10", // form validation + accessibility pass
  terms: "2026-04-25", // effective date
  privacy: "2026-04-25", // effective date
};

export default function sitemap() {
  return [
    { url: `${SITE}/`,           lastModified: MODIFIED.home,       changeFrequency: "weekly",  priority: 1.0 },
    { url: `${SITE}/careers`,    lastModified: MODIFIED.careers,    changeFrequency: "weekly",  priority: 0.9 },
    { url: `${SITE}/reefer`,     lastModified: MODIFIED.reefer,     changeFrequency: "weekly",  priority: 0.8 },
    { url: `${SITE}/flatbed-owner-operator-jobs-mississippi`, lastModified: MODIFIED.flatbedOoMs, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/about`,      lastModified: MODIFIED.about,      changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/operations`, lastModified: MODIFIED.operations, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/contact`,    lastModified: MODIFIED.contact,    changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE}/terms`,      lastModified: MODIFIED.terms,      changeFrequency: "yearly",  priority: 0.2 },
    { url: `${SITE}/privacy`,    lastModified: MODIFIED.privacy,    changeFrequency: "yearly",  priority: 0.2 },
  ];
}
