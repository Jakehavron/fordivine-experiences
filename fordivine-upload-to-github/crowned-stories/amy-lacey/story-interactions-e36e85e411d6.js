// Native video posters download even with preload="none". Request reel thumbnails
// only as the section approaches so they cannot compete with the opening portrait.
(() => {
  const videos = [...document.querySelectorAll('video[data-poster]')];
  const reveal = video => { video.poster = video.dataset.poster; };
  if (!('IntersectionObserver' in window)) { videos.forEach(reveal); return; }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      reveal(entry.target);
      observer.unobserve(entry.target);
    });
  }, {rootMargin:'600px'});
  videos.forEach(video => observer.observe(video));
})();

// Fetch below-the-fold display fonts shortly before their sections are visible.
(() => {
  const definitions = [["#what-changed", "@font-face{font-family:'Bebas Neue';src:url('/crowned-stories/amy-lacey/fonts/bebas-neue-latin.woff2') format('woff2');font-style:normal;font-weight:400;font-display:swap}"], [".discovery-footer", "@font-face{font-family:Discovery Inter;src:url('/crowned-stories/amy-lacey/fonts/inter-latin-optimized.woff2') format('woff2');font-weight:300 800;font-display:swap}"]];
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
    const text = `${first === last ? `Video ${first}` : `Videos ${first}–${last}`} of ${count}`;
    if (status.textContent !== text) status.textContent = text;
  };
  const move = direction => {
    const {step, visible} = measure();
    track.scrollBy({left: direction * step * visible, behavior: reducedMotion.matches ? 'auto' : 'smooth'});
  };
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  track.addEventListener('keydown', event => {
    if (event.target.closest('video')) return;
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

// Keep all on-page videos quiet offscreen and prevent overlapping audio.
(() => {
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)entry.target.pause();}),{threshold:0});
 document.addEventListener('play',event=>{
  const video=event.target;if(video.tagName!=='VIDEO')return;
  document.querySelectorAll('video').forEach(other=>{if(other!==video)other.pause();});
  observer.observe(video);
 },true);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)document.querySelectorAll('video').forEach(video=>video.pause());});
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
  let previousY = 0;
  let inRange = false;
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
  const initialTarget = location.hash && document.getElementById(location.hash.slice(1));
  const targetAfterResults = initialTarget && (accordion.compareDocumentPosition(initialTarget) & Node.DOCUMENT_POSITION_FOLLOWING);
  const initiallyOpen = motion.matches || Boolean(targetAfterResults);
  const initialHeights = initiallyOpen ? rows.map(row => row.querySelector('.layer-expanded-inner').offsetHeight) : [];
  rows.forEach((row, index) => {
    setOpen(row, initiallyOpen, initialHeights[index]);
    row.querySelector('button').addEventListener('click', () => {
      manualY = window.scrollY;
      setOpen(row, !state.get(row));
    });
  });
  accordion.classList.add('layers-ready');
  // Resolve chapter anchors against the final accordion height, not its animated intermediate height.
  const settleAnchor = () => {
    const target = location.hash && document.getElementById(location.hash.slice(1));
    if (!target) return;
    accordion.classList.add('layers-anchor-settle');
    const follows = Boolean(accordion.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING);
    if (follows) {
      const heights = rows.map(row => row.querySelector('.layer-expanded-inner').offsetHeight);
      rows.forEach((row, index) => setOpen(row, true, heights[index]));
    }
    void accordion.offsetHeight;
    target.scrollIntoView({behavior:'instant',block:'start'});
    previousY = window.scrollY;
    manualY = previousY;
    requestAnimationFrame(() => accordion.classList.remove('layers-anchor-settle'));
  };
  window.addEventListener('hashchange', settleAnchor);
  if (location.hash) document.fonts.ready.then(settleAnchor);

  // Honor a direct link or restored scroll position without requiring a first scroll.
  const proximity = new IntersectionObserver(entries => {
    inRange = entries[0].isIntersecting;
    if (inRange) { previousY = window.scrollY; requestAnimationFrame(() => applyScroll(1)); }
  }, {rootMargin:'1000px'});
  proximity.observe(accordion);
  window.addEventListener('scroll', () => {
    if (!inRange || frame) return;
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
    const heights = rows.map(row => row.querySelector('.layer-expanded-inner').offsetHeight);
    rows.forEach((row, index) => setOpen(row, true, heights[index]));
    manualY = null;
    previousY = window.scrollY;
  });
  };
  // Defer results geometry until the section approaches, after the hero paints.
  // Direct chapter links still initialize immediately to preserve their position.
  let initialized = false;
  const activate = () => {
    if (initialized) return;
    initialized = true;
    approach.disconnect();
    initialize();
  };
  const approach = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) activate();
  }, {rootMargin: '1200px'});
  approach.observe(accordion);
  accordion.addEventListener('pointerdown', activate, {once:true, passive:true});
  accordion.addEventListener('focusin', activate, {once:true});
  window.addEventListener('hashchange', activate, {once:true});
  if (location.hash) activate();
})();

