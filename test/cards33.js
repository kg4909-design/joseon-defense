const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const errs = [];
  for (const [w, h] of [[1180, 820], [1766, 936], [844, 390], [667, 375]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.37'); });
    p.on('pageerror', (e) => errs.push(String(e)));
    await p.goto('file:///home/claude/joseon-defense/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' }); await p.click('#btnSingle'); await p.waitForTimeout(300);
    await p.evaluate(() => { window.__dbg.hostCtl('start', { start: 0, dur: 240, diff: 'normal', wall: 0, coop: true, bots: 3, cl: 1 }); }); await p.waitForTimeout(500);
    await p.evaluate(() => { const D = window.__dbg, G = D.G; D.hostCtl('fight'); G.evDone = [true, true]; G.bossTimes = []; G.lvq = 1; });
    await p.waitForTimeout(900);
    for (const st of ['quiz', 'cards']) {
      if (st === 'cards') { await p.evaluate(() => { const G = window.__dbg.G; const me = G.pl[G.order[0]]; if (G.qzr === me.id) hostMsg(me.id, { k: 'qa', i: me.qz.a }); else { hostMsg(G.qzr, { k: 'qa', i: G.pl[G.qzr].qz.a }); } }); await p.waitForTimeout(500); }
      await p.screenshot({ path: `/tmp/c33_${w}_${st}.png` });
    }
    const r = await p.evaluate(() => { const bb = (id) => { const e = document.getElementById(id); if (!e || getComputedStyle(e).display === 'none') return null; const r = e.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.top), Math.round(r.right), Math.round(r.bottom)]; }; return { cards: bb('cards'), cr: bb('btnCr'), sum: bb('btnSummon'), sk: bb('btnSkill'), up: bb('btnUp'), rep: bb('btnRep') }; });
    console.log(w, h, JSON.stringify(r));
    await p.close();
  }
  console.log('errs', errs); await b.close();
})();
