const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  for (const [w, h] of [[1280, 720], [960, 540]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } }); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.goto('file:///home/claude/work/game/dist/index.html?fast=60'); await p.waitForSelector('#bwj-intro', { state: 'detached' });
    await p.fill('#nick', '하늘'); await p.click('#btnSingle'); await p.waitForSelector('#sRoom.on');
    await p.click('#diffRow button[data-d="hard"]'); await p.click('#roleRow button[data-r="monk"]'); await p.screenshot({ path: `test/w${w}_room.png` });
    await p.click('#btnStart'); await p.waitForSelector('#sBrief.on'); await p.screenshot({ path: `test/w${w}_tut.png` });
    for (let i = 0; i < 5; i++) await p.click('#tutNext'); // 마지막에서 닫힘
    await p.click('#bqOpts .qo'); await p.click('#btnFight'); await p.waitForSelector('#sBattle.on'); await p.waitForTimeout(1500); await p.screenshot({ path: `test/w${w}_intro.png` });
    console.log(w, 'diff', await p.evaluate(() => __dbg.G.dif.hp + ' ' + __dbg.G.sel.diff));
    await p.click('#btnPause'); await p.waitForTimeout(400); await p.screenshot({ path: `test/w${w}_pause.png` });
    const t1 = await p.evaluate(() => __dbg.G.t); await p.waitForTimeout(1200); const t2 = await p.evaluate(() => __dbg.G.t); console.log('paused frozen', t1 === t2);
    await p.click('#pResume'); await p.waitForTimeout(8000);
    await p.evaluate(() => { __dbg.G.t = __dbg.G.dur * 0.36; }); await p.waitForTimeout(900); await p.screenshot({ path: `test/w${w}_vote.png` });
    const e1 = await p.evaluate(() => [__dbg.G.t, !!__dbg.G.ev]); await p.waitForTimeout(1500); const e2 = await p.evaluate(() => __dbg.G.t); console.log('vote frozen', e1, e2);
    console.log('errors', errs); await p.close();
  }
  await b.close();
})().catch((e) => { console.error('FAIL', e.message); process.exit(1); });
