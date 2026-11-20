const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } }); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.31'); });
  await p.goto('file:///home/claude/work/game/dist/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' }); await p.waitForTimeout(3200);
  await p.fill('#nick', '하늘'); await p.click('#btnSingle'); await p.waitForTimeout(500); await p.click('#btnStart'); await p.waitForTimeout(500);
  await p.click('#bqOpts .qo'); await p.click('#btnFight'); await p.waitForTimeout(500);
  for (const ut of ['spear', 'cav']) for (const [et, n] of [['grunt', 1], ['grunt', 3], ['cav', 1], ['cav', 3]]) for (const lv of [1, 2]) {
    const r = await p.evaluate(([ut, et, n, lv]) => { const g = __dbg.G; g.ev = null; g.paused = false; g.waveT = 999; g.units = new Array(g.units.length).fill(null); g.units[0] = { t: ut, lv, cd: 0 }; g.en = []; g.souls = []; g.baseHp = g.baseMax;
      for (const id of g.order) { g.pl[id].x = g.ax + 700; g.pl[id].y = g.ay + 700; g.pl[id].offer = null; }
      const ids = []; for (let i = 0; i < n; i++) { const e = __dbg.spawn(et, 1.0, [g.ax + 110 + i * 14, g.ay + 20 + i * 18]); e && ids.push(e.id); }
      g.en = g.en.filter((e) => ids.includes(e.id)); const ids2 = new Set(g.en.map((e) => e.id)); let t = 0, minhp = 1e9; const u = g.units[0];
      for (; t < 40; t += 0.034) { __dbg.stepBattle(0.034); g.en = g.en.filter((e) => ids2.has(e.id) && e.hp > 0 || (!ids2.has(e.id) ? false : false)); g.en.forEach((e) => { if (e.t === 'shoot') e.hp = 0; }); if (u.hp !== undefined) minhp = Math.min(minhp, u.hp); if (!g.en.length) break; }
      return { left: g.en.length, t: +t.toFixed(1), hp: Math.round(u.hp), mh: Math.round(u.mh), down: u.dn || 0 }; }, [ut, et, n, lv]);
    console.log(ut, 'lv' + lv, 'vs', n + et, JSON.stringify(r));
  }
  console.log(errs); await b.close();
})();
