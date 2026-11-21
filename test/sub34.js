const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 844, height: 390 } }); const errs = [];
  p.on('pageerror', (e) => errs.push(String(e)));
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.38'); localStorage.setItem('jd_hid', '1'); });
  await p.goto('file:///home/claude/joseon-defense/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' }); await p.waitForTimeout(300);
  await p.click('#btnSingle'); await p.waitForTimeout(300);
  const kinds = ['camp', 'conv', 'ref', 'twin', 'herb', 'rush', 'fast'];
  const res = await p.evaluate(async (kinds) => {
    const D = window.__dbg; D.hostCtl('start', { start: 3, dur: 300, diff: 'normal', coop: true, bots: 2, cl: 2 }); const G = D.G; G.cmObj = 'd'; G.obj = 'd'; G.cmM = false; D.hostCtl('fight');
    G.obj = 'd'; G.castle = true; G.evDone = [true, true]; G.bossTimes = []; G.cmOn = G.cmS = G.cmR = false;
    const out = {}; const me = G.pl[G.order[0]];
    for (const k of kinds) {
      G.sm = null; G.lvq = 0; for (const id of G.order) { G.pl[id].offer = null; G.pl[id].down = 0; G.pl[id].hp = G.pl[id].mx; }
      G.t = Math.max(G.t, 30); D.stepBattle(0.1); // init sm
      G.sm.cur = null; G.sm.last = ''; G.sm.nt = 0;
      // force this kind: temporary override Math.random-free: loop until chosen
      let tries = 0; while ((!G.sm.cur || G.sm.cur.k !== k) && tries++ < 200) { G.sm.cur = null; G.sm.nt = 0; G.sm.last = ''; for (const kk of kinds) {} D.stepBattle(0.05); if (G.sm.cur && G.sm.cur.k !== k) { const m = G.sm.cur; if (m.e) G.en.splice(G.en.indexOf(m.e), 1); for (const c of m.cv || []) G.en.splice(G.en.indexOf(c), 1); } }
      const m = G.sm.cur; if (!m || m.k !== k) { out[k] = 'never chosen'; continue; }
      const snap = D.makeSnap(); const info = { snapSm: snap.sm && snap.sm.n, pts: snap.sm && snap.sm.pts.length };
      // 성공시키기
      if (k === 'camp') m.e.hp = 0;
      else if (k === 'conv') for (const c of m.cv) c.hp = 0;
      else if (k === 'ref') { m.u.x = m.g[0]; m.u.y = m.g[1]; }
      else if (k === 'twin') { const h = G.order.map((i) => G.pl[i]); h[0].x = m.pa[0]; h[0].y = m.pa[1]; h[1].x = m.pb[0]; h[1].y = m.pb[1]; for (let i = 0; i < 80 && G.sm.cur; i++) { h[0].x = m.pa[0]; h[0].y = m.pa[1]; h[1].x = m.pb[0]; h[1].y = m.pb[1]; D.stepBattle(0.1); } }
      else if (k === 'herb') for (const q of m.h.slice()) { me.x = q[0]; me.y = q[1]; D.stepBattle(0.05); }
      else if (k === 'rush') m.t = 0.01;
      else if (k === 'fast') G.kc = (G.kc || 0) + 99;
      const lv0 = G.lvq, ok0 = G.sm.ok; D.stepBattle(0.1); D.stepBattle(0.1);
      out[k] = Object.assign(info, { ok: G.sm.ok - ok0 + (G.sm.cur ? 0 : 0), cleared: !G.sm.cur, okTotal: G.sm.ok, lvq: G.lvq - lv0 });
    }
    return out;
  }, kinds);
  console.log(JSON.stringify(res)); console.log('errs', errs); await b.close();
})();
