// Explainer Shorts. A card holds a muted loop from this site, so nothing is sent to YouTube before the visitor presses play.
// Pressing play swaps in one youtube-nocookie iframe and counts video_play and video_play_<slug>.
// Phone and tablet: three carousels, one per use case, previews play while a card is in view.
// Desktop (900 px and wider): tabs per use case, one big preview (the "stage") and a numbered list, so only one picture moves.
(function () {
  'use strict';
  var root = document.getElementById('videos');
  if (!root) return;
  var t = function (k) { return window.I18N ? window.I18N.t(k) : k; };
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mq = window.matchMedia ? window.matchMedia('(min-width: 900px)') : { matches: false };
  var track = function (n) { if (window.NobleAnalytics) window.NobleAnalytics.track(n); };
  var groups = Array.prototype.slice.call(root.querySelectorAll('.vgroup'));
  var cards = Array.prototype.slice.call(root.querySelectorAll('.vcard'));
  var desk = false;
  var active = 0;
  var tabs = [];

  function frame(vid, key) {
    var f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + vid + '?autoplay=1&rel=0&playsinline=1';
    f.title = t(key);
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
    f.referrerPolicy = 'strict-origin-when-cross-origin';
    return f;
  }
  function counted(slug) { track('video_play'); track('video_play_' + slug); }
  function startVideo(v) {
    v.muted = true;
    if (!v.getAttribute('src')) v.src = v.getAttribute('data-src');
    var p = v.play(); if (p && p.catch) p.catch(function () {});
  }

  // ---- Phone and tablet: press a card to play it in place ----
  function playCard(card) {
    var thumb = document.createElement('span');
    thumb.className = 'vthumb';
    thumb.appendChild(frame(card.getAttribute('data-vid'), card.getAttribute('data-key')));
    var cap = document.createElement('span');
    cap.className = 'vtitle';
    cap.textContent = t(card.getAttribute('data-key'));
    var box = document.createElement('div');
    box.className = 'vcard';
    box.setAttribute('data-playing', '1');
    box.appendChild(thumb);
    box.appendChild(cap);
    card.parentNode.replaceChild(box, card);
    counted(card.getAttribute('data-slug'));
  }

  // A tall card on a short screen counts as in view once a good part of it shows, so the ratio alone is not the test.
  function visibleEnough(e) { return e.isIntersecting && (e.intersectionRatio >= 0.45 || e.intersectionRect.height >= 260); }
  var cardIO = (!still && 'IntersectionObserver' in window) ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var v = e.target.querySelector('video');
      if (!v) return;
      if (!desk && visibleEnough(e)) startVideo(v); else v.pause();
    });
  }, { threshold: [0, 0.2, 0.45, 0.7, 1] }) : null;

  // ---- Desktop: the stage ----
  function stageOf(g) { return g.querySelector('.vstage'); }
  function previewStage(st) {
    var v = st.querySelector('video');
    if (!v) return;
    if (desk && !still && st._seen && !st.closest('[hidden]')) startVideo(v); else v.pause();
  }
  var stageIO = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { e.target._seen = visibleEnough(e); previewStage(e.target); });
  }, { threshold: [0, 0.2, 0.45, 0.7, 1] }) : null;

  function showStage(g, card) {
    var st = stageOf(g);
    var slug = card.getAttribute('data-slug');
    st.setAttribute('data-slug', slug);
    st.setAttribute('data-vid', card.getAttribute('data-vid'));
    st.setAttribute('data-key', card.getAttribute('data-key'));
    st.innerHTML = '<button type="button" class="vstage-btn"><span class="vthumb"><img src="previews/' + slug + '.jpg" alt="" width="540" height="960">' +
      '<video muted loop playsinline disablepictureinpicture preload="none" aria-hidden="true" tabindex="-1" poster="previews/' + slug + '.jpg" data-src="previews/' + slug + '.mp4"></video>' +
      '<span class="vplay" aria-hidden="true">▶</span></span></button>';
    var btn = st.firstChild;
    btn.setAttribute('aria-label', t(card.getAttribute('data-key')));
    btn.addEventListener('click', function () {
      var thumb = document.createElement('span');
      thumb.className = 'vthumb';
      thumb.appendChild(frame(st.getAttribute('data-vid'), st.getAttribute('data-key')));
      st.innerHTML = '';
      st.appendChild(thumb);
      counted(slug);
    });
    Array.prototype.forEach.call(g.querySelectorAll('.vcard'), function (c) {
      if (c === card) c.setAttribute('aria-current', 'true'); else c.removeAttribute('aria-current');
    });
    previewStage(st);
  }

  // ---- Tabs ----
  function buildTabs() {
    var bar = document.createElement('div');
    bar.className = 'vtabs';
    bar.setAttribute('role', 'tablist');
    groups.forEach(function (g, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'vtab';
      b.id = 'vtab-' + i;
      b.setAttribute('data-i18n', g.querySelector('h3').getAttribute('data-i18n'));
      b.textContent = g.querySelector('h3').textContent;
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-controls', 'vpanel-' + i);
      b.addEventListener('click', function () { activate(i, true); });
      b.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (d) { e.preventDefault(); activate((i + d + groups.length) % groups.length, true); }
      });
      bar.appendChild(b);
      tabs.push(b);
      g.id = 'vpanel-' + i;
      g.setAttribute('role', 'tabpanel');
      g.setAttribute('aria-labelledby', b.id);
    });
    root.insertBefore(bar, groups[0]);
  }
  function activate(i, focus) {
    active = i;
    groups.forEach(function (g, k) {
      g.hidden = desk && k !== i;
      tabs[k].setAttribute('aria-selected', k === i ? 'true' : 'false');
      tabs[k].tabIndex = k === i ? 0 : -1;
    });
    if (focus) tabs[i].focus();
    groups.forEach(function (g) { previewStage(stageOf(g)); });
  }

  // ---- Mode switch ----
  function apply() {
    desk = mq.matches;
    root.classList.toggle('vdesk', desk);
    if (desk) {
      cards.forEach(function (c) { var v = c.querySelector('video'); if (v) v.pause(); });
      groups.forEach(function (g) {
        if (!g.querySelector('.vstage-btn') && !g.querySelector('.vstage iframe')) showStage(g, g.querySelector('.vcard[aria-current="true"]') || g.querySelector('.vcard'));
      });
    } else if (cardIO) {
      groups.forEach(function (g) { var v = stageOf(g).querySelector('video'); if (v) v.pause(); });
      cards.forEach(function (c) { cardIO.unobserve(c); cardIO.observe(c); });
    }
    activate(active, false);
    syncNav();
  }

  // ---- Phone carousels: previous and next buttons show only when a row overflows ----
  var navs = Array.prototype.map.call(root.querySelectorAll('.vcar'), function (car) {
    var row = car.querySelector('.vrow'), prev = car.querySelector('.vprev'), next = car.querySelector('.vnext');
    function sync() {
      var over = !desk && row.scrollWidth > row.clientWidth + 4;
      prev.hidden = !over || row.scrollLeft < 8;
      next.hidden = !over || row.scrollLeft + row.clientWidth >= row.scrollWidth - 8;
    }
    function go(d) { row.scrollBy({ left: d * (row.clientWidth * 0.8), behavior: still ? 'auto' : 'smooth' }); }
    prev.addEventListener('click', function () { go(-1); });
    next.addEventListener('click', function () { go(1); });
    row.addEventListener('scroll', sync, { passive: true });
    return sync;
  });
  function syncNav() { navs.forEach(function (f) { f(); }); }
  window.addEventListener('resize', syncNav);

  // ---- Wiring ----
  cards.forEach(function (c) {
    c.addEventListener('click', function () {
      if (desk) showStage(c.closest('.vgroup'), c); else playCard(c);
    });
    if (cardIO) cardIO.observe(c);
  });
  if (stageIO) groups.forEach(function (g) { stageIO.observe(stageOf(g)); });

  // "Watch" links beside the controls jump to the matching video. They never load it themselves.
  Array.prototype.forEach.call(document.querySelectorAll('.vlink'), function (b) {
    b.addEventListener('click', function () {
      var c = root.querySelector('.vcard[data-vid="' + b.getAttribute('data-goto') + '"]');
      if (!c) return;
      var smooth = still ? 'auto' : 'smooth';
      if (desk) {
        var g = c.closest('.vgroup');
        activate(groups.indexOf(g), false);
        showStage(g, c);
        stageOf(g).scrollIntoView({ behavior: smooth, block: 'center' });
      } else {
        c.scrollIntoView({ behavior: smooth, block: 'center', inline: 'center' });
      }
      c.focus({ preventScroll: true });
    });
  });

  buildTabs();
  if (window.I18N) window.I18N.onChange(function () {
      groups.forEach(function (g) {
      var b = g.querySelector('.vstage-btn');
      if (b) b.setAttribute('aria-label', t(stageOf(g).getAttribute('data-key')));
    });
  });
  if (mq.addEventListener) mq.addEventListener('change', apply); else if (mq.addListener) mq.addListener(apply);
  apply();
})();
