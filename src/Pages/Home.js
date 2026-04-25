import React from "react";
import { motion } from "framer-motion";
import { FiPhone, FiMail, FiFileText } from "react-icons/fi";
import Seo from "../Components/Seo/Seo";
import homeVideo from "../Components/Assets/homeVideo.mp4";

const RECRUITING_PHONE_DISPLAY = "(601) 300-5529";
const RECRUITING_PHONE_TEL = "+16013005529";
const RECRUITING_EMAIL = "recruiting@forbeslogistix.com";

const scrollToId = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const Button = ({ children, className = "", noColorHover = false, ...props }) => (
  <button
    className={`
      bg-black
      text-white
      px-8 py-4
      text-lg font-semibold
      rounded-2xl
      shadow-xl
      border border-white/20
      transition-all duration-300 ease-in-out
      ${noColorHover ? "hover:scale-105" : "hover:bg-white hover:text-black hover:scale-105"}
      ${className}
    `}
    {...props}
  >
    {children}
  </button>
);

const ProofChip = ({ children }) => (
  <div className="flex items-center justify-center text-center px-4 py-3 border border-white/30 rounded-xl bg-white/5 backdrop-blur-sm text-sm md:text-base font-semibold tracking-wide uppercase">
    {children}
  </div>
);

const AudienceCard = ({ title, blurb, targetId }) => (
  <motion.button
    onClick={() => scrollToId(targetId)}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.5 }}
    className="group text-left w-full bg-black text-white p-8 md:p-10 rounded-2xl border border-white/20 shadow-xl hover:bg-white hover:text-black transition-all duration-300 hover:scale-[1.02]"
  >
    <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-3">{title}</h3>
    <p className="text-base md:text-lg leading-relaxed mb-5 opacity-90">{blurb}</p>
    <span className="inline-block font-bold tracking-wide group-hover:translate-x-1 transition-transform duration-300">
      See the offer →
    </span>
  </motion.button>
);

const Bullet = ({ children }) => (
  <li className="flex items-start gap-3 text-base md:text-lg leading-relaxed">
    <span aria-hidden className="mt-2 inline-block w-2 h-2 rounded-full bg-white shrink-0" />
    <span>{children}</span>
  </li>
);

