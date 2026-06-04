(() => {
  const doc = document;
  const root = doc.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  function enhanceMediaShells() {
    doc.querySelectorAll('video').forEach((video) => {
      const shell = video.closest('[data-cs-media-shell]') || video.parentElement;
      if (shell && shell !== doc.body) {
        shell.dataset.csMediaShell = 'true';
        if (!shell.dataset.csReveal) shell.dataset.csReveal = 'media';
      }
      video.muted = true;
      video.loop = true;
      video.autoplay = true;
      video.playsInline = true;
      video.setAttribute('muted', '');
      video.setAttribute('loop', '');
      video.setAttribute('autoplay', '');
      video.setAttribute('playsinline', '');
      video.setAttribute('preload', video.getAttribute('preload') || 'metadata');
      video.addEventListener('loadeddata', () => video.closest('[data-cs-media-shell]')?.classList.add('cs-media-loaded'), { once: true });
      video.addEventListener('canplay', () => video.play?.().catch(() => {}), { once: true });
      video.addEventListener('error', () => video.closest('[data-cs-media-shell]')?.classList.add('cs-media-error'), { once: true });
    });
  }

  function enhanceMobileNav() {
    if (doc.querySelector('[data-cs-mobile-nav]')) return;

    const navLinks = [
      ['Home', 'https://www.fordivine.com/'],
      ['FD House', 'https://www.fordivine.com/fd-house'],
      ['Crowned Stories', 'https://www.fordivine.com/crowned-stories/'],
      ['Services', 'https://www.fordivine.com/discover'],
      ['Inquire', 'https://www.fordivine.com/inquire'],
      ['Retreat', 'https://home.fordivine.com/retreat'],
      ['Email', 'mailto:hello@fordivine.com']
    ];

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
        <div class="cs-mobile-nav__links">
          ${navLinks.map(([label, href]) => `<a href="${href}">${label}</a>`).join('')}
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
    enhanceMobileNav();
    enhanceLinks();
    enhanceTickers();
    enhanceMediaShells();
    enhanceReveals();
    doc.body?.setAttribute('data-cs-enhancements', 'active');
  }

  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
