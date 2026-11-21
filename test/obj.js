const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } }); await p.addInitScript(() => { try { { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.34'); }; } catch (e) {} }); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto('file:///home/claude/work/game/dist/index.html?fast=60'); await p.waitForSelector('#bwj-intro', { state: 'detached' });
  await p.fill('#nick', '하늘'); await p.click('#btnSingle'); await p.waitForSelector('#sRoom.on');
  await p.click('#btnStart'); await p.waitForSelector('#sBrief.on'); await p.screenshot({ path: 'test/o_brief.png' });
  await p.click('#bqOpts .qo'); await p.click('#btnFight'); await p.waitForSelector('#sBattle.on');
  // [round idx, label]
  const modes = [[0, 'd'], [1, 'e'], [2, 's'], [3, 'b'], [6, 'r']];
  for (const [i, l] of modes) {
    await p.evaluate((i) => { startRound(i); G.food = 999; G.ph = 'battle'; for (let k = 0; k < 6; k++) doSummon(false); }, i);
    await p.waitForTimeout(9000);
    await p.screenshot({ path: `test/o_${l}.png` });
    const st = await p.evaluate(() => ({ obj: G.obj, en: G.en.length, hp: Math.round(G.baseHp), lives: G.lives, gi: G.gi, ph: G.ph, t: Math.round(G.t) }));
    console.log(l, JSON.stringify(st));
  }
  console.log('errors', errs); await b.close();
})().catch((e) => { console.error('FAIL', e.message); process.exit(1); });
