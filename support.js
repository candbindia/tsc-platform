// Consulting & Beyond — Technology Spearheads Committee
// Shared helpers for the Technology Support pages (raise, my requests, desk).
// Needs nav.js (escapeHtml) loaded first.

const SUPPORT_BADGE = {
  "New": "badge-submitted",
  "In progress": "badge-progress",
  "Waiting for requester": "badge-pending",
  "Completed": "badge-live",
  "Declined": "badge-rejected",
};
const SUPPORT_STEPS = ["Received", "In progress", "Completed"];
const SUPPORT_STEP_OF = { "New": 0, "In progress": 1, "Waiting for requester": 1, "Completed": 2 };

function supportBadge(status) {
  return '<span class="badge ' + (SUPPORT_BADGE[status] || "badge-default") + '">' + escapeHtml(status || "—") + "</span>";
}

function supportPriorityBadge(p) {
  const cls = p === "Urgent" ? "badge-rejected" : "badge-default";
  return '<span class="badge ' + cls + '">' + escapeHtml(p || "Normal") + "</span>";
}

// Received → In progress → Completed (nothing for declined requests)
function supportFlow(status) {
  if (!(status in SUPPORT_STEP_OF)) return "";
  const cur = SUPPORT_STEP_OF[status];
  let html = '<div class="tracker">';
  SUPPORT_STEPS.forEach((label, i) => {
    let cls = "step";
    if (i < cur || status === "Completed") cls += " done";
    else if (i === cur) cls += " current";
    const text = i === 1 && status === "Waiting for requester" ? "Waiting for you" : label;
    html += '<div class="' + cls + '"><div class="line"></div><div class="dot"></div><div class="label">' + escapeHtml(text) + "</div></div>";
  });
  return html + "</div>";
}

function supportLinkify(text) {
  const safe = escapeHtml((text || "").toString());
  return safe.replace(/(https?:\/\/[^\s<]+)/gi, function (u) {
    return '<a href="' + u + '" target="_blank" rel="noopener noreferrer">' + u + "</a>";
  });
}

function supportDaysOpen(item) {
  const start = (item["Submission Date"] || "").toString();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(start)) return "";
  const end = ["Completed", "Declined"].includes(item["Status"])
    ? ((item["Completion Date"] || item["Last Updated"] || "").toString().slice(0, 10))
    : new Date(Date.now() + 5.5 * 3600 * 1000).toISOString().slice(0, 10);
  const d = Math.round((Date.parse(end + "T00:00:00Z") - Date.parse(start + "T00:00:00Z")) / 86400000);
  return isNaN(d) ? "" : Math.max(0, d);
}

function supportToday() {
  return new Date(Date.now() + 5.5 * 3600 * 1000).toISOString().slice(0, 10);
}

// The conversation + history for one request.
function supportThreadHtml(updates) {
  if (!updates || !updates.length) return '<p class="subtitle">No activity yet.</p>';
  return updates.map(function (u) {
    const internal = u.visibility === "Internal";
    const label = u.type + (u.statusAfter && ["Status", "Question", "Reply", "Reopened"].includes(u.type) ? " → " + u.statusAfter : "");
    return (
      '<div class="update-item' + (internal ? " internal" : "") + '">' +
      '<div class="u-meta">' + escapeHtml(u.date) + " · " + escapeHtml(u.by) + " (" + escapeHtml(u.role) + ") · " + escapeHtml(label) +
      (internal ? " · team only" : "") + "</div>" +
      (u.message ? "<div>" + supportLinkify(u.message) + "</div>" : "") +
      "</div>"
    );
  }).join("");
}

function supportKv(label, value) {
  return value ? '<div class="k">' + escapeHtml(label) + "</div><div>" + supportLinkify(value) + "</div>" : "";
}
