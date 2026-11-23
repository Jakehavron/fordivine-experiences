(function (scriptEl) {
  var HJID = 6670160;
  var HJSV = 6;

  function libraryPresent() {
    if (document.querySelector('script[data-fd-hotjar="' + HJID + '"]')) return true;
    return !!document.querySelector('script[src*="static.hotjar.com/c/hotjar-' + HJID + '.js"]');
  }

  function loadHotjar() {
    var settings = window._hjSettings;
    if (window.__fdHotjarInitialized === HJID) return;
    // Skip when this site id is already initialized and its library tag is present.
    if (window.hj && settings && settings.hjid === HJID && libraryPresent()) {
      window.__fdHotjarInitialized = HJID;
      return;
    }
    window.__fdHotjarInitialized = HJID;

    (function (h, o, t, j, a, r) {
      h.hj = h.hj || function () {
        (h.hj.q = h.hj.q || []).push(arguments);
      };
      h._hjSettings = { hjid: HJID, hjsv: HJSV };
      if (libraryPresent()) return;
      a = o.getElementsByTagName("head")[0];
      r = o.createElement("script");
      r.async = 1;
      r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
      r.setAttribute("data-fd-hotjar", String(HJID));
      a.appendChild(r);
    })(window, document, "https://static.hotjar.com/c/hotjar-", ".js?sv=");
  }

  window.fdLoadHotjar = loadHotjar;

  // "manual" keeps a page's existing deferral (first interaction, idle, or
  // the crowned-stories 30s fallback). The page calls fdLoadHotjar() then.
  var when = (scriptEl && scriptEl.getAttribute("data-fd-hj-when")) || "now";
  if (when === "manual") return;
  loadHotjar();
})(document.currentScript);
