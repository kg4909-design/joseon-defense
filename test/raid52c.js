const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 844, height: 390 }, hasTouch: true });
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.33'); });
  const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
  await p.goto('file:///home/claude/work/game/dist/index.html'); await p.waitForTimeout(400);
  await p.click('#btnSingle'); await p.waitForTimeout(300);
  const r = await p.evaluate(() => {
    const D = window.__dbg, o = {log:[]}; D.hostCtl('start', { start: 3, dur: 300, diff: 'normal', wall: 0, coop: true, bots: 3, cl: 2, obj: 'r' }); const G = D.G; G.ph = 'battle'; G.du = null;
    const camps = () => G.en.filter((e) => e.t === 'camp').sort((a, c) => a.cj - c.cj);
    for (const id of G.order) { const q = G.pl[id]; q.hp = q.mx = 99999; } const me = G.pl[G.order[0]];
    o.obj = G.obj; o.start = camps().map((c) => [c.cj, !!c.lk]);
    const run = (sec) => { for (let i = 0; i < sec * 30; i++) { if (G.ph !== 'battle') break; G.paused = false; G.ev = null; me.offer = null; me.qz = null; for (const id of G.order) G.pl[id].hp = G.pl[id].mx; D.stepBattle(1 / 30); } };
    run(5); // 잠긴 창고 공격해도 안 죽어야
    const c2 = camps()[1]; c2.hp = -5; run(1); o.lockedSurvives = camps().length === 3;
    camps()[0].hp = -1; run(1); o.afterFirst = { n: camps().length, wait: G.rgWait, info: G.info && G.info.tt, nxLocked: !!camps()[0].lk };
    G.t = 62; run(1); o.afterGate = { t: Math.round(G.t), nxLocked: !!camps()[0].lk, info: G.info && G.info.tt };
    camps()[0].hp = -1; run(1); // 3번째 창고 gate 때문에 잠김 가능
    o.third = { n: camps().length, wait: Math.round(G.rgWait || 0) };
    G.t = 130; run(1); o.dbg = { lk: camps().map((c) => [c.cj, !!c.lk, c.hp]), gate: G.rgGate, wait: G.rgWait, ph: G.ph }; if (camps().length) { camps()[0].hp = -1; run(1); o.dbg2 = { n: camps().length, t: G.t, hp: camps().map((c) => c.hp), du: !!G.du, paused: G.paused, ph: G.ph }; run(1); }
    o.afterCamps = { n: camps().length, boss: G.en.filter((e) => e.t === 'boss').length, rgBoss: G.rgBoss, ph: G.ph, du: !!G.du, t: Math.round(G.t) };
    const bs = (G.du && G.du.b) || G.en.find((e) => e.t === 'boss'); if (bs) bs.hp = -1; run(6); o.bossDead = G.bossDead;
    o.end = { ph: G.ph, res: G.res && G.res.win };
    return o;
  });
  console.log(JSON.stringify(r)); console.log('ERR', JSON.stringify(errs)); await b.close();
})();
