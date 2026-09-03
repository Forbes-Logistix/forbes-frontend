// Form v6 shared definitions for the DOT application: state-code list, ZIP
// rule, USDOT rule, CDL endorsement codes (with None-exclusivity), legacy
// draft normalization, and the residence-history 3-year coverage check.
// State codes, ZIP regex, endorsement codes + labels, None-exclusivity, the
// residence coverage rule, and every error sentence built here are mirrored
// in forbesLogistix-backend/controllers/pdfController.js — change both or neither.

// NOTE: explicit .js extension — this lib is imported directly by the Node
// test runner (test/), which resolves ESM specifiers strictly; Next's webpack
// accepts the extension too.
import {
  monthIndex,
  currentMonthIndex,
  mergeIntervals,
  formatMonthYear,
  indexToYm,
} from "./employmentHistory.js";

// Literal stored value for a non-US employer location. ZIP relaxes to
// "non-empty, <= 12 chars" when this is the selected state.
export const OTHER_STATE = "Other (non-US)";

// The 50 states (alphabetical) + DC + PR + Other (non-US). The select stores
// the 2-letter code (or the OTHER_STATE literal).
export const US_STATES = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
  { code: "DC", name: "District of Columbia" },
  { code: "PR", name: "Puerto Rico" },
  { code: OTHER_STATE, name: OTHER_STATE },
];

// US ZIP: 5 digits, optional +4.
export const ZIP_RE = /^\d{5}(-\d{4})?$/;

// USDOT numbers: digits only, at most 12.
export const USDOT_RE = /^\d{1,12}$/;

// ZIP rule with the Other (non-US) relaxation.
export function zipOk(zip, stateCode) {
  const z = String(zip ?? "").trim();
  if (stateCode === OTHER_STATE) return z.length > 0 && z.length <= 12;
  return ZIP_RE.test(z);
}

// Draft-restore normalization for stored state values: valid 2-letter codes
// kept (uppercased), full state names mapped to their code, the Other
// (non-US) literal kept (any casing), everything else -> "".
export function normalizeStateValue(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return "";
  const upper = raw.toUpperCase();
  if (US_STATES.some((s) => s.code === upper)) return upper;
  const byName = US_STATES.find((s) => s.name.toUpperCase() === upper);
  return byName ? byName.code : "";
}

// CDL endorsement codes in canonical order, with display labels.
export const ENDORSEMENTS = [
  { code: "H", label: "Hazmat" },
  { code: "N", label: "Tank" },
  { code: "T", label: "Doubles/Triples" },
  { code: "P", label: "Passenger" },
  { code: "S", label: "School bus" },
  { code: "X", label: "Tank + Hazmat" },
];

// Payload marker for a deliberate "no endorsements" selection.
export const NONE_CODE = "NONE";

const ENDORSEMENT_ORDER = ENDORSEMENTS.map((e) => e.code);

// Toggle one endorsement checkbox. "None" is mutually exclusive: checking it
// clears the letter codes, and checking any letter clears "None". Letter
// codes are kept in canonical H/N/T/P/S/X order.
export function toggleEndorsement(codes, code) {
  const list = Array.isArray(codes) ? codes : [];
  if (code === NONE_CODE) return list.includes(NONE_CODE) ? [] : [NONE_CODE];
  if (list.includes(code)) return list.filter((c) => c !== code);
  return [...list.filter((c) => c !== NONE_CODE), code].sort(
    (a, b) => ENDORSEMENT_ORDER.indexOf(a) - ENDORSEMENT_ORDER.indexOf(b)
  );
}

// Human-readable endorsement list — "H (Hazmat), X (Tank + Hazmat)" or
// "None". Mirrors the backend's PDF rendering.
export function formatEndorsements(codes) {
  const list = Array.isArray(codes) ? codes : [];
  if (!list.length || list.includes(NONE_CODE)) return "None";
  return ENDORSEMENTS.filter((e) => list.includes(e.code))
    .map((e) => `${e.code} (${e.label})`)
    .join(", ");
}

// Draft-restore parse of a pre-v6 free-text endorsements value: standalone
// known letters (any casing, e.g. "Tanker (N), Hazmat (H)") become codes in
// canonical order; "none"/empty/unrecognized -> [] — NOT ["NONE"], so the
// driver consciously picks None on the re-walked CDL step.
export function parseLegacyEndorsements(text) {
  const raw = String(text ?? "").trim();
  if (!raw || /^none\.?$/i.test(raw)) return [];
  const found = new Set();
  for (const m of raw.toUpperCase().matchAll(/\b([HNTPSX])\b/g)) found.add(m[1]);
  return ENDORSEMENT_ORDER.filter((c) => found.has(c));
}

// ---------------------------------------------------------------------------
// Residence-history coverage (v6). Merged address intervals — the current
// address runs since -> now, previous addresses from -> to — must cover the
// last 36 months with no gap of >= 2 whole missing months (a single missing
// month is tolerated, same as the employment gap rule). Returns the first
// uncovered {from, to} ("YYYY-MM") or null when covered. Unparseable entries
// contribute nothing (their own field validation catches them).
export function firstResidenceGap(
  currentAddress,
  previousAddresses,
  nowIdx = currentMonthIndex()
) {
  const entries = [];
  if (monthIndex(currentAddress?.since) !== null)
    entries.push({ from: String(currentAddress.since).trim(), current: true });
  for (const a of previousAddresses ?? []) entries.push({ from: a?.from, to: a?.to });
  const merged = mergeIntervals(entries, nowIdx);
  const windowStart = nowIdx - 36;
  const gaps = [];
  let cursor = windowStart;
  for (const iv of merged) {
    if (iv.end < windowStart) continue;
    if (iv.start > nowIdx) break;
    if (iv.start > cursor) gaps.push({ from: cursor, to: iv.start - 1 });
    cursor = Math.max(cursor, iv.end + 1);
    if (cursor > nowIdx) break;
  }
  if (cursor <= nowIdx) gaps.push({ from: cursor, to: nowIdx });
  for (const g of gaps) {
    if (g.to - g.from + 1 >= 2) return { from: indexToYm(g.from), to: indexToYm(g.to) };
  }
  return null;
}

// The blocking sentence for a residence coverage failure — byte-identical on
// both sides.
export function residenceCoverageError(gap) {
  return `Your addresses need to cover the last 3 years — add the address you lived at during ${formatMonthYear(
    gap.from
  )} – ${formatMonthYear(gap.to)}.`;
}
