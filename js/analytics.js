// Cookieless event counting. See docs/analytics.md for event names and the exclusion filter.
(function () {
  'use strict';
  var cfg = window.NOBLE_CONFIG || {};
  var FLAG = 'noble_exclude';

  function store(fn) { try { return fn(window.localStorage); } catch (e) { return null; } }

  // ?noble=1 marks this browser as owner/agent: never counted. ?noble=0 removes the mark.
  var q = new URLSearchParams(location.search).get('noble');
  if (q === '1') store(function (s) { s.setItem(FLAG, '1'); });
  if (q === '0') store(function (s) { s.removeItem(FLAG); });

  var reason = null;
  if (q === '1' || store(function (s) { return s.getItem(FLAG); }) === '1') reason = 'noble flag';
  else if (navigator.webdriver) reason = 'automated browser';
  else if (/bot|crawl|spider|slurp|headless|lighthouse|preview/i.test(navigator.userAgent)) reason = 'bot user agent';
  else if ((cfg.ANALYTICS_HOSTS || []).indexOf(location.hostname) < 0) reason = 'host not in ANALYTICS_HOSTS';

  var enabled = !reason && (cfg.ABACUS_NAMESPACE || cfg.GOATCOUNTER_CODE);
  var sent = {};
  var page = (document.currentScript && document.currentScript.getAttribute('data-page')) ||
    (location.pathname.split('/').pop() || 'index.html').replace('.html', '') || 'index';

  // Marketing source: ?src=<channel> from SRC_CHANNELS. The first source a browser arrives with is kept,
  // so checkout starts and payments can be counted per channel as well.
  var src = (new URLSearchParams(location.search).get('src') || '').toLowerCase();
  if ((cfg.SRC_CHANNELS || []).indexOf(src) < 0) src = '';
  var firstSrc = enabled ? store(function (s) { return s.getItem('fc_src'); }) : null;
  var PER_SRC = { checkout_start: 1, payment_complete: 1 };

  if (enabled && cfg.GOATCOUNTER_CODE) {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://gc.zgo.at/count.js';
    s.setAttribute('data-goatcounter', 'https://' + cfg.GOATCOUNTER_CODE + '.goatcounter.com/count');
    document.head.appendChild(s);
  }

  function track(name, oncePerPage) {
    if (!enabled) return;
    if (oncePerPage && sent[name]) return;
    sent[name] = true;
    if (cfg.ABACUS_NAMESPACE) {
      var url = 'https://abacus.jasoncameron.dev/hit/' + cfg.ABACUS_NAMESPACE + '/' + name;
      try { fetch(url, { mode: 'cors', keepalive: true }).catch(function () {}); } catch (e) {}
    }
    if (cfg.GOATCOUNTER_CODE && window.goatcounter && window.goatcounter.count) {
      window.goatcounter.count({ path: name, title: name, event: true });
    }
    if (PER_SRC[name] && firstSrc) track(name + '_src_' + firstSrc);
  }

  window.NobleAnalytics = { track: track, enabled: !!enabled, reason: reason };

  // Qualified page view on every load, plus a once-per-browser unique visitor mark.
  track('pageview_' + page);
  if (enabled && store(function (s) { return s.getItem('fc_seen'); }) !== '1') {
    store(function (s) { s.setItem('fc_seen', '1'); });
    track('visitor_unique');
  }
  // One visit_src_<channel> per browser and channel.
  if (enabled && src && store(function (s) { return s.getItem('fc_src_' + src); }) !== '1') {
    store(function (s) { s.setItem('fc_src_' + src, '1'); if (!s.getItem('fc_src')) s.setItem('fc_src', src); });
    if (!firstSrc) firstSrc = src;
    track('visit_src_' + src);
  }
})();
