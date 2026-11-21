const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1180, height: 820 } });
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.36'); });
  const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
  await p.goto('file:///home/claude/joseon-defense/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' }); await p.click('#btnSingle'); await p.waitForTimeout(200);
  const r = await p.evaluate(() => {
    const D = window.__dbg, G = D.G, o = {};
    D.hostCtl('start', { start: 0, dur: 180, diff: 'normal', wall: 0, coop: true, bots: 3 });
    o.names = G.order.map((id) => G.pl[id].name + ':' + G.pl[id].role + ':' + G.pl[id].cr);
    for (let i = 0; i < 100; i++) D.botAI(0.1); o.ans = Object.keys(G.ans).length;
    D.hostCtl('fight'); G.evDone = [true, true]; G.bossTimes = [];
    const human = G.pl[G.order[0]]; let evs = 0, offers = 0, maxEn = 0;
    const bots = G.order.slice(1).map((id) => G.pl[id]); const moved = bots.map(() => 0), lastPos = bots.map((q) => [q.x, q.y]); let crUse = bots.map(() => 0), prevCc = bots.map(() => 0), skUse = 0, campsKilledAt = null;
    const startCamps = G.en.filter((e) => e.t === 'camp').length;
    for (let i = 0; i < 30 * 170 && G.ph === 'battle'; i++) {
      human.hp = human.mx; human.x = G.ax; human.y = G.ay + 60;
      if (G.ev) evs++; if (human.offer) { applyCard(human, human.offer[0]); human.offer = null; human.qz = null; offers++; }
      D.botAI(1 / 30); D.stepBattle(1 / 30);
      bots.forEach((q, k) => { moved[k] += Math.hypot(q.x - lastPos[k][0], q.y - lastPos[k][1]); lastPos[k] = [q.x, q.y]; if ((q.cc || 0) > prevCc[k] + 1) crUse[k]++; prevCc[k] = q.cc || 0; });
      maxEn = Math.max(maxEn, G.en.length);
      if (campsKilledAt == null && G.en.filter((e) => e.t === 'camp').length === 0) campsKilledAt = Math.round(G.t);
    }
    o.end = { ph: G.ph, win: G.res && G.res.win, cmf: G.res && G.res.cmf, t: Math.round(G.t), startCamps, campsKilledAt, evs, maxEn, base: Math.round(G.baseHp / G.baseMax * 100) };
    o.bots = bots.map((q, k) => ({ n: q.name, moved: Math.round(moved[k]), crUse: crUse[k], lv: q.lv, hp: Math.round(q.hp / q.mx * 100), units: G.units.filter(Boolean).length }));
    for (let i = 0; i < 100; i++) D.botAI(0.1); o.mer = bots.map((q) => (q.mer ? Object.keys(q.mer).length : 0));
    D.hostCtl('lobby'); o.afterLobby = G.order.length;
    D.hostCtl('start', { start: 0, dur: 180, diff: 'normal', wall: 0, coop: false, bots: 3 }); o.noCoopBots = G.order.length;
    return o;
  });
  console.log(JSON.stringify(r)); console.log('errs', errs); await b.close();
})();
