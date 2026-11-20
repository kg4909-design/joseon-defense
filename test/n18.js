const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } }); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.32'); });
  await p.goto('file:///home/claude/work/game/dist/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' });
  await p.fill('#nick', '하늘'); await p.click('#btnSingle'); await p.waitForSelector('#sRoom.on'); await p.click('#btnStart'); await p.waitForSelector('#sBrief.on'); await p.click('#bqOpts .qo'); await p.click('#btnFight'); await p.waitForSelector('#sBattle.on');
  // 탈출: 스폰 위치 분포
  const d = await p.evaluate(() => { startRound(1); G.ph = 'battle'; const h = G.pl.me; let L = 0, F = 0, U = 0; for (let i = 0; i < 400; i++) { const q = spawnPos(); if (!q) continue; if (q[0] < h.x - 100) L++; else if (Math.abs(q[1] - h.y) > 400) U++; else F++; } return { behind: L, front: F, vertical: U }; });
  console.log('escape spawn', JSON.stringify(d));
  await p.waitForTimeout(500); await p.evaluate(() => { G.t = 40; G.ambT = 0.1; });
  await p.waitForTimeout(1500); await p.screenshot({ path: '/tmp/n18_amb.png' });
  // 야간
  await p.evaluate(() => { startRound(0); G.ph = 'battle'; G.evDone = [true, true]; G.fx.push([G.ax, G.ay, 10, 'night']); G.nl = 1; }); await p.waitForTimeout(7500); await p.evaluate(() => { G.nl = 1; }); await p.waitForTimeout(800); await p.screenshot({ path: '/tmp/n18_night.png' });
  console.log('speed night', await p.evaluate(() => Math.round(heroStats(G.pl.me).sp)), 'errs', errs); await b.close();
})();
