"use client";

import { useState, useEffect, useRef } from "react";
import { Phone, Plus, Trash2, ShieldCheck } from "lucide-react";
import { track } from "@vercel/analytics";
import useTurnstile from "../lib/useTurnstile";
import {
  detectGaps,
  coverageYears,
  maxExperienceYears,
  formatMonthYear,
  formatFullDate,
  formatMonthIndex,
  monthIndex,
  currentMonthIndex,
} from "../lib/employmentHistory";
import { composeFullName, splitFullName } from "../lib/legalName";
import {
  US_STATES,
  OTHER_STATE,
  USDOT_RE,
  zipOk,
  normalizeStateValue,
  ENDORSEMENTS,
  NONE_CODE,
  toggleEndorsement,
  normalizeEndorsementCodes,
  endorsementCodesValid,
  parseLegacyEndorsements,
  firstResidenceGap,
  residenceCoverageError,
} from "../lib/licenseAndAddress";

const BACKEND_URL = "https://forbes-logistix-backend.vercel.app";
const RECRUITING_PHONE_DISPLAY = "(601) 300-5529";
const RECRUITING_PHONE_TEL = "+16013005529";

// Bump when the draft shape changes so stale localStorage drafts are discarded.
// Form v4 deliberately did NOT bump: v3 drafts are normalized on restore (see
// the draft-restore effect) so a driver mid-application keeps their progress.
// Form v5 (structured legal name) also did NOT bump: a legacy free-text
// fullName is best-effort split into first/middle/last on restore.
// Form v6 also did NOT bump: endorsements/state/residence values are
// normalized on restore, and a pre-v6 draft (no license.endorsementCodes)
// re-walks from step 0.
const DRAFT_KEY = "fl-dot-application-draft-v3";

const POSITIONS = [
  { value: "flatbed-southeast", label: "Company Flatbed Driver — Southeast" },
  { value: "reefer-dallas", label: "Company Reefer Driver — Dedicated Dallas Outbound" },
  // Same 391.21 application — leased O/Os are driver-qualified like company
  // drivers; the equipment lease (Part 376) is separate onboarding paperwork.
  { value: "owner-operator-flatbed", label: "Owner-Operator — Flatbed (Southeast)" },
];

// ---------------------------------------------------------------------------
// Background-check disclosure & consent texts. These must stay in sync with
// the copies the backend prints into the PDF (utils/pdfGenerator.js). Layout
// rules that shape the steps below:
//  - The FCRA disclosure must be a standalone document (15 U.S.C.
//    1681b(b)(2)(A)) — its card contains the disclosure and nothing else.
//  - The PSP form is FMCSA-mandated verbatim (psp.fmcsa.dot.gov, LAST UPDATED
//    2/11/2016) and "may NOT be included with other consent forms or any
//    other language" — it gets its own step with nothing else on it.
//  - The Clearinghouse full-query consent can only be granted INSIDE the
//    Clearinghouse portal (49 CFR 382.703) — this form only acknowledges.
// CRA named 2026-07-14 per owner: Data Facts, Inc. (details verified against
// datafacts.com privacy policy + applicant-assistance page). If the vendor
// ever changes, update the name/address/phone/website here AND in the
// backend's pdfGenerator.js (naming is required for California applicants).
const FCRA_DISCLOSURE =
  "Forbes Logistix LLC (“Forbes Logistix”) may obtain one or more consumer reports about you for employment purposes, including deciding whether to hire or engage you as a driver and, if you are hired or engaged, for decisions about your continued employment or engagement to the extent permitted by law. The reports may include information about your criminal record history, your driving and motor vehicle records, and verification of your prior employment. The reports will be obtained from the following consumer reporting agency: Data Facts, Inc., 8000 Centerview Parkway, Suite 400, Cordova, TN 38018, toll-free (800) 264-4110, www.datafacts.com.";

const FCRA_INVESTIGATIVE =
  "Forbes Logistix LLC may also request an “investigative consumer report” about you — a background report that includes information about your character, general reputation, personal characteristics, or mode of living, obtained through personal interviews (for example, interviews with your previous employers about your safety performance history). You have the right to request, in writing within a reasonable time, additional disclosure about the nature and scope of any such investigation. A written summary of your rights under the Fair Credit Reporting Act is provided with this disclosure:";

const CFPB_SUMMARY_URL =
  "https://files.consumerfinance.gov/f/documents/bcfp_consumer-rights-summary_2018-09.pdf";

const FCRA_AUTHORIZATION =
  "I acknowledge that I have received and read the Disclosure Regarding Background Reports and the Investigative Consumer Report Disclosure from Forbes Logistix LLC. I authorize Forbes Logistix LLC to obtain consumer reports and investigative consumer reports about me from Data Facts, Inc. in connection with my application and, to the extent permitted by applicable law, at any time during my employment or contract with Forbes Logistix LLC. I authorize state motor vehicle agencies, courts, my previous employers, and other information sources to furnish information about me to Data Facts, Inc. and Forbes Logistix LLC for these reports. I understand that typing my full legal name constitutes my electronic signature.";

const FCRA_FREE_COPY_LABEL =
  "Check this box to receive a free copy of any consumer report or investigative consumer report obtained about you. (California, Minnesota, and Oklahoma applicants have this right by law; Forbes Logistix extends it to all applicants. California applicants: a copy will be sent within 3 business days of Forbes Logistix receiving the report.)";

const PSP_BANNER =
  "THE BELOW DISCLOSURE AND AUTHORIZATION LANGUAGE IS FOR MANDATORY USE BY ALL ACCOUNT HOLDERS";

const PSP_DISCLOSURE_PARAGRAPHS = [
  "In connection with your application for employment with Forbes Logistix LLC (“Prospective Employer”), Prospective Employer, its employees, agents or contractors may obtain one or more reports regarding your driving, and safety inspection history from the Federal Motor Carrier Safety Administration (FMCSA).",
  "When the application for employment is submitted in person, if the Prospective Employer uses any information it obtains from FMCSA in a decision to not hire you or to make any other adverse employment decision regarding you, the Prospective Employer will provide you with a copy of the report upon which its decision was based and a written summary of your rights under the Fair Credit Reporting Act before taking any final adverse action. If any final adverse action is taken against you based upon your driving history or safety report, the Prospective Employer will notify you that the action has been taken and that the action was based in part or in whole on this report.",
  "When the application for employment is submitted by mail, telephone, computer, or other similar means, if the Prospective Employer uses any information it obtains from FMCSA in a decision to not hire you or to make any other adverse employment decision regarding you, the Prospective Employer must provide you within three business days of taking adverse action oral, written or electronic notification: that adverse action has been taken based in whole or in part on information obtained from FMCSA; the name, address, and the toll free telephone number of FMCSA; that the FMCSA did not make the decision to take the adverse action and is unable to provide you the specific reasons why the adverse action was taken; and that you may, upon providing proper identification, request a free copy of the report and may dispute with the FMCSA the accuracy or completeness of any information or report. If you request a copy of a driver record from the Prospective Employer who procured the report, then, within 3 business days of receiving your request, together with proper identification, the Prospective Employer must send or provide to you a copy of your report and a summary of your rights under the Fair Credit Reporting Act.",
  "Neither the Prospective Employer nor the FMCSA contractor supplying the crash and safety information has the capability to correct any safety data that appears to be incorrect. You may challenge the accuracy of the data by submitting a request to https://dataqs.fmcsa.dot.gov. If you challenge crash or inspection information reported by a State, FMCSA cannot change or correct this data. Your request will be forwarded by the DataQs system to the appropriate State for adjudication.",
  "Any crash or inspection in which you were involved will display on your PSP report. Since the PSP report does not report, or assign, or imply fault, it will include all Commercial Motor Vehicle (CMV) crashes where you were a driver or co-driver and where those crashes were reported to FMCSA, regardless of fault. Similarly, all inspections, with or without violations, appear on the PSP report. State citations associated with Federal Motor Carrier Safety Regulations (FMCSR) violations that have been adjudicated by a court of law will also appear, and remain, on a PSP report.",
  "The Prospective Employer cannot obtain background reports from FMCSA without your authorization.",
];

const PSP_AUTH_LEAD =
  "If you agree that the Prospective Employer may obtain such background reports, please read the following and sign below:";

