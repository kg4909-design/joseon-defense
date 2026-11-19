const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } }); await p.addInitScript(() => { try { { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.21'); }; } catch (e) {} }); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto('file:///home/claude/work/game/dist/index.html?fast=60'); await p.waitForSelector('#bwj-intro', { state: 'detached' });
  await p.fill('#nick', '하늘'); await p.click('#btnSingle'); await p.waitForSelector('#sRoom.on'); await p.click('#btnStart'); await p.waitForSelector('#sBrief.on'); await p.click('#bqOpts .qo'); await p.click('#btnFight'); await p.waitForSelector('#sBattle.on');
  // 모든 카드를 최대로 → 소진 상태에서 레벨업 유도
  await p.evaluate(() => { const me = __dbg.G.pl.me; for (const k of ['spear','gong','bomb','hwacha','gun','powder','bow','horse','armor']) me.cards[k] = 5; me.cards.evo_spear = me.cards.evo_gong = me.cards.evo_bomb = me.cards.evo_hwacha = 1; me.hp = me.mx * 0.4; gainXp(__dbg.G.need); });
  await p.waitForTimeout(900); await p.screenshot({ path: 'test/f_empty.png' });
  const n = await p.evaluate(() => document.querySelectorAll('#cards .card').length); console.log('cards shown', n);
  await p.click('.card[data-i="0"]', { force: true }); await p.waitForTimeout(500);
  console.log('offer cleared', await p.evaluate(() => !__dbg.G.pl.me.offer), errs); await b.close();
})().catch((e) => { console.error('FAIL', e.message); process.exit(1); });
