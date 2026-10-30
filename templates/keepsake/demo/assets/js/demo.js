// Keepsake live demo only: lets visitors try every style, mode and a few brand colors.
// Not included in the buyer's download. Choices last for the visit (sessionStorage).
(function () {
  var root = document.documentElement;
  var STYLES = { classic: "#2f5d50", modern: "#1c1c1c", garden: "#4a6b4c" };
  var COLORS = ["#2f5d50", "#1c1c1c", "#4a6b4c", "#1e3a5f", "#7d3f5a", "#8a5a2b"];
  var state = { style: "classic", mode: "auto", brand: "" };
  try { Object.assign(state, JSON.parse(sessionStorage.getItem("keepsake-demo") || "{}")); } catch (e) {}

  function apply() {
    root.setAttribute("data-style", state.style);
    if (state.mode === "auto") { root.removeAttribute("data-mode"); try { localStorage.removeItem("keepsake-mode"); } catch (e) {} }
    else root.setAttribute("data-mode", state.mode);
    root.style.setProperty("--brand", state.brand || STYLES[state.style]);
    try { sessionStorage.setItem("keepsake-demo", JSON.stringify(state)); } catch (e) {}
    box.querySelectorAll("[data-k]").forEach(function (b) {
      var k = b.getAttribute("data-k"), v = b.getAttribute("data-v");
      b.setAttribute("aria-pressed", String(k === "brand" ? (state.brand || STYLES[state.style]) === v : state[k] === v));
    });
  }
  function seg(key, items) {
    return '<div class="seg" role="group">' + items.map(function (i) {
      return '<button type="button" data-k="' + key + '" data-v="' + i[0] + '">' + i[1] + "</button>";
    }).join("") + "</div>";
  }
  var box = document.createElement("div");
  box.className = "demo-switch";
  box.setAttribute("aria-label", "Demo options");
  box.innerHTML =
    '<button type="button" class="toggle" aria-expanded="true">Try Keepsake your way <span aria-hidden="true">▾</span></button>' +
    '<div class="panel">' +
      '<div><div class="label">Style</div>' + seg("style", [["classic", "Classic"], ["modern", "Modern"], ["garden", "Garden"]]) + "</div>" +
      '<div><div class="label">Mode</div>' + seg("mode", [["auto", "Auto"], ["light", "Light"], ["dark", "Dark"]]) + '<p class="hint">Auto follows each visitor’s device setting.</p></div>' +
      '<div><div class="label">Brand color</div><div class="swatches">' + COLORS.map(function (c) {
        return '<button type="button" data-k="brand" data-v="' + c + '" style="background:' + c + '" aria-label="Brand color ' + c + '"></button>';
      }).join("") + "</div></div>" +
      '<p class="note">This panel is for previewing only. Your download includes all three styles, light and dark mode, and any brand color. The setup guide shows how to choose yours in a minute.</p>' +
      '<a href="https://knadigitalstudio.com/templates/keepsake/">Get Keepsake →</a>' +
    "</div>";
  document.body.appendChild(box);
  // On phones the open panel covers half the page, so it starts folded there.
  if (window.matchMedia("(max-width: 640px)").matches) {
    box.setAttribute("data-collapsed", "");
    box.querySelector(".toggle").setAttribute("aria-expanded", "false");
  }

  box.addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    if (b.classList.contains("toggle")) {
      var collapsed = box.toggleAttribute("data-collapsed");
      b.setAttribute("aria-expanded", String(!collapsed));
      return;
    }
    var k = b.getAttribute("data-k"), v = b.getAttribute("data-v");
    if (k === "style") { state.style = v; state.brand = ""; }
    else if (k === "mode") state.mode = v;
    else if (k === "brand") state.brand = v;
    apply();
  });
  apply();
})();
