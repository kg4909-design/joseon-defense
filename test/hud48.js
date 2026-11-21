const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] }); const errs = [];
  for (const [w, h] of [[1597, 900], [844, 390], [1024, 768]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } }); p.on('pageerror', (e) => errs.push(String(e)));
    await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.40'); localStorage.setItem('jd_hid', '1'); });
    await p.goto('file:///home/claude/work/game/dist/index.html'); await p.waitForTimeout(500); await p.click('#btnSingle'); await p.waitForTimeout(300);
    await p.evaluate(() => { const D = window.__dbg, G = D.G; D.hostCtl('start', { start: 0, dur: 300, diff: 'easy', coop: false, bots: 0 }); D.hostCtl('fight'); for (let i = 0; i < 20; i++) D.stepBattle(0.1); for (const id of G.order) { const q = G.pl[id]; q.offer = null; q.qz = null; } });
    await p.waitForTimeout(1500);
    const r = await p.evaluate(() => { const bb = document.getElementById('bwj-badge').getBoundingClientRect(), g = document.getElementById('btnGear').getBoundingClientRect(); return { badge: [bb.left, bb.top, bb.right, bb.bottom].map(Math.round), gear: [g.left, g.top, g.right, g.bottom].map(Math.round) }; });
    console.log(w, h, JSON.stringify(r)); await p.screenshot({ path: '/tmp/hud_' + w + '.png' }); await p.close();
  }
  console.log('ERR', JSON.stringify(errs)); await b.close();
})();
