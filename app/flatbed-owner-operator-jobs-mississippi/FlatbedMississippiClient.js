"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Phone,
  Percent,
  CalendarDays,
  Truck,
  PhoneCall,
  MapPinned,
  IdCard,
  BriefcaseBusiness,
  Warehouse,
} from "lucide-react";
import { track } from "@vercel/analytics";
import QuickApplyForm from "../components/QuickApplyForm";

const RECRUITING_PHONE_DISPLAY = "(601) 300-5529";
const RECRUITING_PHONE_TEL = "+16013005529";

// State-targeted landing page for Mississippi flatbed owner-operators.
// Every claim here already exists on /careers, in the footer, or in the
// owner-approved fact list (90% split, weekly settlements, cost split,
// tractor-only or tractor+trailer, Southeast + Texas lanes (owner-confirmed
// 2026-09-04, Texas listed neutrally among the states), Jackson terminal
// facts, USDOT/MC, CDL-A + 1 year OTR, 4 PM CT callback promise).
// No dollar-figure earnings estimates for owner-operators: the 90% split
// is the only pay claim this page is allowed to make.
const Fact = ({ icon: Icon, children }) => (
  <li className="flex items-start gap-3 text-base md:text-lg leading-relaxed">
    <Icon aria-hidden className="w-5 h-5 mt-1 shrink-0" />
    <span>{children}</span>
  </li>
);