const PSP_AUTH_PARAGRAPHS = [
  "I authorize Forbes Logistix LLC (“Prospective Employer”) to access the FMCSA Pre-Employment Screening Program (PSP) system to seek information regarding my commercial driving safety record and information regarding my safety inspection history. I understand that I am authorizing the release of safety performance information including crash data from the previous five (5) years and inspection history from the previous three (3) years. I understand and acknowledge that this release of information may assist the Prospective Employer to make a determination regarding my suitability as an employee.",
  "I further understand that neither the Prospective Employer nor the FMCSA contractor supplying the crash and safety information has the capability to correct any safety data that appears to be incorrect. I understand I may challenge the accuracy of the data by submitting a request to https://dataqs.fmcsa.dot.gov. If I challenge crash or inspection information reported by a State, FMCSA cannot change or correct this data. I understand my request will be forwarded by the DataQs system to the appropriate State for adjudication.",
  "I understand that any crash or inspection in which I was involved will display on my PSP report. Since the PSP report does not report, or assign, or imply fault, I acknowledge it will include all CMV crashes where I was a driver or co-driver and where those crashes were reported to FMCSA, regardless of fault. Similarly, I understand all inspections, with or without violations, will appear on my PSP report, and State citations associated with FMCSR violations that have been adjudicated by a court of law will also appear, and remain, on my PSP report.",
  "I have read the above Disclosure Regarding Background Reports provided to me by Prospective Employer and I understand that if I sign this Disclosure and Authorization, Prospective Employer may obtain a report of my crash and inspection history. I hereby authorize Prospective Employer and its employees, authorized agents, and/or affiliates to obtain the information authorized above.",
];

const PSP_NOTICES = [
  "NOTICE: This form is made available to monthly account holders by NIC on behalf of the U.S. Department of Transportation, Federal Motor Carrier Safety Administration (FMCSA). Account holders are required by federal law to obtain an Applicant’s written or electronic consent prior to accessing the Applicant’s PSP report. Further, account holders are required by FMCSA to use the language contained in this Disclosure and Authorization form to obtain an Applicant’s consent. The language must be used in whole, exactly as provided. Further, the language on this form must exist as one stand-alone document. The language may NOT be included with other consent forms or any other language.",
  "NOTICE: The prospective employment concept referenced in this form contemplates the definition of “employee” contained at 49 C.F.R. 383.5.",
];

const DA_RELEASE =
  "I authorize each previous employer identified in the Employment History section of this application that employed me in a safety-sensitive function subject to DOT drug and alcohol testing during the three (3) years before the date of this application to release directly to Forbes Logistix LLC (USDOT 4361817, 3180 Utica Ave, Jackson, MS 39209), and I authorize Forbes Logistix LLC to obtain, the following information from my DOT drug and alcohol testing records: (1) alcohol test results of 0.04 or greater; (2) verified positive controlled substances test results; (3) refusals to be tested, including verified adulterated or substituted test results; (4) any other violations of DOT drug and alcohol testing regulations, including whether I violated the prohibitions of 49 CFR part 382 or failed to undertake or complete a rehabilitation program prescribed by a substance abuse professional; and (5) documentation of my completion of DOT return-to-duty requirements, including follow-up tests and any follow-up testing plan. This is a specific consent under 49 CFR 40.321(b), limited to the employers identified in this application, the information listed above, and Forbes Logistix LLC as recipient; it is effective as of the date of my electronic signature and expires when the hiring decision on this application is made. I understand that if I do not provide this consent, federal regulations prohibit Forbes Logistix LLC from permitting me to operate a commercial motor vehicle for Forbes Logistix LLC (49 CFR 40.25(a); 391.23(f)(1)).";

const CLEARINGHOUSE_PARAGRAPHS = [
  "Federal regulations (49 CFR 382.701(a)) require Forbes Logistix LLC to conduct a full pre-employment query of the FMCSA Drug and Alcohol Clearinghouse before you may perform safety-sensitive functions, including driving a commercial motor vehicle.",
  "IMPORTANT: your consent to this full query cannot be given on this application. Federal rules require you to grant it electronically inside the Clearinghouse itself (49 CFR 382.703). After you submit this application, Forbes Logistix LLC will send a consent request to your Clearinghouse account. To see and approve it, you must be registered in the Clearinghouse. If you are not registered, create your free account at clearinghouse.fmcsa.dot.gov — you will need your CDL number and state of issuance.",
  "If you do not register and grant electronic consent in the Clearinghouse, federal regulations prohibit Forbes Logistix LLC from permitting you to operate a commercial motor vehicle (49 CFR 391.23(f)(2); 382.703(c)).",
];

const CLEARINGHOUSE_ACK =
  "I understand that Forbes Logistix LLC will conduct a full query of my FMCSA Drug and Alcohol Clearinghouse record, and that I must be registered in the Clearinghouse and grant consent electronically within the Clearinghouse before I can be permitted to drive.";

const LIMITED_QUERY_CONSENT =
  "I consent to Forbes Logistix LLC (USDOT 4361817) conducting limited queries of the FMCSA Drug and Alcohol Clearinghouse to determine whether drug or alcohol violation information about me exists in the Clearinghouse. This consent covers all limited queries, including the annual query required by 49 CFR 382.701(b), conducted while I am employed by or under contract to Forbes Logistix LLC, and remains in effect for the duration of that relationship unless I withdraw it in writing. I understand that a limited query does not release the contents of my Clearinghouse record; that if a limited query shows information exists, I must provide specific consent electronically within the Clearinghouse so Forbes Logistix LLC can conduct a full query within 24 hours; and that if I do not provide that consent, I must be removed from safety-sensitive functions, including driving a commercial motor vehicle, until the full query is completed and confirms my record contains no prohibitions (49 CFR 382.701(b); 382.703(c)).";

const ESIGN_RECORDS_CONSENT =
  "I agree to complete, sign, and receive this driver qualification application and related hiring documents electronically, and I confirm I can access documents on this device (a phone or computer with a current web browser and PDF viewing capability). I may request a free paper copy of any document, or withdraw this consent, by contacting Forbes Logistix LLC at (601) 300-5529 or recruiting@forbeslogistix.com; withdrawing consent will not affect documents already signed, but future documents would then be provided on paper. My typed full legal name serves as my legal signature.";

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

const EMPTY_EXPERIENCE = { equipmentType: "", years: "", approxMiles: "" };

const EMPTY_EMPLOYMENT = {
  employer: "",
  street: "",
  phone: "",
  city: "",
  state: "",
  zip: "",
  position: "",
  from: "",
  to: "",
  current: false,
  reasonForLeaving: "",
  fmcsrSubject: true,
  safetySensitive: true,
  selfEmployed: false,
  tpaName: "",
  tpaPhone: "",
  usdotNumber: "",
  mcNumber: "",
  authorityStatus: "",
  leasedDuringPeriod: null,
};

const EMPTY_PREV_ADDRESS = { street: "", city: "", state: "", zip: "", from: "", to: "" };

const EMPTY = {
  position: "",
  personal: {
    firstName: "",
    middleName: "",
    lastName: "",
    noMiddleName: false,
    phone: "",
    email: "",
    dob: "",
    currentAddress: { street: "", city: "", state: "", zip: "", since: "" },
    previousAddresses: [],
  },
  license: {
    state: "",
    number: "",
    class: "A",
    expiration: "",
    endorsementCodes: [],
    restrictions: "",
    everDeniedRevokedSuspended: false,
    deniedExplanation: "",
  },
  additionalLicenses: [],
  experience: [{ ...EMPTY_EXPERIENCE }],
  accidents: [],
  violations: [],
  employment: [{ ...EMPTY_EMPLOYMENT }],
  gapExplanations: {},
  historyComplete: false,
  consents: {
    electronicRecords: false,
    fcra: { authorized: false, signature: "", freeCopy: false },
    psp: { signature: "" },
    drugAlcohol: { signature: "", selfReport: null, selfReportExplanation: "", limitedQuery: false },
    clearinghouseAck: false,
  },
  certification: { signature: "", esignConsent: false },
};

