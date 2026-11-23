const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1180, height: 820 } });
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.42'); });
  const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
  const rows = [];
  for (const rdIdx of [2, 8]) for (const np of [1, 2, 3, 4]) {
    await p.goto('file:///home/claude/joseon-defense/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' }); await p.click('#btnSingle'); await p.waitForTimeout(200);
    rows.push(await p.evaluate(([rdIdx, np]) => {
    const D = window.__dbg, out = [];
    { D.hostCtl('start', { start: rdIdx, dur: 240, diff: 'normal', wall: 0 }); const G = D.G;
      while (G.order.length < np) addPlayer('p' + G.order.length, 'b' + G.order.length, ['militia', 'monk', 'gunner'][G.order.length - 1]);
      D.hostCtl('start', { start: rdIdx, dur: 240, diff: 'normal', wall: 0 }); G.ph = 'battle'; G.evDone = [true, true];
      for (const id of G.order) { const h = G.pl[id]; h.hp = h.mx = 1e6; h.cards = { bow: 2, sword: 2 }; }
      let maxEn = 0, sumEn = 0, n = 0, el = 0, bosses = 0, t0 = performance.now(), duels = 0, hpS = 0, hpN = 0, seenB = new Set();
      for (let i = 0; i < 30 * 200; i++) { G.ev = null; for (const id of G.order) G.pl[id].offer = null; if (G.du) { duels++; G.du.b.hp = 0; } D.stepBattle(1 / 30); if (i % 30 === 0) { maxEn = Math.max(maxEn, G.en.length); sumEn += G.en.length; n++; for (const e of G.en) { if (e.t === 'grunt') { hpS += e.mx; hpN++; } if (e.t === 'boss') seenB.add(e.id); } } }
      el = G.en.filter((e) => e.el).length;
      out.push({ rd: rdIdx, np, avgEn: Math.round(sumEn / n), maxEn, elites: el, gruntHp: Math.round(hpS / (hpN || 1)), bossSeen: seenB.size, duels: Math.round(duels / 85), msPerStep: +((performance.now() - t0) / 6000).toFixed(2), obj: G.obj, bossTimes: JSON.stringify(G.bossTimes) });
    }
    return out[0];
    }, [rdIdx, np]));
  }
  for (const r of rows) console.log(JSON.stringify(r));
  console.log('errs', errs); await b.close();
})();
