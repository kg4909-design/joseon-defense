const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1180, height: 820 } });
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.38'); });
  await p.goto('file:///home/claude/work/game/dist/index.html');
  await p.click('#btnSingle'); await p.waitForTimeout(300); await p.click('#btnStart'); await p.waitForTimeout(500);
  await p.click('#bqOpts .qo'); await p.click('#btnFight'); await p.waitForSelector('#sBattle.on'); await p.waitForTimeout(4000);
  await p.screenshot({ path: 'test/a24_hud.png' });
  await b.close();
})();
