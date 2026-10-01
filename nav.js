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

  const who = document.createElement("div");
  who.className = "who";
  who.innerHTML = "Logged in as <strong>" + escapeHtml(session.name) + "</strong> &middot; " + roleLabel(session.role);
  topbar.appendChild(who);

  const nav = document.createElement("nav");
  if (session.role === "employee") {
    nav.innerHTML =
      '<a href="portal-home.html">Home</a>' +
      '<a href="portal-catalog.html">Catalog</a>' +
      '<a href="portal-board.html">Board</a>' +
      '<a href="portal-submit.html">Submit Requirement</a>' +
      '<a href="portal-my-tasks.html">My Tasks</a>' +
      '<span class="logout" onclick="logout()">Log out</span>';
  } else {
    nav.innerHTML =
      '<a href="tracker-dashboard.html">Dashboard</a>' +
      '<a href="tracker-home.html">Requirement Register</a>' +
      '<a href="portal-catalog.html">Catalog</a>' +
      '<a href="portal-board.html">Board</a>' +
      '<span class="logout" onclick="logout()">Log out</span>';
  }
  topbar.appendChild(nav);

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
