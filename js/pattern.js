// Pattern engine: photo pixels in, DMC cross-stitch grid out. Runs fully in the browser.
(function () {
  'use strict';

  var LIN = new Float32Array(256);
  for (var i = 0; i < 256; i++) {
    var c = i / 255;
    LIN[i] = c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  }
  function f(t) { return t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116; }
  function rgbToLab(r, g, b) {
    var R = LIN[r], G = LIN[g], B = LIN[b];
    var x = f((R * 0.4124564 + G * 0.3575761 + B * 0.1804375) / 0.95047);
    var y = f(R * 0.2126729 + G * 0.7151522 + B * 0.072175);
    var z = f((R * 0.0193339 + G * 0.119192 + B * 0.9503041) / 1.08883);
    return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
  }
  function d2(a, ai, b, bi) {
    var x = a[ai] - b[bi], y = a[ai + 1] - b[bi + 1], z = a[ai + 2] - b[bi + 2];
    return x * x + y * y + z * z;
  }

  // Symbols used on printed charts. Chosen to be easy to tell apart.
  var SYMBOLS = '+XO#=%@*S$&?<>/\\^~ABCDEFGHJKLMNPQRTUVWYZ23456789abdefghkmnpqrstuwyz'.split('');

  var dmcLab = null;
  function dmc() {
    if (!dmcLab) {
      dmcLab = new Float32Array(window.DMC.length * 3);
      window.DMC.forEach(function (d, k) {
        var l = rgbToLab(d[2], d[3], d[4]);
        dmcLab[k * 3] = l[0]; dmcLab[k * 3 + 1] = l[1]; dmcLab[k * 3 + 2] = l[2];
      });
    }
    return dmcLab;
  }
  function nearest(lab, li, set, setLab) {
    var best = 0, bd = Infinity;
    for (var k = 0; k < set.length; k++) {
      var dd = d2(lab, li, setLab, k * 3);
      if (dd < bd) { bd = dd; best = k; }
    }
    return best;
  }

  // Seeded random so the same photo and settings give the same pattern.
  function rng(seed) {
    return function () { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  }

  function kmeans(lab, n, k, rand) {
    var cent = new Float32Array(k * 3), dist = new Float32Array(n).fill(Infinity);
    var first = Math.floor(rand() * n);
    cent.set(lab.subarray(first * 3, first * 3 + 3), 0);
    for (var c = 1; c < k; c++) {
      var sum = 0;
      for (var p = 0; p < n; p++) {
        var dd = d2(lab, p * 3, cent, (c - 1) * 3);
        if (dd < dist[p]) dist[p] = dd;
        sum += dist[p];
      }
      var r = rand() * sum, pick = n - 1;
      for (p = 0; p < n; p++) { r -= dist[p]; if (r <= 0) { pick = p; break; } }
      cent.set(lab.subarray(pick * 3, pick * 3 + 3), c * 3);
    }
    var assign = new Int32Array(n), acc = new Float64Array(k * 4);
    for (var it = 0; it < 12; it++) {
      acc.fill(0);
      for (p = 0; p < n; p++) {
        var best = 0, bd = Infinity;
        for (c = 0; c < k; c++) { var e = d2(lab, p * 3, cent, c * 3); if (e < bd) { bd = e; best = c; } }
        assign[p] = best;
        acc[best * 4] += lab[p * 3]; acc[best * 4 + 1] += lab[p * 3 + 1]; acc[best * 4 + 2] += lab[p * 3 + 2]; acc[best * 4 + 3]++;
      }
      for (c = 0; c < k; c++) {
        var m = acc[c * 4 + 3];
        if (m) { cent[c * 3] = acc[c * 4] / m; cent[c * 3 + 1] = acc[c * 4 + 1] / m; cent[c * 3 + 2] = acc[c * 4 + 2] / m; }
      }
    }
    return cent;
  }

  // Replace lone stitches ("confetti") with the most common neighbour colour.
  function cleanConfetti(grid, w, h, maxSame) {
    var out = grid.slice(), changed = 0;
    var counts = {};
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var i = y * w + x, v = grid[i];
        if (v === 65535) continue;
        var same = 0, best = -1, bc = 0;
        counts = {};
        for (var dy = -1; dy <= 1; dy++) {
          for (var dx = -1; dx <= 1; dx++) {
            if (!dx && !dy) continue;
            var xx = x + dx, yy = y + dy;
            if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue;
            var n = grid[yy * w + xx];
            if (n === 65535) continue;
            if (n === v) { same++; continue; }
            counts[n] = (counts[n] || 0) + 1;
            if (counts[n] > bc) { bc = counts[n]; best = n; }
          }
        }
        if (same <= maxSame && best >= 0) { out[i] = best; changed++; }
      }
    }
    return { grid: out, changed: changed };
  }

  // Stitches with no same-colour neighbour in the 8 cells around them.
  function countLone(grid, w, h) {
    var n = 0;
    for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) {
      var v = grid[y * w + x], lone = v !== 65535;
      for (var dy = -1; dy <= 1 && lone; dy++) for (var dx = -1; dx <= 1; dx++) {
        if ((dx || dy) && x + dx >= 0 && y + dy >= 0 && x + dx < w && y + dy < h && grid[(y + dy) * w + x + dx] === v) { lone = false; break; }
      }
      if (lone) n++;
    }
    return n;
  }

  // opts: { maxColors, cleanup: 0|1|2 }
  function generate(img, opts) {
    var w = img.width, h = img.height, px = img.data, total = w * h;
    var lab = new Float32Array(total * 3), opaque = [];
    for (var p = 0; p < total; p++) {
      if (px[p * 4 + 3] < 128) continue;
      var l = rgbToLab(px[p * 4], px[p * 4 + 1], px[p * 4 + 2]);
      lab[p * 3] = l[0]; lab[p * 3 + 1] = l[1]; lab[p * 3 + 2] = l[2];
      opaque.push(p);
    }
    var grid = new Uint16Array(total).fill(65535);
    if (!opaque.length) return { width: w, height: h, grid: grid, palette: [] };

    var rand = rng(12345), sampleN = Math.min(opaque.length, 24000);
    var sample = new Float32Array(sampleN * 3);
    for (var s = 0; s < sampleN; s++) {
      var src = opaque[sampleN === opaque.length ? s : Math.floor(rand() * opaque.length)];
      sample.set(lab.subarray(src * 3, src * 3 + 3), s * 3);
    }
    var k = Math.max(1, Math.min(opts.maxColors, sampleN));
    var cent = kmeans(sample, sampleN, k, rand);

    // Map each cluster centre to its nearest DMC floss, drop duplicates.
    var D = dmc(), chosen = [];
    for (var c = 0; c < k; c++) {
      var di = nearest(cent, c * 3, window.DMC, D);
      if (chosen.indexOf(di) < 0) chosen.push(di);
    }
    var chosenLab = new Float32Array(chosen.length * 3);
    chosen.forEach(function (di, j) { chosenLab.set(D.subarray(di * 3, di * 3 + 3), j * 3); });
    opaque.forEach(function (q) { grid[q] = nearest(lab, q * 3, chosen, chosenLab); });

    if (opts.cleanup > 0) {
      for (var pass = 0; pass < 2; pass++) grid = cleanConfetti(grid, w, h, opts.cleanup === 2 ? 1 : 0).grid;
    }

    // Count, merge very rare colours on strong cleanup, build palette.
    var counts = new Array(chosen.length).fill(0);
    grid.forEach(function (v) { if (v !== 65535) counts[v]++; });
    if (opts.cleanup === 2) {
      var minCount = Math.max(3, Math.round(opaque.length * 0.002));
      var keep = chosen.map(function (_, j) { return counts[j] >= minCount; });
      if (keep.some(Boolean)) {
        var remap = chosen.map(function (_, j) {
          if (keep[j]) return j;
          var best = j, bd = Infinity;
          for (var t = 0; t < chosen.length; t++) {
            if (!keep[t]) continue;
            var dd = d2(chosenLab, j * 3, chosenLab, t * 3);
            if (dd < bd) { bd = dd; best = t; }
          }
          return best;
        });
        for (var g = 0; g < grid.length; g++) if (grid[g] !== 65535) grid[g] = remap[grid[g]];
        grid = cleanConfetti(grid, w, h, 0).grid;
        counts.fill(0);
        grid.forEach(function (v) { if (v !== 65535) counts[v]++; });
      }
    }
    // Sort used colours by stitch count, most used first, and give each a symbol.
    var used = chosen.map(function (di, j) { return { j: j, di: di, count: counts[j] }; })
      .filter(function (u) { return u.count > 0; })
      .sort(function (a, b) { return b.count - a.count; });
    var newIndex = {};
    var palette = used.map(function (u, n) {
      newIndex[u.j] = n;
      var d = window.DMC[u.di];
      return { dmc: d[0], name: d[1], rgb: [d[2], d[3], d[4]], count: u.count, symbol: SYMBOLS[n % SYMBOLS.length] };
    });
    for (var q = 0; q < grid.length; q++) if (grid[q] !== 65535) grid[q] = newIndex[grid[q]];
    return { width: w, height: h, grid: grid, palette: palette, confetti: countLone(grid, w, h) };
  }

  // Thread estimate. A full cross on 14 count uses about 0.88 cm of 2-strand floss
  // (two diagonals plus travel on the back). One skein is 8 m of 6 strands = 24 m of
  // 2-strand floss = about 2.740 stitches. We allow 35% waste: about 1.800 stitches per skein on 14 count.
  function skeins(count, fabricCount) {
    var perSkein = 1800 * (fabricCount / 14);
    return Math.max(1, Math.ceil(count / perSkein));
  }

  window.FlossPattern = { generate: generate, skeins: skeins, rgbToLab: rgbToLab, SYMBOLS: SYMBOLS };
})();
