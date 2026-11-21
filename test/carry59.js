const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 844, height: 390 }, hasTouch: true });
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.40'); });
  const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
  await p.goto('file:///home/claude/work/game/dist/index.html'); await p.waitForTimeout(400);
  await p.click('#btnSingle'); await p.waitForTimeout(300);
  const r = await p.evaluate(() => {
    const D = window.__dbg, G = D.G, o = {};
    D.hostCtl('start', { start: 4, dur: 300, diff: 'normal', wall: 0 }); G.ph = 'battle'; G.en = []; const me = G.pl[G.order[0]];
    D.spawnBoss(0.8, 0.8); const nm = G.bn[0]; o.nm = nm; o.duel = !!G.du;
    G.du.ph = 'fight'; G.du.tm = 0.01; for (let i = 0; i < 5; i++) { me.hp = me.mx; D.stepBattle(1 / 30); if (!G.du) break; }
    o.afterLoss = { du: !!G.du, boss: G.en.some((e) => e.t === 'boss') };
    G.t = G.dur + 1; for (let i = 0; i < 5 && G.ph === 'battle'; i++) D.stepBattle(1 / 30); o.ph = G.ph; o.carry = G.carryBoss && G.carryBoss[0];
    D.hostCtl('start', { start: 4, dur: 300, diff: 'normal', wall: 0 }); G.bpi = 5; G.ph = 'battle'; G.en = []; o.carryKept = G.carryBoss && G.carryBoss[0]; D.spawnBoss(0.8, 0.8); o.next = G.bn[0]; o.same = o.next === nm;
    return o;
  });
  console.log(JSON.stringify(r)); console.log('ERR', JSON.stringify(errs)); await b.close();
})();
