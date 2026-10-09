/* ===========================================
   COLART LINKS — rendering
   Reads window.COLART_CLIENTS (clients.js).
   No edits needed here when adding clients.
=========================================== */
(function () {
  'use strict';

  var CLIENTS = (window.COLART_CLIENTS || []).filter(function (c) { return c && c.slug && c.name; });

  // Colart palette, in the order it appears around the logo
  var PALETTE = {
    teal:    { c: '#50a0b4', ink: '#ffffff' },
    mint:    { c: '#64a08c', ink: '#ffffff' },
    magenta: { c: '#c81478', ink: '#ffffff' },
    yellow:  { c: '#dcdc3c', ink: '#1a1424' },
    lime:    { c: '#8cb43c', ink: '#ffffff' },
    purple:  { c: '#642878', ink: '#ffffff' }
  };
  var ORDER = ['purple', 'magenta', 'teal', 'lime', 'mint', 'yellow'];

  CLIENTS.forEach(function (c, i) {
    c._accent = PALETTE[c.accent] || PALETTE[ORDER[i % ORDER.length]];
    if (c.logo === undefined) c.logo = c.slug + '/assets/logo.svg';
  });

  // Each profile is a folder: /slug/ online, /slug/index.html when opened locally
  var LOCAL = location.protocol === 'file:';
  function profileUrl(c) { return c.slug + (LOCAL ? '/index.html' : '/'); }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  }
  function initials(name) {
    var w = String(name).replace(/[^\p{L}\p{N}\s]/gu, '').trim().split(/\s+/);
    return ((w[0] || '')[0] + (w.length > 1 ? w[1][0] : (w[0] || '')[1] || '')).toUpperCase();
  }
  // Lowercase, strip Latin accents and Arabic diacritics, unify alef/ya/ta marbuta
  function norm(s) {
    return String(s || '').toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[\u064B-\u0652\u0640]/g, '')
      .replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه')
      .replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  }
  function styleVars(c) { return '--accent:' + c._accent.c + ';--accent-ink:' + c._accent.ink; }

  function avatarHTML(c) {
    var inner = c.logo
      ? '<span class="avatar-in has-img"><img src="' + esc(c.logo) + '" alt="" loading="lazy" decoding="async"' +
        (c.logoFit === 'contain' ? ' class="contain"' : '') +
        ' onerror="this.parentNode.classList.remove(\'has-img\');this.parentNode.textContent=\'' + esc(initials(c.name)) + '\'"></span>'
      : '<span class="avatar-in">' + esc(initials(c.name)) + '</span>';
    return '<span class="avatar" aria-hidden="true">' + inner + '</span>';
  }

  var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  /* ---------- DIRECTORY PAGE ---------- */
  function initDirectory() {
    var grid = document.getElementById('grid');
    var input = document.getElementById('q');
    var filters = document.getElementById('filters');
    var empty = document.getElementById('empty');
    var emptyTerm = document.getElementById('empty-term');
    var countEl = document.getElementById('count');
    var status = document.getElementById('status');
    var activeCat = 'All';

    // Cards
    grid.innerHTML = CLIENTS.map(function (c) {
      c._search = norm([c.name, c.nameAr, c.category, c.slug].join(' '));
      return '<li data-slug="' + esc(c.slug) + '">' +
        '<a class="card" href="' + esc(profileUrl(c)) + '" style="' + styleVars(c) + '"' +
        ' aria-label="' + esc(c.name + ', ' + c.category + ': view links') + '">' +
          '<span class="card-node" aria-hidden="true"><i></i><i></i><i></i></span>' +
          avatarHTML(c) +
          '<span class="card-body">' +
            '<span class="card-name">' + esc(c.name) + '</span>' +
            (c.nameAr ? '<span class="card-name-ar" lang="ar" dir="rtl">' + esc(c.nameAr) + '</span>' : '') +
            '<span class="card-cat">' + esc(c.category) + '</span>' +
          '</span>' +
          '<span class="card-cta"><span class="lbl">View links</span><span class="arrow-wrap">' + ARROW + '</span></span>' +
        '</a></li>';
    }).join('');
    var items = Array.prototype.slice.call(grid.children);

    // Count
    var n = CLIENTS.length;
    countEl.innerHTML = '<b>' + n + '</b> ' + (n === 1 ? 'profile' : 'profiles') + ' in the Colart ecosystem';

    // Category chips (only when there is more than one category)
    var cats = [];
    CLIENTS.forEach(function (c) { if (c.category && cats.indexOf(c.category) < 0) cats.push(c.category); });
    if (cats.length > 1) {
      filters.innerHTML = ['All'].concat(cats).map(function (cat) {
        return '<button type="button" class="chip" aria-pressed="' + (cat === 'All') + '" data-cat="' + esc(cat) + '">' + esc(cat) + '</button>';
      }).join('');
      filters.addEventListener('click', function (e) {
        var b = e.target.closest('.chip');
        if (!b) return;
        activeCat = b.getAttribute('data-cat');
        filters.querySelectorAll('.chip').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
        apply();
      });
    } else {
      filters.hidden = true;
    }

    function apply() {
      var q = norm(input.value);
      var terms = q ? q.split(' ') : [];
      var shown = 0;
      CLIENTS.forEach(function (c, i) {
        var okCat = activeCat === 'All' || c.category === activeCat;
        var okQ = terms.every(function (t) { return c._search.indexOf(t) > -1; });
        var vis = okCat && okQ;
        items[i].hidden = !vis;
        if (vis) shown++;
      });
      empty.classList.toggle('show', shown === 0);
      emptyTerm.textContent = input.value.trim() ? '“' + input.value.trim() + '”' : 'this filter';
      status.textContent = shown + (shown === 1 ? ' profile' : ' profiles') + ' shown';
      // Keep ?q= in the URL so searches can be shared
      try {
        var u = new URL(location.href);
        if (input.value.trim()) u.searchParams.set('q', input.value.trim()); else u.searchParams.delete('q');
        history.replaceState(null, '', u);
      } catch (e) {}
    }

    var t;
    input.addEventListener('input', function () { clearTimeout(t); t = setTimeout(apply, 80); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { input.value = ''; apply(); }
      if (e.key === 'Enter') {
        var first = items.filter(function (li) { return !li.hidden; })[0];
        if (first) first.querySelector('a').click();
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === '/' && document.activeElement !== input && !/input|textarea/i.test(document.activeElement.tagName)) {
        e.preventDefault(); input.focus();
      }
    });
    document.getElementById('clear').addEventListener('click', function () {
      input.value = ''; activeCat = 'All';
      filters.querySelectorAll('.chip').forEach(function (x) { x.setAttribute('aria-pressed', x.getAttribute('data-cat') === 'All'); });
      apply(); input.focus();
    });

    try {
      var pre = new URL(location.href).searchParams.get('q');
      if (pre) { input.value = pre; apply(); }
    } catch (e) {}

    buildEcosystem();
  }

  /* Hero visual: client nodes branching off the Colart "C",
     echoing the connector dots on the left of the logo. */
  function buildEcosystem() {
    var host = document.getElementById('eco');
    if (!host || !window.matchMedia('(min-width: 900px)').matches) return;

    var W = 560, H = 540, cx = 360, cy = 270;
    var nodes = CLIENTS.slice(0, 8);
    var k = nodes.length;
    var span = Math.min(150, 40 + k * 22);             // degrees of arc used
    var start = 180 - span / 2;
    var R = 235, rIn = 148;
    var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Colart Links ecosystem">';

    svg += '<image class="eco-mark" href="assets/colart-mark.svg" x="' + (cx - 135) + '" y="' + (cy - 128) + '" width="270" height="257"/>';

    nodes.forEach(function (c, i) {
      var a = (start + (k === 1 ? span / 2 : (span * i) / (k - 1))) * Math.PI / 180;
      var x1 = cx + rIn * Math.cos(a), y1 = cy + rIn * Math.sin(a);
      var x2 = cx + R * Math.cos(a), y2 = cy + R * Math.sin(a);
      var len = Math.hypot(x2 - x1, y2 - y1) - 30;
      var ex = x1 + (x2 - x1) * (len / (len + 30)), ey = y1 + (y2 - y1) * (len / (len + 30));
      var col = c._accent.c, d = (0.25 + i * 0.12).toFixed(2) + 's';
      var mx = (x1 + ex) / 2, my = (y1 + ey) / 2;
      svg += '<path class="eco-line" d="M' + x1.toFixed(1) + ' ' + y1.toFixed(1) + 'L' + ex.toFixed(1) + ' ' + ey.toFixed(1) + '" stroke="' + col + '" style="--len:' + len.toFixed(0) + ';--d:' + d + '"/>';
      svg += '<circle class="eco-dot" cx="' + x1.toFixed(1) + '" cy="' + y1.toFixed(1) + '" r="5" fill="' + col + '" style="--d:' + d + '"/>';
      svg += '<circle class="eco-dot" cx="' + mx.toFixed(1) + '" cy="' + my.toFixed(1) + '" r="3.5" fill="' + col + '" style="--d:' + d + '"/>';
      svg += '<a href="' + esc(profileUrl(c)) + '" tabindex="-1" aria-hidden="true">' +
        '<g class="eco-node" style="--d:' + d + '">' +
          '<title>' + esc(c.name) + '</title>' +
          '<circle cx="' + x2.toFixed(1) + '" cy="' + y2.toFixed(1) + '" r="30" stroke="' + col + '"/>' +
          (c.logo
            ? '<clipPath id="eco-c' + i + '"><circle cx="' + x2.toFixed(1) + '" cy="' + y2.toFixed(1) + '" r="27"/></clipPath>' +
              (c.logoFit === 'contain'
                ? '<image href="' + esc(c.logo) + '" x="' + (x2 - 19).toFixed(1) + '" y="' + (y2 - 19).toFixed(1) + '" width="38" height="38" preserveAspectRatio="xMidYMid meet"/>'
                : '<image href="' + esc(c.logo) + '" clip-path="url(#eco-c' + i + ')" x="' + (x2 - 27).toFixed(1) + '" y="' + (y2 - 27).toFixed(1) + '" width="54" height="54" preserveAspectRatio="xMidYMid slice"/>')
            : '<text x="' + x2.toFixed(1) + '" y="' + y2.toFixed(1) + '" fill="' + (c._accent.ink === '#ffffff' ? col : '#1a1424') + '">' + esc(initials(c.name)) + '</text>') +
        '</g></a>';
    });
    host.innerHTML = svg + '</svg>';
  }

  function initFooterYear() {
    var y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  }

  document.addEventListener('DOMContentLoaded', function () {
    initFooterYear();
    if (document.getElementById('grid')) initDirectory();
  });
})();
