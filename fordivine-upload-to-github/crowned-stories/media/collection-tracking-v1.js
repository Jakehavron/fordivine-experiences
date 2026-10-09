(function (window, document) {
  'use strict';
  // Clean internal links preserve acquisition attribution. Only a clicked story is recorded;
  // this is not a verified story view, lead, or completed booking.
  function track(event) {
    if (event.type === 'auxclick' && event.button !== 1) return;
    var link = event.target.closest && event.target.closest('a[href]');
    if (!link) return;
    var url;
    try { url = new URL(link.href, window.location.href); } catch (_) { return; }
    if (url.origin !== window.location.origin) return;
    var knownStories = ["michelle-roby", "stephanie-byerly", "amy-lacey", "beth-clifford", "roni-lavenia", "lauren-fields", "colette-vanpaemel", "christa-crawford", "ali-marie"];
    var slug = url.pathname.replace(/\/$/, '').split('/').pop();
    var story = link.getAttribute('data-cs-story') || (knownStories.indexOf(slug) !== -1 ? slug : '');
    var category = link.getAttribute('data-cs-category');
    var sourceCategory = window.location.pathname.split('/').filter(Boolean)[1] || 'all';
    var path = url.pathname.replace(/\/$/, '');
    var name = story ? 'crowned_story_click' : category ? 'crowned_category_click' : path === '/discover' ? 'crowned_discover_click' : 'crowned_navigation_click';
    var params = {
      source_page: window.location.pathname,
      link_destination: path + url.hash,
      story_slug: story || '',
      story_category: category || sourceCategory,
      link_placement: link.getAttribute('data-cs-placement') || (link.closest('.proof-story-card') ? 'testimonial' : link.closest('header') ? 'header' : link.closest('footer') ? 'footer' : 'page'),
      card_position: Number(link.getAttribute('data-cs-position')) || 0,
      transport_type: 'beacon'
    };
    if (story) {
      try { window.sessionStorage.setItem('fd_story_click_v1', JSON.stringify({ captured_at: new Date().toISOString(), story_slug: story, story_category: params.story_category, link_placement: params.link_placement, source_page: params.source_page })); } catch (_) {}
    }
    if (typeof window.fdLoadTrackingLibraries === 'function') window.fdLoadTrackingLibraries();
    if (typeof window.gtag === 'function') {
      // Give a first-interaction event time to leave before same-tab navigation.
      // Modified clicks, downloads, and new tabs retain native browser behavior.
      if (event.type === 'click' && !event.defaultPrevented && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey && !link.hasAttribute('download') && (!link.target || link.target === '_self') && typeof event.preventDefault === 'function') {
        event.preventDefault();
        var navigated = false;
        var navigate = function () { if (!navigated) { navigated = true; window.location.assign(url.href); } };
        params.event_callback = navigate;
        params.event_timeout = 800;
        window.setTimeout(navigate, 850);
      }
      window.gtag('event', name, params);
    }
  }
  document.addEventListener('click', track);
  document.addEventListener('auxclick', track);
})(window, document);
