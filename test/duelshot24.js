const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  for (const [w, h] of [[1180, 820], [844, 390]]) {
    const p = await b.newPage({ viewport: { width: w, height: h }, hasTouch: w < 1000 });
    await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.41'); });
    const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
    await p.goto('file:///home/claude/work/game/dist/index.html'); await p.waitForTimeout(5500);
    await p.click('#btnSingle'); await p.waitForTimeout(300); await p.click('#btnStart'); await p.waitForTimeout(500);
    await p.click('#bqOpts .qo'); await p.click('#btnFight'); await p.waitForSelector('#sBattle.on'); await p.waitForTimeout(800);
    await p.evaluate(() => { const G = window.__dbg.G; G.evDone = [true, true]; G.t = 119.5; const h = G.pl[G.order[0]]; h.cards = { bow: 3, nu: 2 }; });
    await p.waitForTimeout(1500); await p.screenshot({ path: `test/duel_${w}_warn.png` });
    await p.waitForTimeout(5200); await p.screenshot({ path: `test/duel_${w}_fight.png` });
    console.log(w, await p.evaluate(() => { const G = window.__dbg.G; return G.du ? { ph: G.du.ph, hp: Math.round(G.du.b.hp / G.du.b.mx * 100), tl: G.du.tl.length } : 'no duel'; }), errs);
    await p.close();
  }
  await b.close();
})();
