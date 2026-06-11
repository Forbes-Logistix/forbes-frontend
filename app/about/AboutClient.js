"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Phone, Mail, FileText } from "lucide-react";

const RECRUITING_PHONE_DISPLAY = "(601) 300-5529";
const RECRUITING_PHONE_TEL = "+16013005529";
const RECRUITING_EMAIL = "recruiting@forbeslogistix.com";

export default function AboutClient() {
  return (
    <div className="bg-black text-white">
      {/* ---------- HERO ---------- */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <Image
          src="/assets/photos/truck-mountain.jpg"
          alt="Forbes Logistix flatbed truck loading freight on a Western plain with Rocky Mountains in the background"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Radial gradient overlay: 70% dark behind the (centered) text card,
            fading to 40% at the edges. Keeps headline contrast where it
            matters while letting the mountain photo read clearly outside the
            words. Drop-shadows on the text reinforce contrast at the
            transition zone. */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.70)_0%,rgba(0,0,0,0.70)_15%,rgba(0,0,0,0.40)_55%)]" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          // No card/border/glass treatment — text sits directly on the dark
          // overlay so the mountain photo reads through. Matches the
          // treatment used on the lower terminal credibility band, and on
          // the home page's terminal band.
          className="relative z-10 text-white max-w-3xl px-6 md:px-12"
        >
          <p className="uppercase tracking-widest text-white/80 text-sm font-bold mb-3 text-center drop-shadow-md">
            About Forbes Logistix
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-6 tracking-tight text-center drop-shadow-lg">
            Built by people who understand trucking from behind the wheel, not just behind a desk.
          </h1>

          <div className="space-y-5 text-base md:text-lg leading-relaxed text-white/90 drop-shadow-md">
            <p>
              Forbes Logistix is a Marine Corps veteran-owned, asset-based, driver-founded carrier
              headquartered in Jackson, Mississippi. We specialize in open-deck transportation and
              operate in one of the most capacity-constrained freight markets in the country.
            </p>
            <p>
              The company was founded by Chase Forbes, a former truck driver with eight years behind
              the wheel and additional time in operations. Our leadership has sat behind the wheel and
              understands what the road actually looks like, not just what the spreadsheet says. That
              perspective shapes how we hire, dispatch, and pay.
            </p>
          </div>
        </motion.div>
      </section>

      {/* ---------- TERMINAL CREDIBILITY BAND ----------
          Pulled the original third paragraph (terminal description) out of the
          hero card and into its own band with the terminal photo as background.
          Lets the mountain hero do "we drive real distances" without competing
          with terminal-specific copy, and gives the terminal photo the role
          where it fits best — a credibility statement about the home base.
          Mirrors the same pattern used on the home page. */}
      <section className="relative h-[50vh] min-h-[360px] overflow-hidden">
        <Image
          src="/assets/photos/terminal.jpg"
          alt="Forbes Logistix terminal in Jackson, Mississippi with company tractor parked outside"
          fill
          sizes="100vw"
          className="object-cover"
        />
        {/* Same radial-gradient pattern as the hero, but at 65% center to
            match the original treatment of this band. Text on this band is
            left-aligned within max-w-5xl (so off-center horizontally), but
            the centered-ellipse gradient still places more darkness where
            the text falls than where the photo edges sit. */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.65)_0%,rgba(0,0,0,0.65)_15%,rgba(0,0,0,0.40)_55%)] flex items-center">
          <div className="max-w-5xl mx-auto px-6 text-white">
            <p className="uppercase tracking-widest text-white/80 text-sm font-bold mb-3 drop-shadow-md">
              Jackson, Mississippi
            </p>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 max-w-3xl drop-shadow-lg">
              A real terminal. A real company.
            </h2>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl drop-shadow-md">
              Our Jackson terminal sits on a 3-acre lot and includes a 25,000-square-foot warehouse,
              giving us the infrastructure to support our fleet and partners with strength and scale.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- RECRUITING CTA ----------
          Every page should end with a next step. Drivers vetting the company
          land here — don't make them go back to the nav to act. Same 3-way
          strip pattern as home/careers/contact; the Apply card links to
          /apply since this page doesn't embed the form. */}
      <section className="bg-white text-black py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-3">
            Sound like your kind of company?
          </h2>
          <p className="text-lg text-gray-600 mb-10">Three ways to reach recruiting.</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a
              href={`tel:${RECRUITING_PHONE_TEL}`}
              className="flex flex-col items-center justify-center bg-black text-white px-6 py-8 rounded-2xl border border-white/20 shadow-xl hover:bg-white hover:text-black hover:scale-105 transition-all duration-300"
            >
              <Phone aria-hidden className="w-8 h-8 mb-3" />
              <span className="text-lg font-bold">Call Recruiting</span>
              <span className="text-sm opacity-80 mt-1">{RECRUITING_PHONE_DISPLAY}</span>
            </a>
            <a
              href={`mailto:${RECRUITING_EMAIL}`}
              className="flex flex-col items-center justify-center bg-black text-white px-6 py-8 rounded-2xl border border-white/20 shadow-xl hover:bg-white hover:text-black hover:scale-105 transition-all duration-300"
            >
              <Mail aria-hidden className="w-8 h-8 mb-3" />
              <span className="text-lg font-bold">Email Recruiting</span>
              <span className="text-sm opacity-80 mt-1 break-all">{RECRUITING_EMAIL}</span>
            </a>
            <Link
              href="/apply"
              className="flex flex-col items-center justify-center bg-black text-white px-6 py-8 rounded-2xl border border-white/20 shadow-xl hover:bg-white hover:text-black hover:scale-105 transition-all duration-300"
            >
              <FileText aria-hidden className="w-8 h-8 mb-3" />
              <span className="text-lg font-bold">Apply Now</span>
              <span className="text-sm opacity-80 mt-1">Three-field callback form</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
