const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 851, height: 393 }, hasTouch: true }); const errs = [];
  p.on('pageerror', (e) => errs.push(String(e)));
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.40'); localStorage.setItem('jd_hid', '1'); });
  await p.goto('file:///home/claude/joseon-defense/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' }); await p.waitForTimeout(300);
  await p.click('#btnSingle'); await p.waitForTimeout(300);
  await p.evaluate(() => { const D = window.__dbg; D.hostCtl('start', { start: 0, dur: 300, diff: 'hard', coop: false, bots: 0, cl: 1 }); D.hostCtl('fight'); D.G.evDone = [true, true]; D.G.wxNext = 2; D.G.hdT = 1; D.G.t = 20; });
  for (const k of ['rain', 'fog', 'night']) {
    await p.evaluate((k) => { const G = window.__dbg.G; G.wx = { k, end: G.t + 25 }; }, k); await p.waitForTimeout(1800);
    await p.screenshot({ path: `/tmp/wx_${k}.png` });
  }
  console.log(errs); await b.close();
})();
