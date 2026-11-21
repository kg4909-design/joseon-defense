const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 844, height: 390 }, hasTouch: true });
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.38'); });
  const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
  await p.goto('file:///home/claude/work/game/dist/index.html'); await p.waitForTimeout(400);
  await p.click('#btnSingle'); await p.waitForTimeout(300);
  await p.evaluate(() => { const D = window.__dbg; D.hostCtl('start', { start: 0, dur: 180, diff: 'normal', wall: 0 }); const G = D.G; G.ph = 'battle'; const me = G.pl[G.order[0]]; me.cards = { bow: 5, train: 1 }; D.spawnBoss(0.8, 0.8, ['테스트장수', '시험']); G.en.find((e) => e.t === 'boss').hp = -1; for (let i = 0; i < 6; i++) D.stepBattle(1 / 30); D.hostMsg(me.id, { k: 'qa', i: me.qz.a }); });
  await p.waitForTimeout(450); await p.screenshot({ path: '/tmp/evo43a.png' });
  await p.waitForTimeout(700); await p.screenshot({ path: '/tmp/evo43b.png' });
  console.log('ERR', JSON.stringify(errs)); await b.close();
})();
