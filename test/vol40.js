const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 844, height: 390 }, hasTouch: true });
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.37'); });
  const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
  await p.goto('file:///home/claude/work/game/dist/index.html'); await p.waitForTimeout(400);
  await p.click('#btnSingle'); await p.waitForTimeout(300);
  const r = await p.evaluate(() => {
    const D = window.__dbg, G = D.G, o = {}; D.hostCtl('start', { start: 0, dur: 180, diff: 'normal', wall: 0 }); G.ph = 'battle'; const me = G.pl[G.order[0]];
    const run = (cards) => { me.cards = cards; me.bw = 0; me.nw = 0; G.en = []; G.shots = []; for (let i = 0; i < 6; i++) { const e = D.spawn ? null : null; } return cards; };
    const cnt = (cards) => { me.cards = cards; me.bw = 0; me.bwt = 0; G.shots = []; G.en = []; D.spawnBoss(0.8, 0.8, ['t', 'x']); const bs = G.en.find((e) => e.t === 'boss'); bs.x = me.x + 120; bs.y = me.y; bs.hp = bs.mx = 1e9; let n = 0; for (let i = 0; i < 40; i++) { me.hp = me.mx; D.stepBattle(1 / 30); n += G.shots.filter((s) => s[5] === 'archer').length; G.shots = []; } return n; };
    o.base = cnt({ bow: 3 }); o.vol = cnt({ bow: 3, volley: 2 }); o.guard = !!D.evoElig; return o; });
  console.log(JSON.stringify(r)); console.log('ERR', errs); await b.close();
})();
