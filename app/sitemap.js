const SITE = "https://www.forbeslogistix.com";

export default function sitemap() {
  const now = new Date();
  return [
    { url: `${SITE}/`,           lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${SITE}/careers`,    lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${SITE}/about`,      lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/operations`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/contact`,    lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE}/apply`,      lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/terms`,      lastModified: now, changeFrequency: "yearly",  priority: 0.2 },
    { url: `${SITE}/privacy`,    lastModified: now, changeFrequency: "yearly",  priority: 0.2 },
  ];
}
