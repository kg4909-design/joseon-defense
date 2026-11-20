const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  for (const [w, h] of [[1572, 910], [1280, 800], [1024, 768], [844, 390], [780, 360]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } }); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.30'); });
    await p.goto('file:///home/claude/work/game/dist/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' }); await p.waitForTimeout(2500);
    const o = await p.evaluate(() => { const r = (id) => { const e = document.getElementById(id); if (!e) return null; const b = e.getBoundingClientRect(); return [Math.round(b.left), Math.round(b.top), Math.round(b.right), Math.round(b.bottom)]; }; return { menu: r('lobMenu'), create: r('btnCreate'), upd: r('updBox'), set: r('lobSet'), sw: document.documentElement.scrollWidth, cw: innerWidth }; });
    console.log(w + 'x' + h, JSON.stringify(o), errs); await p.screenshot({ path: `/tmp/ui_${w}.png` }); await p.close();
  }
  await b.close();
})();
