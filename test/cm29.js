const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1180, height: 820 } });
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.37'); });
  const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
  await p.goto('file:///home/claude/joseon-defense/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' }); await p.click('#btnSingle'); await p.waitForTimeout(200);
  const r = await p.evaluate(() => {
    const D = window.__dbg, G = D.G, o = {};
    D.hostCtl('start', { start: 0, dur: 240, diff: 'normal', wall: 0 });
    while (G.order.length < 3) addPlayer('p' + G.order.length, 'b' + G.order.length, ['militia', 'monk', 'gunner'][G.order.length - 1]);
    D.hostCtl('start', { start: 0, dur: 240, diff: 'normal', wall: 0, coop: true });
    o.cm = G.cm; o.rd = G.rd; o.obj = G.obj; o.cmOn = G.cmOn; o.camps = G.en.filter((e) => e.t === 'camp').length; o.crs = G.order.map((id) => G.pl[id].cr);
    G.ph = 'battle'; G.evDone = [true, true]; G.bossTimes = []; for (const id of G.order) { const h = G.pl[id]; h.offer = null; }
    // 능력
    const [a, bb, c] = G.order.map((id) => G.pl[id]);
    G.baseHp = G.baseMax * 0.5; a.cc = 0; hostMsg(a.id, { k: 'cr' }); o.guard = { inv: G.bInv, base: +(G.baseHp / G.baseMax).toFixed(2), cc: a.cc };
    if (!G.en.some((e) => e.t === 'camp')) return o; const cp = G.en.find((e) => e.t === 'camp'); bb.x = cp.x; bb.y = cp.y; const h0 = cp.hp; hostMsg(bb.id, { k: 'cr' }); o.ranger = { campLoss: +((h0 - cp.hp) / cp.mx).toFixed(2), cc: bb.cc };
    a.hp = a.mx * 0.2; bb.down = 5; const f0 = G.food; hostMsg(c.id, { k: 'cr' }); o.supply = { hp: +(a.hp / a.mx).toFixed(2), down: bb.down, food: G.food - f0, cc: c.cc };
    hostMsg(a.id, { k: 'cr' }); o.cdBlock = a.cc > 20;
    const snap = makeSnap(); o.snap = { cm: snap.cm, cmn: snap.cmn, cr: snap.pl.map((q) => q.cr) };
    // 시간 종료 시 기지 남음 → 패배
    for (const id of G.order) { const h = G.pl[id]; h.hp = h.mx = 1e7; h.down = 0; } G.baseHp = G.baseMax = 1e9; o.pre = G.en.filter((e) => e.t === 'camp').map((e) => Math.round(e.hp / e.mx * 100)); G.t = G.dur - 0.01; o.flags = { ev: !!G.ev, paused: G.paused, du: !!G.du, offer: G.order.map((id) => !!G.pl[id].offer), ph: G.ph, cmOn: G.cmOn, castle: G.castle, base: G.baseHp }; D.stepBattle(0.05);
    o.dbg = { cmOn: G.cmOn, camps: G.en.length, t: G.t, dur: G.dur, rd: G.rd };
    o.res = JSON.stringify(G.res); o.fail = { ph: G.ph, win: G.res && G.res.win, cmf: G.res && G.res.cmf };
    // 기지 모두 부수면 승리
    D.hostCtl('start', { start: 0, dur: 240, diff: 'normal', wall: 0, coop: true }); G.ph = 'battle'; G.evDone = [true, true]; G.bossTimes = []; for (const id of G.order) { G.pl[id].hp = G.pl[id].mx = 1e7; G.pl[id].offer = null; }
    G.baseHp = G.baseMax = 1e9; for (const e of G.en) if (e.t === 'camp') e.hp = 0; D.stepBattle(0.05); G.t = G.dur - 0.01; D.stepBattle(0.05);
    o.win = { ph: G.ph, win: G.res && G.res.win };
    // 비협동 회귀: 보급기지 없음
    D.hostCtl('start', { start: 0, dur: 240, diff: 'normal', wall: 0 }); o.nocoop = { cm: G.cm, camps: G.en.filter((e) => e.t === 'camp').length, cr: G.order.map((id) => G.pl[id].cr) };
    return o;
  });
  console.log(JSON.stringify(r, null, 1)); console.log('errs', errs); await b.close();
})();
