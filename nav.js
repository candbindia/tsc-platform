// Consulting & Beyond — Technology Spearheads Committee
// Builds the shared top bar (brand, navigation with dropdown groups, user menu) on every page
// except the login page. Include after auth.js, then call renderTopbar()
// at the top of the page's script.

function roleLabel(role) {
  if (role === "employee") return "Employee";
  return role; // Committee / Management / Admin
}

// Menus per role. A "group" becomes a dropdown; a plain link stays in the bar.
function navItemsFor(role) {
  if (role === "employee") {
    return [
      { label: "Home", href: "portal-home.html" },
      { label: "Catalog", href: "portal-catalog.html" },
      { label: "Requirements", group: [
        { label: "Submit a Requirement", href: "portal-submit.html" },
        { label: "Requirement Board", href: "portal-board.html" },
      ] },
      { label: "My Tasks", href: "portal-my-tasks.html" },
      { label: "Help", href: "help.html" },
    ];
  }
  return [
    { label: "Dashboard", href: "tracker-dashboard.html" },
    { label: "Requirements", group: [
      { label: "Requirement Register", href: "tracker-home.html" },
      { label: "Requirement Board", href: "portal-board.html" },
    ] },
    { label: "Catalog", href: "portal-catalog.html" },
    { label: "Admin", group: [
      { label: "Manage Accounts", href: "manage-accounts.html" },
    ] },
    { label: "Help", href: "help.html" },
  ];
}

function initialsOf(name) {
  const parts = String(name || "?").trim().split(/\s+/).filter(Boolean);
  const first = parts[0] ? parts[0][0] : "?";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

function closeTopbarMenus() {
  document.querySelectorAll(".topbar .tb-drop.open, .topbar .tb-user.open").forEach((el) => {
    el.classList.remove("open");
    const b = el.querySelector("button[aria-expanded]");
    if (b) b.setAttribute("aria-expanded", "false");
  });
}

function renderTopbar() {
  const session = requireSession();
  if (!session) return null; // requireSession already redirected to login

  // Pages call load() again after every action - never stack a second bar.
  document.querySelectorAll(".topbar").forEach((el) => el.remove());

  const here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const isHere = (href) => (href || "").toLowerCase() === here;

  const topbar = document.createElement("header");
  topbar.className = "topbar";

  // brand
  const logo = document.createElement("a");
  logo.className = "brand-logo";
  logo.href = session.role === "employee" ? "portal-home.html" : "tracker-dashboard.html";
  logo.innerHTML = '<span class="bar"></span><span class="brand-mark">C&amp;B</span><span class="brand-sub">TSC</span>';
  topbar.appendChild(logo);

  // hamburger (phones)
  const burger = document.createElement("button");
  burger.type = "button";
  burger.className = "tb-burger";
  burger.setAttribute("aria-label", "Menu");
  burger.setAttribute("aria-expanded", "false");
  burger.innerHTML = "<span></span><span></span><span></span>";
  topbar.appendChild(burger);

  // main navigation
  const nav = document.createElement("div");
  nav.className = "tb-nav";
  navItemsFor(session.role).forEach((item) => {
    if (!item.group) {
      const a = document.createElement("a");
      a.className = "tb-link" + (isHere(item.href) ? " active" : "");
      a.href = item.href;
      a.textContent = item.label;
      nav.appendChild(a);
      return;
    }
    const active = item.group.some((g) => isHere(g.href));
    const drop = document.createElement("div");
    drop.className = "tb-drop";
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tb-link" + (active ? " active" : "");
    btn.setAttribute("aria-expanded", "false");
    btn.innerHTML = escapeHtml(item.label) + ' <span class="tb-caret"></span>';
    const panel = document.createElement("div");
    panel.className = "tb-menu";
    item.group.forEach((g) => {
      const a = document.createElement("a");
      a.href = g.href;
      a.textContent = g.label;
      if (isHere(g.href)) a.className = "active";
      panel.appendChild(a);
    });
    btn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      const wasOpen = drop.classList.contains("open");
      closeTopbarMenus();
      if (!wasOpen) { drop.classList.add("open"); btn.setAttribute("aria-expanded", "true"); }
    });
    drop.appendChild(btn);
    drop.appendChild(panel);
    nav.appendChild(drop);
  });
  topbar.appendChild(nav);

  // right side: theme toggle + user menu
  const right = document.createElement("div");
  right.className = "tb-right";
  if (typeof createThemeToggle === "function") right.appendChild(createThemeToggle());

  const user = document.createElement("div");
  user.className = "tb-user";
  const ubtn = document.createElement("button");
  ubtn.type = "button";
  ubtn.className = "tb-user-btn";
  ubtn.setAttribute("aria-expanded", "false");
  ubtn.setAttribute("aria-label", "Account menu");
  ubtn.innerHTML =
    '<span class="tb-avatar">' + escapeHtml(initialsOf(session.name)) + "</span>" +
    '<span class="tb-user-text"><span class="tb-user-name">' + escapeHtml(session.name) + "</span>" +
    '<span class="tb-user-role">' + escapeHtml(roleLabel(session.role)) + "</span></span>" +
    '<span class="tb-caret"></span>';
  const umenu = document.createElement("div");
  umenu.className = "tb-menu right";
  umenu.innerHTML =
    '<div class="tb-menu-head"><strong>' + escapeHtml(session.name) + "</strong><span>" + escapeHtml(roleLabel(session.role)) + "</span></div>" +
    '<a href="account.html"' + (isHere("account.html") ? ' class="active"' : "") + ">Account &amp; password</a>" +
    '<button type="button" class="tb-logout">Log out</button>';
  ubtn.addEventListener("click", (ev) => {
    ev.stopPropagation();
    const wasOpen = user.classList.contains("open");
    closeTopbarMenus();
    if (!wasOpen) { user.classList.add("open"); ubtn.setAttribute("aria-expanded", "true"); }
  });
  umenu.querySelector(".tb-logout").addEventListener("click", () => logout());
  user.appendChild(ubtn);
  user.appendChild(umenu);
  right.appendChild(user);
  topbar.appendChild(right);

  burger.addEventListener("click", (ev) => {
    ev.stopPropagation();
    const open = topbar.classList.toggle("menu-open");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
  });

  document.body.insertBefore(topbar, document.body.firstChild);
  return session;
}

// close menus on outside click / Esc (registered once)
if (!window.__tbMenuHandlers) {
  window.__tbMenuHandlers = true;
  document.addEventListener("click", closeTopbarMenus);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeTopbarMenus(); });
}

function escapeHtml(str) {
  if (str === undefined || str === null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
