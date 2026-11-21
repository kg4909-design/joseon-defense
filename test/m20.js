const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  for (const [w, h] of [[844, 390], [1280, 800]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } }); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.37'); });
    await p.goto('file:///home/claude/work/game/dist/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' }); await p.waitForTimeout(3200);
    await p.fill('#nick', '하늘'); await p.click('#btnSingle'); await p.waitForTimeout(500); await p.screenshot({ path: `/tmp/rm_${w}.png` });
    await p.click('#btnStart'); await p.waitForTimeout(500); await p.screenshot({ path: `/tmp/br_${w}.png` });
    await p.click('#bqOpts .qo'); await p.click('#btnFight'); await p.waitForTimeout(1500); await p.screenshot({ path: `/tmp/bt_${w}.png` });
    console.log(w, errs); await p.close();
  }
  await b.close();
})();
