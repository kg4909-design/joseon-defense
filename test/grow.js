const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } }); await p.addInitScript(() => { try { { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.31'); }; } catch (e) {} }); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto('file:///home/claude/work/game/dist/index.html?fast=120'); await p.waitForSelector('#bwj-intro', { state: 'detached' });
  await p.fill('#nick', '하늘'); await p.click('#btnSingle'); await p.waitForSelector('#sRoom.on'); await p.click('#btnStart'); await p.waitForSelector('#sBrief.on'); await p.click('#bqOpts .qo'); await p.click('#btnFight'); await p.waitForSelector('#sBattle.on');
  await p.evaluate(() => { startRound(0); G.ph = 'battle'; G.evDone = [true, true]; G.food = 600; const m = G.pl.me; m.hp = m.mx = 1e5; m.cards.spear = 3; m.cards.gong = 2; m.cards.bomb = 2; });
  await p.waitForTimeout(9000); await p.screenshot({ path: 'test/g1.png' });
  await p.click('#btnUp'); await p.click('#btnUp'); await p.waitForTimeout(600);
  await p.evaluate(() => { offerCards(G.pl.me); }); await p.waitForTimeout(500); await p.screenshot({ path: 'test/g2.png' });
  console.log(JSON.stringify(await p.evaluate(() => ({ upg: G.upg, food: Math.round(G.food), crates: G.crates.length, en: G.en.length, offer: G.pl.me.offer }))), errs);
  // 비성 판: 카드/이벤트
  await p.evaluate(() => { startRound(1); G.ph = 'battle'; for (let i = 0; i < 400; i++) { offerCards(G.pl.me); if (G.pl.me.offer.includes('wall')) throw new Error('wall offered in escape'); } G.t = G.dur * 0.36; }); await p.waitForTimeout(1500);
  console.log(JSON.stringify(await p.evaluate(() => G.ev && G.ev.o.map((o) => o.n)))); await b.close();
})().catch((e) => { console.error('FAIL', e.message); process.exit(1); });
