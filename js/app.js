// M&S Car Wash: nacrtani auti, izbor vozila, prije/poslije, "kako peremo" dok se lista, i upit koji složi poruku za WhatsApp / Viber.
(function () {
  'use strict';
  var PHONE = '38762568565';
  var $ = function (s) { return document.querySelector(s); };
  var all = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  document.documentElement.classList.add('js');
  var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // nacrtani auti (js/car.js)
  if (window.carSVG) all('[data-car]').forEach(function (el, k) { el.innerHTML = carSVG(el.getAttribute('data-car'), { seed: 11 + k, reflect: !el.classList.contains('art-car') }); });

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

  // kapljice vode na laku u pozadini vrha (iste kao na vizit karti i cjenovniku)
  var beads = $('.hero-bg canvas');
  function rnd(seed) { return function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }
  function drawBeads() {
    var w = beads.clientWidth, h = beads.clientHeight, S = Math.min(2, window.devicePixelRatio || 1);
    if (!w || !h) return;
    beads.width = w * S; beads.height = h * S;
    var x = beads.getContext('2d'), r = rnd(7), placed = [], n = Math.round(w * h / 520), i, t;
    x.scale(S, S);
    for (t = 0; t < n * 5 && placed.length < n; t++) {
      var R = 1.4 + Math.pow(r(), 2.6) * 17, cx = r() * w, cy = r() * h, dx = (cx - w / 2) / (w / 2), dy = (cy - h * 0.42) / (h * 0.5);
      if (Math.hypot(dx * (w < 600 ? 0.95 : 1.1), dy * 0.85) < (w < 600 ? 0.72 : 0.58) + r() * 0.25) continue; // sredina ostaje čista zbog teksta
      var hit = false;
      for (i = 0; i < placed.length && !hit; i++) hit = Math.hypot(placed[i][0] - cx, placed[i][1] - cy) < placed[i][2] + R + 1.5;
      if (!hit) placed.push([cx, cy, R]);
    }
    placed.forEach(function (b) {
      var cx = b[0], cy = b[1], R = b[2], g;
      g = x.createRadialGradient(cx + R * 0.18, cy + R * 0.3, R * 0.4, cx + R * 0.18, cy + R * 0.3, R * 1.25);
      g.addColorStop(0, 'rgba(0,0,0,.4)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      x.fillStyle = g; x.beginPath(); x.arc(cx + R * 0.18, cy + R * 0.3, R * 1.25, 0, 7); x.fill();
      g = x.createRadialGradient(cx - R * 0.1, cy + R * 0.35, R * 0.1, cx, cy, R);
      g.addColorStop(0, 'rgba(150,200,255,.3)'); g.addColorStop(0.55, 'rgba(70,120,210,.12)'); g.addColorStop(0.88, 'rgba(5,10,20,.32)'); g.addColorStop(1, 'rgba(160,210,255,.22)');
      x.fillStyle = g; x.beginPath(); x.arc(cx, cy, R, 0, 7); x.fill();
      g = x.createRadialGradient(cx - R * 0.38, cy - R * 0.4, 0, cx - R * 0.38, cy - R * 0.4, R * 0.32);
      g.addColorStop(0, 'rgba(255,255,255,.9)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      x.fillStyle = g; x.beginPath(); x.arc(cx - R * 0.38, cy - R * 0.4, R * 0.32, 0, 7); x.fill();
    });
  }
  if (beads) {
    drawBeads();
    var bw = beads.clientWidth;
    addEventListener('resize', function () { if (Math.abs(beads.clientWidth - bw) > 40) { bw = beads.clientWidth; drawBeads(); } });
  }

  // izbor vozila: Malo auto / SUV
  var pick = $('.pick');
  if (pick) {
    var PR = { sedan: ['Malo auto', '15'], suv: ['SUV', '20'] }, pv = $('#pick-v');
    pick.querySelector('.seg').addEventListener('click', function (e) {
      var b = e.target.closest('button[data-v]');
      if (!b) return;
      var v = b.getAttribute('data-v');
      pick.querySelectorAll('.seg button').forEach(function (x) { x.setAttribute('aria-selected', String(x === b)); });
      pick.classList.toggle('is-suv', v === 'suv');
      pick.querySelectorAll('.pc').forEach(function (x) { x.classList.toggle('on', x.getAttribute('data-car') === v); });
      $('#pick-n').textContent = PR[v][0]; pv.textContent = PR[v][1];
      pv.classList.remove('bump'); void pv.offsetWidth; pv.classList.add('bump');
      all('.list .it').forEach(function (x) { x.classList.toggle('hl', x.classList.contains('v-' + v)); });
    });
    $('.list .v-sedan').classList.add('hl');
  }

  // prije / poslije
  var ba = $('.ba');
  if (ba) ba.querySelector('input').addEventListener('input', function (e) { ba.style.setProperty('--x', e.target.value + '%'); });

  // kako peremo: auto prolazi kroz pjenu, pranje, sušenje i sjaj dok se lista
  var proc = $('.proc'), pcar = $('.proc-car'), steps = all('.steps li'), pbar = $('.proc-bar');
  var clamp = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };
  function procScroll() {
    if (!proc) return;
    var r = proc.getBoundingClientRect(), span = proc.offsetHeight - innerHeight;
    var p = clamp(-r.top / (span > 0 ? span : 1)), q = p * 4, st = Math.min(3, Math.floor(q)), f = q - st;
    var v = { foam: 0, water: 0, beads: 0, dirt: 1, shine: 0 };
    if (st === 0) { v.foam = clamp(f * 1.6); v.dirt = 1 - clamp((f - 0.5) * 2); }
    else if (st === 1) { v.dirt = 0; v.foam = 1 - clamp(f * 1.4); v.water = clamp(f * 3) * (1 - clamp((f - 0.7) * 3.3)); v.beads = clamp((f - 0.3) * 1.6); }
    else if (st === 2) { v.dirt = 0; v.beads = 1 - clamp(f * 1.3); }
    else { v.dirt = 0; v.shine = f; }
    for (var k in v) pcar.style.setProperty('--' + k, v[k].toFixed(3));
    pbar.style.setProperty('--p', p.toFixed(3));
    steps.forEach(function (li, i) { li.classList.toggle('on', i === st); });
  }
  if (proc) { addEventListener('scroll', function () { requestAnimationFrame(procScroll); }, { passive: true }); addEventListener('resize', procScroll); procScroll(); }

  // mlaz vode na vrhu: kapi lete prema autu i odbiju se
  var spray = $('.stage .spray');
  if (spray && !reduced) {
    var sx = spray.getContext('2d'), drops = [], seen = true, last = 0, SW, SH, SS = Math.min(2, window.devicePixelRatio || 1);
    var size = function () { SW = spray.clientWidth; SH = spray.clientHeight; spray.width = SW * SS; spray.height = SH * SS; sx.setTransform(SS, 0, 0, SS, 0, 0); };
    size(); addEventListener('resize', size);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { seen = en[0].isIntersecting; }).observe(spray);
    var t0 = performance.now();
    (function frame(now) {
      requestAnimationFrame(frame);
      if (!seen) { last = now; return; }
      var dt = Math.min(0.05, (now - (last || now)) / 1000); last = now;
      var on = now - t0 > 2100 && ((now - t0) % 7000) < 3600, k;
      if (on) for (k = 0; k < (SW < 600 ? 3 : 6); k++) {
        drops.push({ x: SW * 0.02, y: SH * (0.12 + Math.random() * 0.05), vx: SW * (0.55 + Math.random() * 0.35), vy: SH * (0.1 + Math.random() * 0.45), r: (SW < 600 ? 0.5 : 0.8) + Math.random() * (SW < 600 ? 1.1 : 1.6), life: 1 });
      }
      sx.clearRect(0, 0, SW, SH);
      for (k = drops.length - 1; k >= 0; k--) {
        var d = drops[k];
        d.vy += SH * 0.9 * dt; d.x += d.vx * dt; d.y += d.vy * dt; d.life -= dt * 0.9;
        if (d.y > SH * 0.62 && d.x > SW * 0.12 && !d.hit) { d.hit = true; d.vx *= -0.25; d.vy *= -0.35; }
        if (d.life <= 0 || d.y > SH || d.x > SW) { drops.splice(k, 1); continue; }
        sx.globalAlpha = Math.max(0, d.life) * 0.8;
        sx.fillStyle = '#cfe9ff';
        sx.beginPath(); sx.ellipse(d.x, d.y, d.r * 2.2, d.r, Math.atan2(d.vy, d.vx), 0, 7); sx.fill();
      }
      sx.globalAlpha = 1;
    })(t0);
  }

  // pjena iz dugmeta kad se usluga doda u upit
  function foam(el) {
    if (reduced) return;
    var b = el.getBoundingClientRect(), k;
    for (k = 0; k < 9; k++) {
      var f = document.createElement('i'), a = -Math.PI / 2 + (Math.random() - 0.5) * 2.2, d = 30 + Math.random() * 40;
      f.className = 'foam';
      f.style.cssText = 'left:' + (b.left + b.width / 2) + 'px;top:' + (b.top + b.height / 2) + 'px;--s:' + (6 + Math.random() * 12).toFixed(1) + 'px;--dx:' + (Math.cos(a) * d).toFixed(1) + 'px;--dy:' + (Math.sin(a) * d - 10).toFixed(1) + 'px;animation-delay:' + (Math.random() * 0.12).toFixed(2) + 's';
      document.body.appendChild(f);
      setTimeout(f.remove.bind(f), 1200);
    }
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
    if (k === -1) foam(items[i].querySelector('.add, .card-add svg, svg') || items[i]);
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
