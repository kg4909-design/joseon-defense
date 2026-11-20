const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1180, height: 820 } });
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.31'); });
  const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
  for (const np of [1, 2, 3, 4]) {
    await p.goto('file:///home/claude/joseon-defense/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' }); await p.click('#btnSingle'); await p.waitForTimeout(200);
    console.log(np, await p.evaluate((np) => {
      const D = window.__dbg, G = D.G; while (G.order.length < np) addPlayer('p' + G.order.length, 'b', ['militia', 'monk', 'gunner'][G.order.length - 1]);
      D.hostCtl('start', { start: 4, dur: 180, diff: 'normal', wall: 0 }); G.ph = 'battle'; G.t = 109.99; G.evDone = [true, true];
      for (const id of G.order) { const h = G.pl[id]; h.cards = { bow: 3, nu: 2, train: 2 }; }
      for (let i = 0; i < 5; i++) { G.ev = null; D.stepBattle(1 / 30); if (G.du) break; }
      if (!G.du) return 'no duel'; const mx = G.du.b.mx; let t = 0;
      for (let i = 0; i < 30 * 120 && G.du; i++) { G.ev = null; for (const id of G.order) { const h = G.pl[id]; h.hp = h.mx; h.offer = null; } D.stepBattle(1 / 30); t += 1 / 30; }
      return { bossHp: Math.round(mx), ttk: Math.round(t), won: !!G.bossDead, np: G.order.length };
    }, np));
  }
  console.log('errs', errs); await b.close();
})();
