const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 844, height: 390 } }); const errs = [];
  p.on('pageerror', (e) => errs.push(String(e)));
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.34'); localStorage.setItem('jd_hid', '1'); });
  await p.goto('file:///home/claude/joseon-defense/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' }); await p.waitForTimeout(300);
  await p.click('#btnSingle'); await p.waitForTimeout(300);
  const run = (coop, bots) => p.evaluate(({ coop, bots }) => {
    const D = window.__dbg, G = D.G; D.hostCtl('start', { start: 3, dur: 300, diff: 'easy', coop, bots, cl: 1 }); D.hostCtl('fight'); G.evDone = [true, true]; G.bossTimes = [];
    const starts = []; let last = null; const out = { humans: G.order.filter((i) => !G.pl[i].bot).length, bots: G.order.filter((i) => G.pl[i].bot).length, cm: G.cm, obj: G.obj, rd: G.rd, quiz: null };
    for (let i = 0; i < 1000 && G.ph === 'battle'; i++) {
      if (i === 100) G.lvq = 1;
      for (const id of G.order) { const q = G.pl[id]; if (q.offer) { if (q.qz && q.qs === 0 && id === G.qzr) { out.quiz = out.quiz || { by: G.qzr === G.order[0], others: G.order.filter((x) => G.pl[x].offer).length }; D.hostMsg(id, { k: 'qa', i: q.qz.a }); } else if (q.qs !== 0 && q.qrd <= 0 && (!q.qz || id === G.qzr)) D.hostMsg(id, { k: 'card', i: 0 }); } if (q.hp < q.mx * 0.6) q.hp = q.mx; }
      D.stepBattle(0.1); D.botAI(0.1); const m = G.sm && G.sm.cur; if (m && m !== last) { starts.push([+G.t.toFixed(0), m.k]); last = m; } if (!m) last = null;
    }
    out.subs = starts.length; out.first = starts[0]; return out;
  }, { coop, bots });
  console.log('협동전+봇2', JSON.stringify(await run(true, 2)));
  console.log('협동전+봇0', JSON.stringify(await run(true, 0)));
  console.log('일반(협동X)', JSON.stringify(await run(false, 0)));
  console.log('errs', errs); await b.close();
})();
