"use client";

import { useState, useEffect, useRef } from "react";
import { Phone, Plus, Trash2, ShieldCheck } from "lucide-react";
import { track } from "@vercel/analytics";
import useTurnstile from "../lib/useTurnstile";

const BACKEND_URL = "https://forbes-logistix-backend.vercel.app";
const RECRUITING_PHONE_DISPLAY = "(601) 300-5529";
const RECRUITING_PHONE_TEL = "+16013005529";

// Bump when the draft shape changes so stale localStorage drafts are discarded.
const DRAFT_KEY = "fl-dot-application-draft-v2";

const POSITIONS = [
  { value: "flatbed-southeast", label: "Company Flatbed Driver — Southeast" },
  { value: "reefer-dallas", label: "Company Reefer Driver — Dedicated Dallas Outbound" },
];

const EQUIPMENT_TYPES = [
  "Reefer (tractor-trailer)",
  "Flatbed / open-deck",
  "Dry van",
  "Tanker",
  "Straight truck",
  "Other",
];

const US_PHONE = (raw) => {
  const d = String(raw ?? "").replace(/\D/g, "");
  return d.length === 10 || (d.length === 11 && d.startsWith("1"));
};
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MONTH_RE = /^\d{4}-\d{2}$/;

const EMPTY = {
  position: "",
  personal: {
    fullName: "",
    phone: "",
    email: "",
    dob: "",
    currentAddress: { street: "", city: "", state: "", zip: "", sinceYear: "" },
    previousAddresses: [],
  },
  license: {
    state: "",
    number: "",
    class: "A",
    expiration: "",
    endorsements: "",
    everDeniedRevokedSuspended: false,
    deniedExplanation: "",
  },
  additionalLicenses: [],
  experience: [{ equipmentType: "", years: "", approxMiles: "" }],
  accidents: [],
  violations: [],
  employment: [
    {
      employer: "",
      street: "",
      phone: "",
      cityState: "",
      position: "",
      from: "",
      to: "",
      current: false,
      reasonForLeaving: "",
      fmcsrSubject: true,
      safetySensitive: true,
    },
  ],
  gapsExplanation: "",
  certification: { signature: "", esignConsent: false },
};

const STEPS = [
  "Position & About You",
  "Your CDL",
  "Driving Experience",
  "Accidents & Violations",
  "Employment History",
  "Review & Sign",
];

const inputCls =
  "w-full border border-gray-300 rounded-lg p-3 bg-white text-black focus:outline-none focus:ring-2 focus:ring-black/30";
const labelCls = "block font-medium mb-1 text-gray-800";
const errCls = "mt-1 text-sm text-red-600";

function Field({ id, label, error, children, hint }) {
  return (
    <div>
      <label htmlFor={id} className={labelCls}>
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-sm text-gray-500">{hint}</p>}
      {error && (
        <p id={`${id}-error`} className={errCls}>
          {error}
        </p>
      )}
    </div>
  );
}

function TextInput({ id, value, onChange, error, type = "text", ...rest }) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? `${id}-error` : undefined}
      className={inputCls}
      {...rest}
    />
  );
}

function RemoveButton({ onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-700 py-2 hover:underline underline-offset-2"
    >
      <Trash2 aria-hidden className="w-4 h-4" /> {label}
    </button>
  );
}

function AddButton({ onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 border border-black rounded-xl px-5 py-3 font-semibold hover:bg-black hover:text-white transition-colors"
    >
      <Plus aria-hidden className="w-4 h-4" /> {label}
    </button>
  );
}

