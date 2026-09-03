// node:test suite for app/lib/employmentHistory.js (pure ESM — imported
// directly; Node's module-syntax detection handles the typeless package).
// All interval/gap tests pin nowIdx so no real clock leaks in.
import { test } from "node:test";
import assert from "node:assert/strict";

import {
  monthIndex,
  currentMonthIndex,
  indexToYm,
  formatMonthYear,
  formatMonthIndex,
  formatFullDate,
  mergeIntervals,
  detectGaps,
  coverageYears,
  maxExperienceYears,
} from "../app/lib/employmentHistory.js";

// Fixed "now": September 2026.
const NOW = monthIndex("2026-09");

test("monthIndex parses YYYY-MM and rejects everything else", () => {
  assert.equal(monthIndex("2022-03"), 2022 * 12 + 2);
  assert.equal(monthIndex(" 2022-03 "), 2022 * 12 + 2); // trimmed
  assert.equal(monthIndex("2022-13"), null);
  assert.equal(monthIndex("2022-00"), null);
  assert.equal(monthIndex("2022-3"), null); // two digits required
  assert.equal(monthIndex("202-01"), null);
  assert.equal(monthIndex(""), null);
  assert.equal(monthIndex(null), null);
  assert.equal(monthIndex(undefined), null);
  assert.equal(monthIndex("garbage"), null);
});

test("indexToYm is the inverse of monthIndex", () => {
  assert.equal(indexToYm(monthIndex("2026-09")), "2026-09");
  assert.equal(indexToYm(monthIndex("1999-01")), "1999-01");
  assert.equal(indexToYm(monthIndex("2000-12")), "2000-12");
});

test("currentMonthIndex matches the real clock's shape", () => {
  const now = new Date();
  assert.equal(currentMonthIndex(), now.getFullYear() * 12 + now.getMonth());
});

test("formatMonthYear spells out full month names; passthrough for junk", () => {
  assert.equal(formatMonthYear("2022-03"), "March 2022");
  assert.equal(formatMonthYear("2026-12"), "December 2026");
  assert.equal(formatMonthYear("not-a-month"), "not-a-month");
  assert.equal(formatMonthYear(""), "");
  assert.equal(formatMonthYear(null), "");
});

test("formatMonthIndex formats an absolute index directly", () => {
  assert.equal(formatMonthIndex(NOW), "September 2026");
  assert.equal(formatMonthIndex(NOW - 36), "September 2023");
  assert.equal(formatMonthIndex(NOW - 120), "September 2016");
});

test("formatFullDate spells out dates; passthrough for junk", () => {
  assert.equal(formatFullDate("1988-03-04"), "March 4, 1988");
  assert.equal(formatFullDate("2026-12-31"), "December 31, 2026");
  assert.equal(formatFullDate("1988-13-04"), "1988-13-04");
  assert.equal(formatFullDate("1988-03-32"), "1988-03-32");
  assert.equal(formatFullDate("1988-03"), "1988-03");
  assert.equal(formatFullDate(null), "");
});

test("mergeIntervals merges overlapping and adjacent intervals", () => {
  const merged = mergeIntervals(
    [
      { from: "2020-01", to: "2020-06" },
      { from: "2020-07", to: "2020-12" }, // adjacent — merges
      { from: "2020-03", to: "2020-05" }, // contained
    ],
    NOW
  );
  assert.deepEqual(merged, [{ start: monthIndex("2020-01"), end: monthIndex("2020-12") }]);
});

test("mergeIntervals honors current:true and 'Present' (any casing)", () => {
  const a = mergeIntervals([{ from: "2024-01", to: "", current: true }], NOW);
  assert.deepEqual(a, [{ start: monthIndex("2024-01"), end: NOW }]);
  const b = mergeIntervals([{ from: "2024-01", to: "PRESENT" }], NOW);
  assert.deepEqual(b, [{ start: monthIndex("2024-01"), end: NOW }]);
  const c = mergeIntervals([{ from: "2024-01", to: "present" }], NOW);
  assert.deepEqual(c, [{ start: monthIndex("2024-01"), end: NOW }]);
});

