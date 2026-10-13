// Explainer Shorts. A card holds only text until the visitor presses play, so nothing is sent to YouTube before that click.
(function () {
  'use strict';
  var cards = document.querySelectorAll('.vcard');
  var t = function (k) { return window.I18N ? window.I18N.t(k) : k; };

  function play(card) {
    if (card.getAttribute('data-playing')) return;
    var f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + card.getAttribute('data-vid') + '?autoplay=1&rel=0&playsinline=1';
    f.title = t(card.getAttribute('data-key'));
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
    f.referrerPolicy = 'strict-origin-when-cross-origin';
    var box = document.createElement('div');
    box.className = 'vcard';
    box.setAttribute('data-playing', '1');
    box.appendChild(f);
    card.parentNode.replaceChild(box, card);
  }

  Array.prototype.forEach.call(cards, function (c) {
    c.addEventListener('click', function () { play(c); });
  });

  // "Watch" links beside the controls jump to the matching card. They never load the video themselves.
  Array.prototype.forEach.call(document.querySelectorAll('.vlink'), function (b) {
    b.addEventListener('click', function () {
      var c = document.querySelector('.vcard[data-vid="' + b.getAttribute('data-goto') + '"]');
      if (!c) return;
      c.scrollIntoView({ behavior: 'smooth', block: 'center' });
      c.focus({ preventScroll: true });
    });
  });
})();
