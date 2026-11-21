const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } }); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.34'); });
  await p.goto('file:///home/claude/work/game/dist/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' }); await p.waitForTimeout(3200);
  await p.fill('#nick', '하늘'); await p.click('#btnSingle'); await p.waitForTimeout(500);
  await p.evaluate(() => { document.getElementById('selStart').value = '12'; }); await p.click('#btnStart'); await p.waitForTimeout(500);
  await p.click('#bqOpts .qo'); await p.click('#btnFight'); await p.waitForTimeout(800);
  // 레벨업 강제
  await p.evaluate(() => { const g = __dbg.G; __dbg.gainXp(g.need + 1); });
  await p.waitForTimeout(600);
  await p.screenshot({ path: '/tmp/q1.png' });
  const info = await p.evaluate(() => { const g = __dbg.G, pl = g.pl[g.order[0]]; return { qz: pl.qz, qs: pl.qs, offer: pl.offer }; });
  console.log(JSON.stringify(info));
  const right = info.qz.a;
  await p.click(`#cards .qzo button[data-i="${right}"]`); await p.waitForTimeout(500);
  await p.screenshot({ path: '/tmp/q2.png' });
  console.log(await p.evaluate(() => JSON.stringify(__dbg.G.pl[__dbg.G.order[0]].offer)));
  await p.click('#cards .card'); await p.waitForTimeout(300);
  console.log('offer after', await p.evaluate(() => JSON.stringify(__dbg.G.pl[__dbg.G.order[0]].offer)), errs);
  // 결과 화면 복기
  await p.evaluate(() => { __dbg.G.baseHp = 0; }); await p.waitForTimeout(1500);
  await p.screenshot({ path: '/tmp/q3.png' });
  console.log(await p.evaluate(() => [document.getElementById('btnNext').disabled, document.getElementById('btnNext').textContent, __dbg.G.ph]));
  await p.waitForTimeout(10500);
  console.log(await p.evaluate(() => [document.getElementById('btnNext').disabled, document.getElementById('btnNext').textContent]), errs);
  await b.close();
})();
