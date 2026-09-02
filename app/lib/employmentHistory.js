// Pure employment-history helpers for the DOT application (form v4): month
// math, gap detection, and the experience-vs-history coverage cross-check.
// Gap/coverage logic mirrored in forbesLogistix-backend/controllers/pdfController.js — change both or neither.

const YM_RE = /^(\d{4})-(\d{2})$/;
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// "YYYY-MM" -> absolute month index (year*12 + month-1), or null if unparseable.
export function monthIndex(ym) {
  const m = YM_RE.exec(String(ym ?? "").trim());
  if (!m) return null;
  const month = Number(m[2]);
  if (month < 1 || month > 12) return null;
  return Number(m[1]) * 12 + (month - 1);
}

export function currentMonthIndex() {
  const now = new Date();
  return now.getFullYear() * 12 + now.getMonth();
}

function indexToYm(idx) {
  const year = Math.floor(idx / 12);
  const month = (idx % 12) + 1;
  return `${year}-${String(month).padStart(2, "0")}`;
}

// "2022-03" -> "Mar 2022"; unparseable input is returned as-is.
export function formatMonthYear(ym) {
  const idx = monthIndex(ym);
  if (idx === null) return String(ym ?? "");
  return `${MONTH_NAMES[idx % 12]} ${Math.floor(idx / 12)}`;
}

// Employment entries -> sorted merged month intervals [{start, end}].
// current === true (or to === "Present"/"present") ends at the current month.
// Entries with unparseable months (or end before start) are ignored.
// Overlapping or ADJACENT intervals merge — concurrent/back-to-back jobs are
// not gaps (adjacent = next.start <= prev.end + 1).
export function mergeIntervals(entries, nowIdx = currentMonthIndex()) {
  const intervals = [];
  for (const x of entries ?? []) {
    const start = monthIndex(x?.from);
    if (start === null) continue;
    const to = String(x?.to ?? "").trim();
    const isCurrent = x?.current === true || to === "Present" || to === "present";
    const end = isCurrent ? nowIdx : monthIndex(to);
    if (end === null || end < start) continue;
    intervals.push({ start, end });
  }
  intervals.sort((a, b) => a.start - b.start || a.end - b.end);
  const merged = [];
  for (const iv of intervals) {
    const prev = merged[merged.length - 1];
    if (prev && iv.start <= prev.end + 1) {
      if (iv.end > prev.end) prev.end = iv.end;
    } else {
      merged.push({ start: iv.start, end: iv.end });
    }
  }
  return merged;
}

// Detected gaps needing explanation: [{from: "YYYY-MM", to: "YYYY-MM", key: "from|to"}].
// A between-jobs gap counts only when it spans >= 2 whole missing months (a
// single missing month is tolerated, per the FMCSA sample form's "in excess of
// one month"). A trailing gap fires when the latest interval ends more than
// 1 month before the current month, and runs through the current month.
// Gaps are clipped to the 10-year (120-month) window; anything ending before
// it is dropped, and a gap starting earlier is truncated to the window start.
// Time before the earliest listed employer is NOT a gap (covered by the
// historyComplete attestation instead).
export function detectGaps(entries, nowIdx = currentMonthIndex()) {
  const merged = mergeIntervals(entries, nowIdx);
  if (!merged.length) return [];
  const rawGaps = [];
  for (let i = 1; i < merged.length; i++) {
    const from = merged[i - 1].end + 1;
    const to = merged[i].start - 1;
    if (to - from + 1 >= 2) rawGaps.push({ from, to });
  }
  const latestEnd = merged[merged.length - 1].end;
  if (nowIdx - latestEnd > 1) rawGaps.push({ from: latestEnd + 1, to: nowIdx });
  const windowStart = nowIdx - 120;
  const gaps = [];
  for (const g of rawGaps) {
    if (g.to < windowStart) continue;
    const fromYm = indexToYm(Math.max(g.from, windowStart));
    const toYm = indexToYm(g.to);
    gaps.push({ from: fromYm, to: toYm, key: `${fromYm}|${toYm}` });
  }
  return gaps;
}

// Years between the earliest parseable employment start and now, or null when
// no entry has a parseable "from".
export function coverageYears(entries, nowIdx = currentMonthIndex()) {
  let earliest = null;
  for (const x of entries ?? []) {
    const s = monthIndex(x?.from);
    if (s !== null && (earliest === null || s < earliest)) earliest = s;
  }
  if (earliest === null) return null;
  return (nowIdx - earliest) / 12;
}

// Largest claimed years across experience entries, or null when none parse.
export function maxExperienceYears(experience) {
  let max = null;
  for (const x of experience ?? []) {
    const n = parseFloat(String(x?.years ?? "").replace(/[^0-9.]/g, ""));
    if (!Number.isNaN(n) && (max === null || n > max)) max = n;
  }
  return max;
}
