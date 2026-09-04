"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Phone, Truck, CalendarDays, Handshake, MapPinned, IdCard } from "lucide-react";
import { track } from "@vercel/analytics";
import QuickApplyForm from "../components/QuickApplyForm";

const RECRUITING_PHONE_DISPLAY = "(601) 300-5529";
const RECRUITING_PHONE_TEL = "+16013005529";

// Deliberately LIGHT page: the division is new, comp is being finalized,
// and this page is a market test. Every claim here is owner-confirmed
// (2026-07-13). No pay figures, no home-time or equipment claims until the
// owner provides them — the honesty IS the pitch, matching the site's
// "straight numbers" voice. Type-led hero: all photo assets are flatbed.
const Fact = ({ icon: Icon, children }) => (
  <li className="flex items-start gap-3 text-base md:text-lg leading-relaxed">
    <Icon aria-hidden className="w-5 h-5 mt-1 shrink-0" />
    <span>{children}</span>
  </li>
);

export default function ReeferClient() {
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
              New Division &middot; Now Hiring
            </p>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
              Reefer out of Dallas.
            </h1>
            <p className="text-lg md:text-2xl text-white/85 max-w-2xl mx-auto mb-8">
              Dedicated outbound lanes. W-2 company driver seats. Hiring now.
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
                onClick={() => track("call_tap", { placement: "reefer_hero" })}
                className="inline-flex items-center justify-center gap-2 bg-transparent text-white border border-white/50 px-8 py-4 text-lg font-semibold rounded-2xl hover:bg-white hover:text-black transition-all duration-300 hover:scale-105"
              >
                <Phone aria-hidden className="w-5 h-5" /> Call Recruiting
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------- WHAT WE KNOW TODAY ---------- */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <p className="uppercase tracking-widest text-gray-500 text-sm font-bold mb-3">
              Straight answers
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              What we can tell you today.
            </h2>
            <p className="text-lg md:text-xl text-gray-700 max-w-2xl mb-10">
              This division is brand new. Here is everything we can say for certain,
              and nothing we can&apos;t.
            </p>

            <ul className="grid md:grid-cols-2 gap-x-10 gap-y-4">
              <Fact icon={IdCard}>W-2 company driver seats (valid Class A CDL required)</Fact>
              <Fact icon={Truck}>Dedicated reefer freight</Fact>
              <Fact icon={MapPinned}>Dallas outbound lanes</Fact>
              <Fact icon={CalendarDays}>
                Seats are <span className="font-bold">open now</span>
              </Fact>
              <Fact icon={Handshake}>
                Hiring now: apply today and we&apos;ll talk this week
              </Fact>
              <Fact icon={Phone}>Direct line to the owner, no recruiting maze</Fact>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* ---------- THE PAY QUESTION, HEAD-ON ---------- */}
      <section className="bg-black text-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">
              Where&apos;s the pay number?
            </h2>
            <div className="space-y-4 text-lg md:text-xl text-white/85 max-w-3xl">
              <p>
                Being finalized right now. We publish exact pay for our{" "}
                <Link href="/careers" className="underline underline-offset-4 hover:text-white">
                  flatbed fleet
                </Link>
                , and we&apos;ll do the same here the day the reefer package is set.
              </p>
              <p className="font-semibold text-white">
                Until then: call. We&apos;re hiring now, and we&apos;ll talk real numbers for
                your situation.
              </p>
            </div>
            <a
              href={`tel:${RECRUITING_PHONE_TEL}`}
              onClick={() => track("call_tap", { placement: "reefer_pay" })}
              className="mt-8 inline-flex items-center justify-center gap-2 bg-white text-black px-8 py-4 text-lg font-bold rounded-2xl hover:scale-105 transition-all duration-300"
            >
              <Phone aria-hidden className="w-5 h-5" /> Talk Numbers &middot; {RECRUITING_PHONE_DISPLAY}
            </a>
          </motion.div>
        </div>
      </section>

      {/* ---------- QUICK APPLY ---------- */}
      <section id="quick-apply" className="py-20 px-4 scroll-mt-28 bg-white">
        <div className="max-w-3xl mx-auto">
          <QuickApplyForm
            id="quick-apply-form"
            variant="dark"
            position="reefer-dallas"
            heading="Apply now"
            subhead="Three fields. We'll call you."
          />
        </div>
      </section>

      {/* ---------- MINI FAQ ---------- */}
      <section className="bg-white text-black pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-8 text-center">
            Quick questions
          </h2>
          <ul className="space-y-3">
            <li>
              <details className="group rounded-xl border border-black/10 bg-gray-50 open:bg-white open:shadow-md transition-shadow">
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4 px-6 py-5 font-semibold text-lg select-none">
                  Is this the same as your flatbed jobs?
                  <span aria-hidden className="text-2xl leading-none transition-transform duration-200 group-open:rotate-45">+</span>
                </summary>
                <div className="px-6 pb-5 text-gray-700 leading-relaxed">
                  No. Our flatbed fleet runs the Southeast and Texas out of Jackson, MS.
                  This is a new, separate reefer division running dedicated outbound lanes from
                  Dallas, TX.
                </div>
              </details>
            </li>
            <li>
              <details className="group rounded-xl border border-black/10 bg-gray-50 open:bg-white open:shadow-md transition-shadow">
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4 px-6 py-5 font-semibold text-lg select-none">
                  What does it pay?
                  <span aria-hidden className="text-2xl leading-none transition-transform duration-200 group-open:rotate-45">+</span>
                </summary>
                <div className="px-6 pb-5 text-gray-700 leading-relaxed">
                  The package is being finalized now. Call{" "}
                  <a href={`tel:${RECRUITING_PHONE_TEL}`} className="underline underline-offset-2 font-semibold">
                    {RECRUITING_PHONE_DISPLAY}
                  </a>{" "}
                  and we&apos;ll talk real numbers for your situation.
                </div>
              </details>
            </li>
            <li>
              <details className="group rounded-xl border border-black/10 bg-gray-50 open:bg-white open:shadow-md transition-shadow">
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4 px-6 py-5 font-semibold text-lg select-none">
                  When do seats actually start?
                  <span aria-hidden className="text-2xl leading-none transition-transform duration-200 group-open:rotate-45">+</span>
                </summary>
                <div className="px-6 pb-5 text-gray-700 leading-relaxed">
                  Right away. We&apos;re hiring now. If you apply today, we&apos;re
                  talking this week.
                </div>
              </details>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
