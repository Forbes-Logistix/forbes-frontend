import QuickApplyForm from "../components/QuickApplyForm";

export const metadata = {
  title: "Apply — Forbes Logistix",
  description:
    "Quick three-field driver application. We'll call you back within one business day. Full DOT application is sent after we talk.",
  alternates: { canonical: "https://www.forbeslogistix.com/apply" },
  openGraph: {
    title: "Apply — Forbes Logistix",
    description:
      "Quick three-field driver application. We'll call you back within one business day.",
    url: "https://www.forbeslogistix.com/apply",
    images: [{ url: "/assets/photos/truck-loading.jpg" }],
  },
  robots: { index: false, follow: true },
};

export default function ApplyPage() {
  return (
    <div className="bg-white text-black min-h-screen">
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10 text-center">
            <p className="uppercase tracking-widest text-gray-500 text-sm font-bold mb-3">Apply</p>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Talk to recruiting first.
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-xl mx-auto">
              Three fields. We&apos;ll call you. Full DOT application is sent after we talk.
            </p>
          </div>

          <QuickApplyForm
            id="quick-apply-form"
            variant="dark"
            heading={null}
            subhead={null}
          />
        </div>
      </section>
    </div>
  );
}
