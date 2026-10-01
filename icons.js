// Consulting & Beyond — Technology Spearheads Committee
// Thin wrapper around Font Awesome Solid so the rest of the app just calls
// icon("name", size) with our own semantic names — if we ever swap icon
// libraries, only this map changes. Font Awesome Solid = "filled" icon
// style, loaded via style.css.

const ICON_MAP = {
  archive: "fa-box-archive",
  package: "fa-box",
  clipboard: "fa-clipboard-check",
  "plus-circle": "fa-circle-plus",
  "check-square": "fa-square-check",
  "check-circle": "fa-circle-check",
  "x-circle": "fa-circle-xmark",
  clock: "fa-clock",
  hourglass: "fa-hourglass-half",
  "user-check": "fa-user-check",
  user: "fa-user",
  users: "fa-users",
  key: "fa-key",
  "log-in": "fa-right-to-bracket",
  "chevron-right": "fa-chevron-right",
  "chevron-left": "fa-chevron-left",
  info: "fa-circle-info",
  layers: "fa-layer-group",
  list: "fa-list",
  inbox: "fa-inbox",
  "trending-up": "fa-arrow-trend-up",
  sparkle: "fa-wand-magic-sparkles",
  send: "fa-paper-plane",
  kanban: "fa-table-columns",
  "help-circle": "fa-circle-question",
  book: "fa-book-open",
  bolt: "fa-bolt",
  robot: "fa-robot",
  rocket: "fa-rocket",
  mail: "fa-envelope",
  warning: "fa-triangle-exclamation",
  search: "fa-magnifying-glass",
  gear: "fa-gear",
  shield: "fa-shield-halved",
  calendar: "fa-calendar-days",
  "external-link": "fa-up-right-from-square",
  building: "fa-building",
  "chart-pie": "fa-chart-pie",
  "chart-bar": "fa-chart-column",
  star: "fa-star",
  scale: "fa-scale-balanced",
  gauge: "fa-gauge-high",
};

function icon(name, size) {
  size = size || 20;
  const cls = ICON_MAP[name] || "fa-circle-question";
  return (
    '<i class="fa-solid ' + cls + '" style="font-size:' + size + "px; line-height:1;\" aria-hidden=\"true\"></i>"
  );
}
