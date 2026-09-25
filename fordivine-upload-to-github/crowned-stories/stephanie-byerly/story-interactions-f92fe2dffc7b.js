// Fetch below-the-fold display fonts shortly before their sections are visible.
(() => {
  const definitions = [["#what-changed", "@font-face{font-family:'Bebas Neue';src:url('/crowned-stories/stephanie-byerly/fonts/bebas-neue-latin.woff2') format('woff2');font-style:normal;font-weight:400;font-display:swap}"], [".discovery-footer", "@font-face{font-family:Discovery Inter;src:url('/crowned-stories/stephanie-byerly/fonts/inter-latin-optimized.woff2') format('woff2');font-weight:300 800;font-display:swap}"]];
  for (const [selector, css] of definitions) {
    const section = document.querySelector(selector);
    if (!section) continue;
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      const style = document.createElement('style');
      style.textContent = css;
      document.head.appendChild(style);
      observer.disconnect();
    }, {rootMargin: '1600px'});
    observer.observe(section);
  }
})();

(() => {
  const menu = document.querySelector('.mobile-menu');
  if (menu) {
    document.addEventListener('pointerdown', event => {
      if (menu.open && !menu.contains(event.target)) menu.open = false;
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu.open) {
        menu.open = false;
        menu.querySelector('summary').focus();
      }
    });
    menu.addEventListener('click', event => {
      if (event.target.closest('a')) menu.open = false;
    });
    matchMedia('(min-width: 701px)').addEventListener('change', event => {
      if (event.matches) menu.open = false;
    });
  }
  const track = document.getElementById('social-posts');
  if (!track) return;
  const section = track.closest('.social-carousel');
  const previous = section.querySelector('[data-carousel-direction="-1"]');
  const next = section.querySelector('[data-carousel-direction="1"]');
  const status = section.querySelector('.social-position');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const count = track.children.length;
  const measure = () => {
    const step = track.children[1].offsetLeft - track.children[0].offsetLeft;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return {step, visible: Math.max(1, Math.round((track.clientWidth + gap) / step))};
  };
  const update = () => {
    const {step, visible} = measure();
    if (!step) return;
    const end = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
    const first = Math.max(1, Math.min(count, Math.round(track.scrollLeft / step) + 1));
    const last = end ? count : Math.min(count, first + visible - 1);
    previous.disabled = track.scrollLeft < 2;
    next.disabled = end;
    const text = `${first === last ? `Post ${first}` : `Posts ${first}–${last}`} of ${count}`;
    if (status.textContent !== text) status.textContent = text;
  };
  const move = direction => {
    const {step, visible} = measure();
    track.scrollBy({left: direction * step * visible, behavior: reducedMotion.matches ? 'auto' : 'smooth'});
  };
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  track.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      move(event.key === 'ArrowRight' ? 1 : -1);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      track.scrollTo({left: event.key === 'Home' ? 0 : track.scrollWidth, behavior: 'auto'});
    }
  });
  // Coalesce scroll updates; only observe carousel geometry when it is near the viewport.
  let frame = 0;
  const schedule = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => { frame = 0; update(); });
  };
  track.addEventListener('scroll', schedule, {passive:true});
  const resize = new ResizeObserver(schedule);
  const visible = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    resize.observe(track);
    schedule();
    visible.disconnect();
  }, {rootMargin:'300px'});
  visible.observe(track);
})();

// Load Instagram’s official embed script once, only near the social showcase.
(() => {
  const section = document.getElementById('social-content');
  if (!section || !section.querySelector('.instagram-media')) return;
  const loadEmbeds = () => {
    if (document.getElementById('instagram-embed-script')) return;
    const script = document.createElement('script');
    script.id = 'instagram-embed-script';
    script.src = 'https://www.instagram.com/embed.js';
    script.async = true;
    script.onload = () => window.instgrm?.Embeds?.process();
    document.body.appendChild(script);
  };
  const observer = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    loadEmbeds();
    observer.disconnect();
  }, {rootMargin: '600px'});
  observer.observe(section);
})();

