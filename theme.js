// Consulting & Beyond — Technology Spearheads Committee
// Light theme ("Cloudy Pro") is the default. Members can switch to the dark
// theme ("Midnight Pro"); the choice is remembered in their browser.
// Load this in <head> on every page so there's no flash of the wrong theme.

(function () {
  const KEY = "tsc_theme";

  function stored() {
    try {
      return localStorage.getItem(KEY) === "dark" ? "dark" : "light";
    } catch (e) {
      return "light";
    }
  }

  function apply(theme) {
    if (theme === "dark") document.documentElement.setAttribute("data-theme", "dark");
    else document.documentElement.removeAttribute("data-theme");
  }

  apply(stored());

  window.getTheme = function () {
    return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  };

  window.setTheme = function (theme) {
    try {
      localStorage.setItem(KEY, theme);
    } catch (e) {}
    apply(theme);
    document.querySelectorAll("button.theme-toggle").forEach(paintToggle);
    window.dispatchEvent(new CustomEvent("themechange", { detail: theme }));
  };

  function paintToggle(btn) {
    const dark = window.getTheme() === "dark";
    const cls = dark ? "fa-sun" : "fa-moon";
    btn.innerHTML = '<i class="fa-solid ' + cls + '"></i>';
    btn.title = dark ? "Switch to light theme" : "Switch to dark theme";
    btn.setAttribute("aria-label", btn.title);
  }

  // Returns a ready-made toggle button (used by the top bar and the login page).
  window.createThemeToggle = function () {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "theme-toggle";
    btn.onclick = function () {
      window.setTheme(window.getTheme() === "dark" ? "light" : "dark");
    };
    paintToggle(btn);
    return btn;
  };

  // Pages without the top bar (login) get a floating toggle.
  document.addEventListener("DOMContentLoaded", function () {
    if (!document.querySelector(".topbar") && !document.querySelector("button.theme-toggle")) {
      const b = window.createThemeToggle();
      b.classList.add("floating");
      document.body.appendChild(b);
    }
  });
})();
