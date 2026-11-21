const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 844, height: 390 }, hasTouch: true });
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.34'); });
  const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
  await p.goto('file:///home/claude/work/game/dist/index.html'); await p.waitForTimeout(400);
  await p.click('#btnSingle'); await p.waitForTimeout(300);
  const r = await p.evaluate(() => {
    const D = window.__dbg, o = [];
    D.hostCtl('start', { start: 0, dur: 180, diff: 'normal', wall: 0 }); const G = D.G; G.ph = 'battle';
    for (let i = 0; i < 5; i++) D.stepBattle(1 / 30);
    G.paused = true; D.updateHUD && D.updateHUD();
    o.push('pHome ' + !!document.getElementById('pHome') + ' pFs ' + !!document.getElementById('pFs'));
    G.paused = false;
    G.lvC = 0; let c0 = {}; for (let i = 0; i < 3000; i++) { G.t = 100; const t = D.pickType ? D.pickType({ cl: 'inf' }) : '?'; c0[t] = (c0[t] || 0) + 1; }
    G.lvC = 12; let c1 = {}; for (let i = 0; i < 3000; i++) { G.t = 100; const t = D.pickType ? D.pickType({ cl: 'inf' }) : '?'; c1[t] = (c1[t] || 0) + 1; }
    o.push('Lv0 ' + JSON.stringify(c0), 'Lv12 ' + JSON.stringify(c1));
    return o;
  });
  console.log(r.join('\n'), '\nERR', errs);
  await b.close();
})();