// Keep Instagram’s internal layout at a usable width, scaled to each narrow card.
(() => {
  const cards = document.querySelectorAll('.instagram-card');
  const resize = new ResizeObserver(entries => {
    for (const {target, contentRect} of entries) {
      const width = contentRect.width;
      if (!width) continue;
      const embedWidth = Math.max(326, width);
      target.style.setProperty('--embed-width', `${embedWidth}px`);
      target.style.setProperty('--embed-media-height', `${width * 1.25}px`);
      target.style.setProperty('--embed-scale', `${width / embedWidth}`);
    }
  });
  cards.forEach(card => resize.observe(card));
})();

// Chapter 05: viewport-height scroll thresholds, independent of screen aspect ratio.
(() => {
  const accordion = document.querySelector('#what-changed .layers-accordion');
  if (!accordion) return;
  const initialize = () => {
  const rows = [...accordion.querySelectorAll('.layer-row')];
  const slider = accordion.querySelector('.layer-slider');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const state = new Map();
  let active = null;
  let previousY = window.scrollY;
  let frame = 0;
  let manualY = null;

  let highlightFrame = 0;
  const paintHighlight = () => {
    if (!slider) return;
    if (!active || !state.get(active)) {
      slider.style.opacity = '0';
      return;
    }
    const header = active.querySelector('.layer-collapsed');
    const height = header.offsetHeight;
    const top = header.getBoundingClientRect().top - accordion.getBoundingClientRect().top;
    slider.style.height = `${height}px`;
    slider.style.transform = `translateY(${top}px)`;
    slider.style.opacity = '1';
  };
  const highlight = () => {
    if (highlightFrame) return;
    highlightFrame = requestAnimationFrame(() => { highlightFrame = 0; paintHighlight(); });
  };
  const setOpen = (row, open, measuredHeight) => {
    const height = open ? (measuredHeight ?? row.querySelector('.layer-expanded-inner').offsetHeight) : 0;
    const panel = row.querySelector('.layer-expanded');
    const header = row.querySelector('button');
    state.set(row, open);
    row.classList.toggle('is-open', open);
    header.setAttribute('aria-expanded', String(open));
    panel.inert = !open;
    panel.style.height = `${height}px`;
    if (open) active = row;
    else if (active === row) active = rows.filter(item => state.get(item)).at(-1) || null;
    highlight();
  };
  const syncSizes = () => {
    const measurements = rows.filter(row => state.get(row)).map(row => [row, row.querySelector('.layer-expanded-inner').offsetHeight]);
    measurements.forEach(([row, height]) => { row.querySelector('.layer-expanded').style.height = `${height}px`; });
    highlight();
  };
  const applyScroll = (direction) => {
    if (motion.matches) return;
    const threshold = window.innerHeight * 0.4;
    // Capture geometry before mutations so one expansion cannot cascade into another.
    const positions = rows.map(row => ({row, top: row.querySelector('.layer-collapsed').getBoundingClientRect().top, height: row.querySelector('.layer-expanded-inner').offsetHeight}));
    positions.forEach(({row, top, height}) => {
      if (direction > 0 && top <= threshold && !state.get(row)) setOpen(row, true, height);
      if (direction < 0 && top > threshold + 48 && state.get(row) && !row.querySelector('.layer-expanded').contains(document.activeElement)) setOpen(row, false);
    });
  };
  rows.forEach(row => {
    setOpen(row, motion.matches);
    row.querySelector('button').addEventListener('click', () => {
      manualY = window.scrollY;
      setOpen(row, !state.get(row));
    });
  });
  accordion.classList.add('layers-ready');
  // Honor a direct link or restored scroll position without requiring a first scroll.
  requestAnimationFrame(() => applyScroll(1));
  window.addEventListener('scroll', () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - previousY;
      previousY = y;
      if (Math.abs(delta) < 2) return;
      // Manual choices persist until the visitor deliberately moves away.
      if (manualY !== null && Math.abs(y - manualY) < 80) return;
      manualY = null;
      applyScroll(Math.sign(delta));
    });
  }, {passive:true});
  const sizes = new ResizeObserver(syncSizes);
  rows.forEach(row => {
    sizes.observe(row.querySelector('.layer-expanded-inner'));
    sizes.observe(row.querySelector('.layer-collapsed'));
  });
  const animationSizes = new ResizeObserver(highlight);
  rows.forEach(row => animationSizes.observe(row));
  window.addEventListener('resize', syncSizes, {passive:true});
  document.fonts?.ready.then(syncSizes);
  motion.addEventListener('change', () => {
    rows.forEach(row => setOpen(row, true));
    manualY = null;
    previousY = window.scrollY;
  });
  };
  const observer = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    initialize();
    observer.disconnect();
  }, {rootMargin: '1000px'});
  observer.observe(accordion);
})();

