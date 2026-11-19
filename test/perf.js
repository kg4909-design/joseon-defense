const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } }); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  const t0 = Date.now(); await p.goto('file:///home/claude/work/game/dist/index.html?fast=60'); await p.waitForSelector('#bwj-intro', { state: 'detached' }); console.log('load+intro ms', Date.now() - t0);
  await p.screenshot({ path: 'test/n_lobby.png' });
  await p.fill('#nick', '하늘'); await p.click('#btnSingle'); await p.waitForSelector('#sRoom.on'); await p.click('#btnStart'); await p.waitForSelector('#sBrief.on'); await p.click('#btnFight'); await p.waitForSelector('#sBattle.on');
  await p.evaluate(() => { startRound(10); G.food = 999; G.ph = 'battle'; for (let k = 0; k < 12; k++) doSummon(false); G.pl.me.hp = 1e6; G.pl.me.mx = 1e6; G.baseHp = 1e6; G.baseMax = 1e6; });
  await p.waitForTimeout(25000);
  const r = await p.evaluate(() => new Promise((res) => { const ts = []; let last = performance.now(), n = 0; const f = () => { const t = performance.now(); ts.push(t - last); last = t; if (++n < 240) requestAnimationFrame(f); else { ts.sort((a, b) => a - b); res({ en: G.en.length, avg: ts.reduce((a, c) => a + c, 0) / ts.length, p95: ts[Math.floor(ts.length * 0.95)], max: ts[ts.length - 1] }); } }; f(); }));
  console.log(JSON.stringify(r)); await p.screenshot({ path: 'test/n_battle.png' }); console.log(errs); await b.close();
})();
