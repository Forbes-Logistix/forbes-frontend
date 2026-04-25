"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FiMapPin, FiMail, FiPhone, FiClock } from "react-icons/fi";

const BACKEND_URL = "https://forbes-logistix-backend.vercel.app";
// Optional: if this env var is unset, the Turnstile widget is not rendered
// and the form submits without a token. Backend skips verification when
// TURNSTILE_SECRET is unset, so the two sides roll out together.
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export default function ContactClient() {
  const [f, setF] = useState({ name: "", email: "", message: "" });
  const [s, setS] = useState("idle");
  const [turnstileToken, setTurnstileToken] = useState("");
  const widgetRef = useRef(null);
  const widgetIdRef = useRef(null);

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;

    const SCRIPT_ID = "cf-turnstile-script";
    const CALLBACK_NAME = "onTurnstileSuccess";
    const EXPIRED_NAME = "onTurnstileExpired";
    const ERROR_NAME = "onTurnstileError";

    window[CALLBACK_NAME] = (token) => setTurnstileToken(token);
    window[EXPIRED_NAME] = () => setTurnstileToken("");
    window[ERROR_NAME] = () => setTurnstileToken("");

    const renderWidget = () => {
      if (!window.turnstile || !widgetRef.current) return;
      try {
        widgetIdRef.current = window.turnstile.render(widgetRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          callback: CALLBACK_NAME,
          "expired-callback": EXPIRED_NAME,
          "error-callback": ERROR_NAME,
        });
      } catch {
        // widget may already be rendered (e.g. React StrictMode) — ignore
      }
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
      delete window[CALLBACK_NAME];
      delete window[EXPIRED_NAME];
      delete window[ERROR_NAME];
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
    setS("sending");
    try {
      const body = TURNSTILE_SITE_KEY ? { ...f, turnstileToken } : f;
      const r = await fetch(`${BACKEND_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!r.ok) throw new Error("send failed");
      setS("ok");
      setF({ name: "", email: "", message: "" });
      resetTurnstile();
    } catch {
      setS("err");
      resetTurnstile();
    }
  };

  const submitDisabled = s === "sending" || (!!TURNSTILE_SITE_KEY && !turnstileToken);

  return (
    <>
      <section
        className="relative min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-6"
        style={{ backgroundImage: `url(/assets/contactBg.jpg)` }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 grid md:grid-cols-2 gap-10 max-w-5xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/20 border border-white/20 backdrop-blur-sm text-white rounded-2xl shadow-xl p-10"
          >
            <h1 className="text-2xl font-semibold mb-6 text-center">Head Office</h1>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <FiMapPin aria-hidden className="mt-1 shrink-0" />
                <div>
                  <p className="text-white/90">3180 Utica Ave</p>
                  <p className="text-white/90">Jackson, MS 39209</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <FiMail aria-hidden className="mt-1 shrink-0" />
                <a href="mailto:contact@forbeslogistix.com" className="text-white/90 hover:text-white underline-offset-2 hover:underline">
                  contact@forbeslogistix.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <FiPhone aria-hidden className="mt-1 shrink-0" />
                <a href="tel:+16013005529" className="text-white/90 hover:text-white underline-offset-2 hover:underline">
                  (601) 300-5529
                </a>
              </li>
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/20 border border-white/20 backdrop-blur-sm text-white rounded-2xl shadow-xl p-10"
          >
            <h2 className="text-2xl font-semibold mb-6 text-center">Operating Hours</h2>
            <div className="flex items-start gap-3 justify-center">
              <FiClock aria-hidden className="mt-1 shrink-0" />
              <p className="text-white/90 leading-relaxed">
                Open 24 hours a day,<br />7 days a week,<br />365 days a year.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-white py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto bg-white/70 backdrop-blur-md border border-black/10 shadow-xl rounded-2xl p-10"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Send Us a Message</h2>
          <form onSubmit={onS} className="space-y-6 text-left" noValidate>
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
            {s === "ok" && (
              <p className="text-green-700 font-medium text-center">Thanks — your message was sent.</p>
            )}
            {s === "err" && (
              <p className="text-red-600 font-medium text-center">Something went wrong. Please call (601) 300-5529.</p>
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
    </>
  );
}
