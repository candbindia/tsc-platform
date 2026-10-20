// Consulting & Beyond — Technology Spearheads Committee
// Shared session helpers. Every page (except the login page itself)
// includes this and calls requireSession() at the top.

const SESSION_KEY = "tsc_session";

function saveSession(data) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(data));
}

function getSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

function logout() {
  clearSession();
  window.location.href = "index.html";
}

// Call this at the top of every page that needs a logged-in user. Sends
// them back to the login page if there's no session. Returns the session
// object ({ token, name, role, department? }) if there is one.
function requireSession() {
  const session = getSession();
  if (!session || !session.token) {
    window.location.href = "index.html";
    return null;
  }
  return session;
}

// Wrapper around fetch that adds the Authorization header and handles an
// expired/invalid session by bouncing back to login.
async function apiFetch(path, options) {
  const session = getSession();
  options = options || {};
  options.headers = Object.assign({}, options.headers, {
    "Content-Type": "application/json",
    Authorization: session ? "Bearer " + session.token : "",
  });

  const res = await fetch(API_BASE + path, options);

  if (res.status === 401) {
    clearSession();
    window.location.href = "index.html";
    throw new Error("Session expired");
  }

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Something went wrong");
  }
  return data;
}

// Decodes the (unsigned-here, already-trusted-because-it-came-from-us)
// JWT payload so pages can read things like the employee's own ID (the
// "sub" claim) without the Worker needing to return it separately.
function decodeToken(token) {
  try {
    const part = token.split(".")[1];
    const json = atob(part.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

function getEmployeeId() {
  const session = getSession();
  if (!session || !session.token) return null;
  const payload = decodeToken(session.token);
  return payload ? payload.sub : null;
}

// ───────── Button loading state + generic submit/click wiring ─────────
// Keeps every async action consistent: disable the button, show a spinner
// in place of its label, restore it when the request settles either way.

function setButtonLoading(btn, loading, loadingLabel) {
  if (!btn) return;
  if (loading) {
    if (btn.dataset.originalText === undefined) btn.dataset.originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span class="btn-spinner"></span>' + (loadingLabel || "Working…");
  } else {
    btn.disabled = false;
    if (btn.dataset.originalText !== undefined) btn.innerHTML = btn.dataset.originalText;
  }
}

// Wire a <form onsubmit="return handleFormSubmit(event, someAsyncFn)">.
// Finds the form's submit button automatically and spins it.
function handleFormSubmit(e, fn) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  setButtonLoading(btn, true);
  Promise.resolve(fn()).finally(() => setButtonLoading(btn, false));
  return false;
}

// Wire a plain <button onclick="handleClick(this, someAsyncFn)">.
function handleClick(btn, fn) {
  setButtonLoading(btn, true);
  Promise.resolve(fn()).finally(() => setButtonLoading(btn, false));
}

// After login, send each role to the right landing page.
function redirectAfterLogin(session) {
  window.location.href = typeof homeFor === "function" ? homeFor(session.role) :
    (session.role === "employee" ? "portal-home.html" : session.role === "Admin" ? "manage-accounts.html" :
     session.role === "Management" ? "tracker-dashboard.html" : "tracker-home.html");
}

// Downloads the RUD from the portal (employees never get a Drive link).
async function downloadRud(id, format) {
  try {
    const d = await apiFetch("/requirements/rud-download?id=" + encodeURIComponent(id) + "&format=" + format);
    const bin = atob(d.base64), bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const url = URL.createObjectURL(new Blob([bytes], { type: d.mime }));
    const a = document.createElement("a");
    a.href = url; a.download = d.fileName; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  } catch (e) { if (typeof showToast === "function") showToast(e.message, "error"); }
}

// ───────── File picking (attachments, code, guides) ─────────
const FILE_EXT_INPUT = ["xlsx", "xls", "xlsm", "csv", "pdf", "docx", "doc", "pptx", "ppt", "txt", "png", "jpg", "jpeg", "zip", "json"];
const FILE_EXT_TOOL = FILE_EXT_INPUT.concat(["py", "js", "ts", "sql", "bas", "vba", "ps1", "sh", "ipynb", "pbix", "md", "html", "gs"]);
const FILE_MAX_MB = 10;

// Returns an error message, or "" when the picked files are fine.
function checkPicked(files, exts) {
  for (const f of files) {
    const ext = (f.name.split(".").pop() || "").toLowerCase();
    if (f.name.indexOf(".") < 0 || !exts.includes(ext)) return '"' + f.name + '" is not an allowed file type.';
    if (f.size > FILE_MAX_MB * 1024 * 1024) return '"' + f.name + '" is larger than ' + FILE_MAX_MB + " MB.";
    if (f.size === 0) return '"' + f.name + '" is empty.';
  }
  return "";
}

function readFileB64(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(",")[1] || "");
    r.onerror = () => reject(new Error("Could not read " + file.name));
    r.readAsDataURL(file);
  });
}

async function filesToPayload(files) {
  const out = [];
  for (const f of files) out.push({ name: f.name, base64: await readFileB64(f) });
  return out;
}

function fmtSize(n) { return n >= 1048576 ? (n / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(n / 1024)) + " KB"; }
