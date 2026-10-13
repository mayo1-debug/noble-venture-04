// Explainer Shorts. Each card shows a muted loop from this site, so nothing is sent to YouTube before the visitor presses play.
// Pressing play swaps the card for one youtube-nocookie iframe and counts video_play and video_play_<slug>.
(function () {
  'use strict';
  var t = function (k) { return window.I18N ? window.I18N.t(k) : k; };
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var track = function (n) { if (window.NobleAnalytics) window.NobleAnalytics.track(n); };

  function play(card) {
    var f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + card.getAttribute('data-vid') + '?autoplay=1&rel=0&playsinline=1';
    f.title = t(card.getAttribute('data-key'));
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
    f.referrerPolicy = 'strict-origin-when-cross-origin';
    var thumb = document.createElement('span');
    thumb.className = 'vthumb';
    thumb.appendChild(f);
    var cap = document.createElement('span');
    cap.className = 'vtitle';
    cap.textContent = t(card.getAttribute('data-key'));
    var box = document.createElement('div');
    box.className = 'vcard';
    box.setAttribute('data-playing', '1');
    box.appendChild(thumb);
    box.appendChild(cap);
    card.parentNode.replaceChild(box, card);
    track('video_play');
    track('video_play_' + card.getAttribute('data-slug'));
  }

  var cards = document.querySelectorAll('.vcard');
  Array.prototype.forEach.call(cards, function (c) {
    c.addEventListener('click', function () { play(c); });
  });

  // Previews run only while a card is mostly in view, and never under reduced motion. A tall card on a short screen counts
  // as in view once a good part of it shows, so the ratio alone is not the test.
  if (!still && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target.querySelector('video');
        if (!v) return;
        var inView = e.isIntersecting && (e.intersectionRatio >= 0.45 || e.intersectionRect.height >= 260);
        if (inView) {
          v.muted = true;
          if (!v.getAttribute('src')) v.src = v.getAttribute('data-src');
          var p = v.play(); if (p && p.catch) p.catch(function () {});
        } else { v.pause(); }
      });
    }, { threshold: [0, 0.2, 0.45, 0.7, 1] });
    Array.prototype.forEach.call(cards, function (c) { io.observe(c); });
  }

  // Previous and next buttons show only when a row overflows.
  Array.prototype.forEach.call(document.querySelectorAll('.vcar'), function (car) {
    var row = car.querySelector('.vrow'), prev = car.querySelector('.vprev'), next = car.querySelector('.vnext');
    function sync() {
      var over = row.scrollWidth > row.clientWidth + 4;
      prev.hidden = !over || row.scrollLeft < 8;
      next.hidden = !over || row.scrollLeft + row.clientWidth >= row.scrollWidth - 8;
    }
    function go(d) { row.scrollBy({ left: d * (row.clientWidth * 0.8), behavior: still ? 'auto' : 'smooth' }); }
    prev.addEventListener('click', function () { go(-1); });
    next.addEventListener('click', function () { go(1); });
    row.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    sync();
  });

  // "Watch" links beside the controls jump to the matching card. They never load the video themselves.
  Array.prototype.forEach.call(document.querySelectorAll('.vlink'), function (b) {
    b.addEventListener('click', function () {
      var c = document.querySelector('.vcard[data-vid="' + b.getAttribute('data-goto') + '"]');
      if (!c) return;
      c.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'center', inline: 'center' });
      c.focus({ preventScroll: true });
    });
  });
})();
