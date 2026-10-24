const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const OUT = __dirname + '/..'; fs.mkdirSync(OUT, { recursive: true });
// [ime, širina px, visina px, PDF širina mm, PDF visina mm, faktor za PNG]
const JOBS = [
  ['kartica-prednja', 910, 610, 91, 61, 1.181], ['kartica-zadnja', 910, 610, 91, 61, 1.181],
  ['vjernost-prednja', 910, 610, 91, 61, 1.181], ['vjernost-zadnja', 910, 610, 91, 61, 1.181],
  ['cjenovnik-zid', 1400, 2000, 700, 1000, 3],
  ['ig-1-praonica', 1080, 1350, 0, 0, 1], ['ig-2-paketi', 1080, 1350, 0, 0, 1], ['ig-3-detaljno', 1080, 1350, 0, 0, 1], ['ig-4-vjernost', 1080, 1350, 0, 0, 1]
];
const only = process.argv[2];
(async () => {
  const b = await chromium.launch();
  for (const [n, w, h, mw, mh, k] of JOBS) {
    if (only && !n.startsWith(only)) continue;
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: k });
    const p = await ctx.newPage(); const errs = [];
    p.on('pageerror', (e) => errs.push(e.message)); p.on('requestfailed', (r) => errs.push('fail ' + r.url()));
    await p.goto('file://' + __dirname + '/design.html?p=' + n);
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
    await p.screenshot({ path: OUT + '/' + n + '.png', clip: { x: 0, y: 0, width: w, height: h } });
    if (mw) {
      const z = (mw * 96 / 25.4) / w;
      await p.addStyleTag({ content: `body{zoom:${z}}` });
      await p.pdf({ path: OUT + '/' + n + '.pdf', width: mw + 'mm', height: mh + 'mm', printBackground: true, pageRanges: '1' });
    }
    console.log(n, errs.length ? errs : 'ok');
    await ctx.close();
  }
  await b.close();
})();
