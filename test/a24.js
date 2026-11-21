const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1180, height: 820 } });
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.36'); });
  const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
  await p.goto('file:///home/claude/work/game/dist/index.html');
  await p.click('#btnSingle'); await p.waitForTimeout(400);
  const o = await p.evaluate(() => {
    const D = window.__dbg; D.hostCtl('start', { start: 0, dur: 180, diff: 'normal' }); const G = D.G, id = G.order[0], h = G.pl[id]; const r = {};
    G.ph = 'battle'; G.food = 500; h.hp = h.mx = 1e5;
    G.baseHp = G.baseMax * 0.65; D.stepBattle(1 / 30); r.inv1 = G.bInv > 0; r.info = G.info && G.info.tt;
    const hp0 = G.baseHp; G.baseHp -= 100; D.stepBattle(1 / 30); r.clamped = Math.abs(G.baseHp - hp0) < 1;
    for (let i = 0; i < 100; i++) { G.ev = null; h.offer = null; D.stepBattle(1 / 30); } r.invEnd = G.bInv <= 0;
    G.baseHp = G.baseMax * 0.32; G.bInv = 0; D.stepBattle(1 / 30); r.inv2 = G.bInv > 0 && G.bm[1];
    G.bInv = 0; G.baseHp = G.baseMax * 0.5; G.repCd = 0; const f0 = G.food, b0 = G.baseHp; D.hostMsg(id, { k: 'rep' }); r.rep = [f0 - G.food, Math.round(G.baseHp - b0), G.repCd]; D.hostMsg(id, { k: 'rep' }); r.repCdBlock = G.food === f0 - 60;
    const s = D.makeSnap(G); r.snap = [s.bi, s.rcd, Math.round(s.wv)];
    D.hostCtl('start', { start: 1, dur: 180, diff: 'normal' }); r.crates = D.G.crates.map((c) => c.k); r.amb = D.G.ambT; r.need = D.G.need;
    return r;
  });
  console.log(JSON.stringify(o), errs);
  await b.close();
})();
