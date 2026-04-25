"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiPhone, FiMail, FiCheck } from "react-icons/fi";

const RECRUITING_PHONE_DISPLAY = "(601) 300-5529";
const RECRUITING_PHONE_TEL = "+16013005529";
const RECRUITING_EMAIL = "recruiting@forbeslogistix.com";

const Bullet = ({ children }) => (
  <li className="flex items-start gap-3 text-base md:text-lg leading-relaxed">
    <FiCheck aria-hidden className="mt-1.5 shrink-0" />
    <span>{children}</span>
  </li>
);

export default function CareersClient() {
  return (
    <div className="bg-white text-black min-h-screen overflow-hidden">
      {/* ---------- HERO ---------- */}
      <section className="relative w-full h-screen flex items-center justify-center">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          src="/assets/careers.mp4"
        >
          <source src="/assets/careers.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/70 z-10" />

        <div className="relative z-20 text-center px-4 md:px-12 text-white max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4"
          >
            Flatbed seats. Real pay. Real home time.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-2xl text-white/90 mb-10"
          >
            Hiring company drivers and owner-operators across the Southeast.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/apply"
              className="bg-white text-black px-10 py-4 text-lg font-bold rounded-2xl hover:bg-black hover:text-white border border-white hover:scale-105 transition-all duration-300"
            >
              Apply Now
            </Link>
            <a
              href={`tel:${RECRUITING_PHONE_TEL}`}
              className="inline-flex items-center justify-center bg-transparent text-white border border-white/60 px-10 py-4 text-lg font-bold rounded-2xl hover:bg-white hover:text-black hover:scale-105 transition-all duration-300"
            >
              <FiPhone aria-hidden className="mr-2" /> Call Recruiting
            </a>
          </motion.div>
        </div>
      </section>

      {/* ---------- COMPANY DRIVER OFFER ---------- */}
      <section id="company-drivers" className="bg-black text-white py-20 px-4 scroll-mt-28">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <p className="uppercase tracking-widest text-white/60 text-sm font-bold mb-3">
              For Company Drivers
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              The offer, in plain numbers.
            </h2>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-10">
              No fine print. No commission games. Here is what you earn and what you get.
            </p>

            <ul className="grid md:grid-cols-2 gap-x-10 gap-y-4 mb-12">
              <Bullet><span className="font-bold">Earn $90,000+ per year</span></Bullet>
              <Bullet><span className="font-bold">30% of line haul</span></Bullet>
              <Bullet>Available for dispatch? You earn at least <span className="font-bold">$1,000 per week</span></Bullet>
              <Bullet><span className="font-bold">$3,000 sign-on bonus</span></Bullet>
              <Bullet><span className="font-bold">$100 tarp pay</span></Bullet>
              <Bullet>Weekly direct deposit</Bullet>
              <Bullet>Health insurance</Bullet>
              <Bullet>Annual safety bonuses</Bullet>
              <Bullet>Home most weekends</Bullet>
              <Bullet>Modern, well-maintained equipment</Bullet>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* ---------- REQUIREMENTS ---------- */}
      <section className="bg-white text-black py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <p className="uppercase tracking-widest text-gray-500 text-sm font-bold mb-3">
              What we look for
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Qualified flatbed drivers.
            </h2>
            <p className="text-lg md:text-xl text-gray-700 max-w-2xl mb-10">
              Our seats fit drivers who take the job seriously. If this is you, we want to talk.
            </p>

            <ul className="grid md:grid-cols-2 gap-x-10 gap-y-4">
              <Bullet>Valid Class A CDL</Bullet>
              <Bullet>Clean MVR — no major violations</Bullet>
              <Bullet>Pass DOT physical and drug screen</Bullet>
              <Bullet>At least 23 years old</Bullet>
              <Bullet>Verifiable OTR experience</Bullet>
              <Bullet>Comfortable with tarping and securement</Bullet>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* ---------- OWNER-OPERATORS ---------- */}
      <section id="owner-operators" className="bg-black text-white py-20 px-4 scroll-mt-28">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <p className="uppercase tracking-widest text-white/60 text-sm font-bold mb-3">
              For Owner-Operators
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
              Run your truck. Run with the Buffalo.
            </h2>
            <div className="text-lg md:text-xl text-white/80 max-w-3xl space-y-5 mb-10 leading-relaxed">
              <p>
                We work with owner-operators who take pride in their equipment and their reputation.
                Modern freight, weekly settlements, and a dispatcher who picks up the phone.
              </p>
              <p>
                Talk to us about lease terms and percentage. We will be straight with you about what the seat is worth.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={`tel:${RECRUITING_PHONE_TEL}`}
                className="inline-flex items-center justify-center bg-white text-black border border-white px-8 py-4 text-lg font-semibold rounded-2xl hover:bg-black hover:text-white hover:scale-105 transition-all duration-300 shadow-xl"
              >
                <FiPhone aria-hidden className="mr-2" /> Talk to Recruiting
              </a>
              <a
                href={`mailto:${RECRUITING_EMAIL}`}
                className="inline-flex items-center justify-center bg-transparent text-white border border-white/60 px-8 py-4 text-lg font-semibold rounded-2xl hover:bg-white hover:text-black hover:scale-105 transition-all duration-300"
              >
                <FiMail aria-hidden className="mr-2" /> Email Recruiting
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------- CTA STRIP ---------- */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-3">Start the conversation.</h2>
          <p className="text-lg text-gray-600 mb-10">Three ways to reach recruiting.</p>

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
            <Link
              href="/apply"
              className="flex flex-col items-center justify-center bg-black text-white px-6 py-8 rounded-2xl border border-white/20 shadow-xl hover:bg-white hover:text-black hover:scale-105 transition-all duration-300"
            >
              <FiCheck aria-hidden className="text-3xl mb-3" />
              <span className="text-lg font-bold">Apply Now</span>
              <span className="text-sm opacity-80 mt-1">Driver application</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
