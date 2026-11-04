(() => {
  const media = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  document.querySelectorAll('[data-tilt-card]').forEach(card => {
    if (card.dataset.tiltReady) return;
    card.dataset.tiltReady = 'true';
    let x = 0, y = 0, vx = 0, vy = 0, tx = 0, ty = 0, frame = 0, previous = 0;
    const paint = () => { card.style.transform = `perspective(1000px) rotateX(${x}deg) rotateY(${y}deg)`; };
    const step = time => {
      const dt = Math.min((time - previous) / 1000 || 1 / 60, 1 / 30);
      previous = time;
      // Small substeps retain the spring's velocity while keeping it stable.
      for (let i = 0; i < 4; i++) {
        const h = dt / 4;
        vx += ((tx - x) * 200 - vx * 15) / .3 * h;
        vy += ((ty - y) * 200 - vy * 15) / .3 * h;
        x += vx * h; y += vy * h;
      }
      paint();
      if (Math.abs(tx-x)+Math.abs(ty-y)+Math.abs(vx)+Math.abs(vy) > .001) frame = requestAnimationFrame(step);
      else { x = tx; y = ty; paint(); frame = 0; previous = 0; }
    };
    const start = () => { if (!frame) frame = requestAnimationFrame(step); };
    const leave = () => { tx = ty = 0; card.dataset.hovered = 'false'; start(); };
    card.addEventListener('pointermove', event => {
      if (!media.matches || event.pointerType !== 'mouse') return;
      const r = card.getBoundingClientRect();
      const px = Math.max(0, Math.min(1, (event.clientX-r.left)/r.width));
      const py = Math.max(0, Math.min(1, (event.clientY-r.top)/r.height));
      tx = (.5-py)*4; ty = (px-.5)*4;
      card.style.setProperty('--glare-x', `${px*100}%`);
      card.style.setProperty('--glare-y', `${py*100}%`);
      card.dataset.hovered = 'true'; start();
    });
    card.addEventListener('pointerleave', leave);
    card.addEventListener('pointercancel', leave);
    window.addEventListener('blur', leave);
    media.addEventListener('change', () => {
      cancelAnimationFrame(frame); frame = previous = x = y = vx = vy = tx = ty = 0;
      card.dataset.hovered = 'false'; paint();
    });
  });
})();
