const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  for (const role of ['archer', 'militia', 'gunner']) for (const bhp of [3000, 5200]) {
    const p = await b.newPage({ viewport: { width: 1280, height: 720 } }); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.33'); });
    await p.goto('file:///home/claude/work/game/dist/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' }); await p.waitForTimeout(3200);
    await p.fill('#nick', '하늘'); await p.click('#btnSingle'); await p.waitForTimeout(300); await p.click(`#roleRow button[data-r=${role}]`); await p.click('#btnStart'); await p.waitForTimeout(500);
    await p.click('#bqOpts .qo'); await p.click('#btnFight'); await p.waitForTimeout(500);
    const r = await p.evaluate(([role, bhp]) => { const g = __dbg.G; __dbg.ET.boss.hp = bhp; const h = g.pl[g.order[0]]; h.x = g.ax - 60; h.y = g.ay + 80; const B = { archer: { bow: 3, nu: 2, forge: 2, train: 2, crit: 1 }, militia: { sword: 3, spear: 2, flail: 1, forge: 2, train: 2 }, gunner: { cannon: 3, musket: 2, forge: 2, train: 2, powder: 1 } }[role]; h.cards = Object.assign({}, B); h.lv = 9; g.upg = 2; for (let i = 0; i < 6; i++) __dbg.hostMsg(h.id, { k: 'summon' }); for (let i = 0; i < 8; i++) if (!g.units[i]) g.units[i] = { t: ['bow', 'gun', 'spear', 'cav', 'cannon'][i % 5], lv: 2, cd: 0 }; let t = 0; let bl = 0;
      const out = { lv: h.lv, units: g.units.filter(Boolean).length };
      g.en = g.en.filter((e) => e.t !== 'boss'); g.waveT = 1e9; g.spawnT = 1e9; const e = __dbg.spawn('boss', 1.0 * 0.85, [g.ax + 220, g.ay + 40]); e.bn = ['t', '']; e.bi = 1; e.bk = 4; g.en = [e]; const hp0 = e.hp, b0 = g.baseHp; let tt = 0, hm = h.hp;
      for (; tt < 120; tt += 0.034) { g.ev = null; h.offer = null; g.waveT = 1e9; g.spawnT = 1e9; g.en = g.en.filter((x) => x === e || x.t === 'grunt'); __dbg.stepBattle(0.034); hm = Math.min(hm, h.hp); h.x = g.ax - 60; h.y = g.ay + 80; if (e.hp <= 0 || g.ph !== 'battle') break; }
      return Object.assign(out, { hp0: Math.round(hp0), ttk: +tt.toFixed(0), killed: e.hp <= 0, baseLoss: Math.round(b0 - g.baseHp), heroMin: Math.round(hm), mx: h.mx }); }, [role, bhp]);
    console.log(role, bhp, JSON.stringify(r).slice(0, 420), errs); await p.close();
  }
  await b.close();
})();
