const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } }); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.24'); });
  await p.goto('file:///home/claude/work/game/dist/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' }); await p.waitForTimeout(3200);
  await p.fill('#nick', '하늘'); await p.click('#btnSingle'); await p.waitForTimeout(500); await p.click('#btnStart'); await p.waitForTimeout(500);
  await p.click('#bqOpts .qo'); await p.click('#btnFight'); await p.waitForTimeout(500);
  console.log(JSON.stringify(await p.evaluate(() => { const g = __dbg.G, out = {}; const rd = __dbg.R[g.rd];
    for (const d of ['easy', 'normal', 'hard']) for (const pr of [0.1, 0.5, 0.9]) { g.dif = __dbg.DIFF[d]; g.t = g.dur * pr; const c = {}; for (let i = 0; i < 4000; i++) { const t = __dbg.pickType(rd); c[t] = (c[t] || 0) + 1; } out[d + '@' + pr] = Object.fromEntries(Object.entries(c).map(([k, v]) => [k, +(v / 40).toFixed(1)])); } return out; })));
  const r = await p.evaluate(() => { const g = __dbg.G; g.dif = __dbg.DIFF.normal; g.t = 5; g.ev = null; g.waveT = 999; g.en = []; const h = g.pl[g.order[0]]; h.x = g.ax + 300; h.y = g.ay; h.hp = h.mx; h.fz = 0; h.cards = {};
    const e = __dbg.spawn('cannon', 1.0, [g.ax + 560, g.ay]); e.gt = 0.01; let maxpj = 0, shots = 0, last = 0, minhp = h.hp, baseLoss = 0; const b0 = g.baseHp;
    for (let t = 0; t < 12; t += 0.034) { g.spawnT = 5; g.en = g.en.filter((x) => x === e); const n0 = g.pj.length; __dbg.stepBattle(0.034); maxpj = Math.max(maxpj, g.pj.length); minhp = Math.min(minhp, h.hp); }
    return { dbg: [g.ph, g.paused, !!g.ev, g.t, e.st, e.gt, e.hp, g.en.length, g.units.filter(Boolean).length], maxpj, minhp, hp0: h.mx, baseLoss: Math.round(b0 - g.baseHp), ex: Math.round(e.x - g.ax) }; });
  console.log(JSON.stringify(r));
  await p.evaluate(() => { const g = __dbg.G; g.en = []; const h = g.pl[g.order[0]]; const e = __dbg.spawn('cannon', 1.0, [h.x + 300, h.y - 20]); e.gt = 0.01; for (let i = 0; i < 35; i++) __dbg.stepBattle(0.034); });
  await p.waitForTimeout(150); await p.screenshot({ path: '/tmp/cn1.png' }); console.log(errs); await b.close();
})();
