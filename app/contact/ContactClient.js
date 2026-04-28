"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Mail, Phone, FileText } from "lucide-react";

const BACKEND_URL = "https://forbes-logistix-backend.vercel.app";
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const RECRUITING_PHONE_DISPLAY = "(601) 300-5529";
const RECRUITING_PHONE_TEL = "+16013005529";
const RECRUITING_EMAIL = "recruiting@forbeslogistix.com";

export default function ContactClient() {
  const [f, setF] = useState({ name: "", email: "", message: "" });
  const [s, setS] = useState("idle");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [contactConsent, setContactConsent] = useState(false);
  const [acceptError, setAcceptError] = useState("");
  const widgetRef = useRef(null);
  const widgetIdRef = useRef(null);

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;

    const SCRIPT_ID = "cf-turnstile-script";

    // Pass function references directly. Earlier we used string-named window
    // callbacks; under React 18 StrictMode the double-mount cleanup deleted
    // those names mid-flight and Turnstile threw "c.call is not a function"
    // when its internal lookup returned undefined. Direct refs sidestep that.
    const renderWidget = () => {
      if (!window.turnstile || !widgetRef.current) return;
      try {
        widgetIdRef.current = window.turnstile.render(widgetRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          callback: (token) => setTurnstileToken(token),
          "expired-callback": () => setTurnstileToken(""),
          "error-callback": () => setTurnstileToken(""),
        });
      } catch { /* widget may already be rendered */ }
    };

    if (document.getElementById(SCRIPT_ID)) {
      renderWidget();
    } else {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.onload = renderWidget;
      document.body.appendChild(script);
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try { window.turnstile.remove(widgetIdRef.current); } catch { /* ignore */ }
      }
    };
  }, []);

  const resetTurnstile = () => {
    setTurnstileToken("");
    if (widgetIdRef.current && window.turnstile) {
      try { window.turnstile.reset(widgetIdRef.current); } catch { /* ignore */ }
    }
  };

  const onC = (e) => setF({ ...f, [e.target.name]: e.target.value });

  const onS = async (e) => {
    e.preventDefault();
    setAcceptError("");
    if (!acceptTerms) {
      setAcceptError("Please confirm you have read the Terms of Use and Privacy Policy.");
      return;
    }
    setS("sending");
    try {
      const body = {
        ...f,
        contactConsent,
        ...(TURNSTILE_SITE_KEY ? { turnstileToken } : {}),
      };
      const r = await fetch(`${BACKEND_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!r.ok) throw new Error("send failed");
      setS("ok");
      setF({ name: "", email: "", message: "" });
      setAcceptTerms(false);
      setContactConsent(false);
      resetTurnstile();
    } catch {
      setS("err");
      resetTurnstile();
    }
  };

  const submitDisabled = s === "sending" || (!!TURNSTILE_SITE_KEY && !turnstileToken);

  return (
    <div className="bg-white text-black">
      {/* ---------- HERO: RECRUITING-FIRST ---------- */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/assets/photos/terminal.jpg"
          alt="Forbes Logistix terminal in Jackson, Mississippi with company tractor parked outside"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/65" />

        <div className="relative z-10 max-w-5xl w-full px-6 py-20 text-white">
          <div className="text-center mb-10">
            <p className="uppercase tracking-widest text-white/60 text-sm font-bold mb-3">Recruiting</p>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Talk to the people running the trucks.
            </h1>
            <p className="text-lg md:text-xl text-white/85 max-w-2xl mx-auto">
              Company drivers and owner-operators &mdash; reach Forbes Logistix recruiting directly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
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
              className="flex flex-col items-center justify-center bg-white text-black px-6 py-8 rounded-2xl border border-white shadow-xl hover:bg-black hover:text-white hover:scale-105 transition-all duration-300"
            >
              <FileText aria-hidden className="w-8 h-8 mb-3" />
              <span className="text-lg font-bold">Apply Now</span>
              <span className="text-sm opacity-80 mt-1">Driver application</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- TERMINAL DETAILS ---------- */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-black text-white rounded-2xl shadow-xl p-10"
          >
            <h2 className="text-2xl font-semibold mb-6">Jackson Terminal</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin aria-hidden className="w-5 h-5 mt-1 shrink-0" />
                <div>
                  <p className="text-white/90">3180 Utica Ave</p>
                  <p className="text-white/90">Jackson, MS 39209</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone aria-hidden className="w-5 h-5 mt-1 shrink-0" />
                <a href={`tel:${RECRUITING_PHONE_TEL}`} className="text-white/90 hover:text-white underline-offset-2 hover:underline">
                  {RECRUITING_PHONE_DISPLAY}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail aria-hidden className="w-5 h-5 mt-1 shrink-0" />
                <a href={`mailto:${RECRUITING_EMAIL}`} className="text-white/90 hover:text-white underline-offset-2 hover:underline break-all">
                  {RECRUITING_EMAIL}
                </a>
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* ---------- GENERAL CONTACT FORM (demoted) ---------- */}
      <section className="bg-gray-50 py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <p className="uppercase tracking-widest text-gray-500 text-sm font-bold mb-3 text-center">General Contact</p>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">Not a driver inquiry?</h2>
          <p className="text-center text-gray-600 mb-10">
            Use this form for shipper questions or general business. Drivers should use the recruiting contacts above.
          </p>
          <form onSubmit={onS} className="space-y-6 text-left bg-white border border-black/10 shadow-xl rounded-2xl p-10" noValidate>
            <div>
              <label className="block font-medium mb-1 text-gray-800">Your Name</label>
              <input
                name="name"
                type="text"
                value={f.name}
                onChange={onC}
                required
                className="w-full border border-gray-300 rounded-lg p-3 bg-white"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block font-medium mb-1 text-gray-800">Email Address</label>
              <input
                name="email"
                type="email"
                value={f.email}
                onChange={onC}
                required
                className="w-full border border-gray-300 rounded-lg p-3 bg-white"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block font-medium mb-1 text-gray-800">Message</label>
              <textarea
                name="message"
                rows="5"
                value={f.message}
                onChange={onC}
                required
                className="w-full border border-gray-300 rounded-lg p-3 bg-white"
                placeholder="Type your message..."
              />
            </div>
            {TURNSTILE_SITE_KEY && (
              <div className="flex justify-center">
                <div ref={widgetRef} />
              </div>
            )}

            {/* Optional contact-response communications consent. Unchecked by default. */}
            <label className="flex items-start gap-3 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={contactConsent}
                onChange={(e) => setContactConsent(e.target.checked)}
                className="mt-1 shrink-0 h-4 w-4 accent-black"
              />
              <span>
                You may contact me by email or phone to respond to this inquiry. Message and data rates
                may apply if I provide a mobile number. Reply <span className="font-semibold">STOP</span>{" "}
                to opt out of texts. Consent is not required to receive a response.
              </span>
            </label>

            {/* Required acknowledgment of Terms / Privacy. */}
            <div>
              <label className="flex items-start gap-3 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1 shrink-0 h-4 w-4 accent-black"
                  required
                />
                <span>
                  I have read the{" "}
                  <Link href="/terms" className="underline">Terms of Use</Link> and the{" "}
                  <Link href="/privacy" className="underline">Privacy Policy</Link>.
                </span>
              </label>
              {acceptError && <p className="mt-1 text-sm text-red-600 font-semibold">{acceptError}</p>}
            </div>

            {s === "ok" && (
              <p className="text-green-700 font-medium text-center">Thanks &mdash; your message was sent.</p>
            )}
            {s === "err" && (
              <p className="text-red-600 font-medium text-center">
                Something went wrong. Please call {RECRUITING_PHONE_DISPLAY}.
              </p>
            )}
            <div className="text-center mt-10">
              <button
                type="submit"
                disabled={submitDisabled}
                className="bg-black text-white px-12 py-4 text-lg rounded-xl border border-white font-bold disabled:opacity-60"
              >
                {s === "sending" ? "Sending..." : "Submit"}
              </button>
            </div>
          </form>
        </motion.div>
      </section>
    </div>
  );
}
