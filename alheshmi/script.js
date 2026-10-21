/* Al Heshmi Coffee — Links: logo pour (replay on tap) + share */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var wrap = document.getElementById('logo');

  function stagger() {
    Array.prototype.forEach.call(wrap.querySelectorAll('.dot'), function (d, i) {
      d.style.setProperty('--d', (1.45 + i * 0.1).toFixed(2) + 's');
    });
    Array.prototype.forEach.call(wrap.querySelectorAll('.lt'), function (l, i) {
      l.style.setProperty('--d', (1.6 + i * 0.07).toFixed(2) + 's');
    });
  }
  function play() {
    if (reduce || !wrap) return;
    wrap.classList.remove('play');
    void wrap.getBoundingClientRect();
    stagger();
    wrap.classList.add('play');
  }
  if (wrap) {
    play();
    wrap.addEventListener('click', play);
    wrap.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); play(); }
    });
  }

  var btn = document.getElementById('share');
  var toast = document.getElementById('toast');
  function note(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(note.t);
    note.t = setTimeout(function () { toast.classList.remove('show'); }, 2200);
  }
  if (btn) btn.addEventListener('click', function () {
    var data = { title: 'Al Heshmi Coffee | الحشمي', url: location.href.split('?')[0] };
    if (navigator.share) navigator.share(data).catch(function () {});
    else if (navigator.clipboard) navigator.clipboard.writeText(data.url).then(function () { note('Link copied ☕'); }, function () { note(data.url); });
    else note(data.url);
  });
})();
