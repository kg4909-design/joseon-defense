const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 844, height: 390 }, hasTouch: true });
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.34'); });
  const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
  await p.goto('file:///home/claude/work/game/dist/index.html'); await p.waitForTimeout(400);
  await p.click('#btnSingle'); await p.waitForTimeout(300);
  const r = await p.evaluate(() => {
    const D = window.__dbg, G = D.G, o = {}; D.hostCtl('start', { start: 0, dur: 180, diff: 'normal', wall: 0 }); G.ph = 'battle'; const me = G.pl[G.order[0]]; me.cards = { bow: 2, sword: 1 };
    G.t = 41; const keep = () => { me.hp = me.mx; me.down = 0; me.offer = null; me.qz = null; G.baseHp = G.baseMax; };
    keep(); D.stepBattle(1 / 30); o.created = !!G.bc; me.x = G.bc.x; me.y = G.bc.y; D.stepBattle(1 / 30); o.st1 = G.bc.st; o.snap = D.makeSnap().bc;
    for (let i = 0; i < 60 * 30 && G.bc.st < 2; i++) { keep(); me.x = G.bc.x; me.y = G.bc.y; D.stepBattle(1 / 30); } o.done = G.bc.st; o.p = G.bc.p; o.t = G.t; o.ph = G.ph; o.cards = { bow: me.cards.bow, sword: me.cards.sword };
    const d0 = D.heroStats(me).dmg; D.addAug(); G.aug.dm = 0.5; o.augDmg = +(D.heroStats(me).dmg / d0).toFixed(2);
    return o; });
  console.log(JSON.stringify(r)); console.log('ERR', errs); await b.close();
})();
