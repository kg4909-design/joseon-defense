const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  for (const [w, h] of [[844, 390], [1280, 720]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } }); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); });
    await p.goto('file:///home/claude/work/game/dist/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' }); await p.waitForTimeout(3200);
    await p.screenshot({ path: `/tmp/um_${w}.png` });
    const vis = await p.evaluate(() => { const b = document.getElementById('umClose').getBoundingClientRect(); return [Math.round(b.bottom), innerHeight]; });
    await p.click('#umX'); await p.waitForTimeout(200);
    console.log(w, vis, await p.evaluate(() => document.getElementById('updModal').classList.contains('on')), errs); await p.close();
  }
  await b.close();
})();
