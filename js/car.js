// M&S Car Wash: nacrtan auto (sedan i SUV) u bojama brenda. Svaki auto dobije svoje id-jeve, pa ih može biti više na stranici.
// Slojevi preko laka (pjena, voda, kapljice, prljavština, odsjaj) se pale CSS varijablama na roditelju: --foam, --water, --beads, --dirt.
(function () {
  'use strict';
  var BODY = {
    sedan: 'M 76 240 C 62 220 62 190 86 176 C 120 160 175 152 230 148 C 285 108 340 78 420 70 C 500 62 565 66 618 82 C 668 98 705 126 735 146 C 815 152 880 160 930 176 C 958 186 972 206 970 226 L 966 240 L 838 240 A 68 68 0 0 0 702 240 L 318 240 A 68 68 0 0 0 182 240 Z',
    suv: 'M 70 232 C 58 200 58 140 76 112 C 92 96 130 92 170 90 C 210 66 250 42 330 36 C 460 30 590 32 650 42 C 700 60 735 96 758 124 C 830 130 892 138 936 156 C 964 168 976 192 974 214 L 970 232 L 846 232 A 76 76 0 0 0 694 232 L 326 232 A 76 76 0 0 0 174 232 Z'
  };
  BODY.van = 'M 60 236 L 58 72 C 58 52 70 44 92 42 L 688 40 C 730 40 762 58 792 92 L 868 150 C 920 160 952 172 964 192 C 974 208 976 222 972 236 L 846 236 A 72 72 0 0 0 704 236 L 316 236 A 72 72 0 0 0 174 236 Z';
  var GLASS = {
    sedan: 'M 262 146 C 312 108 360 86 424 80 C 495 74 560 76 606 90 C 640 102 668 122 690 142 Z',
    van: 'M 330 60 L 640 58 C 660 58 672 64 680 76 L 680 120 L 330 122 Z M 700 62 C 730 64 754 82 774 102 L 842 152 L 700 150 Z',
    suv: 'M 186 100 C 226 74 270 52 336 46 C 460 40 584 42 638 52 C 672 70 698 96 714 120 Z'
  };
  var PART = {
    sedan: { w: [250, 770], wy: 248, wr: 60, arch: 70, pillar: 'M 488 78 L 484 146', door: 'M 488 146 L 490 232 M 700 152 C 706 180 708 206 704 232', hl: 'M 880 168 C 912 172 942 182 958 198 C 930 200 900 190 880 168 Z', tl: 'M 84 180 C 104 168 134 160 166 158 L 162 170 C 132 173 104 180 88 190 Z', mirror: 'M 688 140 C 700 136 714 138 720 146 C 712 154 696 152 688 140 Z', handle: 'M 530 170 h 36', streak: 'M 300 132 C 340 104 380 92 420 88', band: 'M 60 168 C 320 150 700 150 990 172 L 990 182 C 700 162 320 162 60 180 Z', y0: 60 },
    van: { w: [245, 775], wy: 244, wr: 64, arch: 78, pillar: 'M 690 58 L 692 150', door: 'M 692 150 L 694 228 M 330 122 L 330 226 M 560 122 L 560 226', hl: 'M 930 168 C 948 174 960 184 966 200 C 948 202 934 192 930 168 Z', tl: 'M 62 92 L 80 92 L 80 142 L 62 144 Z', mirror: 'M 792 122 C 804 118 818 120 824 128 C 816 136 800 134 792 122 Z', handle: 'M 600 150 h 30', streak: 'M 350 70 C 420 64 500 62 560 62', band: 'M 58 132 C 320 128 700 130 900 160 L 900 170 C 700 140 320 138 58 142 Z', y0: 40 },
    suv: { w: [250, 770], wy: 244, wr: 66, arch: 80, pillar: 'M 420 44 L 418 112 M 590 42 L 596 116', door: 'M 420 112 L 422 224 M 718 126 C 722 160 724 194 720 224', hl: 'M 888 148 C 918 152 948 162 964 180 C 934 182 904 172 888 148 Z', tl: 'M 74 118 C 84 110 96 106 112 104 L 110 150 C 96 152 84 154 76 156 Z', mirror: 'M 722 116 C 734 112 748 114 754 122 C 746 130 730 128 722 116 Z', handle: 'M 470 146 h 34', streak: 'M 230 90 C 270 66 310 54 350 50', band: 'M 60 128 C 320 112 700 114 990 140 L 990 150 C 700 124 320 124 60 140 Z', y0: 30 }
  };
  function rnd(seed) { return function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }
  var n = 0;

  window.carSVG = function (type, opt) {
    opt = opt || {};
    type = BODY[type] ? type : 'sedan';
    var p = PART[type], id = 'c' + (++n), r = rnd(opt.seed || 11), i, s = '';
    var foam = '', beads = '', dirt = '', water = '';
    for (i = 0; i < 260; i++) { var fr = 4 + Math.pow(r(), 1.8) * 20; foam += '<circle cx="' + (80 + r() * 880).toFixed(0) + '" cy="' + (p.y0 + 10 + Math.pow(r(), 0.8) * 190).toFixed(0) + '" r="' + fr.toFixed(1) + '"/>'; }
    for (i = 0; i < 70; i++) {
      var bx = 90 + r() * 870, by = p.y0 + 30 + r() * 170, br = 1.5 + Math.pow(r(), 2) * 6;
      beads += '<circle cx="' + bx.toFixed(1) + '" cy="' + by.toFixed(1) + '" r="' + br.toFixed(1) + '" fill="url(#' + id + 'bd)"/><circle cx="' + (bx - br * 0.35).toFixed(1) + '" cy="' + (by - br * 0.4).toFixed(1) + '" r="' + (br * 0.3).toFixed(1) + '" fill="#fff" opacity=".9"/>';
    }
    for (i = 0; i < 90; i++) dirt += '<circle cx="' + (80 + r() * 880).toFixed(0) + '" cy="' + (p.y0 + 60 + Math.pow(r(), 0.6) * 160).toFixed(0) + '" r="' + (1 + r() * 3.5).toFixed(1) + '"/>';
    for (i = 0; i < 18; i++) { var wx = 120 + r() * 800; water += '<path d="M ' + wx.toFixed(0) + ' ' + (p.y0 + 10) + ' q ' + (r() * 16 - 8).toFixed(0) + ' 90 ' + (r() * 10 - 5).toFixed(0) + ' 190"/>'; }
    var wheel = function (x) {
      return '<g class="c-wheel" transform="translate(' + x + ' ' + p.wy + ')"><g class="c-spin">'
        + '<circle r="' + p.wr + '" fill="#06080c"/><circle r="' + (p.wr - 3) + '" fill="none" stroke="#1b212b" stroke-width="3"/>'
        + '<circle r="' + (p.wr * 0.7) + '" fill="url(#' + id + 'rim)"/>'
        + '<g fill="#222a37">' + [0, 72, 144, 216, 288].map(function (a) { return '<path transform="rotate(' + a + ')" d="M-5 -10 L-9 ' + (-p.wr * 0.63) + ' L9 ' + (-p.wr * 0.63) + ' L5 -10 Z"/>'; }).join('') + '</g>'
        + '<circle r="' + (p.wr * 0.7) + '" fill="none" stroke="#dde5ee" stroke-width="2"/><circle r="11" fill="#141a26" stroke="#dde5ee" stroke-width="2"/></g>'
        + '<path d="M-31 -22 A38 38 0 0 1 -6 -37" stroke="#3b82f0" stroke-width="9" fill="none" stroke-linecap="round" transform="scale(' + (p.wr / 60) + ')"/></g>';
    };
    s += '<svg class="car car-' + type + '" viewBox="0 0 1000 380" aria-hidden="true" focusable="false"><defs>'
      + '<linearGradient id="' + id + 'pt" x1="0" y1="' + p.y0 + '" x2="0" y2="250" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#4f86e8"/><stop offset=".22" stop-color="#1e4596"/><stop offset=".5" stop-color="#0c1a36"/><stop offset=".66" stop-color="#091224"/><stop offset=".82" stop-color="#173468"/><stop offset="1" stop-color="#081020"/></linearGradient>'
      + '<linearGradient id="' + id + 'gl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a9cdff" stop-opacity=".6"/><stop offset=".4" stop-color="#16243d"/><stop offset="1" stop-color="#04070c"/></linearGradient>'
      + '<radialGradient id="' + id + 'rim" cx=".38" cy=".32" r=".75"><stop offset="0" stop-color="#f4f8fc"/><stop offset=".5" stop-color="#a3afbf"/><stop offset="1" stop-color="#3e4858"/></radialGradient>'
      + '<radialGradient id="' + id + 'sh" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".8"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>'
      + '<radialGradient id="' + id + 'bd" cx=".45" cy=".6" r=".6"><stop offset="0" stop-color="#bfe0ff" stop-opacity=".55"/><stop offset=".7" stop-color="#0a1424" stop-opacity=".35"/><stop offset="1" stop-color="#cfe8ff" stop-opacity=".5"/></radialGradient>'
      + '<linearGradient id="' + id + 'hl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8fd3ff" stop-opacity=".2"/><stop offset="1" stop-color="#f2fbff"/></linearGradient>'
      + '<linearGradient id="' + id + 'tl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ff2436"/><stop offset="1" stop-color="#8a0d18"/></linearGradient>'
      + '<linearGradient id="' + id + 'sw" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>'
      + '<linearGradient id="' + id + 'rf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".2"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/></linearGradient>'
      + '<mask id="' + id + 'rm"><rect x="0" y="300" width="1000" height="90" fill="url(#' + id + 'rf)"/></mask>'
      + '<clipPath id="' + id + 'cl"><path d="' + BODY[type] + '"/><path d="' + GLASS[type] + '"/></clipPath>'
      + '<g id="' + id + 'car">'
      + '<circle cx="' + p.w[0] + '" cy="' + (p.wy - 8) + '" r="' + p.arch + '" fill="#04060a"/><circle cx="' + p.w[1] + '" cy="' + (p.wy - 8) + '" r="' + p.arch + '" fill="#04060a"/>'
      + '<path d="' + BODY[type] + '" fill="url(#' + id + 'pt)"/>'
      + '<g clip-path="url(#' + id + 'cl)"><path d="' + p.band + '" fill="#d8eaff" opacity=".45"/><rect x="0" y="222" width="1000" height="40" fill="#03060c" opacity=".5"/><path d="' + p.door + '" stroke="#03060c" stroke-opacity=".7" stroke-width="2.5" fill="none"/></g>'
      + '<path d="' + GLASS[type] + '" fill="url(#' + id + 'gl)" stroke="#03050a" stroke-width="5" stroke-linejoin="round"/>'
      + '<path d="' + p.pillar + '" stroke="#03050a" stroke-width="9"/>'
      + '<path d="' + p.streak + '" stroke="#fff" stroke-opacity=".35" stroke-width="3" fill="none" stroke-linecap="round"/>'
      + '<path d="' + p.mirror + '" fill="#0b1630" stroke="#03050a" stroke-width="2"/>'
      + '<path class="c-hl" d="' + p.hl + '" fill="url(#' + id + 'hl)"/><path d="' + p.tl + '" fill="url(#' + id + 'tl)"/>'
      + '<path d="' + p.handle + '" stroke="#9fb3cf" stroke-width="4" stroke-linecap="round" opacity=".75"/>'
      + wheel(p.w[0]) + wheel(p.w[1]) + '</g></defs>'
      + '<ellipse cx="520" cy="306" rx="480" ry="20" fill="url(#' + id + 'sh)"/>'
      + (opt.reflect === false ? '' : '<g mask="url(#' + id + 'rm)"><use href="#' + id + 'car" transform="translate(0 616) scale(1 -1)"/></g>')
      + '<use href="#' + id + 'car"/>'
      + '<g clip-path="url(#' + id + 'cl)">'
      + '<g class="c-dirt" fill="#6b5a44">' + dirt + '<rect width="1000" height="380" fill="#4a4034" opacity=".35"/></g>'
      + '<g class="c-water" stroke="#bfe4ff" stroke-width="3" stroke-linecap="round" fill="none" opacity=".6">' + water + '</g>'
      + '<g class="c-foam" fill="#f4f9ff" fill-opacity=".86" stroke="#bcdcff" stroke-opacity=".7" stroke-width="1.5">' + foam + '</g>'
      + '<g class="c-beads">' + beads + '</g>'
      + '<g class="c-sweep"><rect x="-300" y="0" width="260" height="380" fill="url(#' + id + 'sw)" transform="skewX(-18)"/></g>'
      + '</g></svg>';
    return s;
  };
  // pozicija prednjeg svjetla (za odsjaj) i točkova, ako zatreba
  window.carParts = PART;
})();
