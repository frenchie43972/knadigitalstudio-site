// K&A Digital Studio: small enhancements. Every page works without this file.

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

// Email signup (MailerLite): post in the background and confirm on the page.
// Without JavaScript the form still posts to MailerLite directly.
document.querySelectorAll("form.ml-form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const note = form.querySelector("[role=status]");
    const button = form.querySelector("button");
    button.disabled = true;
    fetch(form.action, { method: "POST", body: new FormData(form), mode: "no-cors" })
      .then(() => {
        form.querySelectorAll("input, button").forEach((el) => { el.hidden = true; });
        note.textContent = "Almost done: tap the confirm link in the email we just sent. Not in your inbox? Check Promotions or Spam.";
      })
      .catch(() => {
        button.disabled = false;
        note.textContent = "That didn’t go through. Please try again, or email knadigitalstudio@gmail.com.";
      });
  });
});
