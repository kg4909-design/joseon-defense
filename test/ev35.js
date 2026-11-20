const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 851, height: 393 } }); const errs = [];
  p.on('pageerror', (e) => errs.push(String(e)));
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.33'); localStorage.setItem('jd_hid', '1'); });
  await p.goto('file:///home/claude/joseon-defense/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' }); await p.waitForTimeout(300);
  await p.click('#btnSingle'); await p.waitForTimeout(300);
  const out = await p.evaluate(() => {
    const D = window.__dbg, G = D.G, R = {};
    const play = (diff, secs, setup) => {
      D.hostCtl('start', { start: 0, dur: 300, diff, coop: false, bots: 0, cl: 1 }); D.hostCtl('fight'); G.evDone = [true, true]; G.bossTimes = []; if (setup) setup();
      const seen = { wx: new Set(), hard: new Set(), sm: new Set(), mor: 0 };
      for (let i = 0; i < secs * 10 && G.ph === 'battle'; i++) {
        for (const id of G.order) { const q = G.pl[id]; if (q.offer) { if (q.qz && q.qs === 0 && id === G.qzr) D.hostMsg(id, { k: 'qa', i: q.qz.a }); else if (q.qs !== 0 && q.qrd <= 0 && (!q.qz || id === G.qzr)) D.hostMsg(id, { k: 'card', i: 0 }); } q.hp = q.mx; }
        D.stepBattle(0.1); if (G.wx) seen.wx.add(G.wx.k); if (G.sm && G.sm.cur) seen.sm.add(G.sm.cur.k); if (G.hd2) seen.hard.add('two'); if (G.en.some((e) => e.hb != null)) seen.hard.add('boss'); if (G.en.some((e) => e.arm)) seen.hard.add('arm'); if (G.t < (G.moraleT || 0)) seen.mor++;
        G.baseHp = Math.max(G.baseHp, G.baseMax * 0.5); }
      return { t: Math.round(G.t), diff, wx: [...seen.wx], hard: [...seen.hard], sm: [...seen.sm], mor: seen.mor, ph: G.ph };
    };
    R.normal = play('normal', 280, () => { G.wxNext = 20; });
    R.hard = play('hard', 280, () => { G.wxNext = 20; });
    // 성 수리 강제: 성 체력 낮추기
    D.hostCtl('start', { start: 0, dur: 300, diff: 'normal', coop: false, bots: 0, cl: 1 }); D.hostCtl('fight'); G.evDone = [true, true]; G.bossTimes = [];
    let rep = null; G.baseHp = G.baseMax * 0.4;
    for (let i = 0; i < 700 && G.ph === 'battle'; i++) { for (const id of G.order) { const q = G.pl[id]; if (q.offer) { if (q.qz && q.qs === 0 && id === G.qzr) D.hostMsg(id, { k: 'qa', i: q.qz.a }); else if (q.qs !== 0 && q.qrd <= 0 && (!q.qz || id === G.qzr)) D.hostMsg(id, { k: 'card', i: 0 }); } q.hp = q.mx; } if (G.sm && G.sm.cur && G.sm.cur.k === 'rep' && !rep) { rep = { start: G.t, hp0: G.baseHp / G.baseMax }; const p0 = G.pl[G.order[0]]; p0.x = G.ax; p0.y = G.ay; } D.stepBattle(0.1); if (rep && !rep.end && !(G.sm.cur && G.sm.cur.k === 'rep')) { rep.end = G.t; rep.hp1 = G.baseHp / G.baseMax; rep.info = G.info && G.info.tt; break; } if (G.sm && G.sm.cur && G.sm.cur.k === 'rep') { const p0 = G.pl[G.order[0]]; p0.x = G.ax; p0.y = G.ay; } G.baseHp = Math.min(G.baseHp, G.baseMax); }
    R.rep = rep; R.castle = G.castle; return R;
  });
  console.log(JSON.stringify(out, null, 1)); console.log('errs', errs); await b.close();
})();