const HomePage = () => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      <Seo
        title="Forbes Logistix &mdash; Flatbed driving jobs in the Southeast"
        description="Driver-founded flatbed carrier in Jackson, MS hiring company drivers and owner-operators. Real pay, modern equipment, home most weekends. Call (601) 300-5529."
        path="/"
      />
      {/* ---------- HERO ---------- */}
      <section className="relative min-h-screen">
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={homeVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black bg-opacity-60 z-10" />

        <div className="relative z-20 min-h-screen text-white font-sans flex items-center justify-center">
          <div className="text-center px-4 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-4 tracking-tight">
                Run with the Buffalo
              </h1>
              <p className="text-2xl md:text-3xl mb-4 text-white/90 font-semibold">
                Driver Founded. Driver Focused.
              </p>
              <p className="text-lg md:text-xl mb-10 text-white/80 max-w-2xl mx-auto">
                Flatbed driving jobs built around real pay, modern equipment, and home most weekends.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => scrollToId("company-drivers")}>
                  Company Drivers
                </Button>
                <Button onClick={() => scrollToId("owner-operators")}>
                  Owner-Operators
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ---------- PROOF BAR ---------- */}
      <section className="relative z-20 bg-black text-white py-10 px-4 border-y border-white/10">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <ProofChip>Home Most Weekends</ProofChip>
          <ProofChip>Weekly Direct Deposit</ProofChip>
          <ProofChip>Modern Equipment</ProofChip>
          <ProofChip>Southeast Opportunities</ProofChip>
        </div>
      </section>

      {/* ---------- AUDIENCE SPLIT ---------- */}
      <section className="relative z-20 bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Pick your seat.</h2>
            <p className="text-gray-600 mt-3 text-lg">Two ways to run with us. Both built around the driver.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            <AudienceCard
              title="Company Drivers"
              blurb="W-2 flatbed seat. Real pay, real home time, paid tarps, modern trucks."
              targetId="company-drivers"
            />
            <AudienceCard
              title="Owner-Operators"
              blurb="Bring your truck. Run with a small company that respects the seat."
              targetId="owner-operators"
            />
          </div>
        </div>
      </section>

      {/* ---------- COMPANY DRIVERS ---------- */}
      <section id="company-drivers" className="relative z-20 bg-black text-white py-20 px-4 scroll-mt-28">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <p className="uppercase tracking-widest text-white/60 text-sm font-bold mb-3">For Company Drivers</p>
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
              Drive with Forbes. Get paid like it.
            </h2>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-10">
              Straight numbers. No commission games, no fine print.
            </p>

            <ul className="grid md:grid-cols-2 gap-x-10 gap-y-4 mb-12">
              <Bullet><span className="font-bold">Earn $90,000+ per year</span></Bullet>
              <Bullet><span className="font-bold">30% of line haul</span></Bullet>
              <Bullet>Available for dispatch? You'll earn at least <span className="font-bold">$1,000/week</span></Bullet>
              <Bullet><span className="font-bold">$3,000 sign-on bonus</span></Bullet>
              <Bullet><span className="font-bold">$100 tarp pay</span></Bullet>
              <Bullet>Health insurance</Bullet>
              <Bullet>Annual safety bonuses</Bullet>
              <Bullet>Small-company feel. Big-company professionalism.</Bullet>
            </ul>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={() => window.location.href = "/apply"}>
                Apply Now
              </Button>
              <a
                href={`tel:${RECRUITING_PHONE_TEL}`}
                className="inline-flex items-center justify-center bg-transparent text-white border border-white/40 px-8 py-4 text-lg font-semibold rounded-2xl hover:bg-white hover:text-black hover:scale-105 transition-all duration-300"
              >
                <FiPhone aria-hidden className="mr-2" /> Call Recruiting
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------- OWNER-OPERATORS ---------- */}
      <section id="owner-operators" className="relative z-20 bg-white text-black py-20 px-4 scroll-mt-28">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <p className="uppercase tracking-widest text-gray-500 text-sm font-bold mb-3">For Owner-Operators</p>
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Run your truck. Run with the Buffalo.
            </h2>
            <div className="text-lg md:text-xl text-gray-800 max-w-3xl space-y-5 mb-10 leading-relaxed">
              <p>
                We work with owner-operators who take pride in their equipment and their reputation.
                Modern freight, weekly settlements, and a dispatcher who picks up the phone.
              </p>
              <p>
                Talk to us about lease terms and percentage. We'll be straight with you about what the seat is worth.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={`tel:${RECRUITING_PHONE_TEL}`}
                className="inline-flex items-center justify-center bg-black text-white border border-black px-8 py-4 text-lg font-semibold rounded-2xl hover:bg-white hover:text-black hover:scale-105 transition-all duration-300 shadow-xl"
              >
                <FiPhone aria-hidden className="mr-2" /> Talk to Recruiting
              </a>
              <a
                href={`mailto:${RECRUITING_EMAIL}`}
                className="inline-flex items-center justify-center bg-white text-black border border-black px-8 py-4 text-lg font-semibold rounded-2xl hover:bg-black hover:text-white hover:scale-105 transition-all duration-300"
              >
                <FiMail aria-hidden className="mr-2" /> Email Recruiting
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------- FOUNDER ---------- */}
      <section className="relative z-20 bg-black text-white py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="border-l-4 border-white pl-8 md:pl-12"
          >
            <p className="text-2xl md:text-4xl font-semibold leading-snug tracking-tight mb-6">
              After 8 years in trucking, I started Forbes Logistix to create a better company &mdash;
              one where drivers are paid fairly, respected, and never left in the dark.
            </p>
            <p className="text-3xl md:text-5xl font-extrabold tracking-tight mb-8">
              I've been in your seat.
            </p>
            <footer className="text-base md:text-lg uppercase tracking-widest text-white/70 font-bold">
              &mdash; Chase Forbes, Founder
            </footer>
          </motion.blockquote>
        </div>
      </section>

      {/* ---------- RECRUITING CTA STRIP ---------- */}
      <section className="relative z-20 bg-white py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-3">Ready to roll?</h2>
          <p className="text-lg text-gray-600 mb-10">Three ways to start the conversation.</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a
              href={`tel:${RECRUITING_PHONE_TEL}`}
              className="flex flex-col items-center justify-center bg-black text-white px-6 py-8 rounded-2xl border border-white/20 shadow-xl hover:bg-white hover:text-black hover:scale-105 transition-all duration-300"
            >
              <FiPhone aria-hidden className="text-3xl mb-3" />
              <span className="text-lg font-bold">Call Recruiting</span>
              <span className="text-sm opacity-80 mt-1">{RECRUITING_PHONE_DISPLAY}</span>
            </a>
            <a
              href={`mailto:${RECRUITING_EMAIL}`}
              className="flex flex-col items-center justify-center bg-black text-white px-6 py-8 rounded-2xl border border-white/20 shadow-xl hover:bg-white hover:text-black hover:scale-105 transition-all duration-300"
            >
              <FiMail aria-hidden className="text-3xl mb-3" />
              <span className="text-lg font-bold">Email Recruiting</span>
              <span className="text-sm opacity-80 mt-1 break-all">{RECRUITING_EMAIL}</span>
            </a>
            <a
              href="/apply"
              className="flex flex-col items-center justify-center bg-black text-white px-6 py-8 rounded-2xl border border-white/20 shadow-xl hover:bg-white hover:text-black hover:scale-105 transition-all duration-300"
            >
              <FiFileText aria-hidden className="text-3xl mb-3" />
              <span className="text-lg font-bold">Quick Apply</span>
              <span className="text-sm opacity-80 mt-1">Driver application</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
