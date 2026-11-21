const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const errs = []; const p = await b.newPage({ viewport: { width: 1180, height: 820 } });
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.36'); });
  p.on('pageerror', (e) => errs.push(String(e)));
  await p.goto('file:///home/claude/joseon-defense/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' }); await p.click('#btnSingle'); await p.waitForTimeout(300);
  console.log('bank', await p.evaluate(() => [QALL.length, QALL.filter((x) => x.era < 6).length]));
  // era gating per chapter
  console.log('gating', await p.evaluate(() => { const o = []; for (const rd of [0, 12, 20, 27]) { const ch = R[rd].ch; o.push([rd, ch, Math.max(...QALL.filter((x) => x.era <= 6 + ch).map((x) => x.era)), QALL.filter((x) => x.era <= 6 + ch).length]); } return o; }));
  // solo: correct -> 4 cards, wrong -> 2
  for (const mode of ['right', 'wrong']) {
    await p.evaluate(() => { window.__dbg.hostCtl('start', { start: 0, dur: 240, diff: 'normal', wall: 0, bots: 0 }); }); await p.waitForTimeout(400);
    await p.evaluate(() => { const G = window.__dbg.G; window.__dbg.hostCtl('fight'); G.evDone = [true, true]; G.bossTimes = []; });
    const r = await p.evaluate((mode) => { const D = window.__dbg, G = D.G, me = G.pl[G.order[0]]; G.lvq = 1; G.xp = 0; return new Promise((res) => { setTimeout(() => { const o = { has: !!me.qz, by: G.qzr === me.id, offers: me.offer && me.offer.length }; hostMsg(me.id, { k: 'qa', i: mode === 'right' ? me.qz.a : (me.qz.a + 1) % me.qz.o.length }); o.after = me.offer.length; o.qs = me.qs; res(o); }, 600); }); }, mode);
    console.log('solo', mode, JSON.stringify(r)); await p.screenshot({ path: `/tmp/q33_solo_${mode}.png`, clip: { x: 150, y: 150, width: 880, height: 520 } });
    await p.evaluate(() => { window.__dbg.hostCtl('lobby'); }); await p.waitForTimeout(300);
  }
  // team: 3 players (2 bots + me); also humans via fake players
  const t = await p.evaluate(() => new Promise((res) => {
    const D = window.__dbg; D.hostCtl('start', { start: 0, dur: 240, diff: 'normal', wall: 0, coop: true, bots: 3, cl: 1 });
    setTimeout(() => { const G = D.G; D.hostCtl('fight'); G.evDone = [true, true]; G.bossTimes = [];
      const cnt = {}; for (let i = 0; i < 40; i++) { for (const id of G.order) { G.pl[id].offer = null; G.pl[id].qz = null; } G.lvq = 1; G.xp = 0; G.order.forEach((id) => { G.pl[id].bot = false; }); G.pl[G.order[3]].bot = true; G.pl[G.order[2]].bot = true; startQuiz(); cnt[G.qzr] = (cnt[G.qzr] || 0) + 1; }
      const ids = G.order; for (const id of ids) { G.pl[id].offer = null; G.pl[id].qz = null; } startQuiz(); const o = { qzr: G.qzr, spread: cnt, pend: ids.map((i) => [G.pl[i].qs, G.pl[i].offer.length]) };
      const wrongId = ids.find((i) => i !== G.qzr); hostMsg(wrongId, { k: 'qa', i: 0 }); o.nonQuizzerAnswerIgnored = G.pl[wrongId].qs === 0;
      const q = G.pl[G.qzr]; hostMsg(G.qzr, { k: 'qa', i: (q.qz.a + 1) % q.qz.o.length }); o.afterWrong = ids.map((i) => [G.pl[i].qs, G.pl[i].offer.length]); res(o); }, 500); }));
  console.log('team', JSON.stringify(t));
  console.log('errs', errs); await b.close();
})();
