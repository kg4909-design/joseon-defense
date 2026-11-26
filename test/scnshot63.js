const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  for (const [w, h, n] of [[844, 390, 'ph'], [1180, 820, 'tb']]) {
    const p = await b.newPage({ viewport: { width: w, height: h }, hasTouch: w < 900 });
    await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.44'); });
    await p.goto('file:///home/claude/work/game/dist/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' });
    await p.click('#btnSingle'); await p.waitForSelector('#sRoom.on'); await p.waitForTimeout(400);
    await p.selectOption('#selScn', { label: '8. 평양성 탈환' });
    await p.evaluate(() => document.querySelector('#hostBox').scrollIntoView({ block: 'start' }));
    await p.screenshot({ path: `/tmp/scn_${n}_top.png` });
    await p.evaluate(() => { document.querySelector('#selCmScn').scrollIntoView({ block: 'center' }); });
    await p.screenshot({ path: `/tmp/scn_${n}_coop.png` }); await p.close();
  }
  await b.close();
})();
