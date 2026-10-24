// M&S Car Wash: označena traka dok se lista, i upit koji složi poruku za WhatsApp / Viber.
(function () {
  'use strict';
  var PHONE = '38762568565';

  // traka sa dijelovima: označi dio koji je trenutno na ekranu
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tabs a'));
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        if (!e.isIntersecting) return;
        tabs.forEach(function (a) {
          var on = a.getAttribute('href') === '#' + e.target.id;
          a.classList.toggle('on', on);
          if (on && a.scrollIntoView) a.parentNode.scrollTo({ left: a.offsetLeft - 16, behavior: 'smooth' });
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    tabs.forEach(function (a) { var s = document.querySelector(a.getAttribute('href')); if (s) io.observe(s); });
  }

  // upit: usluge iz cjenovnika (data-s) kao dugmad
  var picks = document.getElementById('picks');
  var msg = document.getElementById('msg');
  var wa = document.getElementById('send-wa');
  var copy = document.getElementById('copy');
  var chosen = [];
  var services = Array.prototype.slice.call(document.querySelectorAll('[data-s]')).map(function (el) { return el.getAttribute('data-s'); });
  picks.innerHTML = services.map(function (s, i) {
    return '<button type="button" class="pick" aria-pressed="false" data-i="' + i + '">' + s.replace(/ \(.*\)$/, '') + '</button>';
  }).join('');

  function text() {
    if (!chosen.length) return 'Zdravo! Zanima me termin za pranje.';
    return 'Zdravo! Zanima me termin za:\n' + chosen.map(function (i) { return '• ' + services[i]; }).join('\n') + '\nKada imate slobodno?';
  }
  function update() {
    var t = text();
    msg.textContent = t;
    wa.href = 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent(t);
  }
  picks.addEventListener('click', function (e) {
    var b = e.target.closest('.pick');
    if (!b) return;
    var i = +b.getAttribute('data-i');
    var k = chosen.indexOf(i);
    if (k === -1) chosen.push(i); else chosen.splice(k, 1);
    b.setAttribute('aria-pressed', String(k === -1));
    update();
  });
  // klik na stavku u cjenovniku je doda u upit
  document.querySelectorAll('[data-s]').forEach(function (el, i) {
    el.addEventListener('click', function () {
      if (chosen.indexOf(i) === -1) picks.querySelector('[data-i="' + i + '"]').click();
      document.getElementById('upit').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    el.style.cursor = 'pointer';
  });
  copy.addEventListener('click', function () {
    var done = function () { copy.textContent = 'Poruka kopirana ✓'; setTimeout(function () { copy.textContent = 'Kopiraj poruku'; }, 1800); };
    if (navigator.clipboard) navigator.clipboard.writeText(text()).then(done, done); else done();
  });
  update();
})();
