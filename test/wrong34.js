const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 844, height: 390 } }); const errs = [];
  p.on('pageerror', (e) => errs.push(String(e)));
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.39'); localStorage.setItem('jd_hid', '1'); });
  await p.goto('file:///home/claude/joseon-defense/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' }); await p.waitForTimeout(300);
  await p.click('#btnSingle'); await p.waitForTimeout(300);
  await p.evaluate(() => { const D = window.__dbg, G = D.G; D.hostCtl('start', { start: 3, dur: 300, diff: 'normal', coop: true, fix: 1, bots: 2, cl: 2 }); D.hostCtl('fight'); G.evDone = [true, true]; G.bossTimes = []; G.lvq = 1; });
  await p.waitForTimeout(800);
  await p.evaluate(() => { const D = window.__dbg, G = D.G, q = G.pl[G.qzr]; D.hostMsg(G.qzr, { k: 'qa', i: (q.qz.a + 1) % q.qz.o.length }); });
  await p.waitForTimeout(1200); await p.screenshot({ path: '/tmp/ui33/wrong1.png' });
  const early = await p.evaluate(() => { const D = window.__dbg, G = D.G; D.hostMsg(G.qzr, { k: 'card', i: 0 }); return { stillOffer: !!G.pl[G.qzr].offer, rd: G.pl[G.qzr].qrd }; });
  await p.waitForTimeout(7500);
  const late = await p.evaluate(() => { const D = window.__dbg, G = D.G; const had = !!G.pl[G.qzr].offer; D.hostMsg(G.qzr, { k: 'card', i: 0 }); return { had, cleared: !G.pl[G.qzr].offer }; });
  console.log(JSON.stringify({ early, late }), errs); await b.close();
})();
