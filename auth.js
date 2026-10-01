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

// After login, send each role to the right landing page.
function redirectAfterLogin(session) {
  if (session.role === "employee") {
    window.location.href = "portal-home.html";
  } else if (session.role === "Management") {
    window.location.href = "tracker-dashboard.html";
  } else {
    // Committee, Admin
    window.location.href = "tracker-home.html";
  }
}
