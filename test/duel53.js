const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 844, height: 390 }, hasTouch: true });
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.40'); });
  const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
  await p.goto('file:///home/claude/work/game/dist/index.html'); await p.waitForTimeout(400);
  await p.click('#btnSingle'); await p.waitForTimeout(300);
  const r = await p.evaluate(() => {
    const D = window.__dbg, G = D.G, out = {};
    for (const [dif, lab] of [['normal', 'n'], ['hard', 'h']]) {
      D.hostCtl('start', { start: 4, dur: 300, diff: dif, wall: 0 }); G.ph = 'battle'; const me = G.pl[G.order[0]]; me.cards = { bow: 3, cannon: 2, spear: 2 }; G.en = [];
      D.spawnBoss(0.8, 0.8); const kinds = {}; let t = 0, dead = false, lostT = 0, minHp = 1e9, ratio = G.du && G.du.ratio;
      const seenPh = {};
      for (let i = 0; i < 30 * 120 && G.du; i++) { G.paused = false; G.ev = null; me.offer = null; me.qz = null; if (me.hp <= 0) { dead = true; break; } D.stepBattle(1 / 30); t += 1 / 30; for (const x of G.du ? G.du.tl : []) kinds[x.k] = (kinds[x.k] || 0) + 1; if (G.du) { const hp = G.du.b.hp / G.du.b.mx; seenPh[hp > 0.66 ? 1 : hp > 0.33 ? 2 : 3] = 1; } }
      out[lab] = { ratio, kinds, t: Math.round(t), dead, heroHp: Math.round(me.hp), mx: Math.round(me.mx), bossLeft: G.du ? Math.round(G.du.b.hp / G.du.b.mx * 100) : 'end', seenPh: Object.keys(seenPh) };
    }
    return out;
  });
  console.log(JSON.stringify(r)); console.log('ERR', JSON.stringify(errs)); await b.close();
})();
