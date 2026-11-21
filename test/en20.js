const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } }); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.41'); });
  await p.goto('file:///home/claude/work/game/dist/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' }); await p.waitForTimeout(3200);
  await p.fill('#nick', '하늘'); await p.click('#btnSingle'); await p.waitForTimeout(500);
  await p.evaluate(() => { document.getElementById('selStart').value = '0'; }); await p.click('#btnStartE'); await p.waitForTimeout(500);
  await p.click('#bqOpts .qo'); await p.click('#btnFight'); await p.waitForTimeout(500);
  const sim = (secs, keepAlive) => p.evaluate(([secs, ka]) => { const g = __dbg.G; const log = []; for (let t = 0; t < secs; t += 0.034) { g.ev = null; for (const id of g.order) { const h = g.pl[id]; h.offer = null; if (ka) { h.hp = h.mx; } } g.baseHp = g.baseMax; __dbg.stepBattle(0.034); } return { t: Math.round(g.t), er: g.er, sc: g.sc, dmx: +g.dmx.toFixed(2), en: g.en.length, bosses: g.en.filter((e) => e.t === 'boss').map((e) => e.bn && e.bn[0] + ':' + Math.round(e.hp)), night: g.nightRd, info: g.info && g.info.tt, ph: g.ph }; }, [secs, keepAlive]);
  console.log(JSON.stringify(await sim(62, true)));
  // 라운드 점프: 9번째, 10번째 (적장)
  await p.evaluate(() => { const g = __dbg.G; g.t = 9 * 60 + 59.9; });
  console.log(JSON.stringify(await sim(1, true)));
  console.log(JSON.stringify(await sim(5, true)));
  await p.evaluate(() => { const g = __dbg.G; g.t = 98 * 60 - 0.2; });
  console.log('r98', JSON.stringify(await sim(1, true)));
  console.log('r99', JSON.stringify(await sim(3, true)));
  await p.evaluate(() => { const g = __dbg.G; const f = g.en.find((e) => e.fin); if (f) f.hp = -1; });
  console.log('after final', JSON.stringify(await sim(1, true)));
  await p.waitForTimeout(800); console.log(await p.evaluate(() => [document.getElementById('endH').textContent, document.getElementById('endText').textContent.slice(0, 120)]), errs);
  await p.screenshot({ path: '/tmp/en1.png' });
  await b.close();
})();
