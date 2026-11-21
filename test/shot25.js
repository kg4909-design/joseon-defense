const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  for (const [w, h] of [[1180, 820], [844, 390]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.35'); });
    const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
    await p.goto('file:///home/claude/work/game/dist/index.html'); await p.waitForTimeout(400);
    await p.click('#btnSingle'); await p.waitForTimeout(300);
    await p.evaluate(() => { const D = window.__dbg; D.hostCtl('start', { start: 0, dur: 180, diff: 'normal', wall: 0 }); const G = D.G, h = G.pl[G.order[0]]; h.role = 'monk'; G.ph = 'battle'; G.t = 50; });
    await p.waitForTimeout(1500);
    await p.evaluate(() => { const D = window.__dbg, G = D.G, h = G.pl[G.order[0]]; D.pickQuiz(h); h.offer = ['sword', 'bow', 'forge']; h.offT = 14; });
    await p.waitForTimeout(700); await p.screenshot({ path: `test/s25_quiz_${w}.png` });
    await p.evaluate(() => { const D = window.__dbg, G = D.G, h = G.pl[G.order[0]]; D.hostMsg(G.order[0], { k: 'qa', i: h.qz.a }); });
    await p.waitForTimeout(700); await p.screenshot({ path: `test/s25_ok_${w}.png` });
    await p.evaluate(() => { const D = window.__dbg, G = D.G, h = G.pl[G.order[0]]; D.hostMsg(G.order[0], { k: 'card', i: 0 }); });
    await p.waitForTimeout(800); await p.screenshot({ path: `test/s25_btn_${w}.png` });
    console.log(w, errs); await p.close();
  }
  await b.close();
})();
