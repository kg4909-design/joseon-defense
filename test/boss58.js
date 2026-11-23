const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 844, height: 390 }, hasTouch: true });
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.42'); });
  const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
  await p.goto('file:///home/claude/work/game/dist/index.html'); await p.waitForTimeout(400);
  await p.click('#btnSingle'); await p.waitForTimeout(300);
  const r = await p.evaluate(() => {
    const D = window.__dbg, G = D.G, out = {};
    for (const nm of ['우키타 히데이에', '구로다 나가마사']) {
      D.hostCtl('start', { start: 4, dur: 300, diff: 'normal', wall: 0 }); G.ph = 'battle'; const me = G.pl[G.order[0]]; me.cards = { bow: 3, cannon: 2, spear: 2 }; G.en = [];
      D.spawnBoss(0.8, 0.8, [nm, 'x']); D.beginDuel(G.en.find((e) => e.t === 'boss')); G.du.ph = 'fight'; G.du.tm = 100; const kinds = {}; let mnMax = 0, soldier = 0, shieldKill = 0, i = 0, minionsAtKill = 0;
      for (; i < 30 * 150 && G.du; i++) { G.paused = false; G.ev = null; me.offer = null; me.qz = null; me.hp = me.mx; D.stepBattle(1 / 30); if (G.du) { for (const t of G.du.tl) kinds[t.k] = 1; mnMax = Math.max(mnMax, G.du.mn.length); for (const q of G.du.pj) if (q.s) soldier++; } }
      out[nm] = { kinds: Object.keys(kinds), mnMax, soldier, ended: !G.du, steps: i, duWins: G.duWins | 0 };
    }
    return out;
  });
  console.log(JSON.stringify(r)); console.log('ERR', JSON.stringify(errs)); await b.close();
})();
