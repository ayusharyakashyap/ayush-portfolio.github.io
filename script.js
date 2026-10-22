// Name "fuzzes" once on load: characters are mutated, then settle left to right.
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var els = document.querySelectorAll('.fuzz');
  if (reduce || !els.length) return;

  var pool = '0123456789abcdef#$%&*<>/\\{}[]=+~?';
  var duration = 1100;
  var start = null;

  function rand() { return pool.charAt(Math.floor(Math.random() * pool.length)); }

  function frame(t) {
    if (start === null) start = t;
    var p = Math.min((t - start) / duration, 1);
    els.forEach(function (el, row) {
      var text = el.getAttribute('data-text');
      var html = '';
      for (var i = 0; i < text.length; i++) {
        var ch = text.charAt(i);
        // each character settles at a staggered point; second line slightly later
        var settleAt = 0.25 + 0.7 * ((i + row * 3) / (text.length + 3));
        if (ch === ' ' || p >= settleAt) html += ch === ' ' ? ' ' : ch;
        else html += '<span class="g">' + rand() + '</span>';
      }
      el.innerHTML = html;
    });
    if (p < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();

// Highlight the current section in the side navigation.
(function () {
  var links = document.querySelectorAll('.rail-nav a');
  if (!('IntersectionObserver' in window) || !links.length) return;
  var map = {};
  links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });

  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting && map[e.target.id]) {
        links.forEach(function (a) { a.classList.remove('active'); });
        map[e.target.id].classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  document.querySelectorAll('main section[id]').forEach(function (s) { obs.observe(s); });
})();
