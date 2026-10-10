(function () {
  'use strict';
  // Cards remain visible without JavaScript or when reduced motion is requested.
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches || !('IntersectionObserver' in window) || !Element.prototype.animate) return;
  var animations = new Set();
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      if (reducedMotion.matches || entry.target.contains(document.activeElement)) return;
      var animation = entry.target.animate([
        { opacity: 0.55, transform: 'translateY(24px) scale(.99)' },
        { opacity: 1, transform: 'translateY(0) scale(1)' }
      ], { duration: 850, easing: 'cubic-bezier(.16,1,.3,1)' });
      animations.add(animation);
      animation.onfinish = animation.oncancel = function () { animations.delete(animation); };
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.cs-featured-card').forEach(function (card) { observer.observe(card); });
  reducedMotion.addEventListener('change', function (event) {
    if (!event.matches) return;
    observer.disconnect();
    animations.forEach(function (animation) { animation.cancel(); });
  });
})();
