"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  FileText,
  House,
  WalletCards,
  Truck,
  MapPinned,
  DollarSign,
  Award,
  ShieldCheck,
  HeartPulse,
  Percent,
  CalendarDays,
  PhoneCall,
} from "lucide-react";
import QuickApplyForm from "./components/QuickApplyForm";

const RECRUITING_PHONE_DISPLAY = "(601) 300-5529";
const RECRUITING_PHONE_TEL = "+16013005529";
const RECRUITING_EMAIL = "recruiting@forbeslogistix.com";

const scrollToId = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const Button = ({ children, className = "", ...props }) => (
  <button
    className={`bg-black text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-xl border border-white/20 transition-all duration-300 ease-in-out hover:bg-white hover:text-black hover:scale-105 ${className}`}
    {...props}
  >
    {children}
  </button>
);

const ProofChip = ({ icon: Icon, label }) => (
  <div className="flex items-center justify-center gap-2 text-center px-4 py-3 border border-white/30 rounded-xl bg-white/5 backdrop-blur-sm text-sm md:text-base font-semibold tracking-wide uppercase">
    <Icon aria-hidden className="w-5 h-5 shrink-0" />
    <span>{label}</span>
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

const OfferBullet = ({ icon: Icon, children }) => (
  <li className="flex items-start gap-3 text-base md:text-lg leading-relaxed">
    <Icon aria-hidden className="w-5 h-5 mt-1 shrink-0" />
    <span>{children}</span>
  </li>
);

export default function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* ---------- HERO (buffalo video) ---------- */}
      <section className="relative min-h-screen">
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/assets/homeVideo.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/60 z-10" />

        <div className="relative z-20 min-h-screen text-white font-sans flex items-center justify-center">
          <div className="text-center px-4 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Brand mark sits above the H1 in the hero. The buffalo asset is
                  white on transparent; on the dark video backdrop it renders as
                  a tone-on-tone seal. h-20 (80px) is in the brand-seal range
                  (64–96px) and matches the size used in the OO sections so the
                  treatment is consistent across the site. */}
              <Image
                src="/assets/buffalo.png"
                alt=""
                aria-hidden
                width={200}
                height={200}
                priority
                className="h-20 w-auto mx-auto mb-4 opacity-90 drop-shadow-lg"
              />
              <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-4 tracking-tight drop-shadow-2xl">
                Run with the Buffalo
              </h1>
              <p className="text-2xl md:text-3xl mb-4 text-white/90 font-semibold drop-shadow-lg">
                Driver Founded. Driver Focused.
              </p>
              <p className="text-lg md:text-xl mb-10 text-white/85 max-w-2xl mx-auto drop-shadow-md">
                Flatbed driving jobs built around real pay, modern equipment, and home weekends.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => scrollToId("company-drivers")}>Company Drivers</Button>
                <Button onClick={() => scrollToId("owner-operators")}>Owner-Operators</Button>
              </div>

              <a
                href={`tel:${RECRUITING_PHONE_TEL}`}
                className="mt-6 inline-flex items-center justify-center gap-2 text-white/90 hover:text-white text-base font-medium underline-offset-4 hover:underline"
              >
                <Phone aria-hidden className="w-4 h-4" /> Call Recruiting · {RECRUITING_PHONE_DISPLAY}
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ---------- PROOF BAR ---------- */}
      <section className="relative z-20 bg-black text-white py-10 px-4 border-y border-white/10">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <ProofChip icon={House} label="Home Weekends" />
          <ProofChip icon={WalletCards} label="Weekly Direct Deposit" />
          <ProofChip icon={Truck} label="Modern Equipment" />
          <ProofChip icon={MapPinned} label="Southeast Opportunities" />
        </div>
      </section>

      {/* ---------- QUICK APPLY ---------- */}
      <section id="quick-apply" className="relative z-20 bg-white text-black py-20 px-4 scroll-mt-28">
        <div className="max-w-3xl mx-auto">
          <QuickApplyForm
            id="quick-apply-form"
            variant="dark"
            heading="Talk to recruiting"
            subhead="Three fields. We'll call you."
          />
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
              blurb="W-2 flatbed seat. Real pay, real home time, tarp pay, modern trucks."
              targetId="company-drivers"
            />
            <AudienceCard
              title="Owner-Operators"
              blurb="Bring your truck. Keep 90% of total billed revenue. Run with a small company that respects the seat."
              targetId="owner-operators"
            />
          </div>
        </div>
      </section>

      {/* ---------- COMPANY DRIVERS ---------- */}
      <section id="company-drivers" className="relative z-20 bg-black text-white py-20 px-4 scroll-mt-28">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-10 items-center">
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
            >
              <p className="uppercase tracking-widest text-white/60 text-sm font-bold mb-3">For Company Drivers</p>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                Drive with Forbes. Get paid like it.
              </h2>
              <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-10">
                Straight numbers. No fine print.
              </p>

              <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-4 mb-10">
                <OfferBullet icon={Percent}><span className="font-bold">30% of line haul</span></OfferBullet>
                <OfferBullet icon={CalendarDays}>
                  Available for dispatch? You&apos;ll earn at least <span className="font-bold">$1,000/week</span>
                </OfferBullet>
                <OfferBullet icon={Award}><span className="font-bold">$3,000 sign-on bonus</span></OfferBullet>
                <OfferBullet icon={ShieldCheck}><span className="font-bold">$100 tarp pay</span></OfferBullet>
                <OfferBullet icon={WalletCards}>Weekly direct deposit</OfferBullet>
                <OfferBullet icon={HeartPulse}>Health insurance</OfferBullet>
                <OfferBullet icon={ShieldCheck}>Annual safety bonuses</OfferBullet>
                <OfferBullet icon={House}>Home weekends</OfferBullet>
                <OfferBullet icon={Truck}>Small-company feel. Big-company professionalism.</OfferBullet>
              </ul>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={() => scrollToId("quick-apply-form")}>Apply Now</Button>
                <a
                  href={`tel:${RECRUITING_PHONE_TEL}`}
                  className="inline-flex items-center justify-center gap-2 bg-transparent text-white border border-white/40 px-8 py-4 text-lg font-semibold rounded-2xl hover:bg-white hover:text-black hover:scale-105 transition-all duration-300"
                >
                  <Phone aria-hidden className="w-5 h-5" /> Call Recruiting
                </a>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-2 relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <Image
              src="/assets/photos/truck-loading.jpg"
              alt="Forbes Logistix Western Star tractor with open-deck trailer under covered loading area"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
              priority={false}
            />
          </div>
        </div>
      </section>

      {/* ---------- OWNER-OPERATORS ---------- */}
      <section id="owner-operators" className="relative z-20 bg-white text-black py-20 px-4 scroll-mt-28">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-10 items-center">
          <div className="lg:col-span-2 relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl order-2 lg:order-1">
            <Image
              src="/assets/photos/truck-urban-load.jpg"
              alt="Forbes Logistix flatbed delivering freight in an urban jobsite"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </div>

          <div className="lg:col-span-3 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
            >
              {/* Same buffalo asset as the home hero, but this section has a
                  white background — `filter invert` flips the white silhouette
                  to black so it reads tone-on-tone here. Same h-20 size as the
                  hero placement; left-aligned to match the column's text. */}
              <Image
                src="/assets/buffalo.png"
                alt=""
                aria-hidden
                width={200}
                height={200}
                className="h-20 w-auto mb-3 opacity-80 [filter:invert(1)]"
              />
              <p className="uppercase tracking-widest text-gray-500 text-sm font-bold mb-3">For Owner-Operators</p>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
                Run your truck. Run with the Buffalo.
              </h2>

              <p className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6">
                Keep <span className="underline decoration-4 decoration-black/80 underline-offset-4">90%</span> of total billed revenue.
              </p>

              <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-4 mb-8 text-lg md:text-xl text-gray-800">
                <OfferBullet icon={Percent}>90% of total billed revenue</OfferBullet>
                <OfferBullet icon={CalendarDays}>Weekly settlements</OfferBullet>
                <OfferBullet icon={Truck}>Real open-deck freight</OfferBullet>
                <OfferBullet icon={PhoneCall}>Dispatcher who answers the phone</OfferBullet>
              </ul>

              <p className="text-base md:text-lg text-gray-700 mb-8 max-w-2xl">
                Talk to recruiting about settlement details, equipment standards, and onboarding.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={`tel:${RECRUITING_PHONE_TEL}`}
                  className="inline-flex items-center justify-center gap-2 bg-black text-white border border-black px-8 py-4 text-lg font-semibold rounded-2xl hover:bg-white hover:text-black hover:scale-105 transition-all duration-300 shadow-xl"
                >
                  <Phone aria-hidden className="w-5 h-5" /> Talk to Recruiting
                </a>
                <a
                  href={`mailto:${RECRUITING_EMAIL}`}
                  className="inline-flex items-center justify-center gap-2 bg-white text-black border border-black px-8 py-4 text-lg font-semibold rounded-2xl hover:bg-black hover:text-white hover:scale-105 transition-all duration-300"
                >
                  <Mail aria-hidden className="w-5 h-5" /> Email Recruiting
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ---------- TERMINAL CREDIBILITY BAND ---------- */}
      <section className="relative h-[50vh] min-h-[360px] overflow-hidden">
        <Image
          src="/assets/photos/terminal.jpg"
          alt="Forbes Logistix terminal in Jackson, Mississippi with company tractor parked outside"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60 flex items-center">
          <div className="max-w-5xl mx-auto px-6 text-white">
            <p className="uppercase tracking-widest text-white/60 text-sm font-bold mb-3">Jackson, Mississippi</p>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 max-w-3xl">
              A real terminal. A real company.
            </h2>
            <p className="text-lg md:text-xl text-white/85 max-w-2xl">
              3-acre lot. 25,000 sq ft warehouse. Asset-based, veteran-owned, and built around the seat.
            </p>
          </div>
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
              I&apos;ve been in your seat.
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
            <a
              href="/apply"
              className="flex flex-col items-center justify-center bg-black text-white px-6 py-8 rounded-2xl border border-white/20 shadow-xl hover:bg-white hover:text-black hover:scale-105 transition-all duration-300"
            >
              <FileText aria-hidden className="w-8 h-8 mb-3" />
              <span className="text-lg font-bold">Quick Apply</span>
              <span className="text-sm opacity-80 mt-1">Driver application</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
