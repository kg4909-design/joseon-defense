const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 851, height: 393 } }); const errs = [];
  p.on('pageerror', (e) => errs.push(String(e)));
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.34'); localStorage.setItem('jd_hid', '1'); });
  await p.goto('file:///home/claude/joseon-defense/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' }); await p.waitForTimeout(300);
  await p.click('#btnSingle'); await p.waitForTimeout(300);
  const run = (start, label) => p.evaluate(({ start, label }) => {
    const D = window.__dbg, G = D.G; D.hostCtl('start', { start, dur: 300, diff: 'easy', coop: false, bots: 0 }); D.hostCtl('fight'); G.evDone = [true, true]; G.bossTimes = [];
    const out = { label, castle: G.castle, obj: G.obj, ww: G.ww, wh: G.wh }; G.sm = { cur: null, nt: 0.1, last: 'x', ok: 0, no: 0 }; let seen = false, walk = [];
    for (let i = 0; i < 700 && G.ph === 'battle'; i++) {
      for (const id of G.order) { const q = G.pl[id]; if (q.offer) { if (q.qz && q.qs === 0 && id === G.qzr) D.hostMsg(id, { k: 'qa', i: q.qz.a }); else if (q.qs !== 0 && q.qrd <= 0 && (!q.qz || id === G.qzr)) D.hostMsg(id, { k: 'card', i: 0 }); } q.hp = q.mx; }
      const S = G.sm; if (S && !S.cur && !seen && S.nt < 1) { S.last = 'x'; /* 강제 ref */ const orig = Math.random; let k = 0; }
      D.stepBattle(0.1); const m = G.sm && G.sm.cur;
      if (m && m.k !== 'ref' && !seen) { G.sm.cur = null; G.sm.nt = 0.05; G.sm.last = m.k; continue; }
      if (m && m.k === 'ref') { if (!seen) { seen = true; out.start = [Math.round(m.u.x), Math.round(m.u.y)]; out.cs = m.cs; out.goal = m.g.map(Math.round); } G.en = G.en.filter((e) => Math.hypot(e.x - m.u.x, e.y - m.u.y) > 300); if (i % 50 === 0) walk.push(Math.round(m.a)); }
      if (seen && (!m || m.k !== 'ref')) { out.end = { t: +G.t.toFixed(0), info: G.info && G.info.tt, tx: G.info && G.info.tx, ok: G.sm.ok, no: G.sm.no }; break; }
    }
    out.walk = walk; return out;
  }, { start, label });
  console.log(JSON.stringify(await run(0, '성 라운드')));
  console.log(JSON.stringify(await run(3, '비성 라운드')));
  console.log('errs', errs); await b.close();
})();
