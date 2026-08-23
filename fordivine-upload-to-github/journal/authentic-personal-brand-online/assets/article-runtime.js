(function () {
  "use strict";

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
