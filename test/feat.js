const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } }); await p.addInitScript(() => { try { { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.32'); }; } catch (e) {} }); const errs = []; p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto('file:///home/claude/work/game/dist/index.html?fast=60'); await p.waitForSelector('#bwj-intro', { state: 'detached' });
  await p.fill('#nick', '하늘'); await p.click('#btnSingle'); await p.waitForSelector('#sRoom.on'); await p.click('#btnStart'); await p.waitForSelector('#sBrief.on'); await p.click('#bqOpts .qo'); await p.click('#btnFight'); await p.waitForSelector('#sBattle.on');
  await p.evaluate(() => { startRound(3); G.food = 999; G.ph = 'battle'; for (let k = 0; k < 6; k++) doSummon(false); G.evDone = [true, true]; G.pl.me.hp = 1e5; G.pl.me.mx = 1e5; });
  await p.waitForTimeout(8000); await p.screenshot({ path: 'test/f_battle.png' });
  await p.click('#btnGear'); await p.waitForTimeout(300); await p.screenshot({ path: 'test/f_set.png' });
  await p.click('[data-k="q"][data-v="low"]'); await p.click('[data-k="hand"][data-v="L"]'); await p.click('[data-k="joy"][data-v="l"]'); await p.click('#setClose'); await p.waitForTimeout(1500); await p.screenshot({ path: 'test/f_low.png' });
  console.log(JSON.stringify(await p.evaluate(() => ({ w: cv.width, low: isLow(), ST }))), errs); await b.close();
})();
