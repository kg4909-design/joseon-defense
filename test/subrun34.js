const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 844, height: 390 } }); const errs = [];
  p.on('pageerror', (e) => errs.push(String(e)));
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.33'); localStorage.setItem('jd_hid', '1'); });
  await p.goto('file:///home/claude/joseon-defense/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' }); await p.waitForTimeout(300);
  await p.click('#btnSingle'); await p.waitForTimeout(300);
  const r = await p.evaluate(() => {
    const D = window.__dbg, G = D.G; D.hostCtl('start', { start: 3, dur: 300, diff: 'easy', coop: true, fix: 1, bots: 3, cl: 1 }); G.cmObj = null; D.hostCtl('fight'); G.evDone = [true, true]; G.bossTimes = [];
    const seen = []; let last = null; const info = [];
    for (let i = 0; i < 3000 && G.ph === 'battle'; i++) {
      for (const id of G.order) { const q = G.pl[id]; if (q.offer) { if (q.qz && q.qs === 0 && id === G.qzr) D.hostMsg(id, { k: 'qa', i: q.qz.a }); else if (q.qs !== 0 && (!q.qz || id === G.qzr)) D.hostMsg(id, { k: 'card', i: 0 }); } if (q.hp < q.mx * 0.5) q.hp = q.mx; }
      D.stepBattle(0.1); D.botAI(0.1);
      const m = G.sm && G.sm.cur; if (m && m !== last) { seen.push([Math.round(G.t), m.k]); } last = m || last;
      if (G.info && G.info.tt && info[info.length - 1] !== G.info.tt) info.push(G.info.tt);
    }
    return { t: Math.round(G.t), ph: G.ph, obj: G.obj, started: seen, ok: G.sm && G.sm.ok, no: G.sm && G.sm.no, info: info.filter((x) => /미션|일기토|서브/.test(x)).slice(0, 14) };
  });
  console.log(JSON.stringify(r)); console.log('errs', errs); await b.close();
})();
