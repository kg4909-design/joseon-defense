const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const pg = await b.newPage(); const errs = []; pg.on('pageerror', (e) => errs.push(e.message));
  await pg.goto('file:///home/claude/work/game/dist/index.html');
  const out = await pg.evaluate(() => {
    const all = {}; const LAG = 150;
    function bot(G) {
      while (G.food >= summonCost() && G.units.includes(null)) if (!doSummon(false)) break;
      for (let a = 0; a < 12; a++) for (let c = a + 1; c < 12; c++) { const A = G.units[a], B = G.units[c]; if (A && B && A.t === B.t && A.lv === B.lv && B.lv < 4) doMerge(a, c); }
      for (const id of G.order) { const p = G.pl[id]; if (p.offer) { applyCard(p, p.offer[Math.floor(Math.random() * 3)]); p.offer = null; } p.x = 600; p.y = 270; }
      if (G.ev) for (const id of G.order) G.ev.votes[id] = 0;
    }
    for (const np of [1, 1, 2, 2, 4, 4]) {
      G = newG(); for (let i = 0; i < np; i++) addPlayer('p' + i, 'n' + i, ['archer', 'militia', 'monk', 'gunner'][i]);
      G.sel.dur = 300; G.sel.diff = 3.5; G.wallN = 0; G.bonus = 0; const log = []; let r = 0, tries = 0;
      while (r < 30 && tries < 90) { startRound(r); beginBattle(); let n = 0; while (G.ph === 'battle' && n < 9100) { stepBattle(1 / 30); if (n % LAG === 0) bot(G); n++; } const w = G.res.win; log.push(w ? '○' : '×'); tries++; if (w) { r++; G.bonus = 30; } else if (tries > 0 && log.slice(-3).every((x) => x === '×')) { r++; } }
      all['np' + np + '_' + Object.keys(all).length] = log.join('');
    }
    return all;
  });
  console.log(out, errs); await b.close();
})();
