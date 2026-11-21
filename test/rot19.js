const { chromium, devices } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  for (const [n, vp] of [['phone-portrait', { width: 360, height: 780 }], ['phone-land', { width: 780, height: 360 }], ['tablet-portrait', { width: 800, height: 1280 }], ['tablet-land', { width: 1280, height: 800 }]]) {
    const c = await b.newContext({ viewport: vp, hasTouch: true, isMobile: true, deviceScaleFactor: 2 }); const p = await c.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.38'); });
    await p.goto('file:///home/claude/work/game/dist/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' }).catch(() => {}); await p.waitForTimeout(1500);
    const vis = await p.evaluate(() => getComputedStyle(document.getElementById('rotWarn')).display);
    await p.screenshot({ path: `/tmp/rot_${n}.png` }); console.log(n, 'rotWarn', vis, errs); await c.close();
  }
  await b.close();
})();
