(function () {
  "use strict";

  var GA4_ID = "G-Q8TH5MKKZ0";
  var manifestNode = document.getElementById("fordivine-article-manifest");
  var articleManifest = {};
  try {
    articleManifest = manifestNode ? JSON.parse(manifestNode.textContent || "{}") : {};
  } catch (error) {
    articleManifest = {};
  }
  var ARTICLE_SLUG = articleManifest.slug || window.location.pathname.split("/").filter(Boolean).pop() || "article";

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

  function loadAnalytics() {
    if (document.querySelector('script[data-fd-article-ga4]')) return;
    var analyticsScript = document.createElement("script");
    analyticsScript.async = true;
    analyticsScript.src = "https://www.googletagmanager.com/gtag/js?id=" + GA4_ID;
    analyticsScript.setAttribute("data-fd-article-ga4", "true");
    document.head.appendChild(analyticsScript);
  }

  // Queue events immediately, but let the page and hero paint before the
  // analytics library competes for bandwidth. This applies to every visitor.
  function scheduleAnalytics() {
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        if ("requestIdleCallback" in window) {
          window.requestIdleCallback(loadAnalytics, { timeout: 1500 });
        } else {
          window.setTimeout(loadAnalytics, 0);
        }
      });
    });
  }
  if (document.readyState === "complete") scheduleAnalytics();
  else window.addEventListener("load", scheduleAnalytics, { once: true });

  function ctaLocation(link, index) {
    if (link.classList.contains("publication-mark")) return "header_logo";
    if (link.classList.contains("header-cta")) return "header_work_with_us";
    if (link.classList.contains("conversion-cta")) return "bottom_schedule_call";
    if (link.classList.contains("footer-logo")) return "footer_logo";
    if (link.classList.contains("related-card--method")) return "related_method";
    if (link.classList.contains("related-card--next")) return "related_private_engagements";
    if (link.closest(".related-heading")) return "related_visit_fordivine";
    if (link.closest(".footer-nav, .fd-footer-nav") && /inquire/i.test(link.textContent)) return "footer_inquire";
    if (link.closest(".footer-nav, .fd-footer-nav")) return "footer_home";
    if (link.closest(".strategy")) return "inline_crowned_authority_framework";
    return "discover_link_" + (index + 1);
  }

  Array.prototype.slice.call(
    document.querySelectorAll('a[href^="https://www.fordivine.com/discover"], a[href^="/discover"]')
  ).forEach(function (link, index) {
    var location = ctaLocation(link, index);
    var destination = new URL(link.href, window.location.origin);
    destination.searchParams.set("fd_entry", "resources");
    destination.searchParams.set("fd_article", ARTICLE_SLUG);
    destination.searchParams.set("fd_cta", location);

    if (location === "bottom_schedule_call" || location === "footer_inquire") {
      destination.hash = "book";
    }
    link.href = destination.toString();
    link.dataset.fdArticleCta = location;

    link.addEventListener("click", function () {
      try {
        var articleAssist = {
          captured_at: new Date().toISOString(),
          entry: "resources",
          article: ARTICLE_SLUG,
          cta: location,
          landing_page: "/resources/" + ARTICLE_SLUG
        };
        var existing = JSON.parse(window.sessionStorage.getItem("fd_attribution_v1") || "{}");
        existing.version = 1;
        existing.articleAssist = articleAssist;
        window.sessionStorage.setItem("fd_attribution_v1", JSON.stringify(existing));
        var localExisting = JSON.parse(window.localStorage.getItem("fd_attribution_v1") || "{}");
        localExisting.version = 1;
        localExisting.articleAssist = articleAssist;
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

  var tocProgress = document.querySelector(".toc-progress span");
  var articleBody = document.querySelector(".article-body");
  var progressFrame = 0;
  var tocLinks = Array.prototype.slice.call(
    document.querySelectorAll('.article-toc:not(.article-tree-toc) a[href^="#"]')
  );
  var sectionLinks = tocLinks.filter(function (link) {
    return link.getAttribute("href") !== "#article";
  });

  function updateProgress() {
    if (tocProgress && articleBody) {
      var articleStart = articleBody.getBoundingClientRect().top + window.scrollY;
      var articleDistance = Math.max(articleBody.offsetHeight - window.innerHeight, 1);
      var articlePercent = Math.min(100, Math.max(0, ((window.scrollY - articleStart) / articleDistance) * 100));
      tocProgress.style.width = articlePercent + "%";
    }
    progressFrame = 0;
  }

  function scheduleProgressUpdate() {
    if (!progressFrame) progressFrame = window.requestAnimationFrame(updateProgress);
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
  window.addEventListener("scroll", scheduleProgressUpdate, { passive: true });
  window.addEventListener("resize", scheduleProgressUpdate);
})();

/* FORDIVINE article-only reading progress. Contents navigation remains independent. */
(function () {
  'use strict';
  function boot() {
    var bar = document.querySelector('.reading-progress');
    var article = document.querySelector('.article-body');
    if (!bar || !article || bar.dataset.articleProgressReady) return;
    var end = article.querySelector('#next-move');
    // A missing endpoint is a QA failure; never silently substitute the page footer.
    if (!end) { bar.style.display = 'none'; return; }
    bar.dataset.articleProgressReady = 'true';
    bar.style.animation = 'none';
    bar.style.transition = 'none';
    bar.style.width = '100%';
    bar.style.transform = 'scaleX(0)';
    bar.style.display = 'block';
    var frame = 0;
    function update() {
      frame = 0;
      var viewport = window.innerHeight;
      var start = Math.max(0, article.getBoundingClientRect().top + window.scrollY - viewport);
      var finish = Math.max(0, end.getBoundingClientRect().bottom + window.scrollY - viewport);
      var value = finish > start ? (window.scrollY - start) / (finish - start) : (window.scrollY >= finish ? 1 : 0);
      bar.style.transform = 'scaleX(' + Math.min(1, Math.max(0, value)) + ')';
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(update); }
    update();
    window.addEventListener('scroll', schedule, {passive:true});
    window.addEventListener('resize', schedule);
    window.addEventListener('pageshow', schedule);
    window.addEventListener('load', schedule);
    if (document.fonts) document.fonts.ready.then(schedule);
    if ('ResizeObserver' in window) {
      var observer = new ResizeObserver(schedule);
      observer.observe(article);
      observer.observe(end);
      var hero = document.querySelector('.article-hero');
      if (hero) observer.observe(hero);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, {once:true});
  else boot();
})();
