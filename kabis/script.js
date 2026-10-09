/* Kabis — Links: jelly letters, replay on tap, share */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var logo = document.getElementById('logo');
  var letters = logo ? Array.prototype.slice.call(logo.querySelectorAll('path')) : [];

  function play(cls, step) {
    letters.forEach(function (p, i) {
      p.classList.remove('land', 'wobble');
      void p.getBoundingClientRect();            // restart the animation
      p.style.setProperty('--d', (i * step).toFixed(2) + 's');
      p.classList.add(cls);
    });
  }

  if (!reduce) {
    play('land', 0.11);
    var t1 = letters.length ? letters[letters.length - 1] : null;
    if (t1) t1.addEventListener('animationend', function done() {
      letters.forEach(function (p) { p.style.opacity = 1; });
      t1.removeEventListener('animationend', done);
    });
    logo.addEventListener('click', function () { play('wobble', 0.07); });
    logo.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); play('wobble', 0.07); }
    });
  }

  /* Share */
  var btn = document.getElementById('share');
  var toast = document.getElementById('toast');
  function note(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(note.t);
    note.t = setTimeout(function () { toast.classList.remove('show'); }, 2200);
  }
  if (btn) btn.addEventListener('click', function () {
    var data = { title: 'Kabis', url: location.href.split('?')[0] };
    if (navigator.share) navigator.share(data).catch(function () {});
    else if (navigator.clipboard) navigator.clipboard.writeText(data.url).then(function () { note('Link copied ✨'); }, function () { note(data.url); });
    else note(data.url);
  });
})();
