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
    me.cards = { bow: 4 }; G.info = null; D.applyCard ? D.applyCard(me, 'bow') : 0; o.hint = G.info && G.info.tt + '/' + G.info.tx;
    G.units = [{ t: 'bow', lv: 1, cd: 1, hp: 10 }]; D.stepBattle(1 / 30); const snap = D.makeSnap(); o.sum = snap.sum;
    D.spawnBoss(0.8, 0.8, ['테스트장수', '설명']); const bs = G.en.find((e) => e.t === 'boss'); bs.hp = -1; D.stepBattle(1 / 30); o.sum2 = D.makeSnap().sum; return o; });
  console.log(JSON.stringify(r)); console.log('ERR', errs); await b.close();
})();
