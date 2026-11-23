const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 844, height: 390 }, hasTouch: true });
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.42'); });
  const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
  await p.goto('file:///home/claude/work/game/dist/index.html'); await p.waitForTimeout(400);
  await p.click('#btnSingle'); await p.waitForTimeout(300);
  const r = await p.evaluate(() => {
    const D = window.__dbg, G = D.G, out = {}; let hits = 0, N = 12;
    for (let s = 0; s < N; s++) { D.hostCtl('start', { start: 4, dur: 300, diff: 'normal', wall: 0 }); G.ph = 'battle'; G.rgR = undefined; const me = G.pl[G.order[0]]; me.hp = me.mx = 99999; out.obj = G.obj; for (let i = 0; i < 30 * 200 && !G.ring; i++) { G.paused = false; G.ev = null; me.offer = null; me.qz = null; me.hp = me.mx; D.stepBattle(1 / 30); if (G.du) { G.du.b.hp = 0; } if (G.ring) break; } if (G.ring) hits++; }
    out.hits = hits; out.N = N; return out;
  });
  console.log(JSON.stringify(r)); console.log('ERR', JSON.stringify(errs)); await b.close();
})();
