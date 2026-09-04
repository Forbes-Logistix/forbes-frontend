// node:test suite for app/lib/licenseAndAddress.js (form v6 shared
// definitions). Residence coverage tests pin nowIdx so no real clock leaks in.
import { test } from "node:test";
import assert from "node:assert/strict";

import { monthIndex } from "../app/lib/employmentHistory.js";
import {
  US_STATES,
  OTHER_STATE,
  ZIP_RE,
  USDOT_RE,
  zipOk,
  normalizeStateValue,
  ENDORSEMENTS,
  NONE_CODE,
  toggleEndorsement,
  formatEndorsements,
  normalizeEndorsementCodes,
  endorsementCodesValid,
  parseLegacyEndorsements,
  firstResidenceGap,
  residenceCoverageError,
} from "../app/lib/licenseAndAddress.js";

// Fixed "now": September 2026 (coverage window starts September 2023).
const NOW = monthIndex("2026-09");

test("US_STATES holds 50 states + DC + PR + Other (non-US)", () => {
  assert.equal(US_STATES.length, 53);
  const codes = US_STATES.map((s) => s.code);
  assert.ok(codes.includes("DC"));
  assert.ok(codes.includes("PR"));
  assert.ok(codes.includes(OTHER_STATE));
  assert.equal(new Set(codes).size, 53); // no duplicates
  assert.equal(OTHER_STATE, "Other (non-US)"); // stored literal
});

test("ZIP regex accepts 5-digit and ZIP+4 only", () => {
  assert.ok(ZIP_RE.test("39209"));
  assert.ok(ZIP_RE.test("39209-1234"));
  assert.ok(!ZIP_RE.test("3920"));
  assert.ok(!ZIP_RE.test("392091234"));
  assert.ok(!ZIP_RE.test("39209-12"));
  assert.ok(!ZIP_RE.test("abcde"));
});

test("zipOk relaxes to non-empty <=12 for Other (non-US)", () => {
  assert.ok(zipOk("39209", "MS"));
  assert.ok(zipOk(" 39209-1234 ", "TX"));
  assert.ok(!zipOk("SW1A 1AA", "TX"));
  assert.ok(zipOk("SW1A 1AA", OTHER_STATE));
  assert.ok(!zipOk("", OTHER_STATE));
  assert.ok(!zipOk("   ", OTHER_STATE));
  assert.ok(!zipOk("1234567890123", OTHER_STATE)); // 13 chars
});

test("USDOT rule: digits only, at most 12", () => {
  assert.ok(USDOT_RE.test("4361817"));
  assert.ok(USDOT_RE.test("123456789012"));
  assert.ok(!USDOT_RE.test("1234567890123"));
  assert.ok(!USDOT_RE.test("DOT 4361817"));
  assert.ok(!USDOT_RE.test(""));
});

test("normalizeStateValue keeps codes, maps names, clears junk", () => {
  assert.equal(normalizeStateValue("TX"), "TX");
  assert.equal(normalizeStateValue("tx"), "TX");
  assert.equal(normalizeStateValue(" Texas "), "TX");
  assert.equal(normalizeStateValue("MISSISSIPPI"), "MS");
  assert.equal(normalizeStateValue("District of Columbia"), "DC");
  assert.equal(normalizeStateValue("Puerto Rico"), "PR");
  assert.equal(normalizeStateValue("Other (non-US)"), OTHER_STATE);
  assert.equal(normalizeStateValue("other (non-us)"), OTHER_STATE);
  assert.equal(normalizeStateValue("ZZ"), "");
  assert.equal(normalizeStateValue("Springfield"), "");
  assert.equal(normalizeStateValue(""), "");
  assert.equal(normalizeStateValue(null), "");
});

test("endorsement definitions: six letter codes with labels", () => {
  assert.deepEqual(
    ENDORSEMENTS.map((e) => e.code),
    ["H", "N", "T", "P", "S", "X"]
  );
  assert.equal(ENDORSEMENTS.find((e) => e.code === "X").label, "Tank + Hazmat");
  assert.equal(NONE_CODE, "NONE");
});

test("toggleEndorsement: None is mutually exclusive both ways", () => {
  assert.deepEqual(toggleEndorsement(["H", "X"], NONE_CODE), [NONE_CODE]);
  assert.deepEqual(toggleEndorsement([NONE_CODE], "H"), ["H"]);
  assert.deepEqual(toggleEndorsement([NONE_CODE], NONE_CODE), []); // uncheck None
});

test("toggleEndorsement adds/removes letters in canonical order", () => {
  assert.deepEqual(toggleEndorsement([], "X"), ["X"]);
  assert.deepEqual(toggleEndorsement(["X"], "H"), ["H", "X"]); // canonical order
  assert.deepEqual(toggleEndorsement(["H", "X"], "X"), ["H"]);
  assert.deepEqual(toggleEndorsement(["H"], "H"), []);
  assert.deepEqual(toggleEndorsement(null, "H"), ["H"]); // defensive
});

test("formatEndorsements matches the PDF rendering", () => {
  assert.equal(formatEndorsements(["H", "X"]), "H (Hazmat), X (Tank + Hazmat)");
  assert.equal(formatEndorsements(["N"]), "N (Tank)");
  assert.equal(formatEndorsements([NONE_CODE]), "None");
  assert.equal(formatEndorsements([]), "None");
  assert.equal(formatEndorsements(null), "None");
});

