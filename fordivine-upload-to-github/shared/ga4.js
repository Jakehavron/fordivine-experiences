(function (scriptEl) {
  var GA4_ID = "G-Q8TH5MKKZ0";

  if (window.__fdGa4Initialized === GA4_ID) return;
  if (window.__fdGa4Initialized) return;
  window.__fdGa4Initialized = GA4_ID;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  function injectLibrary() {
    if (document.querySelector('script[data-fd-ga4="' + GA4_ID + '"]')) return;
    if (document.querySelector('script[src*="googletagmanager.com/gtag/js?id=' + GA4_ID + '"]')) return;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA4_ID;
    s.setAttribute("data-fd-ga4", GA4_ID);
    document.head.appendChild(s);
  }

  function queueConfig() {
    window.gtag("js", new Date());
    window.gtag("config", GA4_ID);
  }

  function startImmediate() {
    injectLibrary();
    queueConfig();
  }

  function onIdle(fn) {
    var run = function () {
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(fn, { timeout: 1500 });
      } else {
        window.setTimeout(fn, 0);
      }
    };
    var afterPaint = function () {
      if ("requestAnimationFrame" in window) {
        window.requestAnimationFrame(function () {
          window.requestAnimationFrame(run);
        });
      } else {
        run();
      }
    };
    if (document.readyState === "complete") afterPaint();
    else window.addEventListener("load", afterPaint, { once: true });
  }

  var when = (scriptEl && scriptEl.getAttribute("data-fd-ga4-when")) || "idle";
  if (when === "immediate") {
    startImmediate();
    return;
  }

  // Default: queue config now so a bounce still counts, inject gtag.js after
  // load + idle (not on first click, scroll, or keydown).
  queueConfig();
  onIdle(injectLibrary);
})(document.currentScript);
