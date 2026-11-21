const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  for (const [nm, w, h] of [['tablet', 1280, 800], ['s23', 780, 360]]) {
    const pg = await (await b.newContext({ viewport: { width: w, height: h }, hasTouch: true })).newPage();
    const errs = []; pg.on('pageerror', (e) => errs.push(e.message));
    await pg.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.39'); });
    await pg.goto('file:///home/claude/work/game/dist/index.html');
    await pg.waitForSelector('#bwj-intro',{state:'detached'});
    await pg.screenshot({ path: `/tmp/v16_lobby_${nm}.png` });
    console.log(nm, 'updBox', await pg.evaluate(() => document.querySelectorAll('#updBox .up').length), 'btnLoad', await pg.isVisible('#btnLoad'));
    await pg.fill('#nick','하늘'); await pg.click('#btnSingle'); await pg.waitForSelector('#sRoom.on'); await pg.click('#btnStart'); await pg.waitForSelector('#sBrief.on');
    console.log(nm, 'fight disabled', await pg.evaluate(() => document.getElementById('btnFight').disabled), await pg.evaluate(() => document.getElementById('btnFight').textContent));
    await pg.screenshot({ path: `/tmp/v16_brief_${nm}.png` });
    await pg.click('#bqOpts .qo >> nth=1', { force: true }); await pg.waitForTimeout(600);
    console.log(nm, 'after ans', await pg.evaluate(() => document.getElementById('btnFight').disabled), await pg.evaluate(() => document.getElementById('bqWhy').textContent.slice(0, 40)));
    await pg.click('#btnFight', { force: true }); await pg.waitForTimeout(800);
    console.log(nm, 'ph', await pg.evaluate(() => __dbg.G.ph), 'food', await pg.evaluate(() => __dbg.G.food));
    // 라운드 끝 → 자동저장
    await pg.evaluate(() => { __dbg.G.baseHp = 0; });
    await pg.waitForTimeout(1500);
    console.log(nm, 'ph', await pg.evaluate(() => __dbg.G.ph), 'auto', await pg.evaluate(() => localStorage.getItem('jd_sv_auto')));
    await pg.screenshot({ path: `/tmp/v16_result_${nm}.png` });
    console.log(nm, 'errs', errs);
  }
  await b.close();
})();
