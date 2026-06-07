(() => {
  const doc = document;
  const root = doc.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const storyMap = {
    'ali-marie': 'Ali Marie',
    'beth-clifford': 'Beth Clifford',
    'christa-crawford': 'Christa Crawford',
    'colette-vanpaemel': 'Colette VanPaemel',
    'lauren-fields': 'Lauren Fields',
    'roni-lavenia': 'Roni Lavenia'
  };

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getStoryMeta() {
    const path = window.location.pathname.replace(/\/+$/, '');
    const segments = path.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1] || '';
    const slug = lastSegment === 'index.html' ? (segments[segments.length - 2] || '') : lastSegment;
    const name = storyMap[slug] || '';
    const isCrownedStory = path.includes('/crowned-stories/') && Boolean(name);
    return { slug, name, isCrownedStory };
  }

  function markVisible(el) {
    el.classList.add('cs-is-visible');
  }

  function enhanceReveals() {
    const revealEls = Array.from(doc.querySelectorAll('[data-cs-reveal], [data-cs-proof-panel], [data-cs-media-shell]'));
    if (!revealEls.length) return;
    root.classList.add('cs-enhancements-ready');

    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach(markVisible);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          markVisible(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });

    revealEls.forEach((el, index) => {
      if (!el.style.getPropertyValue('--cs-delay')) {
        el.style.setProperty('--cs-delay', `${Math.min(index % 4, 3) * 70}ms`);
      }
      observer.observe(el);
    });
  }

  function enhanceTickers() {
    const tickers = Array.from(doc.querySelectorAll('[data-cs-ticker]'));
    tickers.forEach((ticker) => {
      const list = ticker.querySelector('ul');
      if (!list || list.dataset.csTickerReady === 'true') return;
      list.dataset.csTickerReady = 'true';
      const items = Array.from(list.children);
      if (items.length && items.length < 12) {
        items.forEach((item) => list.appendChild(item.cloneNode(true)));
      }
      ticker.style.setProperty('--cs-marquee-duration', ticker.dataset.csTickerSpeed || '38s');
    });
  }

  function enhanceLinks() {
    doc.querySelectorAll('a[href]').forEach((link) => {
      link.dataset.csEnhancedLink = 'true';
      if (!link.getAttribute('aria-label')) {
        const text = link.textContent.replace(/\s+/g, ' ').trim();
        if (text && text.length <= 80) link.setAttribute('aria-label', text);
      }
    });
    doc.querySelectorAll('button').forEach((button) => {
      button.dataset.csEnhancedButton = 'true';
      if (!button.getAttribute('type')) button.setAttribute('type', 'button');
    });
  }

  function enhanceImageAltText(meta) {
    if (!meta.isCrownedStory) return;
    const safeName = meta.name || 'FORDIVINE client';
    doc.querySelectorAll('img').forEach((img, index) => {
      const existingAlt = img.getAttribute('alt');
      if (existingAlt && existingAlt.trim()) return;
      img.setAttribute('alt', `${safeName} Crowned Story visual ${index + 1}`);
      img.dataset.csAltEnhanced = 'true';
    });
  }

  function enhanceMediaShells() {
    doc.querySelectorAll('video').forEach((video, index) => {
      const shell = video.closest('[data-cs-media-shell]') || video.parentElement;
      if (shell && shell !== doc.body) {
        shell.dataset.csMediaShell = 'true';
        shell.dataset.csMediaState = video.readyState >= 2 ? 'ready' : 'loading';
        shell.dataset.csMediaLabel = shell.dataset.csMediaLabel || 'Loading story film';
        if (!shell.dataset.csReveal) shell.dataset.csReveal = 'media';
      }
      video.dataset.csVideoEnhanced = 'true';
      video.dataset.csVideoIndex = String(index + 1);
      video.muted = true;
      video.loop = true;
      video.autoplay = true;
      video.playsInline = true;
      video.setAttribute('muted', '');
      video.setAttribute('loop', '');
      video.setAttribute('autoplay', '');
      video.setAttribute('playsinline', '');
      video.setAttribute('preload', video.getAttribute('preload') || 'metadata');

      const markReady = () => {
        const currentShell = video.closest('[data-cs-media-shell]');
        if (currentShell) {
          currentShell.classList.add('cs-media-loaded');
          currentShell.dataset.csMediaState = 'ready';
        }
      };
      const markError = () => {
        const currentShell = video.closest('[data-cs-media-shell]');
        if (currentShell) {
          currentShell.classList.add('cs-media-error');
          currentShell.dataset.csMediaState = 'error';
        }
      };

      if (video.readyState >= 2) markReady();
      video.addEventListener('loadeddata', markReady, { once: true });
      video.addEventListener('canplay', () => {
        markReady();
        video.play?.().catch(() => {});
      }, { once: true });
      video.addEventListener('error', markError, { once: true });
    });
  }

  function enhanceLongHeroTitles(meta) {
    if (meta.slug !== 'colette-vanpaemel') return;
    const candidates = Array.from(doc.querySelectorAll('h1, [data-framer-component-type="RichTextContainer"], p, span'));
    const titleText = 'colette vanpaemel';
    candidates.forEach((el) => {
      const normalized = el.textContent.replace(/\s+/g, ' ').trim().toLowerCase();
      if (normalized !== titleText) return;
      const target = el.closest('[data-framer-component-type="RichTextContainer"]') || el;
      target.dataset.csLongHeroTitle = 'true';
      target.dataset.csReveal = target.dataset.csReveal || 'hero';
    });
  }

  function enhanceStoryProgress(meta) {
    if (!meta.isCrownedStory || doc.querySelector('[data-cs-story-progress]')) return;

    const phases = [
      { short: 'Meet', label: 'The Introduction', caption: 'Entering her Crowned Story.' },
      { short: 'Unveil', label: 'The Unveiling', caption: 'Where the deeper identity begins to surface.' },
      { short: 'Refine', label: 'The Refinement', caption: 'Brand details, visuals, message, and authority polish.' },
      { short: 'Prepare', label: 'The Preparation', caption: 'The final work before her crowned reveal.' },
      { short: 'Reign', label: 'Now Reigning', caption: 'The finished presence taking its rightful place.' }
    ];

    const frame = doc.createElement('iframe');
    frame.className = 'cs-story-progress-frame';
    frame.dataset.csStoryProgress = 'true';
    frame.dataset.csProgressActive = 'false';
    frame.dataset.csProgressPhase = '0';
    frame.title = `${meta.name} story reading progress`;
    frame.setAttribute('aria-label', `${meta.name} story reading progress`);
    frame.setAttribute('aria-valuemin', '0');
    frame.setAttribute('aria-valuemax', '100');
    frame.setAttribute('aria-valuenow', '0');
    frame.setAttribute('scrolling', 'no');
    frame.setAttribute('tabindex', '-1');
    frame.setAttribute('frameborder', '0');
    frame.setAttribute('allowtransparency', 'true');
    doc.body.appendChild(frame);

    const frameDoc = frame.contentDocument || (frame.contentWindow && frame.contentWindow.document);
    if (!frameDoc) return;

    frameDoc.open();
    frameDoc.write(`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  @font-face { font-family: "Helvetica Bold"; src: url("https://framerusercontent.com/assets/ApKD8HJjYHTqN2owNt8rsd2v0c.woff2"); font-display: swap; font-style: normal; font-weight: 400; }
  @font-face { font-family: "Proxima Nova Regular"; src: url("https://framerusercontent.com/assets/lk0lI1lYugJk737ZJsSf2yWwcs.woff2"); font-display: swap; font-style: normal; font-weight: 400; }
  @font-face { font-family: "Proxima Nova Bold"; src: url("https://framerusercontent.com/assets/Ks1NqktMLpAgtXYP9S1oLkSCJQ.woff2"); font-display: swap; font-style: normal; font-weight: 700; }
  :root {
    --cs-ink: #241f1a;
    --cs-muted: #7b6c58;
    --cs-gold: #9b7a47;
    --cs-gold-soft: rgba(151, 121, 76, 0.28);
    --cs-cream: rgba(255, 252, 245, 0.98);
    --cs-cream-warm: rgba(248, 245, 239, 0.96);
    --cs-border: rgba(151, 121, 76, 0.32);
    --cs-progress: 0%;
  }
  * { box-sizing: border-box; }
  html, body { margin: 0; width: 100%; height: 100%; overflow: hidden; background: transparent; }
  body { font-family: "Proxima Nova Regular", "Proxima Nova Regular Placeholder", Arial, sans-serif; color: var(--cs-ink); }
  .cs-story-progress {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 104px;
    height: 244px;
    padding: 12px 10px 11px;
    border: 0;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
    overflow: visible;
  }
  .cs-story-progress::before {
    content: none;
    display: none;
  }
  .cs-story-progress__eyebrow {
    display: block;
    position: relative;
    z-index: 2;
    margin: 0 auto 8px;
    font-family: "Helvetica Bold", "Helvetica Bold Placeholder", "Proxima Nova Bold", Arial, sans-serif;
    font-size: 7px;
    letter-spacing: 0.14em;
    line-height: 1.15;
    text-align: center;
    text-transform: uppercase;
    color: var(--cs-gold);
    font-weight: 800;
  }
  .cs-story-progress__rail {
    position: relative;
    z-index: 2;
    width: 34px;
    height: 132px;
    margin: 0 auto 9px;
  }
  .cs-story-progress__line,
  .cs-story-progress__fill {
    position: absolute;
    left: 50%;
    top: 10px;
    bottom: 10px;
    width: 2px;
    transform: translateX(-50%);
    border-radius: 999px;
  }
  .cs-story-progress__line { background: rgba(151, 121, 76, 0.18); }
  .cs-story-progress__fill {
    bottom: auto;
    height: var(--cs-progress);
    max-height: calc(100% - 20px);
    background: linear-gradient(180deg, rgba(151,121,76,0.34), rgba(151,121,76,0.78));
    box-shadow: 0 0 14px rgba(151, 121, 76, 0.14);
    transition: height 220ms ease;
  }
  .cs-story-progress__pearls {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    height: 100%;
  }
  .cs-story-progress__pearl {
    width: 19px;
    height: 19px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    border: 1px solid rgba(151, 121, 76, 0.30);
    background: radial-gradient(circle at 35% 28%, #fffdf8 0 28%, #ece8df 72%, #c2b8a3 100%);
    color: rgba(62, 57, 45, 0.76);
    font-family: "Helvetica Bold", "Helvetica Bold Placeholder", "Proxima Nova Bold", Arial, sans-serif;
    font-size: 8px;
    font-weight: 700;
    line-height: 1;
    box-shadow: 0 4px 10px rgba(61, 45, 28, 0.09);
    transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease, color 220ms ease;
  }
  .cs-story-progress__pearl[data-active="true"] {
    width: 23px;
    height: 23px;
    color: #3e392d;
    border-color: rgba(151, 121, 76, 0.68);
    box-shadow: 0 0 0 5px rgba(151, 121, 76, 0.10), 0 8px 16px rgba(61, 45, 28, 0.16);
    transform: scale(1.04);
  }
  .cs-story-progress__title {
    display: block;
    position: relative;
    z-index: 2;
    width: fit-content;
    max-width: 74px;
    margin: 0 auto 7px;
    padding: 5px 8px 4px;
    border: 1px solid rgba(151, 121, 76, 0.22);
    border-radius: 999px;
    background: transparent;
    font-family: "Helvetica Bold", "Helvetica Bold Placeholder", "Proxima Nova Bold", Arial, sans-serif;
    font-size: 8px;
    font-weight: 800;
    line-height: 1;
    letter-spacing: 0.08em;
    text-align: center;
    text-transform: uppercase;
    color: var(--cs-ink);
    white-space: nowrap;
  }
  .cs-story-progress__caption {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  .cs-story-progress__percent {
    display: block;
    position: relative;
    z-index: 2;
    font-family: "Helvetica Bold", "Helvetica Bold Placeholder", "Proxima Nova Bold", Arial, sans-serif;
    font-size: 10px;
    font-weight: 800;
    line-height: 1;
    letter-spacing: 0.08em;
    text-align: center;
    color: rgba(36, 31, 26, 0.68);
  }
  @media (max-width: 700px) {
    .cs-story-progress {
      top: 8px;
      right: 8px;
      width: 96px;
      height: 226px;
      padding: 11px 9px 10px;
      border-radius: 25px;
      box-shadow: none;
    }
    .cs-story-progress::before { content: none; display: none; }
    .cs-story-progress__eyebrow { margin-bottom: 7px; font-size: 6.5px; letter-spacing: 0.13em; }
    .cs-story-progress__rail { height: 122px; margin-bottom: 8px; }
    .cs-story-progress__pearl { width: 18px; height: 18px; font-size: 7.5px; }
    .cs-story-progress__pearl[data-active="true"] { width: 22px; height: 22px; box-shadow: 0 0 0 4px rgba(151, 121, 76, 0.10), 0 6px 14px rgba(61, 45, 28, 0.15); }
    .cs-story-progress__title { max-width: 68px; padding: 5px 7px 4px; font-size: 7.5px; }
    .cs-story-progress__percent { font-size: 9px; }
  }
</style>
</head>
<body>
  <div class="cs-story-progress" role="progressbar" aria-label="${escapeHtml(meta.name)} story reading progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
    <span class="cs-story-progress__eyebrow">Pearl Timeline</span>
    <div class="cs-story-progress__rail" aria-hidden="true">
      <span class="cs-story-progress__line"></span>
      <span class="cs-story-progress__fill"></span>
      <div class="cs-story-progress__pearls">
        ${phases.map((phase, index) => `<span class="cs-story-progress__pearl" data-cs-progress-pearl="${index}" data-active="${index === 0 ? 'true' : 'false'}">${index + 1}</span>`).join('')}
      </div>
    </div>
    <span class="cs-story-progress__title" data-cs-progress-title>${escapeHtml(phases[0].short)}</span>
    <span class="cs-story-progress__caption" data-cs-progress-caption>${escapeHtml(phases[0].label)} · ${escapeHtml(phases[0].caption)}</span>
    <span class="cs-story-progress__percent" data-cs-progress-percent>0%</span>
  </div>
</body>
</html>`);
    frameDoc.close();

    const progress = frameDoc.querySelector('.cs-story-progress');
    const pearls = Array.from(frameDoc.querySelectorAll('[data-cs-progress-pearl]'));
    const title = frameDoc.querySelector('[data-cs-progress-title]');
    const caption = frameDoc.querySelector('[data-cs-progress-caption]');
    const percentText = frameDoc.querySelector('[data-cs-progress-percent]');
    let ticking = false;
    let currentPhase = -1;

    const update = () => {
      const scrollTop = window.scrollY || doc.documentElement.scrollTop || 0;
      const scrollHeight = Math.max(doc.documentElement.scrollHeight - window.innerHeight, 1);
      const percent = Math.max(0, Math.min(100, Math.round((scrollTop / scrollHeight) * 100)));
      const phaseIndex = Math.max(0, Math.min(phases.length - 1, Math.floor((percent / 100) * phases.length)));
      const phase = phases[phaseIndex];
      frame.style.setProperty('--cs-progress', `${percent}%`);
      frame.dataset.csProgressActive = percent > 3 ? 'true' : 'false';
      frame.dataset.csProgressPhase = String(phaseIndex);
      frame.setAttribute('aria-valuenow', String(percent));
      frame.setAttribute('aria-valuetext', `${phase.label}, ${percent}% complete`);
      if (progress) {
        progress.style.setProperty('--cs-progress', `${percent}%`);
        progress.setAttribute('aria-valuenow', String(percent));
        progress.setAttribute('aria-valuetext', `${phase.label}, ${percent}% complete`);
      }
      if (percentText) percentText.textContent = `${percent}%`;
      if (phaseIndex !== currentPhase) {
        currentPhase = phaseIndex;
        pearls.forEach((pearl, index) => {
          pearl.dataset.active = index === phaseIndex ? 'true' : 'false';
        });
        if (title) title.textContent = phase.short;
        if (caption) caption.textContent = `${phase.label} · ${phase.caption}`;
      }
      ticking = false;
    };

    const requestUpdate = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
  }

  function enhanceMobileNav(meta) {
    if (doc.querySelector('[data-cs-mobile-nav]')) return;

    const navLinks = [
      { label: 'Home', href: 'https://www.fordivine.com/', match: '/' },
      { label: 'About Us', href: 'https://www.fordivine.com/about-us', match: '/about-us' },
      { label: 'Crowned Stories', href: 'https://www.fordivine.com/crowned-stories/', match: '/crowned-stories' },
      { label: 'Services', href: 'https://www.fordivine.com/discover', match: '/discover' },
      { label: 'Contact', href: 'https://www.fordivine.com/discover', match: '/discover' },
      { label: 'Email', href: 'mailto:hello@fordivine.com', match: 'mailto:' }
    ];

    const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
    const isActiveLink = (link) => {
      if (link.match === '/') return currentPath === '/';
      if (link.match === '/crowned-stories') return currentPath.includes('/crowned-stories');
      return currentPath === link.match || currentPath.startsWith(`${link.match}/`);
    };

    const button = doc.createElement('button');
    button.type = 'button';
    button.className = 'cs-mobile-nav-button';
    button.dataset.csMobileNavButton = 'true';
    button.setAttribute('aria-label', 'Open FORDIVINE navigation menu');
    button.setAttribute('aria-controls', 'cs-mobile-nav-drawer');
    button.setAttribute('aria-expanded', 'false');
    button.innerHTML = '<span aria-hidden="true"></span><span aria-hidden="true"></span>';

    const drawer = doc.createElement('div');
    drawer.className = 'cs-mobile-nav';
    drawer.dataset.csMobileNav = 'true';
    drawer.id = 'cs-mobile-nav-drawer';
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'true');
    drawer.setAttribute('aria-label', 'FORDIVINE mobile navigation');
    drawer.setAttribute('aria-hidden', 'true');
    drawer.innerHTML = `
      <div class="cs-mobile-nav__backdrop" data-cs-mobile-nav-close="true"></div>
      <nav class="cs-mobile-nav__panel" aria-label="FORDIVINE mobile navigation links">
        <div class="cs-mobile-nav__topline">
          <a class="cs-mobile-nav__brand" href="https://www.fordivine.com/" aria-label="FORDIVINE home">FORDIVINE<span>™</span></a>
          <button type="button" class="cs-mobile-nav__close" data-cs-mobile-nav-close="true" aria-label="Close FORDIVINE navigation menu">Close</button>
        </div>
        ${meta.isCrownedStory ? `<p class="cs-mobile-nav__context">Viewing <strong>${escapeHtml(meta.name)}</strong></p>` : ''}
        <div class="cs-mobile-nav__links">
          ${navLinks.map((link) => {
            const active = isActiveLink(link);
            return `<a href="${link.href}"${active ? ' class="cs-mobile-nav__link--active" aria-current="page"' : ''}>${link.label}${active ? '<span>Current</span>' : ''}</a>`;
          }).join('')}
        </div>
      </nav>`;

    doc.body.appendChild(button);
    doc.body.appendChild(drawer);

    const panel = drawer.querySelector('.cs-mobile-nav__panel');
    const closeEls = Array.from(drawer.querySelectorAll('[data-cs-mobile-nav-close]'));
    const links = Array.from(drawer.querySelectorAll('a[href]'));
    const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    let lastActiveEl = null;

    function getFocusable() {
      return Array.from(drawer.querySelectorAll(focusableSelector)).filter((el) => el.offsetParent !== null);
    }

    function openNav() {
      lastActiveEl = doc.activeElement;
      button.setAttribute('aria-expanded', 'true');
      button.setAttribute('aria-label', 'Close FORDIVINE navigation menu');
      drawer.setAttribute('aria-hidden', 'false');
      doc.body.classList.add('cs-mobile-nav-open');
      window.requestAnimationFrame(() => {
        drawer.dataset.state = 'open';
        const firstLink = drawer.querySelector('.cs-mobile-nav__links a');
        firstLink?.focus({ preventScroll: true });
      });
    }

    function closeNav({ restoreFocus = true } = {}) {
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-label', 'Open FORDIVINE navigation menu');
      drawer.dataset.state = 'closed';
      drawer.setAttribute('aria-hidden', 'true');
      doc.body.classList.remove('cs-mobile-nav-open');
      if (restoreFocus && lastActiveEl && typeof lastActiveEl.focus === 'function') {
        lastActiveEl.focus({ preventScroll: true });
      }
    }

    function isOpen() {
      return drawer.dataset.state === 'open';
    }

    button.addEventListener('click', () => {
      if (isOpen()) closeNav({ restoreFocus: false });
      else openNav();
    });

    closeEls.forEach((el) => el.addEventListener('click', () => closeNav()));
    links.forEach((link) => link.addEventListener('click', () => closeNav({ restoreFocus: false })));

    doc.addEventListener('keydown', (event) => {
      if (!isOpen()) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        closeNav();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = getFocusable();
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && doc.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && doc.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    panel?.addEventListener('click', (event) => event.stopPropagation());
    window.addEventListener('resize', () => {
      if (window.innerWidth > 809 && isOpen()) closeNav({ restoreFocus: false });
    });
  }

  function init() {
    const meta = getStoryMeta();
    if (meta.slug) doc.body?.setAttribute('data-cs-story-slug', meta.slug);
    if (meta.name) doc.body?.setAttribute('data-cs-story-name', meta.name);
    enhanceMobileNav(meta);
    enhanceLinks();
    enhanceImageAltText(meta);
    enhanceTickers();
    enhanceMediaShells();
    enhanceLongHeroTitles(meta);
    enhanceStoryProgress(meta);
    enhanceReveals();
    doc.body?.setAttribute('data-cs-enhancements', 'active');
  }

  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
