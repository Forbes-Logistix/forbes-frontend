// Structured legal-name helpers for the DOT application (form v5).
// composeFullName mirrors the backend's derived fullName (used in the PDF,
// email subject, and attachment filename) — change both or neither.

// Display name from the structured parts: non-empty trimmed parts joined
// with single spaces.
export function composeFullName({ firstName, middleName, lastName } = {}) {
  return [firstName, middleName, lastName]
    .map((s) => String(s ?? "").trim())
    .filter(Boolean)
    .join(" ");
}

// Best-effort split of a legacy free-text fullName (pre-v5 drafts only) into
// the structured parts: 1 token -> firstName; 2 -> first + last; 3+ -> first
// token, last token, and the tokens between joined as the middle name.
export function splitFullName(fullName) {
  const parts = String(fullName ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "", middleName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], middleName: "", lastName: "" };
  if (parts.length === 2) return { firstName: parts[0], middleName: "", lastName: parts[1] };
  return {
    firstName: parts[0],
    middleName: parts.slice(1, -1).join(" "),
    lastName: parts[parts.length - 1],
  };
}