// Original-image comparison: one pointer controller, with no native range competing for touch.
(() => {
  document.querySelectorAll('.profile-comparison').forEach(figure => {
    const stage = figure.querySelector('.profile-compare-stage');
    const control = figure.querySelector('.profile-compare-range');
    if (!stage || !control) return;
    let position = 50;
    let drag = null;
    const update = value => {
      position = Math.max(0, Math.min(100, value));
      const rounded = Math.round(position);
      control.setAttribute('aria-valuenow', String(rounded));
      control.setAttribute('aria-valuetext', `${rounded}% before, ${100 - rounded}% after`);
      figure.style.setProperty('--reveal', `${100 - position}%`);
    };
    const point = event => {
      if (!drag || !drag.rect.width) return;
      update((event.clientX - drag.rect.left - drag.offset) / drag.rect.width * 100);
    };
    control.addEventListener('pointerdown', event => {
      if (!event.isPrimary || event.button !== 0 || drag) return;
      const rect = stage.getBoundingClientRect();
      const handleX = rect.left + rect.width * position / 100;
      const touch = event.pointerType === 'touch';
      drag = {id:event.pointerId, x:event.clientX, y:event.clientY, rect,
        offset:Math.abs(event.clientX - handleX) <= 32 ? event.clientX - handleX : 0,
        horizontal:!touch};
      control.setPointerCapture(event.pointerId);
      if (!touch) {
        event.preventDefault();
        control.focus({preventScroll:true});
        point(event);
      }
    });
    control.addEventListener('pointermove', event => {
      if (!drag || event.pointerId !== drag.id) return;
      if (!drag.horizontal) {
        const dx = Math.abs(event.clientX - drag.x);
        const dy = Math.abs(event.clientY - drag.y);
        if (Math.max(dx, dy) < 5) return;
        if (dy > dx) { finish(event); return; }
        drag.horizontal = true;
        control.focus({preventScroll:true});
      }
      point(event);
    });
    const finish = event => {
      if (!drag || event.pointerId !== drag.id) return;
      const id = drag.id;
      drag = null;
      if (control.hasPointerCapture(id)) control.releasePointerCapture(id);
    };
    control.addEventListener('pointerup', event => {
      if (!drag || event.pointerId !== drag.id) return;
      // A tap selects a position; vertical gestures remain page scrolling.
      if (drag.horizontal || Math.hypot(event.clientX-drag.x,event.clientY-drag.y)<5) point(event);
      finish(event);
    });
    control.addEventListener('pointercancel', finish);
    control.addEventListener('lostpointercapture', () => { drag = null; });
    control.addEventListener('keydown', event => {
      const step = event.shiftKey ? 10 : 2;
      const values = {ArrowLeft:position-step,ArrowRight:position+step,
        ArrowDown:position-step,ArrowUp:position+step,Home:0,End:100,
        PageDown:position-10,PageUp:position+10};
      if (!(event.key in values)) return;
      event.preventDefault();
      update(values[event.key]);
    });
    update(position);
  });
})();

(function(){'use strict';var VIDALYTICS_ACCOUNT='Sjy1Iha6';
  function buildVideoPlaceholder(container) {
    if (container.dataset.placeholderReady === 'true') return;
    container.dataset.placeholderReady = 'true';

    var poster = document.createElement('img');
    poster.className = 'fd-deferred-video-poster';
    if (container.dataset.posterSizes) poster.sizes = container.dataset.posterSizes;
    if (container.dataset.posterSrcset) poster.srcset = container.dataset.posterSrcset;
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


initVideos();})();
