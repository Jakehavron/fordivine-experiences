(function () {
  'use strict';

  var VIDALYTICS_ACCOUNT = 'Sjy1Iha6';

  function buildVideoPlaceholder(container) {
    if (container.dataset.placeholderReady === 'true') return;
    container.dataset.placeholderReady = 'true';

    var poster = document.createElement('img');
    poster.className = 'fd-deferred-video-poster';
    poster.src = container.dataset.poster;
    poster.alt = '';
    poster.decoding = 'async';
    poster.loading = container.dataset.ratio === 'landscape' ? 'eager' : 'lazy';
    if (container.dataset.ratio === 'landscape') poster.fetchPriority = 'high';

    var shade = document.createElement('span');
    shade.className = 'fd-deferred-video-shade';
    shade.setAttribute('aria-hidden', 'true');

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'fd-deferred-video-button';
    button.setAttribute('aria-label', container.dataset.label || 'Play video');
    button.addEventListener('click', function () {
      loadVidalytics(container);
    }, { once: true });

    container.appendChild(poster);
    container.appendChild(shade);
    container.appendChild(button);
  }

  function loadVidalytics(container) {
    if (!container || container.dataset.loaded === 'true') return;
    container.dataset.loaded = 'true';
    container.classList.add('is-loading');

    var videoId = container.dataset.vidalyticsId;
    var elementId = 'vidalytics_embed_' + videoId;
    var target = document.createElement('div');
    target.id = elementId;
    target.style.width = '100%';
    target.style.position = 'relative';
    target.style.paddingTop = container.dataset.ratio === 'landscape' ? '56.25%' : '177.78%';
    container.replaceChildren(target);

    var base = 'https://fast.vidalytics.com/embeds/' + VIDALYTICS_ACCOUNT + '/' + videoId + '/';

    (function (v, i, d, a, l, y, t, c, s) {
      y = '_' + d.toLowerCase();
      c = d + 'L';
      if (!v[d]) v[d] = {};
      if (!v[c]) v[c] = {};
      if (!v[y]) v[y] = {};
      var vl = 'Loader';
      var vli = v[y][vl];
      var vsl = v[c][vl + 'Script'];
      var vlf = v[c][vl + 'Loaded'];
      var ve = 'Embed';
      if (!vsl) {
        vsl = function (u, cb) {
          if (t) {
            cb();
            return;
          }
          s = i.createElement('script');
          s.type = 'text/javascript';
          s.async = true;
          s.src = u;
          s.onload = function () {
            vlf = 1;
            cb();
          };
          s.onerror = function () {
            container.dataset.loaded = 'false';
            container.classList.remove('is-loading');
            container.replaceChildren();
            delete container.dataset.placeholderReady;
            buildVideoPlaceholder(container);
          };
          i.head.appendChild(s);
        };
      }
      vsl(l + 'loader.min.js', function () {
        if (!vli) {
          var Loader = v[c][vl];
          vli = new Loader();
        }
        vli.loadScript(l + 'player.min.js', function () {
          var Embed = v[d][ve];
          t = new Embed();
          t.run(a);
          container.classList.remove('is-loading');
          container.classList.add('is-loaded');
        });
      });
    })(window, document, 'Vidalytics', elementId, base);
  }

  function initVideos() {
    var videos = Array.from(document.querySelectorAll('.fd-deferred-video[data-vidalytics-id]'));
    videos.forEach(buildVideoPlaceholder);

    if (!('IntersectionObserver' in window)) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var container = entry.target;
        observer.unobserve(container);
        loadVidalytics(container);
      });
    }, { rootMargin: '0px', threshold: 0.55 });

    videos.forEach(function (container) {
      if (container.dataset.load === 'viewport') observer.observe(container);
    });
  }

  function getSchedulerUrl() {
    var match = document.cookie.match('(^|;)\\s*fd_ref\\s*=\\s*([^;]+)');
    var url = 'https://app.iclosed.io/e/jakehavron/discovery-call';
    if (match && match[2] === 'patricia_dm') {
      url += '?utm_source=instagram&utm_medium=dm&utm_campaign=patricia_dm&utm_content=discover';
    }
    return url;
  }

  function loadScheduler() {
    var shell = document.getElementById('iclosed-scheduler-shell');
    if (!shell || shell.dataset.loaded === 'true') return;
    shell.dataset.loaded = 'true';

    var widget = document.createElement('div');
    widget.className = 'iclosed-widget';
    widget.setAttribute('data-url', getSchedulerUrl());
    widget.setAttribute('title', 'Discovery Call');
    widget.setAttribute('role', 'region');
    widget.setAttribute('aria-label', 'Schedule a FORDIVINE discovery call');
    widget.style.width = '100%';
    widget.style.height = '620px';
    shell.replaceChildren(widget);

    if (!document.querySelector('script[data-iclosed-widget]')) {
      var script = document.createElement('script');
      script.src = 'https://app.iclosed.io/assets/widget.js';
      script.async = true;
      script.dataset.iclosedWidget = 'true';
      document.head.appendChild(script);
    }
  }

  function initScheduler() {
    var shell = document.getElementById('iclosed-scheduler-shell');
    if (!shell) return;

    window.fdLoadScheduler = loadScheduler;

    document.querySelectorAll('a[href="#book"]').forEach(function (link) {
      ['pointerenter', 'focus', 'touchstart'].forEach(function (eventName) {
        link.addEventListener(eventName, loadScheduler, { once: true, passive: eventName !== 'focus' });
      });
      link.addEventListener('click', function (event) {
        event.preventDefault();
        loadScheduler();

        var bookingSection = document.getElementById('book');
        if (!bookingSection) return;

        if (window.history && window.history.pushState) {
          window.history.pushState(null, '', '#book');
        }

        var root = document.documentElement;
        var previousScrollBehavior = root.style.scrollBehavior;
        root.style.scrollBehavior = 'auto';
        bookingSection.scrollIntoView({ block: 'start' });
        window.requestAnimationFrame(function () {
          root.style.scrollBehavior = previousScrollBehavior;
        });
      });
    });

    if (!('IntersectionObserver' in window)) return;
    var observer = new IntersectionObserver(function (entries) {
      if (entries.some(function (entry) { return entry.isIntersecting; })) {
        observer.disconnect();
        loadScheduler();
      }
    }, { rootMargin: '1200px 0px', threshold: 0.01 });
    observer.observe(shell);
  }

  initVideos();
  initScheduler();
})();
