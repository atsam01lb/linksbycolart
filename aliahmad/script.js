/* Ali Ahmad — Links: live equalizer, reveal on scroll, share */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* stagger the AHMAD letters */
  Array.prototype.forEach.call(document.querySelectorAll('.logo .ah'), function (p, i) {
    p.style.setProperty('--d', (1.75 + i * 0.09).toFixed(2) + 's');
  });

  /* equalizer bars: each with its own height and tempo */
  var eq = document.getElementById('eq');
  if (eq) {
    var n = 28, html = '';
    for (var i = 0; i < n; i++) {
      var mid = 1 - Math.abs(i - (n - 1) / 2) / (n / 2);          // taller in the centre
      var h = (0.35 + mid * 0.6 + Math.random() * 0.15).toFixed(2);
      var t = (0.45 + Math.random() * 0.6).toFixed(2);
      var d = (Math.random() * -1).toFixed(2);
      html += '<i style="--h:' + h + ';--t:' + t + 's;--d:' + d + 's"></i>';
    }
    eq.innerHTML = html;
  }

  /* reveal sections */
  var items = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
  } else {
    var first = true, k = 0;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.style.setProperty('--rd', first ? (2.9 + (k++) * 0.06).toFixed(2) + 's' : '0s');
        en.target.classList.add('in');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -30px 0px' });
    items.forEach(function (el) { io.observe(el); });
    setTimeout(function () { first = false; }, 3400);
  }

  /* share */
  var btn = document.getElementById('share');
  var toast = document.getElementById('toast');
  function note(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(note.t);
    note.t = setTimeout(function () { toast.classList.remove('show'); }, 2200);
  }
  if (btn) btn.addEventListener('click', function () {
    var data = { title: 'Ali Ahmad (Official)', url: location.href.split('?')[0] };
    if (navigator.share) navigator.share(data).catch(function () {});
    else if (navigator.clipboard) navigator.clipboard.writeText(data.url).then(function () { note('Link copied 🎵'); }, function () { note(data.url); });
    else note(data.url);
  });
})();
