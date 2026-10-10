(function () {
  'use strict';
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var cards = Array.from(document.querySelectorAll('.cs-featured-card'));
  var frame = 0;
  var strengths = new WeakMap();
  function update() {
    frame = 0;
    var viewport = window.innerHeight;
    // Read every card before writing styles; compensate for its previous lift.
    var values = cards.map(function (card) {
      if (reducedMotion.matches) return 0;
      var rect = card.getBoundingClientRect();
      var previous = strengths.get(card) || 0;
      var center = rect.top + rect.height / 2 + previous * 12;
      var distance = Math.abs(center - viewport / 2);
      var range = viewport * 0.45 + card.offsetHeight * 0.15;
      var strength = Math.max(0, 1 - distance / range);
      return strength * strength * (3 - 2 * strength);
    });
    cards.forEach(function (card, index) {
      strengths.set(card, values[index]);
      card.style.setProperty('--cs-scroll-emphasis', values[index].toFixed(4));
    });
  }
  function schedule() {
    if (!frame) frame = window.requestAnimationFrame(update);
  }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('pageshow', schedule);
  reducedMotion.addEventListener('change', schedule);
  if ('ResizeObserver' in window) {
    var sizes = new ResizeObserver(schedule);
    cards.forEach(function (card) { sizes.observe(card); });
  }
  schedule();
})();
