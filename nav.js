// Consulting & Beyond — Technology Spearheads Committee
// Builds the shared top bar (who's logged in + nav links) on every page
// except the login page. Include after auth.js, then call renderTopbar()
// at the top of the page's script.

function roleLabel(role) {
  if (role === "employee") return "Employee";
  return role; // Committee / Management / Admin
}

function renderTopbar() {
  const session = requireSession();
  if (!session) return null; // requireSession already redirected to login

  const topbar = document.createElement("div");
  topbar.className = "topbar";

  const logo = document.createElement("div");
  logo.className = "brand-logo";
  logo.innerHTML = '<span class="bar"></span><span class="brand-mark">C&amp;B</span><span class="brand-sub">TSC</span>';
  topbar.appendChild(logo);

  const right = document.createElement("div");
  right.className = "topbar-right";

  const who = document.createElement("div");
  who.className = "who";
  who.innerHTML = "Logged in as <strong>" + escapeHtml(session.name) + "</strong> &middot; " + roleLabel(session.role);
  right.appendChild(who);

  const nav = document.createElement("nav");
  if (session.role === "employee") {
    nav.innerHTML =
      '<a href="portal-home.html">Home</a>' +
      '<a href="portal-catalog.html">Catalog</a>' +
      '<a href="portal-board.html">Board</a>' +
      '<a href="portal-submit.html">Submit Requirement</a>' +
      '<a href="portal-my-tasks.html">My Tasks</a>' +
      '<a href="help.html">Help</a>' +
      '<span class="logout" onclick="logout()">Log out</span>';
  } else {
    nav.innerHTML =
      '<a href="tracker-dashboard.html">Dashboard</a>' +
      '<a href="tracker-home.html">Requirement Register</a>' +
      '<a href="portal-catalog.html">Catalog</a>' +
      '<a href="portal-board.html">Board</a>' +
      '<a href="help.html">Help</a>' +
      '<span class="logout" onclick="logout()">Log out</span>';
  }
  right.appendChild(nav);
  topbar.appendChild(right);

  document.body.insertBefore(topbar, document.body.firstChild);
  return session;
}

function escapeHtml(str) {
  if (str === undefined || str === null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
