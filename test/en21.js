const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } }); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.36'); });
  await p.goto('file:///home/claude/work/game/dist/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' }); await p.waitForTimeout(3200);
  await p.fill('#nick', '하늘'); await p.click('#btnSingle'); await p.waitForTimeout(400); await p.click('#btnStartE'); await p.waitForTimeout(500);
  await p.screenshot({ path: '/tmp/eb.png' });
  await p.click('#bqOpts .qo'); await p.click('#btnFight'); await p.waitForTimeout(500);
  await p.evaluate(() => { const g = __dbg.G; g.t = 9 * 60 + 59.9; g.nightRd = false; for (let i = 0; i < 300; i++) { g.ev = null; g.pl[g.order[0]].offer = null; g.pl[g.order[0]].hp = g.pl[g.order[0]].mx; g.baseHp = g.baseMax; __dbg.stepBattle(0.034); } });
  await p.waitForTimeout(1200); await p.screenshot({ path: '/tmp/ec.png' }); console.log(errs); await b.close();
})();
