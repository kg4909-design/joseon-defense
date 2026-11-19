const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] }).catch(() => chromium.launch({ channel: 'chrome', args: ['--no-sandbox'] }));
  const pg = await b.newPage({ viewport: { width: 1280, height: 720 } });
  const errs = []; pg.on('pageerror', (e) => errs.push(e.message)); pg.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await pg.goto('file:///home/claude/work/game/dist/index.html?fast=300');
  const out = await pg.evaluate(() => {
    const res = [];
    function bot(G) { G.magT = 1;
      while (G.food >= summonCost() && true) if (!doSummon(false)) break;
      for (let a = 0; a < 18; a++) for (let c = a + 1; c < 18; c++) { const A = G.units[a], B = G.units[c]; if (A && B && A.t === B.t && A.lv === B.lv && B.lv < 4) { doMerge(a, c); } }
      for (const id of G.order) { const p = G.pl[id]; if (p.offer) { applyCard(p, p.offer[Math.floor(Math.random() * 3)]); p.offer = null; } if (G.castle) { p.x = G.ax; p.y = G.ay + 60; } else { p.x = Math.max(60, Math.min(G.ww - 60, p.x)); } }
      if (G.upg < 5 && G.food >= UPC[G.upg] + summonCost()) hostMsg('p0', { k: 'upg' });
      if (G.ev) { for (const id of G.order) G.ev.votes[id] = 0; }
    }
    for (const np of [1, 2]) for (const rdi of [0, 1, 2, 3, 10]) {
      G = newG(); for (let i = 0; i < np; i++) addPlayer('p' + i, 'n' + i, ['archer', 'militia', 'monk', 'gunner'][i]);
      G.sel.dur = 300; startRound(rdi); beginBattle();
      let n = 0; while (G.ph === 'battle' && n < 300 * 30 + 10) { stepBattle(1 / 30); if (n % 15 === 0) bot(G); n++; }
      res.push({ np, rd: rdi + 1, ph: G.ph, win: G.res && G.res.win, base: Math.round(G.baseHp), t: Math.round(G.t), food: Math.round(G.food), units: G.units.filter(Boolean).length, lvs: G.units.filter(Boolean).map((u) => u.lv).join('') });
    }
    return res;
  });
  console.table(out); console.log('errors:', errs);
  await b.close();
})();
