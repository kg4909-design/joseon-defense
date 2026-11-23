const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 844, height: 390 }, hasTouch: true });
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.42'); });
  const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
  await p.goto('file:///home/claude/work/game/dist/index.html'); await p.waitForTimeout(400);
  await p.click('#btnSingle'); await p.waitForTimeout(300);
  const r = await p.evaluate(() => {
    const D = window.__dbg, G = D.G, o = {};
    D.hostCtl('start', { start: 1, dur: 300, diff: 'normal', wall: 0 }); G.ph = 'battle'; const me = G.pl[G.order[0]]; o.lives0 = G.lives; o.castle = !!G.castle; o.cm = !!G.cm; o.n = G.order.length;
    G.lives = 0; me.hp = 0; for (let i = 0; i < 6; i++) { G.ev = null; me.offer = null; D.stepBattle(1 / 30); }
    o.afterDie = { ph: G.ph, down: me.down, hp: me.hp };
    for (let i = 0; i < 90 && G.ph === 'battle'; i++) D.stepBattle(1 / 30); o.ph2 = G.ph;
    D.hostCtl('start', { start: 1, dur: 300, diff: 'normal', wall: 0 }); G.ph = 'battle'; for (let i = 0; i < 20; i++) D.stepBattle(1 / 30);
    o.again = { ph: G.ph, down: me.down, hp: me.hp, x: Math.round(me.x), y: Math.round(me.y) };
    return o;
  });
  console.log(JSON.stringify(r)); console.log('ERR', JSON.stringify(errs)); await b.close();
})();
