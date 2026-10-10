(() => {
  const hero = document.querySelector('#fd-video-hero');
  const videos = [...hero.querySelectorAll('video')];
  const button = hero.querySelector('.fd-about-motion');
  const compact = matchMedia('(max-width:809.98px)');
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  let paused = reduced.matches;
  let heroInView = true;
  const films = [...document.querySelectorAll('.fd-about-film')];
  function send(frame, method, value) {
    frame.contentWindow?.postMessage(JSON.stringify({method, value}), 'https://player.vimeo.com');
  }
  function sync() {
    document.body.dataset.aboutMotionPaused = String(paused);
    button.textContent = paused ? 'Play motion' : 'Pause motion';
    button.setAttribute('aria-pressed', String(paused));
    videos.forEach(video => {
      const active = video.classList.contains(compact.matches ? 'hero-video-mobile' : 'hero-video-desktop');
      if (!active || paused || !heroInView || document.hidden) { video.pause(); return; }
      const source = video.querySelector('source');
      if (!source.hasAttribute('src')) { source.src = source.dataset.src; video.load(); }
      video.play().catch(() => { /* The poster remains visible if autoplay is unavailable. */ });
    });
    films.forEach(film => {
      const frame = film.querySelector('iframe');
      const shouldPlay = !paused && film.dataset.paused !== 'true' && !compact.matches && !document.hidden && film.dataset.inView === 'true';
      if (shouldPlay && !frame.hasAttribute('src')) frame.src = frame.dataset.src;
      if (frame.hasAttribute('src')) send(frame, shouldPlay ? 'play' : 'pause');
    });
  }
  videos.forEach(video => {
    video.removeAttribute('autoplay');
    video.addEventListener('play', () => {
      if (paused || !heroInView || document.hidden || video !== videos[compact.matches ? 1 : 0]) video.pause();
    });
  });
  button.addEventListener('click', () => { paused = !paused; sync(); });
  compact.addEventListener('change', sync);
  reduced.addEventListener('change', () => { paused = reduced.matches; sync(); });
  document.addEventListener('visibilitychange', sync);
  new IntersectionObserver(entries => { heroInView = entries[0].isIntersecting; sync(); }).observe(hero);
  const filmObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => { entry.target.dataset.inView = String(entry.isIntersecting); });
    sync();
  }, { rootMargin: '100px' });
  films.forEach(film => {
    filmObserver.observe(film);
    const toggle = film.querySelector('.fd-about-film-pause');
    toggle.addEventListener('click', () => {
      const stopped = film.dataset.paused !== 'true';
      film.dataset.paused = String(stopped);
      toggle.textContent = stopped ? 'Play' : 'Pause';
      toggle.setAttribute('aria-label', stopped ? 'Play film' : 'Pause film');
      toggle.setAttribute('aria-pressed', String(stopped));
      sync();
    });
  });
  window.addEventListener('message', event => {
    if (event.origin !== 'https://player.vimeo.com') return;
    const film = films.find(f => f.querySelector('iframe').contentWindow === event.source);
    if (!film) return;
    let message;
    try { message = typeof event.data === 'string' ? JSON.parse(event.data) : event.data; } catch { return; }
    if (!message || typeof message !== 'object') return;
    const frame = film.querySelector('iframe');
    if (message.event === 'ready') {
      send(frame, 'addEventListener', 'timeupdate');
      send(frame, 'addEventListener', 'error');
      sync();
    }
    if (message.event === 'timeupdate' && message.data?.seconds > 0) film.dataset.playing = 'true';
    if (message.event === 'error') film.dataset.playing = 'false';
  });
  sync();
})();
