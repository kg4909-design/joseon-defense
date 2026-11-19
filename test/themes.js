const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] }); const errs = [];
  for (const [i, nm] of [[20, 'hg'], [25, 'qg']]) {
    const p = await b.newPage({ viewport: { width: 1280, height: 720 } }); p.on('pageerror', (e) => errs.push(e.message));
    await p.goto('file:///home/claude/work/game/dist/index.html?fast=60'); await p.waitForSelector('#bwj-intro', { state: 'detached' });
    await p.fill('#nick', '하늘'); await p.click('#btnSingle'); await p.waitForSelector('#sRoom.on'); await p.selectOption('#selStart', String(i)); await p.click('#btnStart'); await p.waitForSelector('#sBrief.on');
    if (i === 0) await p.screenshot({ path: 'test/t_brief.png' });
    await p.click('#btnFight'); await p.waitForSelector('#sBattle.on');
    await p.evaluate(() => { const G = __dbg.G; G.food = 999; for (let k = 0; k < 8; k++) doSummon(false); G.pl.me.x = 520; G.pl.me.y = 270; });
    await p.waitForTimeout(9000); await p.screenshot({ path: `test/t_${nm}.png` }); await p.close();
  }
  console.log('errors', errs); await b.close();
})().catch((e) => { console.error('FAIL', e.message); process.exit(1); });
