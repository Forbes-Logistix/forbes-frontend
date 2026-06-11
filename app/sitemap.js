const SITE = "https://www.forbeslogistix.com";

// /apply is intentionally absent: the page is noindexed (form-only), and a
// sitemap should list only canonical, indexable URLs — submitting a noindexed
// URL sends Google contradictory signals.
//
// lastModified is intentionally omitted: it used to be `new Date()` at build
// time, which falsely claimed every page changed on every deploy. Better to
// say nothing than to fabricate it.
export default function sitemap() {
  return [
    { url: `${SITE}/`,           changeFrequency: "weekly",  priority: 1.0 },
    { url: `${SITE}/careers`,    changeFrequency: "weekly",  priority: 0.9 },
    { url: `${SITE}/about`,      changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/operations`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/contact`,    changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE}/terms`,      changeFrequency: "yearly",  priority: 0.2 },
    { url: `${SITE}/privacy`,    changeFrequency: "yearly",  priority: 0.2 },
  ];
}
