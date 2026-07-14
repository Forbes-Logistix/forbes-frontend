import ApplicationClient from "./ApplicationClient";

// HIDDEN PAGE by design: noindexed, absent from the sitemap, and linked
// from nowhere on the site. The owner texts this URL to a driver after the
// screening callback — it IS the "full DOT application sent after we talk"
// referenced on /apply. Keep it out of nav, footer, and sitemap.
export const metadata = {
  title: "Driver Application | Forbes Logistix",
  description:
    "Full DOT driver qualification application for Forbes Logistix. Complete on your phone in about 20 minutes.",
  robots: { index: false, follow: false },
  alternates: { canonical: null },
};

export default function ApplicationPage() {
  return <ApplicationClient />;
}
