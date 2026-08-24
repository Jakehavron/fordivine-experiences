(function (window, document) {
  'use strict';

  var STORAGE_KEY = 'fd_attribution_v1';
  var ATTRIBUTION_VERSION = 1;
  var ARTICLE_ASSIST_TTL = 30 * 24 * 60 * 60 * 1000;
  var ACQUISITION_TTL = 90 * 24 * 60 * 60 * 1000;
  var UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id'];
  var CLICK_ID_KEYS = ['fbclid', 'gclid', 'wbraid', 'gbraid', 'msclkid'];

  function clean(value, maxLength) {
    if (typeof value !== 'string') return '';
    return value.trim().slice(0, maxLength || 500);
  }

  function readStore(storage) {
    try {
      var value = storage.getItem(STORAGE_KEY);
      return value ? JSON.parse(value) : {};
    } catch (error) {
      return {};
    }
  }

  function writeStore(storage, value) {
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch (error) {
      // Attribution should never interrupt the visitor's experience.
    }
  }

  function isFresh(timestamp, ttl) {
    var capturedAt = Date.parse(timestamp || '');
    return Number.isFinite(capturedAt) && Date.now() - capturedAt <= ttl;
  }

  function currentState() {
    var local = readStore(window.localStorage);
    var session = readStore(window.sessionStorage);
    var state = {
      version: ATTRIBUTION_VERSION,
      acquisition: session.acquisition || local.acquisition || null,
      articleAssist: session.articleAssist || local.articleAssist || null
    };

    if (state.acquisition && !isFresh(state.acquisition.captured_at, ACQUISITION_TTL)) {
      state.acquisition = null;
    }
    if (state.articleAssist && !isFresh(state.articleAssist.captured_at, ARTICLE_ASSIST_TTL)) {
      state.articleAssist = null;
    }
    return state;
  }

  function saveState(state) {
    writeStore(window.sessionStorage, state);
    writeStore(window.localStorage, state);
  }

  function getReferrer() {
    var referrer = clean(document.referrer, 1000);
    if (!referrer) return '';
    try {
      var referrerUrl = new URL(referrer);
      if (referrerUrl.hostname === window.location.hostname) return '';
      referrerUrl.search = '';
      referrerUrl.hash = '';
      return referrerUrl.toString();
    } catch (error) {
      return '';
    }
  }

  function capture() {
    var state = currentState();
    var params = new URLSearchParams(window.location.search);
    var now = new Date().toISOString();
    var hasCampaignData = UTM_KEYS.concat(CLICK_ID_KEYS).some(function (key) {
      return clean(params.get(key));
    });
    var externalReferrer = getReferrer();

    if (!state.acquisition || hasCampaignData || externalReferrer) {
      var acquisition = state.acquisition || {};
      if (!state.acquisition || hasCampaignData) {
        acquisition = {
          captured_at: now,
          landing_page: window.location.pathname,
          landing_url: window.location.origin + window.location.pathname,
          referrer: externalReferrer
        };
      } else if (!acquisition.referrer && externalReferrer) {
        acquisition.referrer = externalReferrer;
      }

      UTM_KEYS.concat(CLICK_ID_KEYS).forEach(function (key) {
        var value = clean(params.get(key));
        if (value) acquisition[key] = value;
      });
      state.acquisition = acquisition;
    }

    var article = clean(params.get('fd_article'), 160);
    if (article) {
      state.articleAssist = {
        captured_at: now,
        entry: clean(params.get('fd_entry'), 80) || 'journal',
        article: article,
        cta: clean(params.get('fd_cta'), 120) || 'unknown',
        landing_page: '/journal/' + article
      };
    }

    saveState(state);
    return state;
  }

  function gaParams() {
    var state = currentState();
    var assist = state.articleAssist;
    if (!assist) return { article_assisted: false };

    var ageDays = Math.max(0, Math.floor((Date.now() - Date.parse(assist.captured_at)) / 86400000));
    return {
      article_assisted: true,
      article_entry: assist.entry,
      article_slug: assist.article,
      article_cta_location: assist.cta,
      article_assist_age_days: ageDays
    };
  }

  function decorateSchedulerUrl(rawUrl) {
    var state = currentState();
    var url;
    try {
      url = new URL(rawUrl);
    } catch (error) {
      return rawUrl;
    }

    var acquisition = state.acquisition;
    if (acquisition) {
      UTM_KEYS.concat(CLICK_ID_KEYS).forEach(function (key) {
        if (acquisition[key] && !url.searchParams.has(key)) {
          url.searchParams.set(key, acquisition[key]);
        }
      });
      if (acquisition.landing_page) url.searchParams.set('fd_first_landing_page', acquisition.landing_page);
      if (acquisition.referrer) url.searchParams.set('fd_first_referrer', acquisition.referrer);
    }

    var assist = state.articleAssist;
    if (assist) {
      url.searchParams.set('fd_entry', assist.entry);
      url.searchParams.set('fd_article', assist.article);
      url.searchParams.set('fd_cta', assist.cta);
      url.searchParams.set('fd_article_landing_page', assist.landing_page);
    }

    return url.toString();
  }

  function safeQueryParams() {
    var state = currentState();
    var params = new URLSearchParams();
    var acquisition = state.acquisition;
    if (acquisition) {
      UTM_KEYS.concat(CLICK_ID_KEYS).forEach(function (key) {
        if (acquisition[key]) params.set(key, acquisition[key]);
      });
      if (acquisition.landing_page) params.set('fd_first_landing_page', acquisition.landing_page);
      if (acquisition.referrer) params.set('fd_first_referrer', acquisition.referrer);
    }
    var assist = state.articleAssist;
    if (assist) {
      params.set('fd_entry', assist.entry);
      params.set('fd_article', assist.article);
      params.set('fd_cta', assist.cta);
      params.set('fd_article_landing_page', assist.landing_page);
    }
    return params;
  }

  window.FDAttribution = {
    capture: capture,
    getState: currentState,
    gaParams: gaParams,
    decorateSchedulerUrl: decorateSchedulerUrl,
    safeQueryParams: safeQueryParams
  };

  var capturedState = capture();
  if (/^\/discover\/?$/.test(window.location.pathname) && capturedState.articleAssist && typeof window.gtag === 'function') {
    window.gtag('event', 'article_assisted_discover_visit', gaParams());
  }
})(window, document);
