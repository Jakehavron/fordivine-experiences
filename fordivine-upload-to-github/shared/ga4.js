(function (scriptEl) {
  var GA4_ID = "G-Q8TH5MKKZ0";
  var ADS_ID = "AW-18105449390";
  var CONSENT_REQUIRED_REGIONS = ["AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE","IT","LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE","IS","LI","NO","GB","CH"];

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
    // Consent mode v2 defaults. Must run before any config call.
    // EEA, UK and Switzerland: denied (there is no consent banner).
    window.gtag("consent", "default", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
      region: CONSENT_REQUIRED_REGIONS
    });
    // Everywhere else (the ads target the US only): granted.
    window.gtag("consent", "default", {
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
      analytics_storage: "granted"
    });
    window.gtag("js", new Date());
    window.gtag("config", GA4_ID);
    window.gtag("config", ADS_ID);
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
