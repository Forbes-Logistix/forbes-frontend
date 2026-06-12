"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Truck,
  House,
  PhoneCall,
  WalletCards,
  Wrench,
  MapPin,
  Phone,
  Mail,
  FileText,
} from "lucide-react";

const RECRUITING_PHONE_DISPLAY = "(601) 300-5529";
const RECRUITING_PHONE_TEL = "+16013005529";
const RECRUITING_EMAIL = "recruiting@forbeslogistix.com";

const sections = [
  {
    title: "Open-deck freight",
    Icon: Truck,
    body:
      "We run flatbeds and step-decks on open-deck loads across the Southeast. Real freight, real lanes, customers who expect drivers who know how to secure a load.",
  },
  {
    title: "Home weekends",
    Icon: House,
    body:
      "Our lanes are built so company drivers can be home weekends. We do not sell flexible scheduling — we plan dispatch around real home time.",
  },
  {
    title: "Dispatch that picks up the phone",
    Icon: PhoneCall,
    body:
      "If you call dispatch, dispatch answers. No tickets, no chasing. We are small enough that the person you talk to has the authority to fix the problem.",
  },
  {
    title: "Weekly direct deposit, no surprises",
    Icon: WalletCards,
    body:
      "Settlements run weekly with direct deposit. The numbers match what you were quoted: 30% of line haul, $100 tarp pay, and at least $1,000/week if you're available for dispatch all week. Right now our company drivers are making over $2,500 a week.",
  },
  {
    title: "Modern, maintained equipment",
    Icon: Wrench,
    body:
      "Modern tractors and well-kept open-deck trailers, kept on top of with regular maintenance. If something breaks, we get it fixed fast. You should not be losing weeks to downtime.",
  },
  {
    title: "Jackson, MS terminal",
    Icon: MapPin,
    body:
      "Our 3-acre terminal at 3180 Utica Ave includes a 25,000 sq ft warehouse. Drop your trailer, park your truck, talk face-to-face with the people running the company.",
  },
];

export default function OperationsClient() {
  return (
    <div className="bg-black text-white">
      {/* ---------- HERO IMAGE ---------- */}
      <section className="relative h-hero-60 min-h-[420px] w-full overflow-hidden">
        <Image
          src="/assets/photos/truck-precast.jpg"
          alt="Forbes Logistix flatbed hauling precast concrete products at customer site"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 h-full flex items-center px-6 md:px-20">
          <div className="max-w-4xl">
            <p className="uppercase tracking-widest text-white/80 text-sm font-bold mb-3">How we run</p>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
              What the seat actually looks like.
            </h1>
            <p className="text-lg md:text-xl text-white/85 max-w-2xl">
              Forbes Logistix is built around the driver experience. Here is how that shows up day to day.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- HOW WE RUN GRID ---------- */}
      <section className="px-6 md:px-20 py-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {sections.map((s, idx) => (
            <motion.div
              key={s.title}
              className="flex items-start gap-5 bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="w-12 h-12 shrink-0 rounded-xl bg-white text-black flex items-center justify-center">
                <s.Icon aria-hidden className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-2">{s.title}</h2>
                <p className="text-white/80 leading-relaxed">{s.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------- TERMINAL IMAGE BAND ---------- */}
      <section className="relative h-[50vh] min-h-[360px] overflow-hidden">
        <Image
          src="/assets/photos/truck-loading.jpg"
          alt="Forbes Logistix Western Star tractor with open-deck trailer under covered loading area"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/65 flex items-center">
          <div className="max-w-5xl mx-auto px-6 text-white">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 max-w-3xl">
              Built around the driver experience.
            </h2>
            <p className="text-lg md:text-xl text-white/85 max-w-2xl">
              Veteran-owned, asset-based, headquartered in Jackson. Real freight. Real people. Real seats.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- RECRUITING CTA ----------
          This page sells the day-to-day; close the loop with a next step
          instead of dead-ending. Same 3-way strip pattern as home/careers;
          Apply links to /apply since the form isn't embedded here. */}
      <section className="bg-white text-black py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-3">Want this seat?</h2>
          <p className="text-lg text-gray-600 mb-10">Three ways to reach recruiting.</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a
              href={`tel:${RECRUITING_PHONE_TEL}`}
              className="flex flex-col items-center justify-center bg-black text-white px-6 py-8 rounded-2xl border border-black shadow-xl hover:bg-white hover:text-black hover:scale-105 transition-all duration-300"
            >
              <Phone aria-hidden className="w-8 h-8 mb-3" />
              <span className="text-lg font-bold">Call Recruiting</span>
              <span className="text-sm opacity-80 mt-1">{RECRUITING_PHONE_DISPLAY}</span>
            </a>
            <a
              href={`mailto:${RECRUITING_EMAIL}`}
              className="flex flex-col items-center justify-center bg-black text-white px-6 py-8 rounded-2xl border border-black shadow-xl hover:bg-white hover:text-black hover:scale-105 transition-all duration-300"
            >
              <Mail aria-hidden className="w-8 h-8 mb-3" />
              <span className="text-lg font-bold">Email Recruiting</span>
              <span className="text-sm opacity-80 mt-1 break-all">{RECRUITING_EMAIL}</span>
            </a>
            <Link
              href="/apply"
              className="flex flex-col items-center justify-center bg-black text-white px-6 py-8 rounded-2xl border border-black shadow-xl hover:bg-white hover:text-black hover:scale-105 transition-all duration-300"
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
