"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  Check,
  DollarSign,
  Percent,
  CalendarDays,
  Award,
  ShieldCheck,
  WalletCards,
  HeartPulse,
  House,
  Truck,
  PhoneCall,
  IdCard,
  BriefcaseBusiness,
  ShieldAlert,
  TestTubeDiagonal,
  PackageCheck,
} from "lucide-react";
import QuickApplyForm from "../components/QuickApplyForm";

const RECRUITING_PHONE_DISPLAY = "(601) 300-5529";
const RECRUITING_PHONE_TEL = "+16013005529";
const RECRUITING_EMAIL = "recruiting@forbeslogistix.com";

const OfferBullet = ({ icon: Icon, children }) => (
  <li className="flex items-start gap-3 text-base md:text-lg leading-relaxed">
    <Icon aria-hidden className="w-5 h-5 mt-1 shrink-0" />
    <span>{children}</span>
  </li>
);

const Requirement = ({ icon: Icon, children }) => (
  <li className="flex items-start gap-3 text-base md:text-lg leading-relaxed">
    <Icon aria-hidden className="w-5 h-5 mt-1 shrink-0" />
    <span>{children}</span>
  </li>
);

export default function CareersClient() {
  return (
    <div className="bg-white text-black min-h-screen overflow-hidden">
      {/* ---------- HERO ---------- */}
      <section className="relative w-full h-screen flex items-center justify-center">
        <Image
          src="/assets/photos/truck-loading.jpg"
          alt="Forbes Logistix Western Star tractor with open-deck trailer under covered loading area"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
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
            <a
              href="#quick-apply"
              className="bg-white text-black px-10 py-4 text-lg font-bold rounded-2xl hover:bg-black hover:text-white border border-white hover:scale-105 transition-all duration-300"
            >
              Apply Now
            </a>
            <a
              href={`tel:${RECRUITING_PHONE_TEL}`}
              className="inline-flex items-center justify-center gap-2 bg-transparent text-white border border-white/60 px-10 py-4 text-lg font-bold rounded-2xl hover:bg-white hover:text-black hover:scale-105 transition-all duration-300"
            >
              <Phone aria-hidden className="w-5 h-5" /> Call Recruiting
            </a>
          </motion.div>
        </div>
      </section>

      {/* ---------- QUICK APPLY ---------- */}
      <section id="quick-apply" className="bg-white py-20 px-4 scroll-mt-28">
        <div className="max-w-3xl mx-auto">
          <QuickApplyForm
            id="quick-apply-form"
            variant="dark"
            heading="Talk to recruiting"
            subhead="Three fields. We'll call you."
          />
        </div>
      </section>

      {/* ---------- COMPANY DRIVER OFFER ---------- */}
      <section id="company-drivers" className="bg-black text-white py-20 px-4 scroll-mt-28">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-10 items-start">
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
            >
              <p className="uppercase tracking-widest text-white/60 text-sm font-bold mb-3">For Company Drivers</p>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                The offer, in plain numbers.
              </h2>
              <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-10">
                No fine print. Here is what you earn and what you get.
              </p>

              <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
                <OfferBullet icon={Percent}><span className="font-bold">30% of line haul</span></OfferBullet>
                <OfferBullet icon={CalendarDays}>
                  Available for dispatch? You earn at least <span className="font-bold">$1,000/week</span>
                </OfferBullet>
                <OfferBullet icon={Award}><span className="font-bold">$3,000 sign-on bonus</span></OfferBullet>
                <OfferBullet icon={ShieldCheck}><span className="font-bold">$100 tarp pay</span></OfferBullet>
                <OfferBullet icon={WalletCards}>Weekly direct deposit</OfferBullet>
                <OfferBullet icon={HeartPulse}>Health insurance</OfferBullet>
                <OfferBullet icon={ShieldCheck}>Annual safety bonuses</OfferBullet>
                <OfferBullet icon={House}>Home weekends</OfferBullet>
                <OfferBullet icon={Truck}>Modern, well-maintained equipment</OfferBullet>
              </ul>
            </motion.div>
          </div>

          <div className="lg:col-span-2 relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <Image
              src="/assets/photos/truck-precast.jpg"
              alt="Forbes Logistix flatbed hauling precast concrete products at customer site"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
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
              <Requirement icon={IdCard}>Valid Class A CDL, at least 23 years old</Requirement>
              <Requirement icon={BriefcaseBusiness}>At least 1 year of verifiable OTR experience</Requirement>
              <Requirement icon={ShieldAlert}>Clean MVR &mdash; no major violations</Requirement>
              <Requirement icon={TestTubeDiagonal}>Pass DOT physical and drug screen</Requirement>
              <Requirement icon={HeartPulse}>Current DOT medical card</Requirement>
              <Requirement icon={PackageCheck}>Comfortable with tarping and load securement</Requirement>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* ---------- OWNER-OPERATORS ---------- */}
      <section id="owner-operators" className="bg-black text-white py-20 px-4 scroll-mt-28">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-10 items-center">
          <div className="lg:col-span-2 relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 shadow-2xl order-2 lg:order-1">
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
              {/* Buffalo brand mark, same h-32 size used on the home page.
                  This section has a black background so the white silhouette
                  asset reads as-is, no filter needed. */}
              <Image
                src="/assets/buffalo.png"
                alt=""
                aria-hidden
                width={256}
                height={256}
                className="h-32 w-auto -ml-4 mb-1 opacity-90"
              />
              <p className="uppercase tracking-widest text-white/60 text-sm font-bold mb-3">
                For Owner-Operators
              </p>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
                Run your truck. Run with the Buffalo.
              </h2>

              <p className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6">
                Keep <span className="underline decoration-4 decoration-white/80 underline-offset-4">90%</span> of total billed revenue.
              </p>

              <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-4 mb-8 text-lg md:text-xl text-white/85">
                <OfferBullet icon={Percent}>90% of total billed revenue</OfferBullet>
                <OfferBullet icon={CalendarDays}>Weekly settlements</OfferBullet>
                <OfferBullet icon={Truck}>Real open-deck freight</OfferBullet>
                <OfferBullet icon={PhoneCall}>Direct communication with dispatch</OfferBullet>
              </ul>

              <p className="text-base md:text-lg text-white/75 mb-8 max-w-2xl">
                Talk to recruiting about settlement details, equipment standards, and onboarding.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={`tel:${RECRUITING_PHONE_TEL}`}
                  className="inline-flex items-center justify-center gap-2 bg-white text-black border border-white px-8 py-4 text-lg font-semibold rounded-2xl hover:bg-black hover:text-white hover:scale-105 transition-all duration-300 shadow-xl"
                >
                  <Phone aria-hidden className="w-5 h-5" /> Talk to Recruiting
                </a>
                <a
                  href={`mailto:${RECRUITING_EMAIL}`}
                  className="inline-flex items-center justify-center gap-2 bg-transparent text-white border border-white/60 px-8 py-4 text-lg font-semibold rounded-2xl hover:bg-white hover:text-black hover:scale-105 transition-all duration-300"
                >
                  <Mail aria-hidden className="w-5 h-5" /> Email Recruiting
                </a>
              </div>
            </motion.div>
          </div>
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
              href="#quick-apply"
              className="flex flex-col items-center justify-center bg-black text-white px-6 py-8 rounded-2xl border border-white/20 shadow-xl hover:bg-white hover:text-black hover:scale-105 transition-all duration-300"
            >
              <Check aria-hidden className="w-8 h-8 mb-3" />
              <span className="text-lg font-bold">Apply Now</span>
              <span className="text-sm opacity-80 mt-1">Three-field callback form</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
