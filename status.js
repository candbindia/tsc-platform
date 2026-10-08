// Consulting & Beyond — Technology Spearheads Committee
// Shared status -> color/label/step mapping used by the Board, Tracker,
// My Tasks and Dashboard pages so every status reads consistently.

const STATUS_META = {
  "Submitted": { cls: "badge-submitted", step: 0 },
  "Under committee review": { cls: "badge-review", step: 0 },
  "Rejected": { cls: "badge-rejected", step: -1 },
  "Assigned for scoring": { cls: "badge-assigned", step: 1 },
  "Score submitted": { cls: "badge-scored", step: 2 },
  "Scored & assigned": { cls: "badge-scored-assigned", step: 2 },
  "In progress": { cls: "badge-progress", step: 3 },
  "Pending validation": { cls: "badge-pending", step: 4 },
  "Live on board": { cls: "badge-live", step: 5 },
};

const TRACKER_STEPS = ["Submitted", "Assigned", "Scored", "In Progress", "Validation", "Live"];

// Hex colors matching each badge-* class in style.css, so chart slices and
// bars read consistently with the badges shown everywhere else.
const STATUS_COLORS = {
  "Submitted": "#646767",
  "Under committee review": "#9c9c97",
  "Rejected": "#d9534f",
  "Assigned for scoring": "#f2ac3c",
  "Score submitted": "#f2ac3c",
  "Scored & assigned": "#f8d65a",
  "In progress": "#d9922a",
  "Pending validation": "#f8d65a",
  "Live on board": "#2e9e5b",
};

const PRIORITY_COLORS = { High: "#f2ac3c", Medium: "#f8d65a", Low: "#646767" };

function statusBadge(status) {
  const meta = STATUS_META[status] || { cls: "badge-default" };
  return '<span class="badge ' + meta.cls + '">' + escapeHtml(status || "—") + "</span>";
}

// Renders the 6-step horizontal tracker for a requirement's current status.
// Rejected items get a plain message instead (there's no "progress" to show).
function renderTracker(status) {
  const meta = STATUS_META[status];
  if (!meta || meta.step === -1) return "";

  const currentStep = meta.step;
  let html = '<div class="tracker">';
  TRACKER_STEPS.forEach((label, i) => {
    let cls = "step";
    if (i < currentStep) cls += " done";
    else if (i === currentStep) cls += " current";
    html +=
      '<div class="' + cls + '">' +
      '<div class="line"></div><div class="dot"></div>' +
      '<div class="label">' + escapeHtml(label) + "</div>" +
      "</div>";
  });
  html += "</div>";
  return html;
}
