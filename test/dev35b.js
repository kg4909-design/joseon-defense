const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const VP = { phone: [851, 393], tab: [1280, 800] };
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  for (const [n, [w, h]] of Object.entries(VP)) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, isMobile: w < 900 });
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
    await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_hid', '1'); localStorage.setItem('jd_upd_seen', 'v0.39'); });
    await p.goto('file:///home/claude/joseon-defense/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' }); await p.waitForTimeout(500);
    await p.screenshot({ path: `/tmp/t35_${n}_lobby.png` });
    await p.click('#btnSingle'); await p.waitForTimeout(300);
    await p.tap('#btnStart'); await p.waitForTimeout(800);
    await p.screenshot({ path: `/tmp/t35_${n}_brief.png` });
    await p.tap('#bqOpts button >> nth=0').catch(()=>{}); await p.waitForTimeout(600); await p.tap('#btnFight'); await p.waitForTimeout(3500);
    await p.screenshot({ path: `/tmp/t35_${n}_battle.png` });
    await p.evaluate(() => { const D = window.__dbg, G = D.G; G.lvq = 1; }); await p.waitForTimeout(2500);
    await p.screenshot({ path: `/tmp/t35_${n}_quiz.png` });
    await p.evaluate(() => { const D = window.__dbg; D.endRound(false); }); await p.waitForTimeout(1200);
    await p.screenshot({ path: `/tmp/t35_${n}_result.png` });
    console.log(n, errs); await ctx.close();
  }
  await b.close();
})();
