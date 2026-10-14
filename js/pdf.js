// Vector PDF export: symbols as real text, grid as lines. jsPDF loads only when someone clicks "Download PDF".
(function () {
  'use strict';
  var JSPDF_URL = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
  var JSPDF_SRI = 'sha384-JcnsjUPPylna1s1fvi1u12X5qjY5OL56iySh75FdtrwhO/SWXgMjoVqcKyIIWOLk';
  var loading = null;

  function loadLib() {
    if (window.jspdf) return Promise.resolve(window.jspdf);
    if (loading) return loading;
    loading = new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = JSPDF_URL; s.integrity = JSPDF_SRI; s.crossOrigin = 'anonymous';
      s.onload = function () { resolve(window.jspdf); };
      s.onerror = function () { loading = null; reject(new Error('PDF library could not load')); };
      document.head.appendChild(s);
    });
    return loading;
  }

  var PAGE_W = 50, PAGE_H = 65;       // stitches per chart page (same as the print view)
  var M = 12, CELL = 3.6;             // mm: page margin, cell size (50 x 3.6 = 180 mm wide on A4)

  function fmt(n, d) { var s = n.toFixed(d); return window.I18N && window.I18N.lang !== 'en' ? s.replace('.', ',') : s; }
  function thousands(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
  function dark(rgb) { return (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) <= 140; }

  // pat: output of FlossPattern.generate. opts: { bw, fabric, skeins(count, fabric) }
  function build(jspdf, pat, opts) {
    var doc = new jspdf.jsPDF({ unit: 'mm', format: 'a4', compress: true });
    var w = pat.width, h = pat.height, cols = Math.ceil(w / PAGE_W), rows = Math.ceil(h / PAGE_H);
    var t = window.I18N.t;
    doc.setProperties({ title: t('pdf.title', { w: w, h: h }), creator: 'FlossChart' });

    // Cover: sizes and floss key.
    doc.setFont('helvetica', 'bold'); doc.setFontSize(18); doc.text(t('print.title'), M, M + 6);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10);
    doc.text(t('print.sub', { w: w, h: h, n: pat.palette.length, p: cols * rows }), M, M + 13);
    doc.text(t('print.size') + ' ' + [11, 14, 16, 18].map(function (c) {
      return t('size.item.pdf', { c: c, a: fmt(w / c * 2.54, 1), b: fmt(h / c * 2.54, 1) });
    }).join(', '), M, M + 19);
    var y = M + 29;
    function keyHeader() {
      doc.setFont('helvetica', 'bold');
      [t('tbl.sym.short'), t('tbl.color'), 'DMC', t('tbl.name'), t('tbl.stitches'), t('tbl.skeinsf', { f: opts.fabric })].forEach(function (t, i) { doc.text(t, M + [0, 12, 26, 44, 130, 155][i], y); });
      doc.setFont('helvetica', 'normal'); y += 6;
    }
    keyHeader();
    pat.palette.forEach(function (p) {
      if (y > 285) { doc.addPage(); y = M + 6; keyHeader(); }
      doc.setFont('courier', 'bold'); doc.setFontSize(11); doc.text(p.symbol, M + 1, y);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(10);
      doc.setFillColor(p.rgb[0], p.rgb[1], p.rgb[2]); doc.setDrawColor(120); doc.rect(M + 12, y - 3.5, 9, 4.2, 'FD');
      doc.text(String(p.dmc), M + 26, y); doc.text(String(p.name), M + 44, y);
      doc.text(thousands(p.count), M + 130, y); doc.text(String(opts.skeins(p.count, opts.fabric)), M + 155, y);
      y += 5.5;
    });
    doc.setFontSize(8);
    doc.text(t('pdf.note'), M, Math.min(y + 4, 290));

    // Chart pages.
    for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) {
      doc.addPage();
      var x0 = c * PAGE_W, y0 = r * PAGE_H, pw = Math.min(PAGE_W, w - x0), ph = Math.min(PAGE_H, h - y0);
      var ox = M + 6, oy = M + 10;
      doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(0);
      doc.text(t('print.page', { a: r * cols + c + 1, b: cols * rows, c1: x0 + 1, c2: x0 + pw, r1: y0 + 1, r2: y0 + ph }), M, M);
      // Cell fills.
      if (!opts.bw) {
        for (var yy = 0; yy < ph; yy++) for (var xx = 0; xx < pw; xx++) {
          var v = pat.grid[(y0 + yy) * w + x0 + xx]; if (v === 65535) continue;
          var rgb = pat.palette[v].rgb; doc.setFillColor(rgb[0], rgb[1], rgb[2]);
          doc.rect(ox + xx * CELL, oy + yy * CELL, CELL, CELL, 'F');
        }
      }
      // Symbols as text.
      doc.setFont('courier', 'bold'); doc.setFontSize(CELL * 2.2);
      for (yy = 0; yy < ph; yy++) for (xx = 0; xx < pw; xx++) {
        v = pat.grid[(y0 + yy) * w + x0 + xx]; if (v === 65535) continue;
        var pal = pat.palette[v];
        doc.setTextColor(!opts.bw && dark(pal.rgb) ? 255 : 0);
        doc.text(pal.symbol, ox + xx * CELL + CELL / 2, oy + yy * CELL + CELL / 2, { align: 'center', baseline: 'middle' });
      }
      doc.setTextColor(0);
      // Grid lines: thin every stitch, bold every 10.
      for (xx = 0; xx <= pw; xx++) {
        var bold = (x0 + xx) % 10 === 0;
        doc.setLineWidth(bold ? 0.45 : 0.08); doc.setDrawColor(bold ? 0 : 140);
        doc.line(ox + xx * CELL, oy, ox + xx * CELL, oy + ph * CELL);
      }
      for (yy = 0; yy <= ph; yy++) {
        bold = (y0 + yy) % 10 === 0;
        doc.setLineWidth(bold ? 0.45 : 0.08); doc.setDrawColor(bold ? 0 : 140);
        doc.line(ox, oy + yy * CELL, ox + pw * CELL, oy + yy * CELL);
      }
      // Axis numbers at every 10th stitch.
      doc.setFont('helvetica', 'normal'); doc.setFontSize(6);
      for (xx = 1; xx <= pw; xx++) if ((x0 + xx) % 10 === 0) doc.text(String(x0 + xx), ox + xx * CELL, oy - 1.5, { align: 'center' });
      for (yy = 1; yy <= ph; yy++) if ((y0 + yy) % 10 === 0) doc.text(String(y0 + yy), ox - 1.5, oy + yy * CELL, { align: 'right', baseline: 'middle' });
    }
    return doc;
  }

  function download(pat, opts) {
    return loadLib().then(function (jspdf) {
      var doc = build(jspdf, pat, opts);
      doc.save('flosschart-' + pat.width + 'x' + pat.height + '.pdf');
      return doc;
    });
  }

  window.FlossPDF = { download: download, build: build, loadLib: loadLib };
})();
