(function () {
  "use strict";

  var GA4_ID = "G-Q8TH5MKKZ0";
  var ARTICLE_SLUG = "personal-branding-strategies-for-business-women";

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA4_ID);

  if (!window.FDAttribution && !document.querySelector('script[data-fd-attribution]')) {
    var attributionScript = document.createElement("script");
    attributionScript.async = true;
    attributionScript.src = "/attribution.js?v=20260823-1";
    attributionScript.setAttribute("data-fd-attribution", "true");
    document.head.appendChild(attributionScript);
  }

  if (!document.querySelector('script[data-fd-article-ga4]')) {
    var analyticsScript = document.createElement("script");
    analyticsScript.async = true;
    analyticsScript.src = "https://www.googletagmanager.com/gtag/js?id=" + GA4_ID;
    analyticsScript.setAttribute("data-fd-article-ga4", "true");
    document.head.appendChild(analyticsScript);
  }

  function ctaLocation(link, index) {
    if (link.classList.contains("publication-mark")) return "header_logo";
    if (link.classList.contains("header-cta")) return "header_work_with_us";
    if (link.classList.contains("conversion-cta")) return "bottom_schedule_call";
    if (link.classList.contains("footer-logo")) return "footer_logo";
    if (link.classList.contains("related-card--method")) return "related_method";
    if (link.classList.contains("related-card--next")) return "related_private_engagements";
    if (link.closest(".related-heading")) return "related_visit_fordivine";
    if (link.closest(".footer-nav") && /inquire/i.test(link.textContent)) return "footer_inquire";
    if (link.closest(".footer-nav")) return "footer_home";
    if (link.closest(".strategy")) return "inline_crowned_authority_framework";
    return "discover_link_" + (index + 1);
  }

  Array.prototype.slice.call(
    document.querySelectorAll('a[href^="https://www.fordivine.com/discover"], a[href^="/discover"]')
  ).forEach(function (link, index) {
    var location = ctaLocation(link, index);
    var destination = new URL(link.href, window.location.origin);
    destination.searchParams.set("fd_entry", "journal");
    destination.searchParams.set("fd_article", ARTICLE_SLUG);
    destination.searchParams.set("fd_cta", location);

    if (location === "bottom_schedule_call" || location === "footer_inquire") {
      destination.hash = "book";
    }
    link.href = destination.toString();
    link.dataset.fdArticleCta = location;

    link.addEventListener("click", function () {
      try {
        var state = {
          version: 1,
          articleAssist: {
            captured_at: new Date().toISOString(),
            entry: "journal",
            article: ARTICLE_SLUG,
            cta: location,
            landing_page: "/journal/" + ARTICLE_SLUG
          }
        };
        var existing = JSON.parse(window.sessionStorage.getItem("fd_attribution_v1") || "{}");
        existing.version = 1;
        existing.articleAssist = state.articleAssist;
        window.sessionStorage.setItem("fd_attribution_v1", JSON.stringify(existing));
        var localExisting = JSON.parse(window.localStorage.getItem("fd_attribution_v1") || "{}");
        localExisting.version = 1;
        localExisting.articleAssist = state.articleAssist;
        window.localStorage.setItem("fd_attribution_v1", JSON.stringify(localExisting));
      } catch (error) {
        // Storage restrictions should not block navigation.
      }

      window.gtag("event", "article_cta_click", {
        article_slug: ARTICLE_SLUG,
        article_cta_location: location,
        destination_path: destination.pathname + destination.hash,
        transport_type: "beacon"
      });
    });
  });

  var progress = document.querySelector(".reading-progress");
  var tocLinks = Array.prototype.slice.call(
    document.querySelectorAll('.article-toc a[href^="#"]')
  );
  var sectionLinks = tocLinks.filter(function (link) {
    return link.getAttribute("href") !== "#article";
  });

  function updateProgress() {
    if (!progress) return;
    var root = document.documentElement;
    var available = Math.max(root.scrollHeight - window.innerHeight, 1);
    var percent = Math.min(100, Math.max(0, (window.scrollY / available) * 100));
    progress.style.width = percent + "%";
  }

  function setActive(id) {
    sectionLinks.forEach(function (link) {
      var active = link.getAttribute("href") === "#" + id;
      var item = link.closest("li");
      if (item) item.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }

  var sections = sectionLinks
    .map(function (link) {
      return document.getElementById(link.getAttribute("href").slice(1));
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        var visible = entries
          .filter(function (entry) {
            return entry.isIntersecting;
          })
          .sort(function (a, b) {
            return a.boundingClientRect.top - b.boundingClientRect.top;
          });
        if (visible.length) setActive(visible[0].target.id);
      },
      { rootMargin: "-18% 0px -68% 0px", threshold: [0, 0.1, 0.5] }
    );
    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  sectionLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      setActive(link.getAttribute("href").slice(1));
    });
  });

  Array.prototype.slice.call(
    document.querySelectorAll("[data-embed-url]")
  ).forEach(function (button) {
    button.addEventListener("click", function () {
      var embedUrl = button.getAttribute("data-embed-url");
      if (!embedUrl) return;
      var frame = document.createElement("iframe");
      frame.src = embedUrl + "&autoplay=1";
      frame.title = button.getAttribute("aria-label") || "Play episode";
      frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      frame.referrerPolicy = "strict-origin-when-cross-origin";
      frame.allowFullscreen = true;
      button.parentNode.replaceChild(frame, button);
    });
  });

  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
})();
