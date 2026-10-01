// Consulting & Beyond — Technology Spearheads Committee
// A short, one-time first-login walkthrough. Shows a tooltip next to a
// few key elements, in sequence, then never shows again (per browser).
// Call maybeStartTour(session) right after renderTopbar() on a landing page.

const TOUR_SEEN_KEY = "tsc_tour_seen";

const TOUR_STEPS_EMPLOYEE = [
  {
    selector: ".brand-logo",
    title: "Welcome to TSC",
    text: "This is the Technology Spearheads Committee portal — where ideas for automation get submitted, reviewed, scored, and built. Quick 30-second tour?",
  },
  {
    selector: 'a[href="portal-catalog.html"]',
    title: "Automation Catalog",
    text: 'Automations already live. "Open" items link straight through — "On Request" ones route a request to the owner.',
  },
  {
    selector: 'a[href="portal-board.html"]',
    title: "Requirement Board",
    text: "Check what's already been requested before submitting something new — it might already be in motion.",
  },
  {
    selector: 'a[href="portal-submit.html"]',
    title: "Submit a Requirement",
    text: "Found a manual process worth automating? Submit it here — it's auto-tagged with your name and department.",
  },
  {
    selector: 'a[href="portal-my-tasks.html"]',
    title: "My Tasks",
    text: "Everything tied to you: things you've submitted, and anything assigned to you to score or build — with the actions right there.",
  },
];

const TOUR_STEPS_STAFF = [
  {
    selector: ".brand-logo",
    title: "Welcome to the TSC Tracker",
    text: "This is where Committee, Management and Admin track every requirement end-to-end. Quick 30-second tour?",
  },
  {
    selector: 'a[href="tracker-dashboard.html"]',
    title: "Dashboard",
    text: "A pulse-check on the whole pipeline — how many requirements, by status and priority.",
  },
  {
    selector: 'a[href="tracker-home.html"]',
    title: "Requirement Register",
    text: "The full list. Committee members can reject, assign for scoring, and validate right from here.",
  },
  {
    selector: 'a[href="portal-catalog.html"]',
    title: "Catalog",
    text: "What automations are already live and in use across the org.",
  },
];

function maybeStartTour(session) {
  if (!session) return;
  if (localStorage.getItem(TOUR_SEEN_KEY)) return;

  const steps = session.role === "employee" ? TOUR_STEPS_EMPLOYEE : TOUR_STEPS_STAFF;
  let index = 0;
  let overlay, tooltip, highlighted;

  function cleanupHighlight() {
    if (highlighted) highlighted.classList.remove("tour-highlight");
  }

  function finish() {
    cleanupHighlight();
    if (overlay) overlay.remove();
    if (tooltip) tooltip.remove();
    try {
      localStorage.setItem(TOUR_SEEN_KEY, "1");
    } catch (e) {}
  }

  function showStep() {
    cleanupHighlight();
    const step = steps[index];
    const target = document.querySelector(step.selector);
    if (!target) {
      index++;
      if (index < steps.length) return showStep();
      return finish();
    }

    target.classList.add("tour-highlight");
    highlighted = target;

    const rect = target.getBoundingClientRect();
    tooltip.innerHTML =
      "<h3>" + escapeHtml(step.title) + "</h3>" +
      "<p>" + escapeHtml(step.text) + "</p>" +
      '<div class="tour-actions">' +
      '<span class="tour-skip" onclick="window.__tscTourFinish()">Skip tour</span>' +
      '<button class="tour-next" onclick="window.__tscTourNext()">' +
      (index === steps.length - 1 ? "Done" : "Next (" + (index + 1) + "/" + steps.length + ")") +
      "</button>" +
      "</div>";

    const top = Math.min(rect.bottom + 12, window.innerHeight - 180);
    let left = rect.left;
    if (left + 290 > window.innerWidth) left = window.innerWidth - 300;
    tooltip.style.top = Math.max(12, top) + "px";
    tooltip.style.left = Math.max(12, left) + "px";
  }

  overlay = document.createElement("div");
  overlay.className = "tour-overlay";
  document.body.appendChild(overlay);

  tooltip = document.createElement("div");
  tooltip.className = "tour-tooltip";
  document.body.appendChild(tooltip);

  window.__tscTourNext = function () {
    index++;
    if (index >= steps.length) return finish();
    showStep();
  };
  window.__tscTourFinish = finish;

  showStep();
}

// Lets the Help page offer "Replay the tour" on demand, ignoring the
// once-only localStorage flag.
function restartTour() {
  try {
    localStorage.removeItem(TOUR_SEEN_KEY);
  } catch (e) {}
  maybeStartTour(getSession());
}
