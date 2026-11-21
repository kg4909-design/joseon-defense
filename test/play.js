const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } }); await p.addInitScript(() => { try { { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.37'); }; } catch (e) {} }); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto('file:///home/claude/work/game/dist/index.html?fast=400'); await p.waitForSelector('#bwj-intro', { state: 'detached' });
  await p.fill('#nick', '하늘'); await p.click('#btnSingle'); await p.waitForSelector('#sRoom.on'); await p.click('#btnStart'); await p.waitForSelector('#sBrief.on'); await p.click('#bqOpts .qo'); await p.click('#btnFight'); await p.waitForSelector('#sBattle.on');
  await p.evaluate(() => { const G = __dbg.G; G.food = 400; for (let i = 0; i < 8; i++) doSummon(false); G.evDone = [true, true]; });
  // 간단 봇: 카드는 즉시 선택, 영웅은 원을 그리며 이동
  for (let i = 0; i < 100; i++) { await p.evaluate((i) => { const G = __dbg.G, me = G.pl.me; if (me.offer) { applyCard(me, me.offer[0]); me.offer = null; } const a = i * 0.7; me.mvx = Math.cos(a); me.mvy = Math.sin(a); me.hp = Math.max(me.hp, me.mx * 0.5); G.baseHp = G.baseMax; G.magT = 1; }, i); await p.waitForTimeout(1000); if (i % 20 === 0) console.log(i, await p.evaluate(() => __dbg.G.en.length)); if (i === 60 || i === 99) await p.screenshot({ path: `test/play${i}.png` }); }
  console.log(await p.evaluate(() => { const G = __dbg.G; return JSON.stringify({ t: G.t, en: G.en.length, lv: G.pl.me.lv, cards: G.pl.me.cards, ph: G.ph }); })); console.log(errs); await b.close();
})();
