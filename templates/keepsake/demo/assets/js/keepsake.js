// Keepsake: small enhancements. Every page still works without this file.

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
    try { localStorage.setItem("keepsake-mode", next); } catch (e) {}
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

// Countdown: counts the days to the date in data-date. After the day it shows
// the text in data-after instead (for example "Married June 12, 2027").
(function () {
  document.querySelectorAll("[data-countdown]").forEach(function (el) {
    var when = new Date(el.getAttribute("data-date"));
    if (isNaN(when)) return;
    var days = Math.ceil((when - new Date()) / 86400000);
    if (days > 1) el.innerHTML = "<strong>" + days + "</strong> days to go";
    else if (days === 1) el.innerHTML = "<strong>1</strong> day to go";
    else if (days === 0) el.textContent = "Today’s the day!";
    else el.textContent = el.getAttribute("data-after") || "";
  });
})();

// Photo viewer: tapping a photo in the gallery opens it larger, with previous
// and next buttons, arrow keys and Escape. Without this script the links
// simply open the photo on its own.
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll(".gallery a"));
  var viewer = document.querySelector(".viewer");
  if (!links.length || !viewer || typeof viewer.showModal !== "function") return;
  var img = viewer.querySelector("img"), caption = viewer.querySelector("p"), index = 0;

  function show(i) {
    index = (i + links.length) % links.length;
    var thumb = links[index].querySelector("img");
    img.src = links[index].getAttribute("href");
    img.alt = thumb.alt;
    caption.textContent = thumb.alt + " (" + (index + 1) + " of " + links.length + ")";
  }
  links.forEach(function (a, i) {
    a.addEventListener("click", function (e) { e.preventDefault(); show(i); viewer.showModal(); });
  });
  viewer.querySelector(".viewer-prev").addEventListener("click", function () { show(index - 1); });
  viewer.querySelector(".viewer-next").addEventListener("click", function () { show(index + 1); });
  viewer.querySelector(".viewer-close").addEventListener("click", function () { viewer.close(); });
  viewer.addEventListener("click", function (e) { if (e.target === viewer) viewer.close(); });   // click outside the photo
  viewer.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });
  viewer.addEventListener("close", function () { links[index].focus(); });
})();