export default function FlatbedMississippiClient() {
  return (
    <div className="bg-white text-black">
      {/* ---------- HERO (type-led, black band) ---------- */}
      <section className="bg-black text-white py-24 md:py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Image
              src="/assets/buffalo.png"
              alt=""
              aria-hidden
              width={256}
              height={256}
              className="h-20 md:h-28 w-auto mx-auto mb-2 opacity-90"
            />
            <p className="uppercase tracking-widest text-white/80 text-sm font-bold mb-3">
              Jackson, MS &middot; Hiring Now
            </p>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
              Flatbed Owner-Operator Jobs in Mississippi
            </h1>
            <p className="text-lg md:text-2xl text-white/85 max-w-3xl mx-auto mb-8">
              Forbes Logistix contracts flatbed owner-operators in Mississippi and
              across the Southeast who keep 90% of total billed revenue. We are a
              veteran-owned carrier headquartered in Jackson, we settle every week, and
              the freight is real open-deck work across the Southeast and Texas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#quick-apply"
                className="bg-white text-black px-8 py-4 text-lg font-bold rounded-2xl border border-white hover:bg-black hover:text-white transition-all duration-300 hover:scale-105"
              >
                Apply Now
              </a>
              <a
                href={`tel:${RECRUITING_PHONE_TEL}`}
                onClick={() => track("call_tap", { placement: "ms_oo_hero" })}
                className="inline-flex items-center justify-center gap-2 bg-transparent text-white border border-white/50 px-8 py-4 text-lg font-semibold rounded-2xl hover:bg-white hover:text-black transition-all duration-300 hover:scale-105"
              >
                <Phone aria-hidden className="w-5 h-5" /> Call Recruiting
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------- THE SHORT VERSION ---------- */}
      <section className="py-16 px-4 border-b border-black/5">
        <div className="max-w-3xl mx-auto">
          <p className="uppercase tracking-widest text-gray-500 text-sm font-bold mb-3">
            The short version
          </p>
          <p className="text-lg md:text-xl text-gray-800 leading-relaxed">
            Owner-operators at Forbes Logistix keep 90% of total billed revenue, paid on
            weekly settlements. You run the truck and cover fuel, insurance, plates, and
            maintenance. We handle load sourcing, billing, dispatch, and settlements.
            Bring a tractor only, or a tractor and trailer. The freight is flatbed and
            open-deck, running the Southeast and Texas out of our Jackson, MS
            terminal. You need a valid Class A CDL and at least 1 year of verifiable OTR
            experience. To apply, call {RECRUITING_PHONE_DISPLAY} or use the quick-apply
            form on this page. Apply before 4 PM CT and we&apos;ll call you back today.
          </p>
        </div>
      </section>

      {/* ---------- THE DEAL ---------- */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <p className="uppercase tracking-widest text-gray-500 text-sm font-bold mb-3">
              The deal
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Keep 90% of total billed revenue.
            </h2>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mb-6">
              The split is simple: you keep 90% of what the load bills. The 10% pays
              for the work that keeps your truck earning: we source
              the loads, bill the customers, run dispatch, and cut your settlement every
              week. You never invoice anyone.
            </p>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mb-6">
              Weekly settlements mean exactly that: you settle every week. Billing the
              customer is our job, so you haul the load, we bill it, and your 90% comes
              through on the weekly settlement.
            </p>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mb-10">
              You will not find dollar-figure earnings estimates on this page. Your
              revenue depends on the loads you run, so the percentage is the number we
              stand behind.
            </p>

            <ul className="grid md:grid-cols-2 gap-x-10 gap-y-4 mb-10">
              <Fact icon={Percent}>90% of total billed revenue</Fact>
              <Fact icon={CalendarDays}>Weekly settlements</Fact>
              <Fact icon={Truck}>Real open-deck freight</Fact>
              <Fact icon={PhoneCall}>Direct communication with dispatch</Fact>
            </ul>

            {/* Same honest 90/10 framing as the careers page: answers
                "90% minus what?" before the phone call. */}
            <div className="grid sm:grid-cols-2 gap-6 max-w-3xl">
              <div className="bg-gray-50 border border-black/10 rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-2">You run the truck</h3>
                <p className="text-gray-700 leading-relaxed">
                  Your tractor, your business: fuel, insurance, plates, and maintenance
                  are yours. You keep 90% because you carry the iron.
                </p>
              </div>
              <div className="bg-gray-50 border border-black/10 rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-2">We keep it loaded</h3>
                <p className="text-gray-700 leading-relaxed">
                  Load sourcing, billing, dispatch, and weekly settlements are on us.
                  That&apos;s what the 10% buys: you drive, we handle the back office.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------- EQUIPMENT ---------- */}
      <section className="bg-black text-white py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <p className="uppercase tracking-widest text-white/60 text-sm font-bold mb-3">
              Equipment
            </p>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">
              Bring a tractor. The trailer is optional.
            </h2>
            <p className="text-lg md:text-xl text-white/85 max-w-3xl mb-4">
              We contract owner-operators two ways. Come on with just your tractor and
              pull our trailers, or bring your own tractor and trailer.
            </p>
            <p className="text-lg md:text-xl text-white/85 max-w-3xl">
              If you already run your own trailer, bring it. If you don&apos;t, that
              should not stop you: tractor-only owner-operators pull our trailers. Talk
              to recruiting about equipment standards and onboarding.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ---------- LANES ---------- */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <p className="uppercase tracking-widest text-gray-500 text-sm font-bold mb-3">
              Lanes
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
              Where you&apos;ll run.
            </h2>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mb-10">
              We run flatbed and open-deck freight across Mississippi, Alabama, Georgia,
              Florida, Tennessee, the Carolinas, and Texas, with drivers based in the
              Southeast. Home base is our terminal at 3180 Utica Ave in Jackson,
              Mississippi: a 3-acre lot with a 25,000 sq ft warehouse.
            </p>
            <ul className="grid md:grid-cols-2 gap-x-10 gap-y-4">
              <Fact icon={MapPinned}>Southeast and Texas lanes out of Jackson</Fact>
              <Fact icon={Warehouse}>
                Jackson, MS terminal: 3-acre lot, 25,000 sq ft warehouse
              </Fact>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* ---------- WHO WE ARE ---------- */}
      <section className="bg-black text-white py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <p className="uppercase tracking-widest text-white/60 text-sm font-bold mb-3">
              Who we are
            </p>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">
              A carrier you can verify.
            </h2>
            <div className="space-y-4 text-lg md:text-xl text-white/85 max-w-3xl">
              <p>
                Forbes Logistix is a Marine Corps veteran-owned, driver-founded carrier
                headquartered in Jackson, Mississippi. Founder Chase Forbes drove OTR for
                8 years before starting the company.
              </p>
              <p>
                Look us up on the FMCSA carrier search before you call:{" "}
                <span className="font-bold text-white">USDOT 4361817</span>,{" "}
                <span className="font-bold text-white">MC 1706978</span>. The terminal is
                at 3180 Utica Ave, Jackson, MS 39209. The address is public, the
                authority numbers are public, and we would rather you check them than
                take our word for it.
              </p>
              <p className="font-semibold text-white">
                Run your truck. Run with the Buffalo.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------- REQUIREMENTS ---------- */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <p className="uppercase tracking-widest text-gray-500 text-sm font-bold mb-3">
              Requirements
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
              What we ask for.
            </h2>
            <ul className="grid md:grid-cols-2 gap-x-10 gap-y-4 mb-8">
              <Fact icon={IdCard}>Valid Class A CDL</Fact>
              <Fact icon={BriefcaseBusiness}>At least 1 year of verifiable OTR experience</Fact>
            </ul>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mb-6">
              If you hold the CDL and have the year of verifiable OTR experience, we
              want to hear from you.
            </p>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl">
              Talk to recruiting about equipment standards and onboarding. Looking for a
              W-2 seat instead? Our{" "}
              <Link href="/careers" className="underline underline-offset-2 font-semibold">
                company flatbed driver page
              </Link>{" "}
              has the full package in plain numbers.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ---------- HOW TO APPLY + QUICK APPLY ---------- */}
      <section id="quick-apply" className="bg-white py-20 px-4 scroll-mt-28 border-t border-black/5">
        <div className="max-w-3xl mx-auto">
          <p className="uppercase tracking-widest text-gray-500 text-sm font-bold mb-3 text-center">
            How to apply
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-center">
            Two ways to start.
          </h2>
          <p className="text-lg md:text-xl text-gray-700 mb-10 text-center">
            Call{" "}
            <a
              href={`tel:${RECRUITING_PHONE_TEL}`}
              onClick={() => track("call_tap", { placement: "ms_oo_apply" })}
              className="underline underline-offset-2 font-semibold"
            >
              {RECRUITING_PHONE_DISPLAY}
            </a>{" "}
            and ask for recruiting, or send the three-field form below: your name, your
            phone number, and your years of verifiable OTR experience. No login and no
            portal maze; the first step is a phone call. Apply before 4 PM CT and
            we&apos;ll call you back today.
          </p>
          <QuickApplyForm
            id="quick-apply-form"
            variant="dark"
            heading="Apply now"
            subhead="Three fields. We'll call you."
          />
        </div>
      </section>

      {/* ---------- FAQ (plain <details>/<summary>, same idiom as /careers;
           deliberately NO FAQPage schema) ---------- */}
      <section className="bg-white text-black pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-8 text-center">
            Quick questions
          </h2>
          <ul className="space-y-3">
            <li>
              <details className="group rounded-xl border border-black/10 bg-gray-50 open:bg-white open:shadow-md transition-shadow">
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4 px-6 py-5 font-semibold text-lg select-none">
                  How much do flatbed owner-operators keep at Forbes Logistix?
                  <span aria-hidden className="text-2xl leading-none transition-transform duration-200 group-open:rotate-45">+</span>
                </summary>
                <div className="px-6 pb-5 text-gray-700 leading-relaxed">
                  Owner-operators keep 90% of total billed revenue, paid on weekly
                  settlements. You cover the truck&apos;s costs: fuel, insurance, plates,
                  and maintenance. We don&apos;t publish dollar estimates because your
                  revenue depends on the loads you run.
                </div>
              </details>
            </li>
            <li>
              <details className="group rounded-xl border border-black/10 bg-gray-50 open:bg-white open:shadow-md transition-shadow">
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4 px-6 py-5 font-semibold text-lg select-none">
                  Do I need my own trailer?
                  <span aria-hidden className="text-2xl leading-none transition-transform duration-200 group-open:rotate-45">+</span>
                </summary>
                <div className="px-6 pb-5 text-gray-700 leading-relaxed">
                  No. Come on with just your tractor pulling our trailers, or bring your
                  own tractor and trailer.
                </div>
              </details>
            </li>
            <li>
              <details className="group rounded-xl border border-black/10 bg-gray-50 open:bg-white open:shadow-md transition-shadow">
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4 px-6 py-5 font-semibold text-lg select-none">
                  Do I have to live in Mississippi?
                  <span aria-hidden className="text-2xl leading-none transition-transform duration-200 group-open:rotate-45">+</span>
                </summary>
                <div className="px-6 pb-5 text-gray-700 leading-relaxed">
                  No. We contract flatbed owner-operators across the Southeast. Our
                  headquarters and terminal are in Jackson, Mississippi, and the
                  freight runs the Southeast and Texas.
                </div>
              </details>
            </li>
            <li>
              <details className="group rounded-xl border border-black/10 bg-gray-50 open:bg-white open:shadow-md transition-shadow">
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4 px-6 py-5 font-semibold text-lg select-none">
                  Where does Forbes Logistix run?
                  <span aria-hidden className="text-2xl leading-none transition-transform duration-200 group-open:rotate-45">+</span>
                </summary>
                <div className="px-6 pb-5 text-gray-700 leading-relaxed">
                  Flatbed and open-deck freight across Mississippi, Alabama, Georgia,
                  Florida, Tennessee, the Carolinas, and Texas, with drivers based in
                  the Southeast. Our terminal is in Jackson, Mississippi.
                </div>
              </details>
            </li>
            <li>
              <details className="group rounded-xl border border-black/10 bg-gray-50 open:bg-white open:shadow-md transition-shadow">
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4 px-6 py-5 font-semibold text-lg select-none">
                  Is Forbes Logistix a real carrier?
                  <span aria-hidden className="text-2xl leading-none transition-transform duration-200 group-open:rotate-45">+</span>
                </summary>
                <div className="px-6 pb-5 text-gray-700 leading-relaxed">
                  Yes. We operate under USDOT 4361817 and MC 1706978, out of our terminal
                  at 3180 Utica Ave, Jackson, MS 39209. The company is veteran-owned and
                  driver-founded.
                </div>
              </details>
            </li>
            <li>
              <details className="group rounded-xl border border-black/10 bg-gray-50 open:bg-white open:shadow-md transition-shadow">
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4 px-6 py-5 font-semibold text-lg select-none">
                  How do I apply?
                  <span aria-hidden className="text-2xl leading-none transition-transform duration-200 group-open:rotate-45">+</span>
                </summary>
                <div className="px-6 pb-5 text-gray-700 leading-relaxed">
                  Call{" "}
                  <a href={`tel:${RECRUITING_PHONE_TEL}`} className="underline underline-offset-2 font-semibold">
                    {RECRUITING_PHONE_DISPLAY}
                  </a>{" "}
                  or send the quick-apply form on this page. Apply before 4 PM CT and
                  we&apos;ll call you back today.
                </div>
              </details>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
