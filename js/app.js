// M&S Car Wash: označena traka dok se lista, pojavljivanje dijelova i upit koji složi poruku za WhatsApp / Viber.
(function () {
  'use strict';
  var PHONE = '38762568565';
  var $ = function (s) { return document.querySelector(s); };
  var all = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  document.documentElement.classList.add('js');

  // traka sa dijelovima: označi dio koji je trenutno na ekranu
  var tabs = all('.tabs a');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        if (!e.isIntersecting) return;
        tabs.forEach(function (a) {
          var on = a.getAttribute('href') === '#' + e.target.id;
          a.classList.toggle('on', on);
          if (on) a.parentNode.scrollTo({ left: a.offsetLeft - 16, behavior: 'smooth' });
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    tabs.forEach(function (a) { var s = $(a.getAttribute('href')); if (s) io.observe(s); });

    // dijelovi se lagano pojave
    var rv = new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        rv.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -12% 0px' });
    all('.rv').forEach(function (s) { rv.observe(s); });
  } else {
    all('.rv').forEach(function (s) { s.classList.add('in'); });
  }

  // upit: dodir na stavku (data-s) je doda ili ukloni
  var items = all('[data-s]');
  var services = items.map(function (el) { return el.getAttribute('data-s'); });
  var chosen = [];
  var picked = $('#picked'), msg = $('#msg'), wa = $('#send-wa'), copy = $('#copy'), count = $('#count'), toast = $('#toast');
  var short = function (s) { return s.replace(/ \(.*\)$/, ''); };

  function text() {
    if (!chosen.length) return 'Zdravo! Zanima me termin za pranje.';
    return 'Zdravo! Zanima me termin za:\n' + chosen.map(function (i) { return '• ' + services[i]; }).join('\n') + '\nKada imate slobodno?';
  }
  var tt;
  function say(t) {
    toast.textContent = t;
    toast.classList.add('on');
    clearTimeout(tt);
    tt = setTimeout(function () { toast.classList.remove('on'); }, 1600);
  }
  function update() {
    var t = text();
    msg.textContent = t;
    wa.href = 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent(t);
    picked.innerHTML = chosen.map(function (i) {
      return '<button type="button" class="chip" data-i="' + i + '" aria-label="Ukloni ' + short(services[i]) + '">' + short(services[i]) + '<svg><use href="#i-plus"/></svg></button>';
    }).join('');
    count.textContent = chosen.length;
    count.hidden = !chosen.length;
    count.classList.remove('bump'); void count.offsetWidth; count.classList.add('bump');
  }
  function toggle(i) {
    var k = chosen.indexOf(i);
    if (k === -1) chosen.push(i); else chosen.splice(k, 1);
    items[i].setAttribute('aria-pressed', String(k === -1));
    update();
    say(k === -1 ? 'Dodano u upit: ' + short(services[i]) : 'Uklonjeno iz upita');
    if (k === -1 && navigator.vibrate) navigator.vibrate(12);
  }
  items.forEach(function (el, i) {
    el.setAttribute('aria-pressed', 'false');
    el.addEventListener('click', function () { toggle(i); });
  });
  picked.addEventListener('click', function (e) {
    var b = e.target.closest('.chip');
    if (b) toggle(+b.getAttribute('data-i'));
  });
  copy.addEventListener('click', function () {
    var done = function () { copy.textContent = 'Poruka kopirana ✓'; setTimeout(function () { copy.textContent = 'Kopiraj poruku'; }, 1800); };
    if (navigator.clipboard) navigator.clipboard.writeText(text()).then(done, done); else done();
  });
  update();
  count.classList.remove('bump');
})();
