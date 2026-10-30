// Harbor: small enhancements. Every page still works without this file.

// Light/dark toggle. The visitor's choice is remembered; without a choice the
// site follows the device setting. Owners can lock a mode with
// data-mode-lock="light" or "dark" on <html>, which also hides the toggle.
(function () {
  var root = document.documentElement;
  var toggle = document.querySelector(".mode-toggle");
  if (!toggle) return;
  if (root.hasAttribute("data-mode-lock")) { toggle.hidden = true; return; }

  function currentMode() {
    var set = root.getAttribute("data-mode");
    if (set) return set;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function label() {
    toggle.setAttribute("aria-label", currentMode() === "dark" ? "Switch to light mode" : "Switch to dark mode");
  }
  toggle.addEventListener("click", function () {
    var next = currentMode() === "dark" ? "light" : "dark";
    root.setAttribute("data-mode", next);
    try { localStorage.setItem("harbor-mode", next); } catch (e) {}
    label();
  });
  label();
})();

// Mobile menu
(function () {
  var button = document.querySelector(".menu-btn");
  var nav = document.getElementById("site-nav");
  if (!button || !nav) return;
  button.addEventListener("click", function () {
    var open = nav.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
})();

// Services dropdown: the arrow button opens it (keyboard, touch, phone menu);
// on desktop it also opens on hover. Escape or a click elsewhere closes it.
(function () {
  var toggle = document.querySelector(".sub-toggle");
  if (!toggle) return;
  var item = toggle.closest(".has-sub");
  function set(open) {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Hide services" : "Show services");
  }
  toggle.addEventListener("click", function () { set(toggle.getAttribute("aria-expanded") !== "true"); });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (item.contains(document.activeElement) || item.matches(":hover")) {
      set(false); item.classList.add("hover-off"); toggle.focus();   // Escape also hides a hover-opened menu
    }
  });
  item.addEventListener("mouseleave", function () { item.classList.remove("hover-off"); });
  document.addEventListener("click", function (e) { if (!item.contains(e.target)) set(false); });
  item.addEventListener("focusout", function (e) { if (!item.contains(e.relatedTarget)) set(false); });
})();
