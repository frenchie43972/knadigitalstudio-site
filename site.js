// KNA Digital Studio: small enhancements. Every page works without this file.

// Page weight in the footer, measured by the browser (not a hard-coded number).
function showPageWeight() {
  const out = document.getElementById("page-weight");
  if (!out || !performance.getEntriesByType) return;
  const entries = [
    ...performance.getEntriesByType("navigation"),
    ...performance.getEntriesByType("resource"),
  ];
  const bytes = entries.reduce((sum, e) => sum + (e.encodedBodySize || e.transferSize || 0), 0);
  if (!bytes) return;
  out.textContent = `This page: ${Math.round(bytes / 1024)} KB · ${entries.length} files · 0 frameworks · hand-written`;
}
window.addEventListener("load", () => setTimeout(showPageWeight, 300));

// Filter chips: <div class="filters"> buttons with data-filter; items with data-kind.
document.querySelectorAll(".filters").forEach((bar) => {
  const items = document.querySelectorAll(bar.dataset.target);
  bar.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    bar.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
    const kind = button.dataset.filter;
    items.forEach((item) => { item.hidden = kind !== "all" && item.dataset.kind !== kind; });
  });
});

// Product preview: skin, brand color, business name, device width.
const preview = document.querySelector(".preview");
if (preview) {
  const site = preview.querySelector(".harbor");
  const stage = preview.querySelector(".stage");

  preview.querySelectorAll(".seg").forEach((group) => {
    group.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button) return;
      group.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
      if (button.dataset.skin) site.dataset.skin = button.dataset.skin;
      if (button.dataset.device) stage.dataset.device = button.dataset.device;
    });
  });

  preview.querySelector("#brand-color").addEventListener("input", (event) => {
    site.style.setProperty("--h-brand", event.target.value);
  });

  const names = site.querySelectorAll("[data-business]");
  preview.querySelector("#brand-name").addEventListener("input", (event) => {
    const name = event.target.value.trim() || "Harbor Plumbing";
    names.forEach((el) => { el.textContent = name; });
  });
}
