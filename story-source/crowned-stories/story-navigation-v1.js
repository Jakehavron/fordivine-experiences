(function () {
  'use strict';
  document.addEventListener('click', function (event) {
    var link = event.target.closest && event.target.closest('a[data-story-nav]');
    if (!link) return;
    var params = {source_page:location.pathname,link_destination:link.getAttribute('href'),story_category:link.dataset.csCategory,story_slug:link.dataset.csStory || '',link_placement:link.dataset.storyNav,transport_type:'beacon'};
    if (params.story_slug) {
      try {sessionStorage.setItem('fd_story_click_v1',JSON.stringify({captured_at:new Date().toISOString(),story_slug:params.story_slug,story_category:params.story_category,link_placement:params.link_placement,source_page:params.source_page}));} catch (_) {}
    }
    if (typeof window.fdLoadTrackingLibraries === 'function') window.fdLoadTrackingLibraries();
    if (typeof window.gtag !== 'function') return;
    if (!event.defaultPrevented && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey && (!link.target || link.target === '_self')) {
      event.preventDefault();
      var navigated=false;
      var navigate=function(){if(!navigated){navigated=true;location.assign(link.href);}};
      params.event_callback=navigate;params.event_timeout=800;setTimeout(navigate,850);
    }
    window.gtag('event',params.story_slug ? 'crowned_story_click' : 'crowned_category_click',params);
  });
})();