test("normalizeEndorsementCodes keeps known codes in canonical order", () => {
  assert.deepEqual(normalizeEndorsementCodes(["X", "H"]), ["H", "X"]);
  assert.deepEqual(normalizeEndorsementCodes(["H", "N", "T", "P", "S", "X"]), [
    "H",
    "N",
    "T",
    "P",
    "S",
    "X",
  ]);
  assert.deepEqual(normalizeEndorsementCodes([NONE_CODE]), [NONE_CODE]);
  assert.deepEqual(normalizeEndorsementCodes([]), []);
});

test("normalizeEndorsementCodes drops unknown codes and dedupes", () => {
  assert.deepEqual(normalizeEndorsementCodes(["H", "Z", "H", "banana"]), ["H"]);
  assert.deepEqual(normalizeEndorsementCodes(["h", "x"]), []); // case-sensitive codes
  assert.deepEqual(normalizeEndorsementCodes([NONE_CODE, NONE_CODE]), [NONE_CODE]);
  assert.deepEqual(normalizeEndorsementCodes(["ZZ", 7, null]), []);
});

test("normalizeEndorsementCodes drops NONE when any letter code is present", () => {
  assert.deepEqual(normalizeEndorsementCodes([NONE_CODE, "H"]), ["H"]);
  assert.deepEqual(normalizeEndorsementCodes(["X", NONE_CODE, "N"]), ["N", "X"]);
});

test("normalizeEndorsementCodes handles non-array input defensively", () => {
  assert.deepEqual(normalizeEndorsementCodes(null), []);
  assert.deepEqual(normalizeEndorsementCodes("H,N"), []);
  assert.deepEqual(normalizeEndorsementCodes(undefined), []);
});

test("endorsementCodesValid accepts known, deduped, None-exclusive selections", () => {
  assert.ok(endorsementCodesValid(["H", "X"]));
  assert.ok(endorsementCodesValid(["X", "H"])); // order-agnostic
  assert.ok(endorsementCodesValid([NONE_CODE]));
  assert.ok(endorsementCodesValid([])); // emptiness is a separate rule
});

test("endorsementCodesValid rejects what the backend rejects", () => {
  assert.ok(!endorsementCodesValid(["H", "Z"])); // unknown code
  assert.ok(!endorsementCodesValid(["H", "H"])); // duplicate
  assert.ok(!endorsementCodesValid([NONE_CODE, NONE_CODE])); // duplicate NONE
  assert.ok(!endorsementCodesValid([NONE_CODE, "H"])); // None not exclusive
  assert.ok(!endorsementCodesValid(["h"])); // codes are case-sensitive
  assert.ok(!endorsementCodesValid("H")); // non-array
});

test("normalized endorsement codes always pass the validity rule", () => {
  const inputs = [
    ["X", "H", "H", NONE_CODE, "junk"],
    [NONE_CODE, NONE_CODE],
    ["h", "Z"],
    null,
    [],
  ];
  for (const input of inputs) {
    assert.ok(endorsementCodesValid(normalizeEndorsementCodes(input)));
  }
});

test("parseLegacyEndorsements extracts standalone known letters", () => {
  assert.deepEqual(parseLegacyEndorsements("Tanker (N), Hazmat (H)"), ["H", "N"]);
  assert.deepEqual(parseLegacyEndorsements("h n x"), ["H", "N", "X"]);
  assert.deepEqual(parseLegacyEndorsements("H,N,T,P,S,X"), ["H", "N", "T", "P", "S", "X"]);
  // Letters inside words don't count.
  assert.deepEqual(parseLegacyEndorsements("Passenger and Tanker"), []);
  // none/empty -> [] (NOT ["NONE"]) — the driver re-picks consciously.
  assert.deepEqual(parseLegacyEndorsements("none"), []);
  assert.deepEqual(parseLegacyEndorsements("None."), []);
  assert.deepEqual(parseLegacyEndorsements(""), []);
  assert.deepEqual(parseLegacyEndorsements(null), []);
  assert.deepEqual(parseLegacyEndorsements("no endorsements listed"), []);
});

test("residence coverage: long-held current address covers everything", () => {
  assert.equal(firstResidenceGap({ since: "2020-01" }, [], NOW), null);
});

test("residence coverage: recent move with no previous addresses gaps back to the window start", () => {
  assert.deepEqual(firstResidenceGap({ since: "2026-08" }, [], NOW), {
    from: "2023-09",
    to: "2026-07",
  });
});

test("residence coverage: previous address closing the range clears the gap", () => {
  const prev = [{ from: "2023-09", to: "2026-07" }];
  assert.equal(firstResidenceGap({ since: "2026-08" }, prev, NOW), null);
});

test("residence coverage tolerates a single missing month", () => {
  const prev = [{ from: "2023-01", to: "2026-06" }]; // 2026-07 missing
  assert.equal(firstResidenceGap({ since: "2026-08" }, prev, NOW), null);
});

test("residence coverage flags a 2-month hole between addresses", () => {
  const prev = [{ from: "2023-01", to: "2026-05" }]; // 2026-06 + 2026-07 missing
  assert.deepEqual(firstResidenceGap({ since: "2026-08" }, prev, NOW), {
    from: "2026-06",
    to: "2026-07",
  });
});

test("residence coverage: no parseable addresses -> whole window uncovered", () => {
  assert.deepEqual(firstResidenceGap({ since: "" }, [], NOW), {
    from: "2023-09",
    to: "2026-09",
  });
  assert.deepEqual(firstResidenceGap({ since: "junk" }, [{ from: "bad", to: "worse" }], NOW), {
    from: "2023-09",
    to: "2026-09",
  });
});

test("residence coverage error sentence is exact (mirrored in the backend)", () => {
  assert.equal(
    residenceCoverageError({ from: "2023-09", to: "2026-07" }),
    "Your addresses need to cover the last 3 years. Add the address you lived at during September 2023 – July 2026."
  );
});