test("mergeIntervals drops unparseable and inverted entries", () => {
  assert.deepEqual(mergeIntervals([{ from: "junk", to: "2020-01" }], NOW), []);
  assert.deepEqual(mergeIntervals([{ from: "2020-06", to: "2020-01" }], NOW), []);
  assert.deepEqual(mergeIntervals([{ from: "2020-01", to: "junk" }], NOW), []);
  assert.deepEqual(mergeIntervals([], NOW), []);
  assert.deepEqual(mergeIntervals(null, NOW), []);
});

test("detectGaps: continuous history has no gaps", () => {
  const gaps = detectGaps(
    [
      { from: "2016-09", to: "2021-05" },
      { from: "2021-06", to: "", current: true },
    ],
    NOW
  );
  assert.deepEqual(gaps, []);
});

test("detectGaps tolerates a single missing month", () => {
  const gaps = detectGaps(
    [
      { from: "2016-09", to: "2021-05" },
      { from: "2021-07", to: "", current: true }, // 2021-06 missing — tolerated
    ],
    NOW
  );
  assert.deepEqual(gaps, []);
});

test("detectGaps flags a 2-month interior gap with a stable key", () => {
  const gaps = detectGaps(
    [
      { from: "2016-09", to: "2021-05" },
      { from: "2021-08", to: "", current: true },
    ],
    NOW
  );
  assert.deepEqual(gaps, [{ from: "2021-06", to: "2021-07", key: "2021-06|2021-07" }]);
});

test("detectGaps flags a trailing gap running through the current month", () => {
  const gaps = detectGaps([{ from: "2016-09", to: "2026-06" }], NOW);
  assert.deepEqual(gaps, [{ from: "2026-07", to: "2026-09", key: "2026-07|2026-09" }]);
});

test("detectGaps: an interval ending exactly 1 month ago is not a trailing gap", () => {
  assert.deepEqual(detectGaps([{ from: "2016-09", to: "2026-08" }], NOW), []);
});

test("detectGaps clips to the 120-month window", () => {
  // Gap entirely before the window (ends before 2016-09) is dropped.
  const old = detectGaps(
    [
      { from: "2010-01", to: "2012-01" },
      { from: "2015-01", to: "", current: true },
    ],
    NOW
  );
  assert.deepEqual(old, []);
  // Gap straddling the window start is truncated to it.
  const straddle = detectGaps(
    [
      { from: "2014-01", to: "2015-06" },
      { from: "2018-01", to: "", current: true },
    ],
    NOW
  );
  assert.deepEqual(straddle, [{ from: "2016-09", to: "2017-12", key: "2016-09|2017-12" }]);
});

test("detectGaps: time before the earliest employer is not a gap", () => {
  const gaps = detectGaps([{ from: "2024-01", to: "", current: true }], NOW);
  assert.deepEqual(gaps, []);
});

test("detectGaps: no parseable entries -> no gaps", () => {
  assert.deepEqual(detectGaps([], NOW), []);
  assert.deepEqual(detectGaps([{ from: "junk", to: "junk" }], NOW), []);
});

test("coverageYears measures from the earliest parseable start", () => {
  assert.equal(coverageYears([{ from: "2016-09", to: "2020-01" }], NOW), 10);
  assert.equal(
    coverageYears(
      [
        { from: "2020-09", to: "2022-01" },
        { from: "2014-09", to: "2016-01" },
      ],
      NOW
    ),
    12
  );
  assert.equal(coverageYears([{ from: "junk" }], NOW), null);
  assert.equal(coverageYears([], NOW), null);
});

test("maxExperienceYears takes the largest sane claim", () => {
  assert.equal(maxExperienceYears([{ years: "4" }, { years: "12.5" }]), 12.5);
  assert.equal(maxExperienceYears([{ years: " 3 " }]), 3);
  // Range/unit typos parse to absurd values and are skipped.
  assert.equal(maxExperienceYears([{ years: "2019-2024" }]), null);
  assert.equal(maxExperienceYears([{ years: "" }, { years: "abc" }]), null);
  assert.equal(maxExperienceYears([]), null);
  assert.equal(maxExperienceYears(null), null);
});
