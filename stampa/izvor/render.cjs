const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const OUT = __dirname + '/..'; fs.mkdirSync(OUT + '/za-kasnije', { recursive: true }); fs.mkdirSync(OUT + '/instagram', { recursive: true }); fs.mkdirSync(OUT + '/pano', { recursive: true });
// [ime, širina px, visina px, PDF širina mm, PDF visina mm, faktor za PNG]
// kartica: 3.543 = oko 900 dpi (3224x2161 px); zid: 5 = 7000x10000 px (oko 254 dpi na 70x100 cm)
// instagram: 2 = 2160x2700 (objava) i 2160x3840 (story), Instagram ih sam smanji bez gubitka oštrine; naljepnica 10x10 cm + 2 mm prepust
const JOBS = [
  ['kartica-prednja', 910, 610, 91, 61, 3.543], ['kartica-zadnja', 910, 610, 91, 61, 3.543],
  ['cjenovnik-zid', 1400, 2000, 700, 1000, 5],
  ['instagram/ig-0-otvorenje', 1080, 1350, 0, 0, 2], ['instagram/story-0-otvorenje', 1080, 1920, 0, 0, 2],
  ['instagram/ig-1-uvod', 1080, 1350, 0, 0, 2], ['instagram/ig-2-praonica', 1080, 1350, 0, 0, 2], ['instagram/ig-3-detaljno', 1080, 1350, 0, 0, 2], ['instagram/ig-4-paketi', 1080, 1350, 0, 0, 2], ['instagram/ig-5-kontakt', 1080, 1350, 0, 0, 2],
  ['instagram/story-1-cjenovnik', 1080, 1920, 0, 0, 2], ['instagram/story-2-kontakt', 1080, 1920, 0, 0, 2],
  ['naljepnica-qr', 1040, 1040, 104, 104, 4.5],
  // pano za kancelariju 72 x 80 cm; 5.906 = 8504 x 9449 px (300 dpi)
  ['pano/pano-svijetli', 1440, 1600, 720, 800, 5.906], ['pano/pano-tamni', 1440, 1600, 720, 800, 5.906],
  ['za-kasnije/vjernost-prednja', 910, 610, 91, 61, 3.543], ['za-kasnije/vjernost-zadnja', 910, 610, 91, 61, 3.543]
];
const only = process.argv[2];
(async () => {
  const b = await chromium.launch();
  for (const [n, w, h, mw, mh, k] of JOBS) {
    if (only && !n.startsWith(only)) continue;
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: k });
    const p = await ctx.newPage(); const errs = [];
    p.on('pageerror', (e) => errs.push(e.message)); p.on('requestfailed', (r) => errs.push('fail ' + r.url()));
    await p.goto('file://' + __dirname + '/design.html?p=' + n.replace(/^(za-kasnije|instagram|pano)\//, ''));
    await p.waitForFunction(() => document.documentElement.dataset.ready === '1'); await p.waitForTimeout(300);
    if (k > 4) {
      // velika slika: crta se u trakama pa se spoji (Chromium ne iscrta sve odjednom)
      const parts = [], step = 250;
      for (let y = 0; y < h; y += step) {
        await p.evaluate((y) => { document.body.style.transform = 'translateY(' + -y + 'px)'; }, y);
        await p.waitForTimeout(150);
        const f = OUT + '/.traka-' + y + '.png';
        await p.screenshot({ path: f, clip: { x: 0, y: 0, width: w, height: Math.min(step, h - y) } });
        parts.push(f);
      }
      await p.evaluate(() => { document.body.style.transform = ''; });
      require('child_process').execFileSync('python3', ['-c', 'import sys;from PIL import Image;Image.MAX_IMAGE_PIXELS=None;ps=[Image.open(f) for f in sys.argv[2:]];W=ps[0].width;H=sum(i.height for i in ps);o=Image.new("RGB",(W,H));y=0\nfor i in ps: o.paste(i,(0,y)); y+=i.height\no.save(sys.argv[1],optimize=True)', OUT + '/' + n + '.png', ...parts]);
      parts.forEach((f) => fs.unlinkSync(f));
    } else {
      await p.screenshot({ path: OUT + '/' + n + '.png', clip: { x: 0, y: 0, width: w, height: h } });
    }
    if (mw) {
      const z = (mw * 96 / 25.4) / w;
      await p.addStyleTag({ content: `body{zoom:${z}}` });
      await p.evaluate(() => document.documentElement.classList.add('pdf'));
      await p.pdf({ path: OUT + '/' + n + '.pdf', width: mw + 'mm', height: mh + 'mm', printBackground: true, pageRanges: '1' });
    }
    console.log(n, errs.length ? errs : 'ok');
    await ctx.close();
  }
  await b.close();
})();
