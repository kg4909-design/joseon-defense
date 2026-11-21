const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] }); const errs = [];
  const p = await b.newPage({ viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true }); p.on('pageerror', (e) => errs.push(e.message));
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.36'); localStorage.setItem('jd_cw', JSON.stringify({ tk: 3, sh: 0, own: {}, cos: ['a_gold','a_fire','t_rain','t_dust'], eq: 'a_gold', eq2: 't_rain', pity: 0, pity2: 0, cl: 0, ids: [] })); });
  await p.goto('file:///home/claude/joseon-defense/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' }); await p.waitForTimeout(400);
  await p.click('#btnCw'); await p.waitForTimeout(1200); await p.screenshot({ path: '/tmp/fxui.png' });
  await p.click('#cwGo'); await p.waitForTimeout(400);
  await p.click('.cwg button[data-a="t_dust"]'); await p.waitForTimeout(300);
  console.log(await p.evaluate(() => JSON.parse(localStorage.getItem('jd_cw')).eq2), errs); await b.close();
})();
