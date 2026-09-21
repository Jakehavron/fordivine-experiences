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
