/* Leil Coffee — Links: pour animation (replay on tap) + share */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mark = document.getElementById('mark');

  function stagger() {
    var bars = mark.querySelectorAll('.bar'), dots = mark.querySelectorAll('.dot'), letters = mark.querySelectorAll('.letter');
    // centre stroke first, then the two outer strokes
    var order = [1, 0, 2];
    Array.prototype.forEach.call(bars, function (b, i) { b.style.setProperty('--d', (0.15 + order.indexOf(i) * 0.18).toFixed(2) + 's'); });
    Array.prototype.forEach.call(dots, function (d, i) { d.style.setProperty('--d', (0.85 + i * 0.12).toFixed(2) + 's'); });
    Array.prototype.forEach.call(letters, function (l, i) { l.style.setProperty('--d', (1.05 + i * 0.07).toFixed(2) + 's'); });
  }
  function play() {
    if (reduce || !mark) return;
    mark.classList.remove('play');
    void mark.getBoundingClientRect();
    stagger();
    mark.classList.add('play');
  }
  if (mark) {
    play();
    mark.addEventListener('click', play);
    mark.addEventListener('keydown', function (e) {
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
    var data = { title: 'Leil Coffee | ليل', url: location.href.split('?')[0] };
    if (navigator.share) navigator.share(data).catch(function () {});
    else if (navigator.clipboard) navigator.clipboard.writeText(data.url).then(function () { note('Link copied ☕'); }, function () { note(data.url); });
    else note(data.url);
  });
})();
