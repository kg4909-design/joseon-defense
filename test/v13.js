const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } }); await p.addInitScript(() => { try { { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.29'); }; } catch (e) {} }); const errs = []; p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto('file:///home/claude/work/game/dist/index.html?fast=300'); await p.waitForSelector('#bwj-intro', { state: 'detached' });
  await p.fill('#nick', '하늘'); await p.click('#btnSingle'); await p.waitForSelector('#sRoom.on'); await p.click('#diffRow button[data-d="hard"]'); await p.click('#btnStart'); await p.waitForSelector('#sBrief.on'); await p.click('#bqOpts .qo'); await p.click('#btnFight'); await p.waitForSelector('#sBattle.on');
  await p.evaluate(() => { const G = __dbg.G; G.food = 300; for (let i = 0; i < 6; i++) doSummon(false); G.evDone = [true, true]; const me = G.pl.me; me.cards = { spear: 5, armor: 2, gong: 3, powder: 1, bow: 2 }; me.hp = 1e6; me.mx = 1e6; G.t = G.dur * 0.34; });
  await p.waitForTimeout(6000); await p.screenshot({ path: 'test/x_night.png' });
  console.log('souls', await p.evaluate(() => __dbg.G.souls.length), 'pj', await p.evaluate(() => __dbg.G.pj.length), 'nl', await p.evaluate(() => __dbg.G.nl));
  await p.evaluate(() => { const me = __dbg.G.pl.me; me.offer = ['evo_spear', 'bomb', 'horse']; me.offT = 30; });
  await p.waitForTimeout(800); await p.screenshot({ path: 'test/x_cards.png' });
  await p.click('.card[data-i="0"]', { force: true }); console.log('evo', await p.evaluate(() => JSON.stringify(__dbg.G.pl.me.cards)));
  await p.evaluate(() => { __dbg.G.t = __dbg.G.dur * 0.1; __dbg.G.bossDone = false; spawn('boss', 1, [__dbg.G.ax + 300, __dbg.G.ay]); __dbg.G.fx.push([__dbg.G.ax + 300, __dbg.G.ay, 60, 'boss']); });
  await p.waitForTimeout(900); await p.screenshot({ path: 'test/x_boss.png' });
  console.log('errors', errs); await b.close();
})().catch((e) => { console.error('FAIL', e.message); process.exit(1); });