export default function ApplicationClient() {
  const [app, setApp] = useState(EMPTY);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | ok | err
  const [serverMsg, setServerMsg] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [restored, setRestored] = useState(false);
  const headingRef = useRef(null);
  const successRef = useRef(null);
  const { widgetRef, token, reset: resetTurnstile, enabled: turnstileEnabled } = useTurnstile(step === 5);

  // ---- draft persistence: a driver on a phone must survive interruptions ----
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const draft = JSON.parse(raw);
        if (draft && draft.app) {
          setApp({ ...EMPTY, ...draft.app });
          setStep(Math.min(draft.step ?? 0, STEPS.length - 1));
          setRestored(true);
        }
      }
    } catch {
      /* corrupt draft — start fresh */
    }
  }, []);

  useEffect(() => {
    if (status === "ok") return;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ app, step }));
    } catch {
      /* storage full/blocked — non-fatal */
    }
  }, [app, step, status]);

  // Focus the step heading on step change so screen readers and keyboard
  // users land at the top of the new step.
  useEffect(() => {
    if (headingRef.current) {
      headingRef.current.focus();
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [step]);

  useEffect(() => {
    if (status === "ok" && successRef.current) successRef.current.focus();
  }, [status]);

  const set = (path, value) => {
    setApp((prev) => {
      const next = structuredClone(prev);
      const keys = path.split(".");
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const setListItem = (listPath, index, key, value) => {
    setApp((prev) => {
      const next = structuredClone(prev);
      const list = listPath.split(".").reduce((o, k) => o[k], next);
      list[index][key] = value;
      return next;
    });
  };

  const addListItem = (listPath, item) => {
    setApp((prev) => {
      const next = structuredClone(prev);
      const list = listPath.split(".").reduce((o, k) => o[k], next);
      list.push(item);
      return next;
    });
  };

  const removeListItem = (listPath, index) => {
    setApp((prev) => {
      const next = structuredClone(prev);
      const keys = listPath.split(".");
      const list = keys.reduce((o, k) => o[k], next);
      list.splice(index, 1);
      return next;
    });
  };

  // ---- per-step validation (mirrors the backend) ----
  const validateStep = (s) => {
    const e = {};
    if (s === 0) {
      if (!app.position) e.position = "Select the position you're applying for";
      if (!app.personal.fullName.trim()) e.fullName = "Required";
      if (!US_PHONE(app.personal.phone)) e.phone = "Enter a valid US phone number";
      if (app.personal.email && !EMAIL_REGEX.test(app.personal.email.trim())) e.email = "Enter a valid email or leave blank";
      if (!app.personal.dob) e.dob = "Required";
      const ca = app.personal.currentAddress;
      if (!ca.street.trim()) e.street = "Required";
      if (!ca.city.trim()) e.city = "Required";
      if (!ca.state.trim()) e.state = "Required";
      if (!ca.zip.trim()) e.zip = "Required";
      app.personal.previousAddresses.forEach((a, i) => {
        if (!a.street.trim() || !a.city.trim() || !a.state.trim() || !a.zip.trim())
          e[`prevAddr${i}`] = "Complete this address or remove it";
      });
    }
    if (s === 1) {
      if (!app.license.state.trim()) e.licState = "Required";
      if (!app.license.number.trim()) e.licNumber = "Required";
      if (!app.license.expiration) e.licExp = "Required";
      if (app.license.everDeniedRevokedSuspended && !app.license.deniedExplanation.trim())
        e.deniedExplanation = "Please explain";
      app.additionalLicenses.forEach((l, i) => {
        if (!l.state.trim() || !l.number.trim() || !l.expiration)
          e[`addlLic${i}`] = "State, number, and expiration required — or remove this entry";
      });
    }
    if (s === 2) {
      if (!app.experience.length) e.experience = "Add at least one entry";
      app.experience.forEach((x, i) => {
        if (!x.equipmentType || !String(x.years).trim()) e[`exp${i}`] = "Equipment type and years are required";
      });
    }
    if (s === 3) {
      app.accidents.forEach((a, i) => {
        if (!a.date || !a.description.trim()) e[`acc${i}`] = "Date and description required — or remove this entry";
      });
      app.violations.forEach((v, i) => {
        if (!v.date || !v.offense.trim()) e[`vio${i}`] = "Date and offense required — or remove this entry";
      });
    }
    if (s === 4) {
      if (!app.employment.length) e.employment = "Add at least one employer";
      app.employment.forEach((x, i) => {
        const toOk = x.current || MONTH_RE.test(x.to);
        if (
          !x.employer.trim() ||
          !x.street.trim() ||
          !MONTH_RE.test(x.from) ||
          !toOk ||
          !x.reasonForLeaving.trim()
        )
          e[`emp${i}`] = "Employer, street address, from/to dates, and reason for leaving are required";
      });
    }
    if (s === 5) {
      if (!app.certification.signature.trim()) e.signature = "Type your full legal name";
      if (!app.certification.esignConsent) e.esignConsent = "Required to sign electronically";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validateStep(step)) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const submit = async () => {
    if (!validateStep(5)) return;
    setStatus("sending");
    setServerMsg("");
    try {
      const payload = {
        position: app.position,
        personal: {
          ...app.personal,
          fullName: app.personal.fullName.trim(),
          email: app.personal.email.trim(),
        },
        license: app.license,
        additionalLicenses: app.additionalLicenses,
        experience: app.experience,
        accidents: app.accidents,
        violations: app.violations,
        employment: app.employment.map((x) => ({ ...x, to: x.current ? "Present" : x.to })),
        gapsExplanation: app.gapsExplanation,
        certification: { signature: app.certification.signature.trim(), esignConsent: true },
        honeypot,
        ...(turnstileEnabled ? { turnstileToken: token } : {}),
      };
      const r = await fetch(`${BACKEND_URL}/api/send-pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!r.ok) {
        let msg = "";
        try {
          msg = (await r.json()).message;
        } catch {
          /* ignore */
        }
        const err = new Error(msg || "Submission failed.");
        err.isServerMessage = Boolean(msg);
        throw err;
      }
      setStatus("ok");
      track("application_submitted", { position: app.position });
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {
        /* ignore */
      }
    } catch (err) {
      setStatus("err");
      setServerMsg(err && err.isServerMessage ? err.message : "");
      resetTurnstile();
    }
  };

  // ---------- success ----------
  if (status === "ok") {
    return (
      <div className="bg-white text-black min-h-[70vh] px-4 py-20">
        <div
          role="status"
          className="max-w-xl mx-auto bg-black text-white rounded-2xl shadow-xl p-8 md:p-10"
        >
          <h1 ref={successRef} tabIndex={-1} className="text-3xl font-extrabold tracking-tight mb-4 outline-none">
            Application received.
          </h1>
          <p className="text-lg text-white/90 mb-4">
            Thanks, {app.personal.fullName.split(" ")[0]}. Your application is in — we&apos;ll call you at{" "}
            <span className="font-bold">{app.personal.phone}</span> from{" "}
            <span className="font-bold">{RECRUITING_PHONE_DISPLAY}</span>, so save the number.
          </p>
          <p className="text-white/80 flex items-start gap-2">
            <ShieldCheck aria-hidden className="w-5 h-5 mt-1 shrink-0" />
            Your Social Security Number is never collected online. We&apos;ll go over it with you
            directly, and you&apos;ll write and initial it yourself on the printed application.
            Never send it by email or text.
          </p>
        </div>
      </div>
    );
  }

  const per = app.personal;
  const lic = app.license;

  return (
    <div className="bg-white text-black">
      <div className="max-w-2xl mx-auto px-4 py-10 md:py-16">
        {/* ---------- header + progress ---------- */}
        <p className="uppercase tracking-widest text-gray-500 text-sm font-bold mb-2">
          Forbes Logistix · Driver Qualification Application
        </p>
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 outline-none"
        >
          {STEPS[step]}
        </h1>
        <p className="text-gray-600 mb-2">
          Step {step + 1} of {STEPS.length} · takes about 15 minutes · your progress saves on this
          device automatically
        </p>
        <div className="h-2 bg-gray-200 rounded-full mb-4" aria-hidden>
          <div
            className="h-2 bg-black rounded-full transition-all duration-300"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
        {restored && step === 0 && (
          <p className="text-sm text-gray-600 mb-4" role="status">
            Welcome back — we restored your saved draft.
          </p>
        )}
        {step === 0 && (
          <p className="flex items-start gap-2 text-sm bg-gray-50 border border-black/10 rounded-xl p-4 mb-6 text-gray-700">
            <ShieldCheck aria-hidden className="w-5 h-5 mt-0.5 shrink-0" />
            We will never ask for your Social Security Number online. You&apos;ll add it yourself,
            in person, on the printed application — never over email or text.
          </p>
        )}

        <form onSubmit={(e) => e.preventDefault()} noValidate className="space-y-6">
          {/* Honeypot — hidden from real users; bots fill everything. */}
          <div aria-hidden className="absolute left-[-9999px] top-auto w-px h-px overflow-hidden">
            <label htmlFor="app-extra-field">Leave this field empty</label>
            <input
              id="app-extra-field"
              name="app_extra_field"
              type="text"
              tabIndex="-1"
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          {/* ================= STEP 0: position + personal ================= */}
          {step === 0 && (
            <>
              <Field id="position" label="Position you're applying for" error={errors.position}>
                <select
                  id="position"
                  value={app.position}
                  onChange={(e) => set("position", e.target.value)}
                  aria-invalid={errors.position ? true : undefined}
                  className={inputCls}
                >
                  <option value="">Select a position…</option>
                  {POSITIONS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field id="fullName" label="Full legal name" error={errors.fullName}>
                <TextInput
                  id="fullName"
                  value={per.fullName}
                  onChange={(e) => set("personal.fullName", e.target.value)}
                  error={errors.fullName}
                  autoComplete="name"
                  maxLength={120}
                />
              </Field>
              <Field id="phone" label="Phone number" error={errors.phone}>
                <TextInput
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  value={per.phone}
                  onChange={(e) => set("personal.phone", e.target.value)}
                  error={errors.phone}
                  autoComplete="tel"
                  maxLength={32}
                />
              </Field>
              <Field id="email" label="Email (optional)" error={errors.email}>
                <TextInput
                  id="email"
                  type="email"
                  inputMode="email"
                  value={per.email}
                  onChange={(e) => set("personal.email", e.target.value)}
                  error={errors.email}
                  autoComplete="email"
                  maxLength={254}
                />
              </Field>
              <Field id="dob" label="Date of birth" error={errors.dob}>
                <TextInput
                  id="dob"
                  type="date"
                  value={per.dob}
                  onChange={(e) => set("personal.dob", e.target.value)}
                  error={errors.dob}
                  autoComplete="bday"
                />
              </Field>

              <h2 className="text-xl font-bold pt-2">Current address</h2>
              <Field id="street" label="Street address" error={errors.street}>
                <TextInput
                  id="street"
                  value={per.currentAddress.street}
                  onChange={(e) => set("personal.currentAddress.street", e.target.value)}
                  error={errors.street}
                  autoComplete="street-address"
                  maxLength={200}
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field id="city" label="City" error={errors.city}>
                  <TextInput
                    id="city"
                    value={per.currentAddress.city}
                    onChange={(e) => set("personal.currentAddress.city", e.target.value)}
                    error={errors.city}
                    maxLength={100}
                  />
                </Field>
                <Field id="state" label="State" error={errors.state}>
                  <TextInput
                    id="state"
                    value={per.currentAddress.state}
                    onChange={(e) => set("personal.currentAddress.state", e.target.value)}
                    error={errors.state}
                    maxLength={40}
                  />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field id="zip" label="ZIP" error={errors.zip}>
                  <TextInput
                    id="zip"
                    inputMode="numeric"
                    value={per.currentAddress.zip}
                    onChange={(e) => set("personal.currentAddress.zip", e.target.value)}
                    error={errors.zip}
                    autoComplete="postal-code"
                    maxLength={12}
                  />
                </Field>
                <Field id="sinceYear" label="Living here since (year)">
                  <TextInput
                    id="sinceYear"
                    inputMode="numeric"
                    value={per.currentAddress.sinceYear}
                    onChange={(e) => set("personal.currentAddress.sinceYear", e.target.value)}
                    maxLength={4}
                    placeholder="e.g. 2023"
                  />
                </Field>
              </div>

              <p className="text-sm text-gray-600">
                Lived at your current address less than 3 years? Add your previous addresses so the
                last 3 years are covered (DOT requirement).
              </p>
              {per.previousAddresses.map((a, i) => (
                <div key={i} className="border border-black/10 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">Previous address {i + 1}</p>
                    <RemoveButton onClick={() => removeListItem("personal.previousAddresses", i)} label="Remove" />
                  </div>
                  <TextInput
                    id={`pa-street-${i}`}
                    value={a.street}
                    onChange={(e) => setListItem("personal.previousAddresses", i, "street", e.target.value)}
                    placeholder="Street address"
                    maxLength={200}
                  />
                  <div className="grid grid-cols-3 gap-3">
                    <TextInput
                      id={`pa-city-${i}`}
                      value={a.city}
                      onChange={(e) => setListItem("personal.previousAddresses", i, "city", e.target.value)}
                      placeholder="City"
                      maxLength={100}
                    />
                    <TextInput
                      id={`pa-state-${i}`}
                      value={a.state}
                      onChange={(e) => setListItem("personal.previousAddresses", i, "state", e.target.value)}
                      placeholder="State"
                      maxLength={40}
                    />
                    <TextInput
                      id={`pa-zip-${i}`}
                      value={a.zip}
                      onChange={(e) => setListItem("personal.previousAddresses", i, "zip", e.target.value)}
                      placeholder="ZIP"
                      maxLength={12}
                    />
                  </div>
                  {errors[`prevAddr${i}`] && <p className={errCls}>{errors[`prevAddr${i}`]}</p>}
                </div>
              ))}
              <AddButton
                onClick={() =>
                  addListItem("personal.previousAddresses", { street: "", city: "", state: "", zip: "" })
                }
                label="Add previous address"
              />
            </>
          )}

          {/* ================= STEP 1: license ================= */}
          {step === 1 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Field id="licState" label="Issuing state" error={errors.licState}>
                  <TextInput
                    id="licState"
                    value={lic.state}
                    onChange={(e) => set("license.state", e.target.value)}
                    error={errors.licState}
                    maxLength={40}
                    placeholder="e.g. TX"
                  />
                </Field>
                <Field id="licClass" label="Class">
                  <select
                    id="licClass"
                    value={lic.class}
                    onChange={(e) => set("license.class", e.target.value)}
                    className={inputCls}
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                  </select>
                </Field>
              </div>
              <Field id="licNumber" label="CDL number" error={errors.licNumber}>
                <TextInput
                  id="licNumber"
                  value={lic.number}
                  onChange={(e) => set("license.number", e.target.value)}
                  error={errors.licNumber}
                  maxLength={40}
                />
              </Field>
              <Field id="licExp" label="Expiration date" error={errors.licExp}>
                <TextInput
                  id="licExp"
                  type="date"
                  value={lic.expiration}
                  onChange={(e) => set("license.expiration", e.target.value)}
                  error={errors.licExp}
                />
              </Field>
              <Field id="endorsements" label="Endorsements (optional)" hint="e.g. Tanker (N), Hazmat (H)">
                <TextInput
                  id="endorsements"
                  value={lic.endorsements}
                  onChange={(e) => set("license.endorsements", e.target.value)}
                  maxLength={120}
                />
              </Field>

              <p className="text-sm text-gray-600">
                Hold any other current license or permit (another state&apos;s license, a CLP)? DOT
                requires listing each one.
              </p>
              {app.additionalLicenses.map((l, i) => (
                <div key={i} className="border border-black/10 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">Other license/permit {i + 1}</p>
                    <RemoveButton onClick={() => removeListItem("additionalLicenses", i)} label="Remove" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <TextInput
                      id={`al-state-${i}`}
                      value={l.state}
                      onChange={(e) => setListItem("additionalLicenses", i, "state", e.target.value)}
                      placeholder="Issuing state/authority"
                      maxLength={40}
                      aria-label="Issuing state or authority"
                    />
                    <TextInput
                      id={`al-number-${i}`}
                      value={l.number}
                      onChange={(e) => setListItem("additionalLicenses", i, "number", e.target.value)}
                      placeholder="Number"
                      maxLength={40}
                      aria-label="License or permit number"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <TextInput
                      id={`al-class-${i}`}
                      value={l.class}
                      onChange={(e) => setListItem("additionalLicenses", i, "class", e.target.value)}
                      placeholder="Class/type (e.g. CLP)"
                      maxLength={20}
                      aria-label="Class or type"
                    />
                    <TextInput
                      id={`al-exp-${i}`}
                      type="date"
                      value={l.expiration}
                      onChange={(e) => setListItem("additionalLicenses", i, "expiration", e.target.value)}
                      aria-label="Expiration date"
                    />
                  </div>
                  {errors[`addlLic${i}`] && <p className={errCls}>{errors[`addlLic${i}`]}</p>}
                </div>
              ))}
              <AddButton
                onClick={() =>
                  addListItem("additionalLicenses", { state: "", number: "", class: "", expiration: "" })
                }
                label="Add another license/permit"
              />
              <fieldset>
                <legend className={labelCls}>
                  Has any license of yours ever been denied, suspended, or revoked?
                </legend>
                <div className="flex gap-3">
                  {[
                    { v: false, label: "No" },
                    { v: true, label: "Yes" },
                  ].map((o) => (
                    <button
                      key={String(o.v)}
                      type="button"
                      onClick={() => set("license.everDeniedRevokedSuspended", o.v)}
                      aria-pressed={lic.everDeniedRevokedSuspended === o.v}
                      className={`px-8 py-3 rounded-xl border font-semibold ${
                        lic.everDeniedRevokedSuspended === o.v
                          ? "bg-black text-white border-black"
                          : "bg-white text-black border-gray-300"
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </fieldset>
              {lic.everDeniedRevokedSuspended && (
                <Field id="deniedExplanation" label="Please explain" error={errors.deniedExplanation}>
                  <textarea
                    id="deniedExplanation"
                    rows="3"
                    value={lic.deniedExplanation}
                    onChange={(e) => set("license.deniedExplanation", e.target.value)}
                    aria-invalid={errors.deniedExplanation ? true : undefined}
                    className={inputCls}
                    maxLength={600}
                  />
                </Field>
              )}
            </>
          )}

          {/* ================= STEP 2: experience ================= */}
          {step === 2 && (
            <>
              {errors.experience && <p className={errCls}>{errors.experience}</p>}
              {app.experience.map((x, i) => (
                <div key={i} className="border border-black/10 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">Equipment {i + 1}</p>
                    {app.experience.length > 1 && (
                      <RemoveButton onClick={() => removeListItem("experience", i)} label="Remove" />
                    )}
                  </div>
                  <select
                    id={`exp-type-${i}`}
                    aria-label="Equipment type"
                    value={x.equipmentType}
                    onChange={(e) => setListItem("experience", i, "equipmentType", e.target.value)}
                    className={inputCls}
                  >
                    <option value="">Equipment type…</option>
                    {EQUIPMENT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <div className="grid grid-cols-2 gap-3">
                    <TextInput
                      id={`exp-years-${i}`}
                      inputMode="decimal"
                      value={x.years}
                      onChange={(e) => setListItem("experience", i, "years", e.target.value)}
                      placeholder="Years (e.g. 4)"
                      maxLength={10}
                      aria-label="Years of experience"
                    />
                    <TextInput
                      id={`exp-miles-${i}`}
                      inputMode="numeric"
                      value={x.approxMiles}
                      onChange={(e) => setListItem("experience", i, "approxMiles", e.target.value)}
                      placeholder="Approx. miles"
                      maxLength={12}
                      aria-label="Approximate miles"
                    />
                  </div>
                  {errors[`exp${i}`] && <p className={errCls}>{errors[`exp${i}`]}</p>}
                </div>
              ))}
              <AddButton
                onClick={() => addListItem("experience", { equipmentType: "", years: "", approxMiles: "" })}
                label="Add equipment type"
              />
            </>
          )}

          {/* ================= STEP 3: accidents & violations ================= */}
          {step === 3 && (
            <>
              <h2 className="text-xl font-bold">Accidents — past 3 years</h2>
              <p className="text-sm text-gray-600">
                None? Just leave this empty — the application will state that you reported none.
              </p>
              {app.accidents.map((a, i) => (
                <div key={i} className="border border-black/10 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">Accident {i + 1}</p>
                    <RemoveButton onClick={() => removeListItem("accidents", i)} label="Remove" />
                  </div>
                  <TextInput
                    id={`acc-date-${i}`}
                    type="date"
                    value={a.date}
                    onChange={(e) => setListItem("accidents", i, "date", e.target.value)}
                    aria-label="Accident date"
                  />
                  <textarea
                    id={`acc-desc-${i}`}
                    rows="2"
                    value={a.description}
                    onChange={(e) => setListItem("accidents", i, "description", e.target.value)}
                    placeholder="What happened?"
                    className={inputCls}
                    maxLength={600}
                    aria-label="Accident description"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <TextInput
                      id={`acc-fat-${i}`}
                      inputMode="numeric"
                      value={a.fatalities}
                      onChange={(e) => setListItem("accidents", i, "fatalities", e.target.value)}
                      placeholder="Fatalities (0 if none)"
                      maxLength={3}
                      aria-label="Fatalities"
                    />
                    <TextInput
                      id={`acc-inj-${i}`}
                      inputMode="numeric"
                      value={a.injuries}
                      onChange={(e) => setListItem("accidents", i, "injuries", e.target.value)}
                      placeholder="Injuries (0 if none)"
                      maxLength={3}
                      aria-label="Injuries"
                    />
                  </div>
                  {errors[`acc${i}`] && <p className={errCls}>{errors[`acc${i}`]}</p>}
                </div>
              ))}
              <AddButton
                onClick={() =>
                  addListItem("accidents", { date: "", description: "", fatalities: "0", injuries: "0" })
                }
                label="Add accident"
              />

              <h2 className="text-xl font-bold pt-4">Traffic convictions — past 3 years</h2>
              <p className="text-sm text-gray-600">
                Violations you were convicted of, or where you forfeited bond or collateral (parking
                tickets don&apos;t count). None? Leave empty.
              </p>
              {app.violations.map((v, i) => (
                <div key={i} className="border border-black/10 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">Violation {i + 1}</p>
                    <RemoveButton onClick={() => removeListItem("violations", i)} label="Remove" />
                  </div>
                  <TextInput
                    id={`vio-date-${i}`}
                    type="date"
                    value={v.date}
                    onChange={(e) => setListItem("violations", i, "date", e.target.value)}
                    aria-label="Violation date"
                  />
                  <TextInput
                    id={`vio-off-${i}`}
                    value={v.offense}
                    onChange={(e) => setListItem("violations", i, "offense", e.target.value)}
                    placeholder="Offense (e.g. speeding 10 over)"
                    maxLength={300}
                    aria-label="Offense"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <TextInput
                      id={`vio-state-${i}`}
                      value={v.state}
                      onChange={(e) => setListItem("violations", i, "state", e.target.value)}
                      placeholder="State"
                      maxLength={40}
                      aria-label="State of violation"
                    />
                    <TextInput
                      id={`vio-pen-${i}`}
                      value={v.penalty}
                      onChange={(e) => setListItem("violations", i, "penalty", e.target.value)}
                      placeholder="Penalty (fine, points…)"
                      maxLength={120}
                      aria-label="Penalty"
                    />
                  </div>
                  {errors[`vio${i}`] && <p className={errCls}>{errors[`vio${i}`]}</p>}
                </div>
              ))}
              <AddButton
                onClick={() => addListItem("violations", { date: "", offense: "", state: "", penalty: "" })}
                label="Add violation"
              />
            </>
          )}

          {/* ================= STEP 4: employment ================= */}
          {step === 4 && (
            <>
              {/* 49 CFR 391.21(d): written pre-submission notice of the safety
                  performance history investigation + 391.23(i) rights. Also
                  printed into the PDF. Do not remove. */}
              <div className="bg-gray-50 border border-black/10 rounded-xl p-4 text-sm text-gray-700 leading-relaxed">
                <p className="font-bold mb-1">Notice (required by federal rule 49 CFR 391.21(d)):</p>
                <p>
                  The employment information you provide may be used, and your previous employers
                  will be contacted, to investigate your safety performance history as required by
                  49 CFR 391.23(d) and (e). You have the right to review the information previous
                  employers provide, to have errors corrected and the corrected information resent,
                  and to attach a rebuttal statement if you and a previous employer cannot agree on
                  its accuracy (49 CFR 391.23(i)).
                </p>
              </div>
              <p className="text-sm text-gray-600">
                Most recent first. Cover the past 3 years, plus any CDL-driving jobs in the 7 years
                before that (DOT requires 10 years for CDL positions).
              </p>
              {errors.employment && <p className={errCls}>{errors.employment}</p>}
              {app.employment.map((x, i) => (
                <div key={i} className="border border-black/10 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">Employer {i + 1}</p>
                    {app.employment.length > 1 && (
                      <RemoveButton onClick={() => removeListItem("employment", i)} label="Remove" />
                    )}
                  </div>
                  <TextInput
                    id={`emp-name-${i}`}
                    value={x.employer}
                    onChange={(e) => setListItem("employment", i, "employer", e.target.value)}
                    placeholder="Company name"
                    maxLength={150}
                    aria-label="Employer name"
                  />
                  <TextInput
                    id={`emp-street-${i}`}
                    value={x.street}
                    onChange={(e) => setListItem("employment", i, "street", e.target.value)}
                    placeholder="Street address"
                    maxLength={200}
                    aria-label="Employer street address"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <TextInput
                      id={`emp-phone-${i}`}
                      type="tel"
                      inputMode="tel"
                      value={x.phone}
                      onChange={(e) => setListItem("employment", i, "phone", e.target.value)}
                      placeholder="Phone (for verification)"
                      maxLength={32}
                      aria-label="Employer phone"
                    />
                    <TextInput
                      id={`emp-loc-${i}`}
                      value={x.cityState}
                      onChange={(e) => setListItem("employment", i, "cityState", e.target.value)}
                      placeholder="City, State"
                      maxLength={100}
                      aria-label="Employer city and state"
                    />
                  </div>
                  <TextInput
                    id={`emp-pos-${i}`}
                    value={x.position}
                    onChange={(e) => setListItem("employment", i, "position", e.target.value)}
                    placeholder="Your position (e.g. OTR Driver)"
                    maxLength={100}
                    aria-label="Position held"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor={`emp-from-${i}`} className="block text-sm text-gray-600 mb-1">
                        From
                      </label>
                      <TextInput
                        id={`emp-from-${i}`}
                        type="month"
                        value={x.from}
                        onChange={(e) => setListItem("employment", i, "from", e.target.value)}
                        placeholder="YYYY-MM"
                      />
                    </div>
                    <div>
                      <label htmlFor={`emp-to-${i}`} className="block text-sm text-gray-600 mb-1">
                        To
                      </label>
                      <TextInput
                        id={`emp-to-${i}`}
                        type="month"
                        value={x.to}
                        onChange={(e) => setListItem("employment", i, "to", e.target.value)}
                        placeholder="YYYY-MM"
                        disabled={x.current}
                      />
                    </div>
                  </div>
                  <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={x.current}
                      onChange={(e) => setListItem("employment", i, "current", e.target.checked)}
                      className="h-4 w-4 accent-black"
                    />
                    I currently work here
                  </label>
                  <TextInput
                    id={`emp-reason-${i}`}
                    value={x.reasonForLeaving}
                    onChange={(e) => setListItem("employment", i, "reasonForLeaving", e.target.value)}
                    placeholder={x.current ? "Reason for looking to leave" : "Reason for leaving"}
                    maxLength={300}
                    aria-label="Reason for leaving"
                  />
                  <div className="grid grid-cols-1 gap-2 text-sm text-gray-700">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={x.fmcsrSubject}
                        onChange={(e) => setListItem("employment", i, "fmcsrSubject", e.target.checked)}
                        className="h-4 w-4 accent-black"
                      />
                      This job was subject to federal motor carrier safety regulations (FMCSRs)
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={x.safetySensitive}
                        onChange={(e) => setListItem("employment", i, "safetySensitive", e.target.checked)}
                        className="h-4 w-4 accent-black"
                      />
                      This job was safety-sensitive with DOT drug &amp; alcohol testing
                    </label>
                  </div>
                  {errors[`emp${i}`] && <p className={errCls}>{errors[`emp${i}`]}</p>}
                </div>
              ))}
              <AddButton
                onClick={() =>
                  addListItem("employment", {
                    employer: "",
                    street: "",
                    phone: "",
                    cityState: "",
                    position: "",
                    from: "",
                    to: "",
                    current: false,
                    reasonForLeaving: "",
                    fmcsrSubject: true,
                    safetySensitive: true,
                  })
                }
                label="Add employer"
              />
              <Field
                id="gaps"
                label="Any gaps in employment? (optional)"
                hint="A sentence is fine — e.g. 'Home with family Jan–Mar 2024.'"
              >
                <textarea
                  id="gaps"
                  rows="2"
                  value={app.gapsExplanation}
                  onChange={(e) => set("gapsExplanation", e.target.value)}
                  className={inputCls}
                  maxLength={600}
                />
              </Field>
            </>
          )}

          {/* ================= STEP 5: review & sign ================= */}
          {step === 5 && (
            <>
              <div className="border border-black/10 rounded-xl p-4 text-sm space-y-1 bg-gray-50">
                <p>
                  <span className="font-semibold">Position:</span>{" "}
                  {POSITIONS.find((x) => x.value === app.position)?.label || "—"}
                </p>
                <p>
                  <span className="font-semibold">Name:</span> {per.fullName} ·{" "}
                  <span className="font-semibold">Phone:</span> {per.phone}
                </p>
                <p>
                  <span className="font-semibold">CDL:</span> {lic.state} · Class {lic.class} · exp{" "}
                  {lic.expiration || "—"}
                </p>
                <p>
                  <span className="font-semibold">Experience:</span> {app.experience.length} equipment
                  type(s) · <span className="font-semibold">Employers:</span> {app.employment.length}
                </p>
                <p>
                  <span className="font-semibold">Accidents:</span> {app.accidents.length} ·{" "}
                  <span className="font-semibold">Violations:</span> {app.violations.length}
                </p>
                <p className="text-gray-600 pt-1">Use Back to correct anything before signing.</p>
              </div>

              <div className="border border-black rounded-xl p-4 md:p-6 space-y-4">
                <p className="text-sm leading-relaxed">
                  This certifies that this application was completed by me, and that all entries on it
                  and information in it are true and complete to the best of my knowledge.
                </p>
                <Field
                  id="signature"
                  label="Type your full legal name as your signature"
                  error={errors.signature}
                >
                  <TextInput
                    id="signature"
                    value={app.certification.signature}
                    onChange={(e) => set("certification.signature", e.target.value)}
                    error={errors.signature}
                    maxLength={120}
                    autoComplete="off"
                  />
                </Field>
                <label className="flex items-start gap-3 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={app.certification.esignConsent}
                    onChange={(e) => set("certification.esignConsent", e.target.checked)}
                    className="mt-1 h-4 w-4 accent-black"
                    aria-invalid={errors.esignConsent ? true : undefined}
                  />
                  <span>
                    I agree that typing my name above constitutes my electronic signature on this
                    application, with the same effect as a handwritten signature.
                  </span>
                </label>
                {errors.esignConsent && <p className={errCls}>{errors.esignConsent}</p>}
              </div>

              {turnstileEnabled && (
                <div className="flex justify-center">
                  <div ref={widgetRef} />
                </div>
              )}

              {status === "err" && (
                <p role="alert" className="text-red-600 font-semibold text-sm">
                  {serverMsg || "Something went wrong submitting your application."} Or call us and
                  we&apos;ll take it by phone:{" "}
                  <a href={`tel:${RECRUITING_PHONE_TEL}`} className="underline underline-offset-2">
                    {RECRUITING_PHONE_DISPLAY}
                  </a>
                  .
                </p>
              )}
            </>
          )}

          {/* ---------- step navigation ---------- */}
          <div className="flex gap-3 pt-2">
            {step > 0 && (
              <button
                type="button"
                onClick={back}
                className="flex-1 border border-black text-black px-6 py-4 text-lg font-bold rounded-2xl hover:bg-gray-50"
              >
                Back
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={next}
                className="flex-1 bg-black text-white px-6 py-4 text-lg font-bold rounded-2xl border border-black hover:scale-[1.01] transition-transform"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                disabled={status === "sending" || (turnstileEnabled && !token)}
                className="flex-1 bg-black text-white px-6 py-4 text-lg font-bold rounded-2xl border border-black disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === "sending" ? "Submitting…" : "Submit Application"}
              </button>
            )}
          </div>
          <p className="text-center text-sm text-gray-600">
            Questions? Call{" "}
            <a href={`tel:${RECRUITING_PHONE_TEL}`} className="underline underline-offset-2 font-semibold">
              {RECRUITING_PHONE_DISPLAY}
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
