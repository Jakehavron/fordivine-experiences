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
