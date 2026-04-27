"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Phone } from "lucide-react";

const BACKEND_URL = "https://forbes-logistix-backend.vercel.app";
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const RECRUITING_PHONE_DISPLAY = "(601) 300-5529";
const RECRUITING_PHONE_TEL = "+16013005529";

// US phone validator: 10 digits, or 11 starting with 1.
function isValidUsPhone(raw) {
  const digits = String(raw).replace(/\D/g, "");
  if (digits.length === 10) return true;
  if (digits.length === 11 && digits.startsWith("1")) return true;
  return false;
}

export default function QuickApplyForm({
  variant = "light", // "light" -> white card on dark; "dark" -> black card on light
  heading = "Talk to recruiting",
  subhead = "Three fields. We'll call you.",
  className = "",
  id,
}) {
  const [form, setForm] = useState({ name: "", phone: "", years: "" });
  const [honeypot, setHoneypot] = useState(""); // bots will fill this
  const [applicantCert, setApplicantCert] = useState(false);
  const [smsConsent, setSmsConsent] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | sending | ok | err
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [turnstileToken, setTurnstileToken] = useState("");
  const widgetRef = useRef(null);
  const widgetIdRef = useRef(null);

  const isLight = variant === "light";

  // Cloudflare Turnstile — render only when a site key is configured.
  // Skipped entirely otherwise so the form keeps working before the Cloudflare
  // site is provisioned. Pass function references directly to render() rather
  // than going through window-named callbacks: under React 18 StrictMode the
  // double-mount cleanup deletes those names mid-flight and Turnstile throws
  // "c.call is not a function" when its internal lookup returns undefined.
  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;

    const SCRIPT_ID = "cf-turnstile-script";

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

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Required";
    if (!form.phone.trim()) {
      errs.phone = "Required";
    } else if (!isValidUsPhone(form.phone)) {
      errs.phone = "Enter a valid US phone number";
    }
    const yearsNum = Number(form.years);
    if (form.years === "" || form.years === null) {
      errs.years = "Required";
    } else if (!Number.isFinite(yearsNum) || yearsNum < 0 || yearsNum > 60) {
      errs.years = "Enter 0–60";
    }
    if (!applicantCert) {
      errs.applicantCert = "Please confirm to continue";
    }
    return errs;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    const errs = validate();
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setStatus("sending");
    try {
      const r = await fetch(`${BACKEND_URL}/api/lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          years: Number(form.years),
          applicantCert,
          smsConsent,
          honeypot,
          ...(TURNSTILE_SITE_KEY ? { turnstileToken } : {}),
        }),
      });
      if (!r.ok) {
        let serverMsg = "";
        try { serverMsg = (await r.json()).message; } catch { /* ignore */ }
        throw new Error(serverMsg || "Submission failed.");
      }
      setStatus("ok");
      setForm({ name: "", phone: "", years: "" });
      setApplicantCert(false);
      setSmsConsent(false);
      setFieldErrors({});
      resetTurnstile();
    } catch (err) {
      setStatus("err");
      setErrorMsg(err.message || "Submission failed. Please try again.");
      resetTurnstile();
    }
  };

  // Tailwind tokens by variant.
  const card = isLight
    ? "bg-white text-black border-black/10"
    : "bg-black text-white border-white/15";
  const inputBase = isLight
    ? "w-full border border-gray-300 rounded-lg p-3 bg-white text-black focus:outline-none focus:ring-2 focus:ring-black/30"
    : "w-full border border-white/20 rounded-lg p-3 bg-black/40 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40";
  const labelTone = isLight ? "text-gray-800" : "text-white/85";
  const helpTone = isLight ? "text-gray-600" : "text-white/70";
  const linkTone = isLight ? "underline underline-offset-2 hover:opacity-80" : "underline underline-offset-2 hover:opacity-80";
  const errorTone = "text-red-500";
  const submitBtn = isLight
    ? "bg-black text-white hover:bg-white hover:text-black border border-black"
    : "bg-white text-black hover:bg-black hover:text-white border border-white";

  if (status === "ok") {
    return (
      <div className={`${card} border rounded-2xl shadow-xl p-8 md:p-10 ${className}`} id={id}>
        <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-3">Thanks &mdash; we got it.</h3>
        <p className={`text-base md:text-lg leading-relaxed ${labelTone}`}>
          Recruiting will call you shortly. If it&apos;s urgent, call{" "}
          <a href={`tel:${RECRUITING_PHONE_TEL}`} className="font-bold underline underline-offset-4">
            {RECRUITING_PHONE_DISPLAY}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div className={`${card} border rounded-2xl shadow-xl p-8 md:p-10 ${className}`} id={id}>
      {(heading || subhead) && (
        <div className="mb-6">
          {heading && (
            <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">{heading}</h3>
          )}
          {subhead && <p className={`mt-2 text-base md:text-lg ${labelTone}`}>{subhead}</p>}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        {/* Honeypot — visually hidden, autocomplete off. Bots fill anything they see. */}
        <div aria-hidden className="absolute left-[-9999px] top-auto w-px h-px overflow-hidden">
          <label htmlFor="qa-website">Website</label>
          <input
            id="qa-website"
            name="website"
            type="text"
            tabIndex="-1"
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="qa-name" className={`block font-medium mb-1 ${labelTone}`}>
            Full name
          </label>
          <input
            id="qa-name"
            name="name"
            type="text"
            value={form.name}
            onChange={onChange}
            autoComplete="name"
            required
            maxLength={100}
            className={inputBase}
            placeholder="Jane Driver"
          />
          {fieldErrors.name && <p className={`mt-1 text-sm ${errorTone}`}>{fieldErrors.name}</p>}
        </div>

        <div>
          <label htmlFor="qa-phone" className={`block font-medium mb-1 ${labelTone}`}>
            Phone number
          </label>
          <input
            id="qa-phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={onChange}
            autoComplete="tel"
            inputMode="tel"
            required
            maxLength={32}
            className={inputBase}
            placeholder="(601) 555-1234"
          />
          {fieldErrors.phone && <p className={`mt-1 text-sm ${errorTone}`}>{fieldErrors.phone}</p>}

          {/* Communications consent — recruiting variant. Conspicuous, near phone field. Unchecked by default. */}
          <label className={`mt-3 flex items-start gap-3 text-sm ${labelTone} cursor-pointer`}>
            <input
              type="checkbox"
              checked={smsConsent}
              onChange={(e) => setSmsConsent(e.target.checked)}
              className="mt-1 shrink-0 h-4 w-4 accent-black"
            />
            <span>
              I agree to receive recruiting-related phone calls and text messages from Forbes Logistix at the
              number above, including for follow-up, interview scheduling, application status, and
              onboarding-related communications. Message frequency may vary. Message and data rates may
              apply. Reply <span className="font-semibold">STOP</span> to opt out of texts at any time.
              Consent is not a condition of submitting this form or of being considered for employment.
            </span>
          </label>
        </div>

        <div>
          <label htmlFor="qa-years" className={`block font-medium mb-1 ${labelTone}`}>
            Years of verifiable OTR experience
          </label>
          <input
            id="qa-years"
            name="years"
            type="number"
            value={form.years}
            onChange={onChange}
            inputMode="numeric"
            min={0}
            max={60}
            step={1}
            required
            className={inputBase}
            placeholder="e.g. 5"
          />
          {fieldErrors.years && <p className={`mt-1 text-sm ${errorTone}`}>{fieldErrors.years}</p>}
        </div>

        {TURNSTILE_SITE_KEY && (
          <div className="flex justify-center">
            <div ref={widgetRef} />
          </div>
        )}

        {/* Applicant certification + Terms / Privacy acknowledgment — required. */}
        <div className="pt-2">
          <label className={`flex items-start gap-3 text-sm ${labelTone} cursor-pointer`}>
            <input
              type="checkbox"
              checked={applicantCert}
              onChange={(e) => setApplicantCert(e.target.checked)}
              className="mt-1 shrink-0 h-4 w-4 accent-black"
              required
            />
            <span>
              I certify the information above is true and complete to the best of my knowledge. I understand
              that false statements or omissions may disqualify me from consideration or lead to later
              termination if hired, subject to applicable law. I understand that submitting this form does
              not guarantee employment and that nothing on this site creates a contract of employment. I
              have read the{" "}
              <Link href="/terms" className={linkTone}>Terms of Use</Link> and the{" "}
              <Link href="/privacy" className={linkTone}>Privacy Policy</Link>.
            </span>
          </label>
          {fieldErrors.applicantCert && <p className={`mt-1 text-sm ${errorTone}`}>{fieldErrors.applicantCert}</p>}
        </div>

        {status === "err" && (
          <p className={`text-sm font-semibold ${errorTone}`}>
            {errorMsg || "Submission failed. Please try again."} Or call{" "}
            <a href={`tel:${RECRUITING_PHONE_TEL}`} className="underline underline-offset-4">
              {RECRUITING_PHONE_DISPLAY}
            </a>
            .
          </p>
        )}

        <div>
          <button
            type="submit"
            disabled={status === "sending" || (!!TURNSTILE_SITE_KEY && !turnstileToken)}
            className={`inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold rounded-2xl shadow transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed ${submitBtn}`}
          >
            <Phone aria-hidden className="w-5 h-5" />
            {status === "sending" ? "Sending..." : "Get a Callback"}
          </button>
          <p className={`mt-3 text-sm ${helpTone}`}>We&apos;ll call you back within one business day.</p>
        </div>
      </form>
    </div>
  );
}