const STEPS = [
  "Position & About You",
  "Your CDL",
  "Driving Experience",
  "Accidents & Violations",
  "Employment History",
  "Background Check Authorization",
  "PSP Authorization",
  "Drug & Alcohol History",
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

// Display-only labels for the "Ready to sign?" checklist — maps validation
// error keys to the field they belong to. No rules live here; messages whose
// text already stands alone map to "".
const ISSUE_LABELS = [
  [/^electronicRecords$/, "Electronic records consent"],
  [/^position$/, "Position"],
  [/^firstName$/, "First name"],
  [/^middleName$/, "Middle name"],
  [/^lastName$/, "Last name"],
  [/^phone$/, "Phone number"],
  [/^email$/, "Email"],
  [/^dob$/, "Date of birth"],
  [/^street$/, "Street address"],
  [/^city$/, "City"],
  [/^state$/, "State"],
  [/^zip$/, "ZIP"],
  [/^addrSince$/, "Living at current address since"],
  [/^prevAddr(\d+)$/, (m) => `Previous address ${Number(m[1]) + 1}`],
  [/^licState$/, "CDL issuing state"],
  [/^licNumber$/, "CDL number"],
  [/^licExp$/, "CDL expiration"],
  [/^endorsements$/, "Endorsements"],
  [/^restrictions$/, "Restrictions"],
  [/^deniedExplanation$/, "License denial/suspension explanation"],
  [/^addlLic(\d+)$/, (m) => `Other license/permit ${Number(m[1]) + 1}`],
  [/^exp(\d+)$/, (m) => `Equipment ${Number(m[1]) + 1}`],
  [/^emp(\d+)$/, (m) => `Employer ${Number(m[1]) + 1}`],
];

function issueLabel(key) {
  for (const [re, label] of ISSUE_LABELS) {
    const m = re.exec(key);
    if (m) return typeof label === "function" ? label(m) : label;
  }
  return "";
}

export default function ApplicationClient() {
  const [app, setApp] = useState(EMPTY);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  // Steps the driver has attempted (Next/submit); their flags update live.
  const [attempted, setAttempted] = useState(() => new Set());
  const [status, setStatus] = useState("idle"); // idle | sending | ok | err
  const [serverMsg, setServerMsg] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [restored, setRestored] = useState(false);
  const headingRef = useRef(null);
  const successRef = useRef(null);
  const { widgetRef, token, reset: resetTurnstile, enabled: turnstileEnabled } = useTurnstile(
    step === STEPS.length - 1
  );

  // ---- draft persistence: a driver on a phone must survive interruptions ----
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const draft = JSON.parse(raw);
        if (draft && draft.app) {
          // Normalize pre-v4 drafts to the current shape (missing keys filled
          // from the templates, legacy cityState split) so restored entries
          // never feed undefined into controlled inputs or .trim().
          // Detect legacy (pre-v4) drafts BEFORE normalization strips the
          // markers: such drivers must re-walk the changed Experience (2) and
          // Employment (4) steps, so their restored step is clamped to 2.
          const isLegacyDraft =
            (Array.isArray(draft.app.employment) &&
              draft.app.employment.some(
                (x) => x && typeof x === "object" && "cityState" in x
              )) ||
            typeof draft.app?.historyComplete !== "boolean";
          // A pre-v5 draft still carries the free-text fullName and no
          // structured firstName: the name fields changed on step 0, so such
          // drivers re-walk from the start (clamp to 0, which also covers the
          // pre-v4 re-walk of steps 2 and 4 on the way forward).
          const draftPersonal =
            draft.app.personal && typeof draft.app.personal === "object"
              ? draft.app.personal
              : {};
          const isNameLegacyDraft =
            typeof draftPersonal.fullName === "string" &&
            !String(draftPersonal.firstName ?? "").trim();
          // A draft lacking license.endorsementCodes is a pre-v6 draft: the
          // CDL, address, and employment steps all changed, so the restored
          // step is clamped to 0 and the driver re-walks them.
          const draftLicense =
            draft.app.license && typeof draft.app.license === "object" ? draft.app.license : {};
          const isPreV6Draft = !Array.isArray(draftLicense.endorsementCodes);
          const merged = { ...EMPTY, ...draft.app };
          // Fill missing personal keys from the template, then best-effort
          // split a legacy fullName into the structured v5 fields. The
          // legacy key never enters state.
          merged.personal = { ...EMPTY.personal, ...draftPersonal };
          if (
            typeof merged.personal.fullName === "string" &&
            !String(merged.personal.firstName ?? "").trim() &&
            !String(merged.personal.lastName ?? "").trim()
          ) {
            const parts = splitFullName(merged.personal.fullName);
            // Clamp to the 60-char field caps — the legacy fullName allowed
            // 120, and programmatically-set values bypass input maxLength.
            merged.personal.firstName = parts.firstName.slice(0, 60);
            merged.personal.middleName = parts.middleName.slice(0, 60);
            merged.personal.lastName = parts.lastName.slice(0, 60);
          }
          delete merged.personal.fullName;
          if (typeof merged.personal.noMiddleName !== "boolean")
            merged.personal.noMiddleName = false;
          // v6 residence shape: month-precision "since" replaces the year-only
          // sinceYear. Never fabricate a month from a bare year — the driver
          // re-enters it on the re-walked step 0.
          const rawCa =
            merged.personal.currentAddress && typeof merged.personal.currentAddress === "object"
              ? merged.personal.currentAddress
              : {};
          merged.personal.currentAddress = { ...EMPTY.personal.currentAddress, ...rawCa };
          if (typeof merged.personal.currentAddress.since !== "string")
            merged.personal.currentAddress.since = "";
          delete merged.personal.currentAddress.sinceYear;
          merged.personal.previousAddresses = (
            Array.isArray(merged.personal.previousAddresses)
              ? merged.personal.previousAddresses
              : []
          ).map((a) => {
            const o = a && typeof a === "object" ? a : {};
            const entry = { ...EMPTY_PREV_ADDRESS };
            for (const k of Object.keys(EMPTY_PREV_ADDRESS)) {
              if (typeof o[k] === "string") entry[k] = o[k];
            }
            return entry;
          });
          // v6 license shape: endorsementCodes[] + restrictions replace the
          // free-text endorsements. A legacy value is parsed for standalone
          // H/N/T/P/S/X letters; "none"/empty/unrecognized restores to []
          // (not ["NONE"]) so the driver consciously picks None.
          merged.license = { ...EMPTY.license, ...draftLicense };
          merged.license.endorsementCodes = isPreV6Draft
            ? parseLegacyEndorsements(draftLicense.endorsements)
            : normalizeEndorsementCodes(draftLicense.endorsementCodes);
          delete merged.license.endorsements;
          if (typeof merged.license.restrictions !== "string") merged.license.restrictions = "";
          merged.experience = (Array.isArray(merged.experience) ? merged.experience : []).map(
            (x) => ({ ...EMPTY_EXPERIENCE, ...x })
          );
          merged.employment = (Array.isArray(merged.employment) ? merged.employment : []).map(
            (x) => {
              const entry = { ...EMPTY_EMPLOYMENT, ...x };
              if (
                !entry.city &&
                !entry.state &&
                typeof entry.cityState === "string" &&
                entry.cityState.trim()
              ) {
                const comma = entry.cityState.lastIndexOf(",");
                entry.city = (comma > -1 ? entry.cityState.slice(0, comma) : entry.cityState).trim();
                entry.state = comma > -1 ? entry.cityState.slice(comma + 1).trim() : "";
              }
              delete entry.cityState;
              // v6: the state select stores a 2-letter code (or the Other
              // (non-US) literal) — legacy free-text values are mapped when
              // possible, else cleared for re-entry.
              entry.state = normalizeStateValue(entry.state);
              // Tampered/hand-edited drafts bypass the inputs' maxLength —
              // cap the stored identifiers the way the fields do (mirrors
              // the backend's 12-char limits).
              entry.usdotNumber = String(entry.usdotNumber ?? "").slice(0, 12);
              entry.mcNumber = String(entry.mcNumber ?? "").slice(0, 12);
              if (typeof entry.leasedDuringPeriod !== "boolean") entry.leasedDuringPeriod = null;
              if (!["active", "inactive", "revoked"].includes(entry.authorityStatus))
                entry.authorityStatus = "";
              return entry;
            }
          );
          if (typeof merged.historyComplete !== "boolean") merged.historyComplete = false;
          if (!merged.gapExplanations || typeof merged.gapExplanations !== "object")
            merged.gapExplanations = {};
          delete merged.gapsExplanation;
          setApp(merged);
          setStep(
            Math.min(
              draft.step ?? 0,
              isNameLegacyDraft || isPreV6Draft ? 0 : isLegacyDraft ? 2 : STEPS.length - 1
            )
          );
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
  // Pure issue collector: returns the errors object for a step WITHOUT
  // touching state, so the Review step's "Ready to sign?" checklist can run
  // the same rules against current data. validateStep wraps it with setErrors
  // — the rules live in exactly one place.
  const collectStepErrors = (s) => {
    const e = {};
    if (s === 0) {
      if (!app.consents.electronicRecords) e.electronicRecords = "Required to continue electronically";
      if (!app.position) e.position = "Select the position you're applying for";
      if (!app.personal.firstName.trim()) e.firstName = "Required";
      if (!app.personal.noMiddleName && !app.personal.middleName.trim())
        e.middleName = "Middle name is required — or check 'I have no middle name'";
      if (!app.personal.lastName.trim()) e.lastName = "Required";
      if (!US_PHONE(app.personal.phone)) e.phone = "Enter a valid US phone number";
      if (app.personal.email && !EMAIL_REGEX.test(app.personal.email.trim())) e.email = "Enter a valid email or leave blank";
      if (!app.personal.dob) e.dob = "Required";
      const ca = app.personal.currentAddress;
      if (!ca.street.trim()) e.street = "Required";
      if (!ca.city.trim()) e.city = "Required";
      if (!ca.state.trim()) e.state = "Required";
      if (!ca.zip.trim()) e.zip = "Required";
      // Address months can't be in the future — field-scoped, and checked
      // BEFORE the coverage rule so a future date gets its own message
      // (the sentence is byte-identical in the backend).
      const nowIdx = currentMonthIndex();
      const sinceIdx = monthIndex(ca.since);
      if (sinceIdx === null) e.addrSince = "Required";
      else if (sinceIdx > nowIdx) e.addrSince = "Address dates can't be in the future.";
      app.personal.previousAddresses.forEach((a, i) => {
        const fromIdx = monthIndex(a.from);
        const toIdx = monthIndex(a.to);
        if (!a.street.trim() || !a.city.trim() || !a.state.trim() || !a.zip.trim())
          e[`prevAddr${i}`] = "Complete this address or remove it";
        else if (fromIdx === null || toIdx === null || toIdx < fromIdx)
          e[`prevAddr${i}`] = "Dates must be real months, and From must come before To.";
        else if (fromIdx > nowIdx || toIdx > nowIdx)
          e[`prevAddr${i}`] = "Address dates can't be in the future.";
      });
      // v6 coverage rule (mirrored in the backend): merged address intervals
      // must cover the last 36 months — no per-gap explanations, just the
      // blocking sentence for the first uncovered range.
      const resGap = firstResidenceGap(ca, app.personal.previousAddresses);
      if (resGap) e.addrCoverage = residenceCoverageError(resGap);
    }
    if (s === 1) {
      if (!app.license.state.trim()) e.licState = "Required";
      if (!app.license.number.trim()) e.licNumber = "Required";
      if (!app.license.expiration) e.licExp = "Required";
      if (!app.license.endorsementCodes.length)
        e.endorsements = "Select your endorsement(s) — or check 'None'";
      // Backend-mirrored sanity rule (known codes, no duplicates, 'None'
      // exclusive) — only reachable via a tampered draft, but it keeps the
      // Ready-to-sign checklist from passing a payload the backend rejects.
      else if (!endorsementCodesValid(app.license.endorsementCodes))
        e.endorsements = "Your endorsement selection is invalid — please re-select.";
      if (!app.license.restrictions.trim())
        e.restrictions = "Required — enter 'None' if your CDL shows none";
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
        // Miles rule mirrors the backend: strip commas, all digits, > 0.
        const rawMiles = String(x.approxMiles ?? "").trim();
        const milesDigits = rawMiles.replace(/,/g, "");
        const milesOk =
          rawMiles.length <= 12 && /^\d+$/.test(milesDigits) && parseInt(milesDigits, 10) > 0;
        if (!x.equipmentType || !String(x.years).trim() || !rawMiles)
          e[`exp${i}`] = "Equipment type, years, and approximate miles are required";
        else if (!milesOk)
          e[`exp${i}`] = "Approximate miles must be a number greater than zero — e.g. 400,000";
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
        // Dates mirror mergeIntervals: from must parse, and either the entry
        // is current or to parses and doesn't precede from — otherwise the
        // entry would be silently dropped from gap detection.
        const fromIdx = monthIndex(x.from);
        const toIdx = monthIndex(x.to);
        const toIsPresent = /^present$/i.test(String(x.to ?? "").trim());
        const datesOk =
          fromIdx !== null && (x.current || toIsPresent || (toIdx !== null && toIdx >= fromIdx));
        // v6: position is required and reason for leaving needs substance.
        const baseOk =
          x.employer.trim() &&
          x.street.trim() &&
          x.city.trim() &&
          x.state.trim() &&
          x.zip.trim() &&
          US_PHONE(x.phone) &&
          x.position.trim() &&
          x.reasonForLeaving.trim();
        const usdot = String(x.usdotNumber ?? "").trim();
        if (!baseOk)
          e[`emp${i}`] =
            "Employer, street, city, state, ZIP, phone, position, from/to dates, and reason for leaving are required";
        else if (!datesOk)
          e[`emp${i}`] = "Dates must be real months, and From must come before To.";
        else if (x.reasonForLeaving.trim().length < 3)
          e[`emp${i}`] = "Reason for leaving must be at least 3 characters.";
        else if (!zipOk(x.zip, x.state))
          e[`emp${i}`] = "ZIP must be 5 digits (or ZIP+4, like 39209-1234).";
        else if (x.selfEmployed && !USDOT_RE.test(usdot))
          e[`emp${i}`] = "Your company's USDOT number is required — digits only.";
        // The optional company-USDOT field is only rendered for FMCSR-subject,
        // non-self-employed entries — the format rule matches its visibility
        // (a hidden value can't block the driver with no field to fix).
        else if (x.fmcsrSubject && !x.selfEmployed && usdot && !USDOT_RE.test(usdot))
          e[`emp${i}`] = "USDOT number must be digits only.";
        else if (String(x.mcNumber ?? "").trim().length > 12)
          e[`emp${i}`] = "MC number must be 12 characters or fewer.";
        else if (
          x.selfEmployed &&
          !["active", "inactive", "revoked"].includes(x.authorityStatus)
        )
          e[`emp${i}`] = "Select your authority status for this period.";
        else if (
          x.selfEmployed &&
          x.leasedDuringPeriod !== true &&
          x.leasedDuringPeriod !== false
        )
          e[`emp${i}`] =
            "Answer whether you were leased to another motor carrier during this period.";
        else if (x.selfEmployed && x.safetySensitive && !x.tpaName.trim())
          e[`emp${i}`] =
            "Add the testing consortium/TPA for your self-employed period — or, if this period wasn't actually subject to DOT drug & alcohol testing, uncheck that box.";
        else if (x.selfEmployed && x.safetySensitive && !US_PHONE(x.tpaPhone))
          e[`emp${i}`] = "Add a valid US phone number for the consortium/TPA.";
      });
      if (detectGaps(app.employment).some((g) => !String(app.gapExplanations[g.key] ?? "").trim()))
        e.empGaps = "Please explain the highlighted employment gap(s)";
      if (!app.historyComplete)
        e.historyComplete =
          "Please confirm your employment history is complete — or add the missing employers";
      // Experience-vs-history cross-check (mirrored in the backend): claimed
      // driving years can't meaningfully exceed the history's coverage unless
      // the full 10 years are already covered.
      const cov = coverageYears(app.employment);
      const maxYears = maxExperienceYears(app.experience);
      if (cov !== null && cov < 10 && maxYears !== null && maxYears > cov + 1) {
        // Earliest entry by parsed month index (not lexicographic sort of the
        // raw strings, which mis-orders whitespace-padded input).
        const earliestEntry = app.employment.reduce((best, x) => {
          const idx = monthIndex(x.from);
          if (idx === null) return best;
          return best === null || idx < monthIndex(best.from) ? x : best;
        }, null);
        e.empCoverage = `Your Driving Experience lists ${maxYears} years, but your employment history only goes back to ${formatMonthYear(String(earliestEntry.from).trim())}. Add the earlier driving jobs, or correct the years on the Driving Experience step.`;
      }
    }
    if (s === 5) {
      if (!app.consents.fcra.authorized)
        e.fcraAuthorized = "Required — we can't order any background report without it";
      if (!app.consents.fcra.signature.trim()) e.fcraSignature = "Type your full legal name";
    }
    if (s === 6) {
      if (!app.consents.psp.signature.trim()) e.pspSignature = "Type your full legal name to sign";
    }
    if (s === 7) {
      const da = app.consents.drugAlcohol;
      if (da.selfReport !== true && da.selfReport !== false) e.selfReport = "Please answer yes or no";
      if (da.selfReport === true && !da.selfReportExplanation.trim())
        e.selfReportExplanation = "Please explain briefly";
      if (!da.signature.trim()) e.daSignature = "Type your full legal name to sign";
      if (!app.consents.clearinghouseAck) e.clearinghouseAck = "Required";
    }
    if (s === 8) {
      if (!app.certification.signature.trim()) e.signature = "Type your full legal name";
      if (!app.certification.esignConsent) e.esignConsent = "Required to sign electronically";
    }
    return e;
  };

  const validateStep = (s) => {
    const e = collectStepErrors(s);
    setErrors(e);
    // Once a step has been validated, keep flagging it live (effect below).
    setAttempted((prev) => (prev.has(s) ? prev : new Set(prev).add(s)));
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validateStep(step)) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  // Live flagging: once a step has been attempted, re-run its pure collector
  // on every change while the driver is on it — missing-field flags clear as
  // they type and reappear immediately if a required value is blanked, with
  // no second press of Next needed to see what's still missing.
  useEffect(() => {
    if (attempted.has(step)) setErrors(collectStepErrors(step));
    // collectStepErrors is re-created each render from current state; app and
    // step are the real inputs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app, step, attempted]);

  const submit = async () => {
    // Re-validate EVERY earlier step against CURRENT data before submitting:
    // a restored draft may predate rule changes (v6 added endorsements to
    // step 1 and residence coverage to step 0), and gap detection depends on
    // the current month (a driver who paused over a month boundary could
    // otherwise submit a stale, empty gap explanation).
    // Runs before setStatus("sending"), so an early return leaves the form idle.
    for (const s of [0, 1, 2, 3, 4, 5, 6, 7]) {
      if (!validateStep(s)) {
        setStep(s);
        return;
      }
    }
    if (!validateStep(STEPS.length - 1)) return;
    setStatus("sending");
    setServerMsg("");
    try {
      const detectedGaps = detectGaps(app.employment);
      const payload = {
        formVersion: 6,
        position: app.position,
        // v5 sends the structured name parts only — the backend derives the
        // composed fullName from them. When noMiddleName is checked the
        // middle name is sent empty.
        personal: {
          ...app.personal,
          firstName: app.personal.firstName.trim(),
          middleName: app.personal.noMiddleName ? "" : app.personal.middleName.trim(),
          lastName: app.personal.lastName.trim(),
          email: app.personal.email.trim(),
        },
        // v6 sends endorsementCodes[] + restrictions (no free-text
        // endorsements key exists in state anymore).
        license: { ...app.license, restrictions: app.license.restrictions.trim() },
        additionalLicenses: app.additionalLicenses,
        experience: app.experience,
        accidents: app.accidents,
        violations: app.violations,
        employment: app.employment.map((x) => {
          const entry = {
            ...x,
            from: String(x.from ?? "").trim(),
            to: x.current ? "Present" : String(x.to ?? "").trim(),
            usdotNumber: String(x.usdotNumber ?? "").trim(),
            mcNumber: String(x.mcNumber ?? "").trim(),
          };
          delete entry.cityState; // legacy key — v4 sends city/state/zip instead
          return entry;
        }),
        employmentGaps: detectedGaps.map((g) => ({
          from: g.from,
          to: g.to,
          explanation: String(app.gapExplanations[g.key] ?? "").trim(),
        })),
        historyComplete: app.historyComplete,
        consents: {
          electronicRecords: app.consents.electronicRecords,
          fcra: { ...app.consents.fcra, signature: app.consents.fcra.signature.trim() },
          psp: { signature: app.consents.psp.signature.trim() },
          drugAlcohol: {
            ...app.consents.drugAlcohol,
            signature: app.consents.drugAlcohol.signature.trim(),
          },
          clearinghouseAck: app.consents.clearinghouseAck,
        },
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
            Thanks, {app.personal.firstName.trim()}. Your application is in — we&apos;ll call you at{" "}
            <span className="font-bold">{app.personal.phone}</span> from{" "}
            <span className="font-bold">{RECRUITING_PHONE_DISPLAY}</span>, so save the number.
          </p>
          <p className="text-white/80 flex items-start gap-2 mb-4">
            <ShieldCheck aria-hidden className="w-5 h-5 mt-1 shrink-0" />
            Your Social Security Number is never collected online. We&apos;ll collect it when we
            call you, add it to your application, and you&apos;ll sign the completed application
            before your first dispatch. Never send it by email or text.
          </p>
          <div className="bg-white/10 rounded-xl p-4">
            <p className="font-bold mb-1">One thing to do right now:</p>
            <p className="text-white/90">
              Register (or log in) at{" "}
              <a
                href="https://clearinghouse.fmcsa.dot.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 font-bold"
              >
                clearinghouse.fmcsa.dot.gov
              </a>{" "}
              and approve the consent request from Forbes Logistix. Federal rules require your
              electronic consent inside the Clearinghouse before you can drive — we can&apos;t
              complete your hire without it. You&apos;ll need your CDL number and state.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const per = app.personal;
  const lic = app.license;
  // Derived from the employer date ranges — each detected gap gets its own
  // required explanation, keyed "from|to" so entries survive re-detection.
  const detectedGaps = detectGaps(app.employment);
  // v6: computed guidance dates for the employment step, at render time.
  const nowMi = currentMonthIndex();
  // v6 "Ready to sign?" checklist: run the pure collectors for the data steps
  // against current state. The signature/submit UI stays hidden until empty.
  const reviewIssues =
    step === STEPS.length - 1
      ? [0, 1, 2, 3, 4, 5, 6, 7].flatMap((s) =>
          Object.entries(collectStepErrors(s)).map(([key, message]) => ({
            step: s,
            key,
            message,
          }))
        )
      : [];

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
          Step {step + 1} of {STEPS.length} · takes about 20 minutes · your progress saves on this
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
            We will never ask for your Social Security Number online. We&apos;ll collect it by
            phone after you submit, and you&apos;ll sign the completed application before your
            first dispatch — never send it by email or text.
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
              {/* 49 CFR 390.32(d) / 15 U.S.C. 7001(c): consent to electronic
                  records & signatures — captured before anything is signed. */}
              <div className="border border-black/10 bg-gray-50 rounded-xl p-4">
                <label className="flex items-start gap-3 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={app.consents.electronicRecords}
                    onChange={(e) => set("consents.electronicRecords", e.target.checked)}
                    className="mt-1 h-4 w-4 accent-black"
                    aria-invalid={errors.electronicRecords ? true : undefined}
                  />
                  <span>{ESIGN_RECORDS_CONSENT}</span>
                </label>
                {errors.electronicRecords && <p className={errCls}>{errors.electronicRecords}</p>}
              </div>
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
              {/* v5: structured legal name — the backend composes the full
                  name from these parts for the PDF and email. */}
              <Field id="firstName" label="First name" error={errors.firstName}>
                <TextInput
                  id="firstName"
                  value={per.firstName}
                  onChange={(e) => set("personal.firstName", e.target.value)}
                  error={errors.firstName}
                  autoComplete="given-name"
                  maxLength={60}
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field id="middleName" label="Middle name" error={errors.middleName}>
                  <TextInput
                    id="middleName"
                    value={per.middleName}
                    onChange={(e) => set("personal.middleName", e.target.value)}
                    error={errors.middleName}
                    autoComplete="additional-name"
                    maxLength={60}
                    disabled={per.noMiddleName}
                    className={`${inputCls} disabled:bg-gray-100 disabled:text-gray-400`}
                  />
                </Field>
                <Field id="lastName" label="Last name" error={errors.lastName}>
                  <TextInput
                    id="lastName"
                    value={per.lastName}
                    onChange={(e) => set("personal.lastName", e.target.value)}
                    error={errors.lastName}
                    autoComplete="family-name"
                    maxLength={60}
                  />
                </Field>
              </div>
              <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={per.noMiddleName}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    // One atomic update: checking the box also clears the
                    // middle name (it must be sent empty in that case).
                    setApp((prev) => ({
                      ...prev,
                      personal: {
                        ...prev.personal,
                        noMiddleName: checked,
                        middleName: checked ? "" : prev.personal.middleName,
                      },
                    }));
                    if (checked)
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.middleName;
                        return next;
                      });
                  }}
                  className="h-4 w-4 accent-black"
                />
                I have no middle name
              </label>
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
                <Field id="addrSince" label="Living here since (month)" error={errors.addrSince}>
                  <TextInput
                    id="addrSince"
                    type="month"
                    value={per.currentAddress.since}
                    onChange={(e) => set("personal.currentAddress.since", e.target.value)}
                    error={errors.addrSince}
                    placeholder="YYYY-MM"
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
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor={`pa-from-${i}`} className="block text-sm text-gray-600 mb-1">
                        Lived here from
                      </label>
                      <TextInput
                        id={`pa-from-${i}`}
                        type="month"
                        value={a.from}
                        onChange={(e) => setListItem("personal.previousAddresses", i, "from", e.target.value)}
                        placeholder="YYYY-MM"
                      />
                    </div>
                    <div>
                      <label htmlFor={`pa-to-${i}`} className="block text-sm text-gray-600 mb-1">
                        To
                      </label>
                      <TextInput
                        id={`pa-to-${i}`}
                        type="month"
                        value={a.to}
                        onChange={(e) => setListItem("personal.previousAddresses", i, "to", e.target.value)}
                        placeholder="YYYY-MM"
                      />
                    </div>
                  </div>
                  {errors[`prevAddr${i}`] && <p className={errCls}>{errors[`prevAddr${i}`]}</p>}
                </div>
              ))}
              {per.previousAddresses.length < 12 && (
                <AddButton
                  onClick={() => addListItem("personal.previousAddresses", { ...EMPTY_PREV_ADDRESS })}
                  label="Add previous address"
                />
              )}
              {errors.addrCoverage && (
                <p role="alert" className={errCls}>
                  {errors.addrCoverage}
                </p>
              )}
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
              {/* v6: endorsement checkboxes — "None" is mutually exclusive
                  with the letter codes (handled by toggleEndorsement). */}
              <fieldset>
                <legend className={labelCls}>Endorsements (as shown on your CDL)</legend>
                <div className="flex flex-wrap gap-2">
                  {ENDORSEMENTS.map((en) => (
                    <label
                      key={en.code}
                      className={`flex items-center gap-2 text-sm border rounded-lg px-3 py-2 cursor-pointer ${
                        lic.endorsementCodes.includes(en.code)
                          ? "border-black bg-gray-50"
                          : "border-gray-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={lic.endorsementCodes.includes(en.code)}
                        onChange={() =>
                          set(
                            "license.endorsementCodes",
                            toggleEndorsement(lic.endorsementCodes, en.code)
                          )
                        }
                        className="h-4 w-4 accent-black"
                      />
                      {en.code} ({en.label})
                    </label>
                  ))}
                  <label
                    className={`flex items-center gap-2 text-sm border rounded-lg px-3 py-2 cursor-pointer ${
                      lic.endorsementCodes.includes(NONE_CODE)
                        ? "border-black bg-gray-50"
                        : "border-gray-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={lic.endorsementCodes.includes(NONE_CODE)}
                      onChange={() =>
                        set(
                          "license.endorsementCodes",
                          toggleEndorsement(lic.endorsementCodes, NONE_CODE)
                        )
                      }
                      className="h-4 w-4 accent-black"
                      aria-invalid={errors.endorsements ? true : undefined}
                    />
                    None
                  </label>
                </div>
                {errors.endorsements && <p className={errCls}>{errors.endorsements}</p>}
              </fieldset>
              <Field
                id="restrictions"
                label="Restrictions (as shown on your CDL — or 'None')"
                error={errors.restrictions}
              >
                <TextInput
                  id="restrictions"
                  value={lic.restrictions}
                  onChange={(e) => set("license.restrictions", e.target.value)}
                  error={errors.restrictions}
                  maxLength={80}
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
                    <div>
                      <TextInput
                        id={`exp-miles-${i}`}
                        inputMode="numeric"
                        value={x.approxMiles}
                        onChange={(e) => setListItem("experience", i, "approxMiles", e.target.value)}
                        placeholder="Approx. miles"
                        maxLength={12}
                        aria-label="Approximate miles"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        Best estimate is fine — e.g. 400,000.
                      </p>
                    </div>
                  </div>
                  {errors[`exp${i}`] && <p className={errCls}>{errors[`exp${i}`]}</p>}
                </div>
              ))}
              {app.experience.length < 8 && (
                <AddButton
                  onClick={() => addListItem("experience", { ...EMPTY_EXPERIENCE })}
                  label="Add equipment type"
                />
              )}
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
                <p className="mb-2">
                  The employment history you provide may be used, and your previous DOT-regulated
                  employers will be contacted, to investigate your safety performance history as
                  required by 49 CFR 391.23(d) and (e) — including your accident history and your
                  alcohol and controlled substances testing history.
                </p>
                <p>
                  Your rights under 49 CFR 391.23(i): (1) you may review the information previous
                  employers provide; (2) you may have errors corrected by the previous employer and
                  the corrected information re-sent to us; (3) if you and a previous employer cannot
                  agree on its accuracy, you may attach a rebuttal statement. To review the
                  information, send us a written request any time from now until 30 days after
                  you&apos;re employed or notified that employment was denied; we&apos;ll provide it
                  within 5 business days of your request (or of receiving it from your previous
                  employer). If you don&apos;t arrange to review the records within 30 days of us
                  making them available, we may treat the request as waived.
                </p>
              </div>
              {/* v6: guidance with computed dates, evaluated at render. */}
              <p className="text-sm text-gray-600">
                List every employer for the last 3 years (since {formatMonthIndex(nowMi - 36)}).
                Because this is a CDL position, also list every employer you drove a commercial
                motor vehicle for in the 7 years before that (back to {formatMonthIndex(nowMi - 120)}).
              </p>
              {app.position === "owner-operator-flatbed" && (
                <p className="text-sm text-gray-600">
                  Owner-operators: list your own operation as an employer for the time you ran under
                  your own authority (use your business name and address). Check &quot;my own
                  company&quot; on that entry.
                </p>
              )}
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
                  <TextInput
                    id={`emp-phone-${i}`}
                    type="tel"
                    inputMode="tel"
                    value={x.phone}
                    onChange={(e) => setListItem("employment", i, "phone", e.target.value)}
                    placeholder="Company phone"
                    maxLength={32}
                    aria-label="Employer phone"
                  />
                  <div className="grid grid-cols-3 gap-3">
                    <TextInput
                      id={`emp-city-${i}`}
                      value={x.city}
                      onChange={(e) => setListItem("employment", i, "city", e.target.value)}
                      placeholder="City"
                      maxLength={100}
                      aria-label="Employer city"
                    />
                    {/* v6: select storing the 2-letter code (or the Other
                        (non-US) literal, which relaxes the ZIP rule). */}
                    <select
                      id={`emp-state-${i}`}
                      value={x.state}
                      onChange={(e) => setListItem("employment", i, "state", e.target.value)}
                      aria-label="Employer state"
                      className={inputCls}
                    >
                      <option value="">State…</option>
                      {US_STATES.map((s) => (
                        <option key={s.code} value={s.code}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                    <TextInput
                      id={`emp-zip-${i}`}
                      inputMode="numeric"
                      value={x.zip}
                      onChange={(e) => setListItem("employment", i, "zip", e.target.value)}
                      placeholder="ZIP"
                      maxLength={12}
                      aria-label="Employer ZIP"
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
                        onChange={(e) => {
                          const checked = e.target.checked;
                          // One atomic update (same pattern as the
                          // noMiddleName clear): unchecking FMCSR on a
                          // non-self-employed entry hides the optional
                          // company USDOT field, so its value is cleared
                          // too — a hidden leftover could otherwise fail
                          // validation with no visible field to fix.
                          setApp((prev) => {
                            const next = structuredClone(prev);
                            const entry = next.employment[i];
                            entry.fmcsrSubject = checked;
                            if (!checked && !entry.selfEmployed) entry.usdotNumber = "";
                            return next;
                          });
                        }}
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
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={x.selfEmployed}
                        onChange={(e) => setListItem("employment", i, "selfEmployed", e.target.checked)}
                        className="h-4 w-4 accent-black"
                      />
                      This was my own company (self-employed / own authority)
                    </label>
                  </div>
                  {/* v6: optional company USDOT for FMCSR-regulated employers
                      (the self-employed block below has its own required
                      field on the same key). */}
                  {x.fmcsrSubject && !x.selfEmployed && (
                    <Field id={`emp-usdot-${i}`} label="Company USDOT number (optional)">
                      <TextInput
                        id={`emp-usdot-${i}`}
                        inputMode="numeric"
                        value={x.usdotNumber}
                        onChange={(e) => setListItem("employment", i, "usdotNumber", e.target.value)}
                        maxLength={12}
                      />
                    </Field>
                  )}
                  {x.selfEmployed && (
                    <div className="space-y-3">
                      <Field id={`emp-usdot-${i}`} label="Your company's USDOT number">
                        <TextInput
                          id={`emp-usdot-${i}`}
                          inputMode="numeric"
                          value={x.usdotNumber}
                          onChange={(e) => setListItem("employment", i, "usdotNumber", e.target.value)}
                          maxLength={12}
                        />
                      </Field>
                      <Field
                        id={`emp-mc-${i}`}
                        label="MC number (optional)"
                        hint="if you had for-hire authority"
                      >
                        <TextInput
                          id={`emp-mc-${i}`}
                          value={x.mcNumber}
                          onChange={(e) => setListItem("employment", i, "mcNumber", e.target.value)}
                          maxLength={12}
                        />
                      </Field>
                      <fieldset>
                        <legend className={labelCls}>Authority status today</legend>
                        <div
                          className="flex gap-6"
                          role="radiogroup"
                          aria-label="Authority status today"
                        >
                          {[
                            { v: "active", label: "Active" },
                            { v: "inactive", label: "Inactive" },
                            { v: "revoked", label: "Revoked" },
                          ].map((o) => (
                            <label
                              key={o.v}
                              className="flex items-center gap-2 text-sm cursor-pointer"
                            >
                              <input
                                type="radio"
                                name={`emp-authority-${i}`}
                                checked={x.authorityStatus === o.v}
                                onChange={() =>
                                  setListItem("employment", i, "authorityStatus", o.v)
                                }
                                className="h-4 w-4 accent-black"
                              />
                              {o.label}
                            </label>
                          ))}
                        </div>
                      </fieldset>
                      <Field
                        id={`emp-tpa-${i}`}
                        label="Random-pool consortium / TPA (for this self-employed period)"
                        hint="The consortium (C/TPA) that ran your DOT random drug & alcohol testing pool while you drove for your own company."
                      >
                        <TextInput
                          id={`emp-tpa-${i}`}
                          value={x.tpaName}
                          onChange={(e) => setListItem("employment", i, "tpaName", e.target.value)}
                          maxLength={150}
                        />
                      </Field>
                      <Field id={`emp-tpa-phone-${i}`} label="Consortium/TPA phone">
                        <TextInput
                          id={`emp-tpa-phone-${i}`}
                          type="tel"
                          inputMode="tel"
                          value={x.tpaPhone}
                          onChange={(e) => setListItem("employment", i, "tpaPhone", e.target.value)}
                          maxLength={32}
                        />
                      </Field>
                      <fieldset>
                        <legend className={labelCls}>
                          During this period, were you ever leased to another motor carrier?
                        </legend>
                        <div
                          className="flex gap-6"
                          role="radiogroup"
                          aria-label="Leased to another motor carrier during this period"
                        >
                          {[
                            { v: true, label: "Yes" },
                            { v: false, label: "No" },
                          ].map((o) => (
                            <label
                              key={String(o.v)}
                              className="flex items-center gap-2 text-sm cursor-pointer"
                            >
                              <input
                                type="radio"
                                name={`emp-leased-${i}`}
                                checked={x.leasedDuringPeriod === o.v}
                                onChange={() =>
                                  setListItem("employment", i, "leasedDuringPeriod", o.v)
                                }
                                className="h-4 w-4 accent-black"
                              />
                              {o.label}
                            </label>
                          ))}
                        </div>
                        {x.leasedDuringPeriod === true && (
                          <p className="mt-2 text-sm text-gray-600">
                            Leased periods: that carrier is a DOT-regulated previous employer —
                            add it as its own employer entry with the dates you were leased.
                          </p>
                        )}
                      </fieldset>
                    </div>
                  )}
                  {errors[`emp${i}`] && <p className={errCls}>{errors[`emp${i}`]}</p>}
                </div>
              ))}
              {app.employment.length < 15 && (
                <AddButton
                  onClick={() => addListItem("employment", { ...EMPTY_EMPLOYMENT })}
                  label="Add employer"
                />
              )}
              {detectedGaps.map((g) => {
                const gapError =
                  errors.empGaps && !String(app.gapExplanations[g.key] ?? "").trim()
                    ? "Required"
                    : undefined;
                return (
                  <div key={g.key} className="border border-amber-300 bg-amber-50 rounded-xl p-4 space-y-2">
                    <p className="font-semibold">
                      Gap: {formatMonthYear(g.from)} – {formatMonthYear(g.to)}
                    </p>
                    <TextInput
                      id={`gap-${g.key}`}
                      value={app.gapExplanations[g.key] || ""}
                      onChange={(e) => set(`gapExplanations.${g.key}`, e.target.value)}
                      placeholder="What were you doing during this period?"
                      maxLength={300}
                      aria-label={`Explanation for gap ${formatMonthYear(g.from)} to ${formatMonthYear(g.to)}`}
                      error={gapError}
                    />
                    {gapError && (
                      <p id={`gap-${g.key}-error`} className={errCls}>
                        {gapError}
                      </p>
                    )}
                    <p className="text-sm text-gray-500">
                      A sentence is fine — e.g. &apos;Non-driving warehouse work&apos; or &apos;Home
                      with family.&apos;
                    </p>
                  </div>
                );
              })}
              {errors.empGaps && <p className={errCls}>{errors.empGaps}</p>}
              <div className="border border-black/10 bg-gray-50 rounded-xl p-4">
                <label className="flex items-start gap-3 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={app.historyComplete}
                    onChange={(e) => set("historyComplete", e.target.checked)}
                    className="mt-1 h-4 w-4 accent-black"
                    aria-invalid={errors.historyComplete ? true : undefined}
                  />
                  <span>
                    I certify I have listed all employers for the past 3 years (driving or not),
                    and every job where I operated a commercial motor vehicle in the past 10 years.
                    Other than the jobs listed above, I have not operated a commercial motor
                    vehicle at any time in the past 10 years.
                  </span>
                </label>
                {errors.historyComplete && <p className={errCls}>{errors.historyComplete}</p>}
              </div>
              {errors.empCoverage && (
                <p role="alert" className={errCls}>
                  {errors.empCoverage}
                </p>
              )}
            </>
          )}

          {/* ================= STEP 5: FCRA disclosures + authorization ================= */}
          {step === 5 && (
            <>
              <p className="text-sm text-gray-600">
                Federal law requires these disclosures before we can order any background report
                (criminal record, driving record, employment verification). Each box below is its
                own document — please read each one.
              </p>
              {/* Standalone FCRA disclosure — this card must contain the
                  disclosure and nothing else (15 U.S.C. 1681b(b)(2)(A)). */}
              <div className="border border-black rounded-xl p-4 md:p-6">
                <p className="font-bold text-center mb-3">DISCLOSURE REGARDING BACKGROUND REPORTS</p>
                <p className="text-sm leading-relaxed">{FCRA_DISCLOSURE}</p>
              </div>
              <div className="border border-black rounded-xl p-4 md:p-6">
                <p className="font-bold text-center mb-3">INVESTIGATIVE CONSUMER REPORT DISCLOSURE</p>
                <p className="text-sm leading-relaxed">
                  {FCRA_INVESTIGATIVE}{" "}
                  <a
                    href={CFPB_SUMMARY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 font-semibold"
                  >
                    A Summary of Your Rights Under the Fair Credit Reporting Act (PDF)
                  </a>
                  .
                </p>
              </div>
              <div className="border border-black rounded-xl p-4 md:p-6 space-y-4">
                <p className="font-bold text-center">AUTHORIZATION OF BACKGROUND REPORTS</p>
                <p className="text-sm leading-relaxed">{FCRA_AUTHORIZATION}</p>
                <label className="flex items-start gap-3 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={app.consents.fcra.authorized}
                    onChange={(e) => set("consents.fcra.authorized", e.target.checked)}
                    className="mt-1 h-4 w-4 accent-black"
                    aria-invalid={errors.fcraAuthorized ? true : undefined}
                  />
                  <span>
                    I have read both disclosures above and I authorize Forbes Logistix LLC to
                    obtain background reports about me as described.
                  </span>
                </label>
                {errors.fcraAuthorized && <p className={errCls}>{errors.fcraAuthorized}</p>}
                <label className="flex items-start gap-3 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={app.consents.fcra.freeCopy}
                    onChange={(e) => set("consents.fcra.freeCopy", e.target.checked)}
                    className="mt-1 h-4 w-4 accent-black"
                  />
                  <span>{FCRA_FREE_COPY_LABEL}</span>
                </label>
                <Field id="fcra-signature" label="Sign by typing your full legal name" error={errors.fcraSignature}>
                  <TextInput
                    id="fcra-signature"
                    value={app.consents.fcra.signature}
                    onChange={(e) => set("consents.fcra.signature", e.target.value)}
                    error={errors.fcraSignature}
                    maxLength={120}
                    autoComplete="off"
                  />
                </Field>
              </div>
            </>
          )}

          {/* ================= STEP 6: PSP — FMCSA-mandated form, verbatim and
              standalone. Nothing else may share this step. ================= */}
          {step === 6 && (
            <div className="border border-black rounded-xl p-4 md:p-6 space-y-3">
              <p className="text-[11px] font-bold text-center text-gray-500">{PSP_BANNER}</p>
              <p className="font-bold text-center text-lg leading-snug">
                IMPORTANT DISCLOSURE
                <br />
                REGARDING BACKGROUND REPORTS FROM THE PSP Online Service
              </p>
              {PSP_DISCLOSURE_PARAGRAPHS.map((t, i) => (
                <p key={i} className="text-sm leading-relaxed">
                  {t}
                </p>
              ))}
              <p className="font-bold text-center pt-2">AUTHORIZATION</p>
              <p className="text-sm leading-relaxed">{PSP_AUTH_LEAD}</p>
              {PSP_AUTH_PARAGRAPHS.map((t, i) => (
                <p key={i} className="text-sm leading-relaxed">
                  {t}
                </p>
              ))}
              <Field id="psp-signature" label="Sign by typing your full legal name" error={errors.pspSignature}>
                <TextInput
                  id="psp-signature"
                  value={app.consents.psp.signature}
                  onChange={(e) => set("consents.psp.signature", e.target.value)}
                  error={errors.pspSignature}
                  maxLength={120}
                  autoComplete="off"
                />
              </Field>
              <p className="text-sm text-gray-600">
                The date is recorded automatically when you submit this application.
              </p>
              {PSP_NOTICES.map((t, i) => (
                <p key={i} className="text-xs text-gray-500 leading-relaxed">
                  {t}
                </p>
              ))}
              <p className="text-xs text-gray-500">LAST UPDATED 2/11/2016</p>
            </div>
          )}

          {/* ================= STEP 7: drug & alcohol history ================= */}
          {step === 7 && (
            <>
              <div className="border border-black rounded-xl p-4 md:p-6 space-y-4">
                <p className="font-bold text-center">
                  AUTHORIZATION TO RELEASE DRUG AND ALCOHOL TESTING INFORMATION (49 CFR 40.25 /
                  391.23(e))
                </p>
                <p className="text-sm leading-relaxed">{DA_RELEASE}</p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  For previous employers regulated by FMCSA, drug and alcohol history is obtained
                  through the FMCSA Drug &amp; Alcohol Clearinghouse (49 CFR 391.23(e)(4)); this
                  release supports direct requests to employers regulated by other DOT agencies and
                  retrieval of any follow-up testing plan.
                </p>
                <div>
                  <p className="font-medium text-gray-800 mb-2">
                    Self-report (49 CFR 40.25(j)): in the past three (3) years, have you tested
                    positive, or refused to test, on any pre-employment drug or alcohol test given
                    by an employer that did not hire you?
                  </p>
                  <div className="flex gap-6" role="radiogroup" aria-label="Self-report answer">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="da-self-report"
                        checked={app.consents.drugAlcohol.selfReport === true}
                        onChange={() => set("consents.drugAlcohol.selfReport", true)}
                        className="h-4 w-4 accent-black"
                      />
                      Yes
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="da-self-report"
                        checked={app.consents.drugAlcohol.selfReport === false}
                        onChange={() => set("consents.drugAlcohol.selfReport", false)}
                        className="h-4 w-4 accent-black"
                      />
                      No
                    </label>
                  </div>
                  {errors.selfReport && <p className={errCls}>{errors.selfReport}</p>}
                </div>
                {app.consents.drugAlcohol.selfReport === true && (
                  <Field
                    id="da-self-report-explanation"
                    label="Briefly explain (you'll be asked to document completion of DOT return-to-duty requirements)"
                    error={errors.selfReportExplanation}
                  >
                    <textarea
                      id="da-self-report-explanation"
                      rows="2"
                      value={app.consents.drugAlcohol.selfReportExplanation}
                      onChange={(e) => set("consents.drugAlcohol.selfReportExplanation", e.target.value)}
                      className={inputCls}
                      maxLength={600}
                    />
                  </Field>
                )}
                <Field id="da-signature" label="Sign by typing your full legal name" error={errors.daSignature}>
                  <TextInput
                    id="da-signature"
                    value={app.consents.drugAlcohol.signature}
                    onChange={(e) => set("consents.drugAlcohol.signature", e.target.value)}
                    error={errors.daSignature}
                    maxLength={120}
                    autoComplete="off"
                  />
                </Field>
              </div>

              <div className="border border-black rounded-xl p-4 md:p-6 space-y-3">
                <p className="font-bold text-center">
                  FMCSA DRUG &amp; ALCOHOL CLEARINGHOUSE — PRE-EMPLOYMENT QUERY NOTICE
                </p>
                {CLEARINGHOUSE_PARAGRAPHS.map((t, i) => (
                  <p key={i} className="text-sm leading-relaxed">
                    {t}
                  </p>
                ))}
                <label className="flex items-start gap-3 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={app.consents.clearinghouseAck}
                    onChange={(e) => set("consents.clearinghouseAck", e.target.checked)}
                    className="mt-1 h-4 w-4 accent-black"
                    aria-invalid={errors.clearinghouseAck ? true : undefined}
                  />
                  <span>{CLEARINGHOUSE_ACK}</span>
                </label>
                {errors.clearinghouseAck && <p className={errCls}>{errors.clearinghouseAck}</p>}
              </div>

              <div className="border border-black/30 rounded-xl p-4 md:p-6 space-y-3">
                <p className="font-bold text-center">
                  OPTIONAL — GENERAL CONSENT FOR LIMITED QUERIES
                </p>
                <p className="text-sm leading-relaxed">{LIMITED_QUERY_CONSENT}</p>
                <label className="flex items-start gap-3 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={app.consents.drugAlcohol.limitedQuery}
                    onChange={(e) => set("consents.drugAlcohol.limitedQuery", e.target.checked)}
                    className="mt-1 h-4 w-4 accent-black"
                  />
                  <span>
                    I give this optional consent, adopted by my signature above. (You can leave
                    this unchecked and still apply.)
                  </span>
                </label>
              </div>
            </>
          )}

          {/* ================= STEP 8: review & sign ================= */}
          {step === 8 && (
            <>
              <div className="border border-black/10 rounded-xl p-4 text-sm space-y-1 bg-gray-50">
                <p>
                  <span className="font-semibold">Position:</span>{" "}
                  {POSITIONS.find((x) => x.value === app.position)?.label || "—"}
                </p>
                <p>
                  <span className="font-semibold">Name:</span> {composeFullName(per)} ·{" "}
                  <span className="font-semibold">Phone:</span> {per.phone}
                </p>
                <p>
                  <span className="font-semibold">CDL:</span> {lic.state} · Class {lic.class} · exp{" "}
                  {formatFullDate(lic.expiration) || "—"}
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

              {/* v6 "Ready to sign?" checklist — the pure collectors run
                  against current data; the signature/submit UI appears only
                  when every earlier step passes. */}
              {reviewIssues.length > 0 && (
                <div className="border border-amber-300 bg-amber-50 rounded-xl p-4 space-y-3">
                  <p className="font-bold">Ready to sign? Not yet — a few things need fixing:</p>
                  <ul className="space-y-2">
                    {reviewIssues.map((iss) => {
                      const label = issueLabel(iss.key);
                      return (
                        <li
                          key={`${iss.step}-${iss.key}`}
                          className="flex items-start justify-between gap-3 text-sm"
                        >
                          <span>
                            <span className="font-semibold">{STEPS[iss.step]}</span>
                            {label ? ` · ${label}` : ""}: {iss.message}
                          </span>
                          <button
                            type="button"
                            onClick={() => setStep(iss.step)}
                            className="shrink-0 border border-black rounded-lg px-3 py-1 text-sm font-semibold hover:bg-black hover:text-white transition-colors"
                          >
                            Fix
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  <p className="text-sm text-gray-600">
                    The signature unlocks once everything above is resolved.
                  </p>
                </div>
              )}

              {reviewIssues.length === 0 && (
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
              )}

              {reviewIssues.length === 0 && turnstileEnabled && (
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
              // Hidden while the "Ready to sign?" checklist has open items.
              reviewIssues.length === 0 && (
                <button
                  type="button"
                  onClick={submit}
                  disabled={status === "sending" || (turnstileEnabled && !token)}
                  className="flex-1 bg-black text-white px-6 py-4 text-lg font-bold rounded-2xl border border-black disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === "sending" ? "Submitting…" : "Submit Application"}
                </button>
              )
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
