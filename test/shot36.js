const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true });
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.38'); });
  await p.goto('file:///home/claude/joseon-defense/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' }); await p.waitForTimeout(500);
  await p.click('#btnSingle'); await p.waitForTimeout(300);
  await p.evaluate(() => { const D = window.__dbg; D.hostCtl('start', { start: 0, dur: 180, diff: 'normal', wall: 0 }); });
  await p.waitForTimeout(800);
  await p.evaluate(() => { const D = window.__dbg, G = D.G; G.ph = 'battle'; G.paused = true; });
  await p.waitForTimeout(500); await p.screenshot({ path: '/tmp/s36_pause.png' });
  await p.evaluate(() => { const G = window.__dbg.G; G.paused = false; G.t = 119.99; G.ev = null; G.evDone = [true, true]; G.sm = G.sm || {}; for (let i = 0; i < 8; i++) window.__dbg.stepBattle(1 / 30); });
  await p.waitForTimeout(600); await p.screenshot({ path: '/tmp/s36_duel.png' });
  console.log(await p.evaluate(() => ({ du: !!window.__dbg.G.du, cls: document.getElementById('sBattle').className, notes: getComputedStyle(document.getElementById('notes')).display })));
  await b.close();
})();