// Load the flip library only near the journal, retaining native scrolling as a fallback.
(() => {
 const root=document.querySelector('[data-journal]');if(!root)return;
 const track=root.querySelector('.journal-track'),slides=[...track.querySelectorAll('.journal-page')];
 const prev=root.querySelector('[data-journal-prev]'),next=root.querySelector('[data-journal-next]'),status=root.querySelector('[data-journal-status]');
 let loading=false,initialized=false;
 const initialize=()=>{
  if(initialized||!window.St)return;
  initialized=true;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');let busy=false;
  const book=new St.PageFlip(track,{width:440,height:660,size:'stretch',minWidth:230,maxWidth:440,minHeight:200,maxHeight:660,autoSize:false,usePortrait:true,showCover:false,drawShadow:true,maxShadowOpacity:.3,flippingTime:900,mobileScrollSupport:true,showPageCorners:!reduced.matches,disableFlipByClick:false});
  const render=()=>{const current=book.getCurrentPageIndex();slides.forEach((slide,index)=>{if(Math.abs(index-current)<=1)slide.querySelector('img').loading='eager';});prev.disabled=busy||current===0;next.disabled=busy||current===slides.length-1;status.textContent=`Page ${current+1} of ${slides.length}`;};
  book.on('flip',render);book.on('init',render);book.on('changeState',e=>{busy=e.data==='flipping';render();});
  root.classList.add('journal-ready');book.loadFromHTML(slides);
  const go=direction=>{if(busy)return;if(reduced.matches){direction>0?book.turnToNextPage():book.turnToPrevPage();}else{direction>0?book.flipNext('bottom'):book.flipPrev('bottom');}};
  prev.addEventListener('click',()=>go(-1));next.addEventListener('click',()=>go(1));
  track.addEventListener('keydown',e=>{if(busy)return;if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();if(e.key==='Home')book.turnToPage(0);else if(e.key==='End')book.turnToPage(slides.length-1);else go(e.key==='ArrowRight'?1:-1);}});
  let lastWidth=track.clientWidth;new ResizeObserver(entries=>{const width=entries[0].contentRect.width;if(width!==lastWidth){lastWidth=width;book.update();}}).observe(track);
 };
 const load=()=>{
  if(initialized||loading)return;
  if(window.St){initialize();return;}
  loading=true;
  const script=document.createElement('script');script.src='/crowned-stories/amy-lacey/vendor/page-flip-2.0.7.js';script.async=true;
  script.onload=()=>{initialize();approach.disconnect();};
  script.onerror=()=>{loading=false;script.remove();};
  document.head.appendChild(script);
 };
 const approach=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting))load();},{rootMargin:'1200px'});approach.observe(root);
 track.addEventListener('focusin',load);track.addEventListener('pointerdown',load,{passive:true});
})();

// Same Vidalytics embed loader used on Discover, scoped to this testimonial.
(function () {
'use strict';
var VIDALYTICS_ACCOUNT = 'Sjy1Iha6';
  function buildVideoPlaceholder(container) {
    if (container.dataset.placeholderReady === 'true') return;
    container.dataset.placeholderReady = 'true';

    var poster = document.createElement('img');
    poster.className = 'fd-deferred-video-poster';
    poster.src = container.dataset.poster;
    if (container.dataset.posterSrcset) poster.srcset = container.dataset.posterSrcset;
    if (container.dataset.posterSizes) poster.sizes = container.dataset.posterSizes;
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


initVideos();
})();
