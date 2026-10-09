/* Fianchetto — Links: replay the knight's move, share */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mark = document.getElementById('mark');
  var knight = document.getElementById('knight');

  function hop() {
    if (reduce || !knight) return;
    knight.classList.remove('move');
    void knight.getBoundingClientRect();     // restart the animation
    knight.style.setProperty('--d', '0s');
    knight.classList.add('move');
  }
  if (mark) {
    mark.addEventListener('click', hop);
    mark.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); hop(); }
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
    var data = { title: 'Fianchetto Chess Center', url: location.href.split('?')[0] };
    if (navigator.share) navigator.share(data).catch(function () {});
    else if (navigator.clipboard) navigator.clipboard.writeText(data.url).then(function () { note('Link copied ♞'); }, function () { note(data.url); });
    else note(data.url);
  });
})();
