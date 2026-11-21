const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1180, height: 820 } });
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.38'); });
  const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
  await p.goto('file:///home/claude/work/game/dist/index.html');
  await p.click('#btnSingle'); await p.waitForTimeout(500);
  const r = await p.evaluate(async () => {
    const { G, hostCtl, hostMsg, stepBattle } = window.__dbg; const o = {};
    hostCtl('start', { start: 0, dur: 180, diff: 'normal' });
    G.ph = 'battle'; G.dur = 1e5; G.food = 999; const h = G.pl[G.order[0]];
    // aggro: 25 s, hero parked near the castle
    h.hp = h.mx = 1e5; h.x = G.ax - 120; h.y = G.ay + 60; const b0 = G.baseHp;
    for (let i = 0; i < 30 * 25; i++) { h.hp = 1e5; stepBattle(1 / 30); }
    o.baseLost = Math.round(b0 - G.baseHp); o.en = G.en.length;
    G.en = []; G.baseHp = G.baseMax - 100; for (let i = 0; i < 30 * 10; i++) stepBattle(1 / 30); const a1 = G.baseHp;
    for (let i = 0; i < 30 * 10; i++) stepBattle(1 / 30); o.regen = Math.round(G.baseHp - a1);
    G.baseHp = G.baseMax; h.hp = h.mx = 1e5; h.cards = {}; h.dead = 0; h.cd = 1e9; h.x = G.ax + 420; h.y = G.ay + 200; const hp0 = h.hp; const bb = G.baseHp; let en = 0;
    let hl = 0; for (let i = 0; i < 30 * 60; i++) { G.ev = null; h.offer = null; stepBattle(1 / 30); hl += Math.max(0, 1e5 - h.hp); if (G.en.length > (o.maxEn || 0)) { o.maxEn = G.en.length; o.hu = G.en.filter((e) => e.hu).length; } h.hp = 1e5; h.x = G.ax + 420; h.y = G.ay + 200; } o.heroDmg = Math.round(hl); o.lost90 = Math.round(bb - G.baseHp); o.en90 = G.en.length; o.hunt = G.en.filter((e) => e.hu).length;
    // merit
    G.baseHp = G.baseMax; G.dur = 100; G.t = 99.99; G.ev = null; stepBattle(1 / 30); stepBattle(1 / 30); o.ph = G.ph; o.mo = h.mo;
    return o;
  });
  console.log(JSON.stringify(r), errs);
  await b.close();
})();
