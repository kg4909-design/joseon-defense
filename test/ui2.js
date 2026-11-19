const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const c = await b.newContext({ viewport: { width: 1280, height: 800 }, hasTouch: true }); const p = await c.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto('file:///home/claude/work/game/dist/index.html?fast=40');
  await p.fill('#nick', '테스트'); await p.click('#btnSingle'); await p.waitForSelector('#sRoom.on'); await p.selectOption('#selStart', '10'); await p.click('#btnStart');
  await p.waitForSelector('#sBrief.on'); await p.screenshot({ path: 'test/t1_brief.png' }); await p.click('#btnFight'); await p.waitForSelector('#sBattle.on');
  // 터치 조이스틱: 왼쪽 영역 드래그
  const st = await p.$eval('#stage', (e) => { const r = e.getBoundingClientRect(); return [r.left, r.top, r.width / 960]; });
  const X = (x) => st[0] + x * st[2], Y = (y) => st[1] + y * st[2];
  const cdp = await c.newCDPSession(p);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: X(120), y: Y(400) }] });
  for (let i = 1; i <= 6; i++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: X(120 + i * 10), y: Y(400 - i * 5) }] });
  const before = await p.evaluate(() => [__dbg.G.pl.me.x, __dbg.G.pl.me.y]);
  await p.waitForTimeout(1200);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  const after = await p.evaluate(() => [__dbg.G.pl.me.x, __dbg.G.pl.me.y]); console.log('joystick moved', before.map(Math.round), '->', after.map(Math.round));
  // 소집 3번 + 병사 탭으로 합성 시도, 카드 강제 제시
  await p.evaluate(() => { __dbg.G.food = 999; });
  for (let i = 0; i < 8; i++) { await p.tap('#btnSummon'); await p.waitForTimeout(80); }
  await p.evaluate(() => { const G = __dbg.G; const u = G.units; for (let a = 0; a < 12; a++) for (let c2 = a + 1; c2 < 12; c2++) if (u[a] && u[c2] && u[a].t === u[c2].t && u[a].lv === u[c2].lv) { window.__pair = [a, c2]; return; } });
  const pair = await p.evaluate(() => window.__pair); console.log('pair', pair);
  if (pair) { const S = await p.evaluate(() => SLOTS); for (const i of pair) { await p.mouse.click(X(S[i][0]), Y(S[i][1])); await p.waitForTimeout(100); } }
  console.log('units lv after merge:', await p.evaluate(() => __dbg.G.units.map((u) => u ? u.lv : 0).join('')));
  await p.evaluate(() => { __dbg.G.pl.me.offer = ['horse', 'hwacha', 'gun']; __dbg.G.pl.me.offT = 30; });
  await p.waitForTimeout(800); await p.screenshot({ path: 'test/t2_cards.png' });
  await p.tap('.card[data-i="1"]'); await p.waitForTimeout(400);
  console.log('hwacha stacks:', await p.evaluate(() => JSON.stringify(__dbg.G.pl.me.cards)), 'card box hidden:', await p.isHidden('#cards'));
  await p.tap('#btnSkill'); await p.waitForTimeout(3000); await p.screenshot({ path: 'test/t3_battle.png' });
  console.log('errors', errs); await b.close();
})().catch((e) => { console.error('FAIL', e); process.exit(1); });
