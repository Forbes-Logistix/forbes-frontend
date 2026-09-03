// node:test suite for app/lib/legalName.js.
import { test } from "node:test";
import assert from "node:assert/strict";

import { composeFullName, splitFullName } from "../app/lib/legalName.js";

test("composeFullName joins non-empty trimmed parts with single spaces", () => {
  assert.equal(
    composeFullName({ firstName: "John", middleName: "Quincy", lastName: "Public" }),
    "John Quincy Public"
  );
  assert.equal(composeFullName({ firstName: "John", middleName: "", lastName: "Public" }), "John Public");
  assert.equal(
    composeFullName({ firstName: "  John  ", middleName: "  ", lastName: " Public " }),
    "John Public"
  );
  assert.equal(composeFullName({ firstName: "", middleName: "", lastName: "" }), "");
  assert.equal(composeFullName({}), "");
  assert.equal(composeFullName(), "");
});

test("splitFullName: 0 tokens", () => {
  assert.deepEqual(splitFullName(""), { firstName: "", middleName: "", lastName: "" });
  assert.deepEqual(splitFullName("   "), { firstName: "", middleName: "", lastName: "" });
  assert.deepEqual(splitFullName(null), { firstName: "", middleName: "", lastName: "" });
});

test("splitFullName: 1 token -> firstName only", () => {
  assert.deepEqual(splitFullName("Cher"), { firstName: "Cher", middleName: "", lastName: "" });
});

test("splitFullName: 2 tokens -> first + last", () => {
  assert.deepEqual(splitFullName("John Public"), {
    firstName: "John",
    middleName: "",
    lastName: "Public",
  });
});

test("splitFullName: 3+ tokens -> middle tokens joined", () => {
  assert.deepEqual(splitFullName("John Quincy Public"), {
    firstName: "John",
    middleName: "Quincy",
    lastName: "Public",
  });
  assert.deepEqual(splitFullName("John Jacob Jingleheimer Schmidt"), {
    firstName: "John",
    middleName: "Jacob Jingleheimer",
    lastName: "Schmidt",
  });
});

test("splitFullName collapses arbitrary whitespace", () => {
  assert.deepEqual(splitFullName("  John   Quincy \t Public "), {
    firstName: "John",
    middleName: "Quincy",
    lastName: "Public",
  });
});
