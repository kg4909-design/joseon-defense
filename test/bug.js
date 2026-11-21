const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } }); await p.addInitScript(() => { try { { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.39'); }; } catch (e) {} }); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto('file:///home/claude/work/game/dist/index.html?fast=120'); await p.waitForSelector('#bwj-intro', { state: 'detached' });
  await p.fill('#nick', '하늘'); await p.click('#btnSingle'); await p.waitForSelector('#sRoom.on'); await p.click('#btnStart'); await p.waitForSelector('#sBrief.on'); await p.click('#bqOpts .qo'); await p.click('#btnFight'); await p.waitForSelector('#sBattle.on');
  await p.evaluate(() => { startRound(2); G.ph = 'battle'; G.evDone = [true, true]; });
  const snap = () => p.evaluate(() => ({ t: +G.t.toFixed(1), en: G.en.length, spawnT: +G.spawnT.toFixed(1), hp: Math.round(G.pl.me.hp), down: G.pl.me.down, lives: G.lives, ph: G.ph, first: G.en[0] && [Math.round(G.en[0].x), Math.round(G.en[0].y), +G.en[0].st.toFixed(1)] }));
  await p.waitForTimeout(6000); console.log('before', JSON.stringify(await snap()));
  await p.evaluate(() => { G.pl.me.hp = 0; }); await p.waitForTimeout(500); console.log('dead', JSON.stringify(await snap()));
  await p.waitForTimeout(8000); console.log('revived', JSON.stringify(await snap()));
  await p.waitForTimeout(8000); console.log('later', JSON.stringify(await snap()));
  console.log(errs); await b.close();
})();
