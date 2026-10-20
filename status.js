// Consulting & Beyond — Technology Spearheads Committee
// Shared status -> color/label mapping used by the Board, Register,
// My Requests and Dashboard so every status reads consistently.

const STATUS_META = {
  "Submitted": { cls: "badge-submitted" },
  "Under committee review": { cls: "badge-review" },
  "Rejected": { cls: "badge-rejected" },
  "Scoring": { cls: "badge-assigned" },
  "Score confirmed": { cls: "badge-validated" },
  "RUD draft": { cls: "badge-scored" },
  "RUD under review": { cls: "badge-pending" },
  "RUD signed off": { cls: "badge-scored-assigned" },
  "In build": { cls: "badge-progress" },
  "Awaiting requester validation": { cls: "badge-pending" },
  "Publishing": { cls: "badge-scored-assigned" },
  "Live": { cls: "badge-live" },
};

// Order used for the Board columns and charts.
const STATUS_ORDER = Object.keys(STATUS_META);

// What employees see: a simple six-step line.
const TRACKER_STEPS = ["Submitted", "In review", "Scored", "Document ready", "In build", "Live"];

const STATUS_COLORS = {
  "Submitted": "#646767",
  "Under committee review": "#9c9c97",
  "Rejected": "#d9534f",
  "Scoring": "#f2ac3c",
  "Score confirmed": "#c98a1a",
  "RUD draft": "#e0a030",
  "RUD under review": "#f8d65a",
  "RUD signed off": "#e8c04a",
  "In build": "#d9922a",
  "Awaiting requester validation": "#f0cf5a",
  "Publishing": "#8fbf6a",
  "Live": "#2e9e5b",
};

const PRIORITY_COLORS = { High: "#f2ac3c", Medium: "#f8d65a", Low: "#646767" };

function statusBadge(status) {
  const meta = STATUS_META[status] || { cls: "badge-default" };
  return '<span class="badge ' + meta.cls + '">' + escapeHtml(status || "—") + "</span>";
}

// Six-step line for a requirement. `step` comes from the server (-1 = rejected).
function renderTracker(step) {
  if (step === undefined || step === null || step < 0) return "";
  let html = '<div class="tracker">';
  TRACKER_STEPS.forEach((label, i) => {
    let cls = "step";
    if (i < step) cls += " done";
    else if (i === step) cls += " current";
    html +=
      '<div class="' + cls + '"><div class="line"></div><div class="dot"></div>' +
      '<div class="label">' + escapeHtml(label) + "</div></div>";
  });
  return html + "</div>";
}
