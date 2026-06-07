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
    const slug = path.split('/').filter(Boolean).pop() || '';
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

    const progress = doc.createElement('div');
    progress.className = 'cs-story-progress';
    progress.dataset.csStoryProgress = 'true';
    progress.setAttribute('role', 'progressbar');
    progress.setAttribute('aria-label', `${meta.name} story reading progress`);
    progress.setAttribute('aria-valuemin', '0');
    progress.setAttribute('aria-valuemax', '100');
    progress.setAttribute('aria-valuenow', '0');
    progress.innerHTML = `
      <span class="cs-story-progress__bar" aria-hidden="true"></span>
      <span class="cs-story-progress__pill" aria-hidden="true">${escapeHtml(meta.name)} · 0%</span>`;
    doc.body.appendChild(progress);

    const pill = progress.querySelector('.cs-story-progress__pill');
    let ticking = false;

    const update = () => {
      const scrollTop = window.scrollY || doc.documentElement.scrollTop || 0;
      const scrollHeight = Math.max(doc.documentElement.scrollHeight - window.innerHeight, 1);
      const percent = Math.max(0, Math.min(100, Math.round((scrollTop / scrollHeight) * 100)));
      progress.style.setProperty('--cs-progress', `${percent}%`);
      progress.dataset.csProgressActive = percent > 3 ? 'true' : 'false';
      progress.setAttribute('aria-valuenow', String(percent));
      if (pill) pill.textContent = `${meta.name} · ${percent}%`;
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
