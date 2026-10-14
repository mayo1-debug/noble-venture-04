// FlossChart UI: upload, preview, floss list, printing, PayPal unlock.
(function () {
  'use strict';
  var cfg = window.NOBLE_CONFIG;
  var track = window.NobleAnalytics ? window.NobleAnalytics.track : function () {};
  var $ = function (id) { return document.getElementById(id); };
  var UNLOCK_KEY = 'fc_unlock';
  var img = null, pat = null, timer = null;

  function store(fn) { try { return fn(window.localStorage); } catch (e) { return null; } }
  function unlocked() { return !!store(function (s) { return s.getItem(UNLOCK_KEY); }); }

  var I = window.I18N, t = I.t;
  // Set or clear a message that follows the page language.
  function setMsg(el, key) {
    if (key) { el.setAttribute('data-i18n', key); el.textContent = t(key); }
    else { el.removeAttribute('data-i18n'); el.textContent = ''; }
  }
  // Price and support text come from config.js only (the price is written the local way by i18n.js).
  function fillSupport() {
    document.querySelectorAll('.support').forEach(function (el) {
      el.textContent = '';
      var a = document.createElement('a');
      if (cfg.SUPPORT_EMAIL) { a.href = 'mailto:' + cfg.SUPPORT_EMAIL; a.textContent = cfg.SUPPORT_EMAIL; }
      else { a.href = cfg.SUPPORT_URL; a.textContent = t('support.fallback'); a.target = '_blank'; a.rel = 'noopener'; }
      el.appendChild(a);
    });
  }
  if (cfg.PAYPAL_ENV !== 'live') $('testmode').hidden = false;

  // ---------- Loading pictures ----------
  function loadFile(file) {
    if (!file || !/^image\//.test(file.type)) { alert(t('alert.notimage')); return; }
    var url = URL.createObjectURL(file), im = new Image();
    im.onload = function () { img = im; showCredit(null); start(); };
    im.onerror = function () { alert(t('alert.unreadable')); };
    im.src = url;
  }
  $('file').addEventListener('change', function (e) { loadFile(e.target.files[0]); });
  $('upload').addEventListener('click', function () { $('file').click(); });
  var drop = $('drop');
  ['dragenter', 'dragover'].forEach(function (t) { drop.addEventListener(t, function (e) { e.preventDefault(); drop.classList.add('over'); }); });
  ['dragleave', 'drop'].forEach(function (t) { drop.addEventListener(t, function (e) { e.preventDefault(); drop.classList.remove('over'); }); });
  drop.addEventListener('drop', function (e) { loadFile(e.dataTransfer.files[0]); });

  // ---------- Sample pictures ----------
  // "Try a sample picture" walks through the paintings from the YouTube Shorts, then the drawn cat.
  // Width and colors match the Shorts, so a visitor from a Short sees the same chart.
  // Images: public-domain artworks, files released under CC0 by The Met and the Cleveland Museum of Art
  // (marketing/assets/SOURCES.md).
  var SAMPLES = [
    { slug: 'great-wave', name: 'The Great Wave', artist: 'Katsushika Hokusai', w: 120, c: 24 },
    { slug: 'sunflowers', name: 'Sunflowers', artist: 'Vincent van Gogh', w: 120, c: 30 },
    { slug: 'cat-and-butterfly', name: 'Cat and Butterfly', artist: 'Min Zhen', w: 80, c: 24 },
    { slug: 'irises', name: 'Irises', artist: 'Vincent van Gogh', w: 120, c: 30 },
    { slug: 'sudden-shower-hiroshige', name: 'Sudden Shower over Shin-Ohashi Bridge', artist: 'Utagawa Hiroshige', w: 80, c: 24 },
    { slug: 'water-pitcher-vermeer', name: 'Young Woman with a Water Pitcher', artist: 'Johannes Vermeer', w: 100, c: 30 },
    { slug: 'flosschart-sample', w: 80, c: 12 }
  ];
  var sampleAt = -1, sampleNow = null;

  function drawnScene() {
    // A small drawn scene, so people can try the tool without a photo.
    var c = document.createElement('canvas'); c.width = 400; c.height = 300;
    var g = c.getContext('2d');
    var sky = g.createLinearGradient(0, 0, 0, 300); sky.addColorStop(0, '#f6b26b'); sky.addColorStop(1, '#fde9c9');
    g.fillStyle = sky; g.fillRect(0, 0, 400, 300);
    g.fillStyle = '#f9e076'; g.beginPath(); g.arc(290, 110, 48, 0, 7); g.fill();
    g.fillStyle = '#6a8f5a'; g.beginPath(); g.moveTo(0, 220); g.quadraticCurveTo(120, 140, 240, 210); g.quadraticCurveTo(320, 250, 400, 200); g.lineTo(400, 300); g.lineTo(0, 300); g.fill();
    g.fillStyle = '#3f6140'; g.beginPath(); g.moveTo(0, 260); g.quadraticCurveTo(200, 200, 400, 270); g.lineTo(400, 300); g.lineTo(0, 300); g.fill();
    g.fillStyle = '#2f2a28'; g.beginPath(); g.ellipse(110, 225, 26, 18, 0, 0, 7); g.fill(); g.beginPath(); g.arc(136, 205, 13, 0, 7); g.fill();
    g.beginPath(); g.moveTo(128, 195); g.lineTo(132, 182); g.lineTo(138, 194); g.fill(); g.beginPath(); g.moveTo(140, 194); g.lineTo(146, 183); g.lineTo(147, 198); g.fill();
    return c.toDataURL();
  }

  function showCredit(s) {
    sampleNow = s;
    var box = $('sampleCredit');
    if (!box) return;
    box.hidden = !s;
    if (s) $('sampleCreditText').textContent = s.name ? s.name + ' · ' + s.artist + ' · ' + t('sample.pd') : t('sample.own');
  }

  function loadSample(slug) {
    var i = slug ? SAMPLES.map(function (s) { return s.slug; }).indexOf(slug) : (sampleAt + 1) % SAMPLES.length;
    if (i < 0) return;
    sampleAt = i;
    var s = SAMPLES[i], im = new Image();
    im.onload = function () { img = im; $('width').value = s.w; $('colors').value = s.c; showCredit(s); start(); };
    im.onerror = function () { alert(t('alert.unreadable')); };
    im.src = s.slug === 'flosschart-sample' ? drawnScene() : 'samples/' + s.slug + '.jpg';
    track('sample_' + s.slug);
  }
  window.FlossSamples = { load: loadSample, list: SAMPLES };
  $('sample').addEventListener('click', function () { loadSample(); });
  if ($('sampleNext')) $('sampleNext').addEventListener('click', function () { loadSample(); });

  function start() {
    $('panel').hidden = false; $('drop').hidden = true;
    regenerate();
    $('tool').scrollIntoView({ behavior: 'smooth' });
  }

  // ---------- Making the pattern ----------
  function regenerate() {
    if (!img) return;
    var w = +$('width').value, colors = +$('colors').value;
    $('wOut').textContent = w; $('cOut').textContent = colors;
    var h = Math.max(1, Math.round(w * img.naturalHeight / img.naturalWidth));
    if (h > 500) { h = 500; w = Math.max(1, Math.round(h * img.naturalWidth / img.naturalHeight)); }
    var c = document.createElement('canvas'); c.width = w; c.height = h;
    var g = c.getContext('2d'); g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
    // Step down in halves for a smoother average on big photos.
    var src = img, sw = img.naturalWidth, sh = img.naturalHeight;
    while (sw / 2 > w * 2) {
      var t = document.createElement('canvas'); t.width = Math.round(sw / 2); t.height = Math.round(sh / 2);
      var tg = t.getContext('2d'); tg.imageSmoothingQuality = 'high'; tg.drawImage(src, 0, 0, t.width, t.height);
      src = t; sw = t.width; sh = t.height;
    }
    g.drawImage(src, 0, 0, w, h);
    pat = window.FlossPattern.generate(g.getImageData(0, 0, w, h), { maxColors: colors, cleanup: +$('cleanup').value });
    track('tool_use', true);
    track('pattern_generated');
    render();
  }
  function schedule() { clearTimeout(timer); timer = setTimeout(regenerate, 150); }
  ['width', 'colors'].forEach(function (id) {
    $(id).addEventListener('input', function () { $(id === 'width' ? 'wOut' : 'cOut').textContent = $(id).value; schedule(); });
  });
  $('cleanup').addEventListener('change', regenerate);
  $('fabric').addEventListener('change', render);
  $('showSymbols').addEventListener('change', render);

  function fmt(n, d) { var s = n.toFixed(d); return window.I18N && window.I18N.lang !== 'en' ? s.replace('.', ',') : s; }
  function thousands(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
  function textColor(rgb) { return (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) > 140 ? '#000' : '#fff'; }
  function rgbCss(rgb) { return 'rgb(' + rgb.join(',') + ')'; }

  function render() {
    if (!pat) return;
    var fabric = +$('fabric').value, w = pat.width, h = pat.height;
    var stitches = pat.palette.reduce(function (a, p) { return a + p.count; }, 0);
    $('stats').textContent = t('stats', { w: w, h: h, n: pat.palette.length, s: thousands(stitches), c: thousands(pat.confetti), f: fabric,
      a: fmt(w / fabric, 1), b: fmt(h / fabric, 1), a2: fmt(w / fabric * 2.54, 1), b2: fmt(h / fabric * 2.54, 1) });

    var cv = $('preview'), wrap = cv.parentElement;
    var sym = $('showSymbols').checked;
    var cell = Math.max(2, Math.min(sym ? 16 : 12, Math.floor((wrap.clientWidth || 600) / w)));
    if (sym) cell = Math.max(cell, 12);
    cv.width = w * cell; cv.height = h * cell;
    var g = cv.getContext('2d');
    g.fillStyle = '#fff'; g.fillRect(0, 0, cv.width, cv.height);
    for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) {
      var v = pat.grid[y * w + x]; if (v === 65535) continue;
      g.fillStyle = rgbCss(pat.palette[v].rgb); g.fillRect(x * cell, y * cell, cell, cell);
    }
    if (sym) {
      g.font = 'bold ' + Math.floor(cell * 0.75) + 'px monospace'; g.textAlign = 'center'; g.textBaseline = 'middle';
      for (y = 0; y < h; y++) for (x = 0; x < w; x++) {
        v = pat.grid[y * w + x]; if (v === 65535) continue;
        g.fillStyle = textColor(pat.palette[v].rgb); g.fillText(pat.palette[v].symbol, x * cell + cell / 2, y * cell + cell / 2 + 1);
      }
    }
    if (cell >= 6) gridLines(g, w, h, cell);

    var rows = '<tr><th>' + esc(t('tbl.sym')) + '</th><th>' + esc(t('tbl.color')) + '</th><th>DMC</th><th>' + esc(t('tbl.name')) + '</th><th>' +
      esc(t('tbl.stitches')) + '</th><th>' + esc(t('tbl.skeins')) + '</th></tr>';
    pat.palette.forEach(function (p) {
      rows += '<tr><td class="sym">' + esc(p.symbol) + '</td><td><span class="sw" style="background:' + rgbCss(p.rgb) + '"></span></td><td>' +
        esc(p.dmc) + '</td><td>' + esc(p.name) + '</td><td>' + thousands(p.count) + '</td><td>' + window.FlossPattern.skeins(p.count, fabric) + '</td></tr>';
    });
    $('key').innerHTML = rows;
    updateGate();
  }
  function gridLines(g, w, h, cell) {
    for (var x = 0; x <= w; x++) {
      g.fillStyle = x % 10 === 0 ? 'rgba(0,0,0,.75)' : 'rgba(0,0,0,.18)';
      g.fillRect(x * cell - (x % 10 === 0 ? 1 : 0), 0, x % 10 === 0 ? 2 : 1, h * cell);
    }
    for (var y = 0; y <= h; y++) {
      g.fillStyle = y % 10 === 0 ? 'rgba(0,0,0,.75)' : 'rgba(0,0,0,.18)';
      g.fillRect(0, y * cell - (y % 10 === 0 ? 1 : 0), w * cell, y % 10 === 0 ? 2 : 1);
    }
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function isFree() { return pat && pat.width <= cfg.FREE_MAX_STITCHES && pat.height <= cfg.FREE_MAX_STITCHES; }
  function updateGate() {
    var u = unlocked();
    $('unlockedNote').hidden = !u; $('buy').hidden = u;
    if (!pat) return;
    $('gateNote').textContent = u ? '' : t(isFree() ? 'gate.free' : 'gate.paid', { max: cfg.FREE_MAX_STITCHES });
  }

  // ---------- Printing ----------
  var PAGE_W = 50, PAGE_H = 65, PCELL = 28;
  function printChart() {
    if (!pat) return;
    if (!isFree() && !unlocked()) { openBuy(); return; }
    track(unlocked() ? 'print_paid' : 'print_free');
    var root = $('printRoot'), bw = $('style').value === 'bw', fabric = +$('fabric').value;
    var w = pat.width, h = pat.height, cols = Math.ceil(w / PAGE_W), rowsN = Math.ceil(h / PAGE_H);
    var html = '<section class="pp cover"><h1>' + esc(t('print.title')) + '</h1><p>' + esc(t('print.sub', { w: w, h: h, n: pat.palette.length, p: cols * rowsN })) +
      '</p><p>' + esc(t('print.size')) + ' ' + [11, 14, 16, 18].map(function (c) {
        return esc(t('size.item', { c: c, a: fmt(w / c * 2.54, 1), b: fmt(h / c * 2.54, 1) }));
      }).join(' · ') + '</p>';
    var pv = document.createElement('canvas'), s = Math.max(1, Math.floor(400 / Math.max(w, h)));
    pv.width = w * s; pv.height = h * s; var pg = pv.getContext('2d');
    for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) {
      var v = pat.grid[y * w + x]; if (v === 65535) continue;
      pg.fillStyle = rgbCss(pat.palette[v].rgb); pg.fillRect(x * s, y * s, s, s);
    }
    html += '<img class="pvimg" src="' + pv.toDataURL() + '" alt="' + esc(t('print.alt.preview')) + '"><table class="key"><tr><th>' + esc(t('tbl.sym.short')) + '</th><th></th><th>DMC</th><th>' + esc(t('tbl.name')) + '</th><th>' +
      esc(t('tbl.stitches')) + '</th><th>' + esc(t('tbl.skeinsf', { f: fabric })) + '</th></tr>';
    pat.palette.forEach(function (p) {
      html += '<tr><td class="sym">' + esc(p.symbol) + '</td><td><span class="sw" style="background:' + rgbCss(p.rgb) + '"></span></td><td>' + esc(p.dmc) + '</td><td>' + esc(p.name) + '</td><td>' + thousands(p.count) + '</td><td>' + window.FlossPattern.skeins(p.count, fabric) + '</td></tr>';
    });
    html += '</table><p class="small">' + esc(t('print.note')) + '</p></section>';

    for (var r = 0; r < rowsN; r++) for (var c = 0; c < cols; c++) {
      html += '<section class="pp"><p class="ph">' + esc(t('print.page', { a: r * cols + c + 1, b: cols * rowsN, c1: c * PAGE_W + 1,
        c2: Math.min(w, (c + 1) * PAGE_W), r1: r * PAGE_H + 1, r2: Math.min(h, (r + 1) * PAGE_H) })) + '</p><img class="chart" src="' +
        pageImage(c * PAGE_W, r * PAGE_H, Math.min(PAGE_W, w - c * PAGE_W), Math.min(PAGE_H, h - r * PAGE_H), bw) + '" alt="' + esc(t('print.alt.page')) + '"></section>';
    }
    root.innerHTML = html;
    setTimeout(function () { window.print(); }, 300);
  }
  function pageImage(x0, y0, pw, ph, bw) {
    var m = 30, cv = document.createElement('canvas');
    cv.width = pw * PCELL + m + 4; cv.height = ph * PCELL + m + 4;
    var g = cv.getContext('2d');
    g.fillStyle = '#fff'; g.fillRect(0, 0, cv.width, cv.height);
    g.save(); g.translate(m, m);
    g.font = 'bold ' + Math.floor(PCELL * 0.72) + 'px monospace'; g.textAlign = 'center'; g.textBaseline = 'middle';
    for (var y = 0; y < ph; y++) for (var x = 0; x < pw; x++) {
      var v = pat.grid[(y0 + y) * pat.width + x0 + x]; if (v === 65535) continue;
      var p = pat.palette[v];
      if (!bw) { g.fillStyle = rgbCss(p.rgb); g.fillRect(x * PCELL, y * PCELL, PCELL, PCELL); }
      g.fillStyle = bw ? '#000' : textColor(p.rgb);
      g.fillText(p.symbol, x * PCELL + PCELL / 2, y * PCELL + PCELL / 2 + 1);
    }
    for (x = 0; x <= pw; x++) {
      var bold = (x0 + x) % 10 === 0;
      g.fillStyle = bold ? '#000' : '#999'; g.fillRect(x * PCELL - (bold ? 1 : 0), 0, bold ? 3 : 1, ph * PCELL);
    }
    for (y = 0; y <= ph; y++) {
      bold = (y0 + y) % 10 === 0;
      g.fillStyle = bold ? '#000' : '#999'; g.fillRect(0, y * PCELL - (bold ? 1 : 0), pw * PCELL, bold ? 3 : 1);
    }
    g.restore();
    g.fillStyle = '#000'; g.font = '16px sans-serif'; g.textAlign = 'center';
    for (x = 0; x <= pw; x++) if ((x0 + x) % 10 === 0 && x0 + x > 0) g.fillText(x0 + x, m + x * PCELL, 18);
    g.textAlign = 'right';
    for (y = 0; y <= ph; y++) if ((y0 + y) % 10 === 0 && y0 + y > 0) g.fillText(y0 + y, m - 4, m + y * PCELL + 5);
    return cv.toDataURL('image/png');
  }
  $('print').addEventListener('click', printChart);
  // Vector PDF (symbols as text): same free and paid rules as printing.
  $('pdf').addEventListener('click', function () {
    if (!pat) return;
    if (!isFree() && !unlocked()) { openBuy(); return; }
    var btn = $('pdf');
    btn.disabled = true; setMsg(btn, 'pdf.preparing');
    track(unlocked() ? 'pdf_paid' : 'pdf_free');
    window.FlossPDF.download(pat, { bw: $('style').value === 'bw', fabric: +$('fabric').value, skeins: window.FlossPattern.skeins })
      .catch(function () { $('gateNote').textContent = t('pdf.error'); })
      .then(function () { btn.disabled = false; setMsg(btn, 'btn.pdf'); });
  });
  $('printNow').addEventListener('click', function () { closeModal(); printChart(); });
  $('pdfNow').addEventListener('click', function () { closeModal(); $('pdf').click(); });

  // ---------- Buying with PayPal ----------
  var sdkLoading = null;
  var PP_LOCALE = { de: 'de_DE', fr: 'fr_FR', es: 'es_ES' };  // English: PayPal picks the buyer's own locale
  function loadSdk() {
    if (sdkLoading) return sdkLoading;
    sdkLoading = new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = 'https://www.paypal.com/sdk/js?client-id=' + encodeURIComponent(cfg.PAYPAL_CLIENT_ID) +
        '&currency=' + encodeURIComponent(cfg.CURRENCY) + '&intent=capture' + (PP_LOCALE[I.lang] ? '&locale=' + PP_LOCALE[I.lang] : '');
      s.onload = resolve; s.onerror = function () { sdkLoading = null; reject(new Error('PayPal could not load')); };
      document.head.appendChild(s);
    });
    return sdkLoading;
  }
  // The buyer ticks the consent box, then presses the own order button (Section 312j(3) BGB,
  // noble-order.js). Only that click loads the PayPal SDK and shows the buttons.
  var buttonsShown = false, order = null;
  function showButtons() {
    if (buttonsShown) return;
    buttonsShown = true;
    $('ppButtons').innerHTML = '<p class="small" data-i18n="pp.loading">' + esc(t('pp.loading')) + '</p>';
    loadSdk().then(function () {
      $('ppButtons').innerHTML = '';
      return window.paypal.Buttons({
        style: { layout: 'vertical', label: 'buynow' },
        createOrder: function (data, actions) {
          track('checkout_start');
          return actions.order.create({
            purchase_units: [{ description: cfg.PRODUCT_NAME, amount: { currency_code: cfg.CURRENCY, value: cfg.PRICE } }],
            application_context: { shipping_preference: 'NO_SHIPPING' }
          });
        },
        onApprove: function (data, actions) {
          return actions.order.capture().then(function (order) {
            var id = order.id || data.orderID;
            store(function (s) { s.setItem(UNLOCK_KEY, JSON.stringify({ orderId: id, env: cfg.PAYPAL_ENV, at: new Date().toISOString() })); });
            track(cfg.PAYPAL_ENV === 'live' ? 'payment_complete' : 'payment_complete_sandbox');
            $('orderId').textContent = id;
            // The order confirmation (Section 312f BGB) is offered at the top of the thank-you view.
            return window.NobleOrder.confirm({
              lang: I.lang, business: 'FlossChart', product: cfg.PRODUCT_NAME, price: cfg.PRICE, currency: cfg.CURRENCY,
              orderId: id, consentText: $('consent').closest('label').textContent.trim(), email: cfg.SUPPORT_EMAIL || '',
              termsUrl: I.page('terms'), withdrawalUrl: I.page('refund'), withdrawUrl: I.page('withdraw'), mount: $('mThanks')
            }).catch(function () {}).then(function () {
              $('mBuy').hidden = true; $('mThanks').hidden = false;
              updateGate();
            });
          });
        },
        onCancel: function () { track('checkout_cancel'); },
        onError: function (err) { setMsg($('payErr'), 'pay.err'); console.error(err); }
      }).render('#ppButtons');
    }).catch(function () {
      buttonsShown = false;
      $('ppButtons').innerHTML = '<p class="small" data-i18n="pp.error">' + esc(t('pp.error')) + '</p>';
      if (order) order.button.hidden = false;
    });
  }
  function openBuy() {
    track('buy_open');
    $('mBuy').hidden = false; $('mThanks').hidden = true; setMsg($('payErr'), '');
    $('modal').hidden = false;
  }
  function closeModal() { $('modal').hidden = true; }
  order = window.NobleOrder.gate({
    consent: $('consent'), paypal: $('ppButtons'), lang: I.lang, price: cfg.PRICE, currency: cfg.CURRENCY,
    onOrder: showButtons
  });
  $('buy').addEventListener('click', openBuy);
  $('buy2').addEventListener('click', openBuy);
  $('mClose').addEventListener('click', closeModal);
  $('modal').addEventListener('click', function (e) { if (e.target === $('modal')) closeModal(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });

  // Re-draw everything that app.js writes itself when the language changes (and once at start).
  I.onChange(function () { fillSupport(); order.setLang(I.lang); if (pat) render(); else updateGate(); });
  fillSupport();
  updateGate();
})();
