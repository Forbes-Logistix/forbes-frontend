import Link from "next/link";

// Branded 404. Without this file Next served its default error block, which
// leaked the homepage canonical/og metadata and duplicate <title> tags onto
// 404 responses.
export const metadata = {
  title: "Page Not Found | Forbes Logistix",
  robots: { index: false },
  alternates: { canonical: null },
};

export default function NotFound() {
  return (
    <div className="bg-black text-white min-h-[70vh] flex items-center justify-center px-6">
      <div className="max-w-xl text-center py-24">
        <p className="uppercase tracking-widest text-white/70 text-sm font-bold mb-3">404</p>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
          This road doesn&apos;t go anywhere.
        </h1>
        <p className="text-lg text-white/85 mb-10">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="bg-white text-black px-8 py-4 text-lg font-bold rounded-2xl border border-white hover:bg-black hover:text-white transition-all duration-300"
          >
            Back to Home
          </Link>
          <Link
            href="/careers"
            className="bg-black text-white px-8 py-4 text-lg font-bold rounded-2xl border border-white/40 hover:bg-white hover:text-black transition-all duration-300"
          >
            Driving Jobs
          </Link>
        </div>
      </div>
    </div>
  );
}
