const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } }); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.addInitScript(() => { try { { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.32'); }; } catch (e) {} }); await p.goto('file:///home/claude/work/game/dist/index.html?fast=60'); await p.waitForSelector('#bwj-intro', { state: 'detached' });
  await p.fill('#nick', '하늘'); await p.click('#btnSingle'); await p.waitForSelector('#sRoom.on'); await p.click('#btnStart'); await p.waitForSelector('#sBrief.on'); await p.click('#bqOpts .qo'); await p.click('#btnFight'); await p.waitForSelector('#sBattle.on');
  await p.evaluate(() => { startRound(4); G.food = 9999; G.ph = 'battle'; for (let k = 0; k < 12; k++) doSummon(false); G.pl.me.hp = 1e6; G.pl.me.mx = 1e6; G.baseHp = 1e6; G.baseMax = 1e6; G.evDone = [true, true]; G.spawnT = -999; });
  await p.evaluate(() => { const hs = 3; for (let i = 0; i < 230; i++) spawn(['grunt', 'shoot', 'cav', 'tank'][i % 4], 0.2, [G.ax + 150 + Math.random() * 400, G.ay - 200 + Math.random() * 400]); });
  const cdp = await p.context().newCDPSession(p);
  for (const rate of [1, 4]) {
    await cdp.send('Emulation.setCPUThrottlingRate', { rate }); await p.waitForTimeout(1500);
    const r = await p.evaluate(() => new Promise((res) => { const ts = []; let last = performance.now(), n = 0; const f = () => { const t = performance.now(); ts.push(t - last); last = t; if (++n < 180) requestAnimationFrame(f); else { ts.sort((a, b) => a - b); res({ en: G.en.length, avgMs: +(ts.reduce((a, c) => a + c, 0) / ts.length).toFixed(1), p95: +ts[Math.floor(ts.length * 0.95)].toFixed(1) }); } }; f(); }));
    console.log('CPU x' + rate, JSON.stringify(r)); }
  await p.screenshot({ path: 'test/n_crowd.png' }); console.log(errs); await b.close();
})();
