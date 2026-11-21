const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } }); await p.addInitScript(() => { try { { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.34'); }; } catch (e) {} }); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto('file:///home/claude/work/game/dist/index.html?fast=60'); await p.waitForSelector('#bwj-intro', { state: 'detached' });
  await p.fill('#nick', '하늘'); await p.click('#btnSingle'); await p.waitForSelector('#sRoom.on'); await p.click('#btnStart'); await p.waitForSelector('#sBrief.on'); await p.click('#bqOpts .qo'); await p.click('#btnFight'); await p.waitForSelector('#sBattle.on');
  const run = async (i, fn, label) => { await p.evaluate((i) => { startRound(i); G.food = 999; G.ph = 'battle'; for (let k = 0; k < 6; k++) doSummon(false); G.pl.me.hp = 1e5; G.pl.me.mx = 1e5; }, i); await p.waitForTimeout(500); await p.evaluate(fn); await p.waitForTimeout(1500);
    console.log(label, JSON.stringify(await p.evaluate(() => ({ ph: G.ph, res: G.res && G.res.win })))); };
  await run(7, () => { G.en.filter((e) => e.t === 'camp').forEach((e) => (e.hp = 0)); }, 'raid win');
  await run(1, () => { G.gi = 0; G.pl.me.x = G.goals[0][0]; G.pl.me.y = G.goals[0][1]; }, 'escape step1');
  await p.evaluate(() => { G.t = G.dur; }); await p.waitForTimeout(1500);
  console.log('escape end', JSON.stringify(await p.evaluate(() => ({ ph: G.ph, gi: G.gi, res: G.res && G.res.win }))));
  await run(4, () => { }, 'boss'); await p.waitForTimeout(7000); await p.screenshot({ path: 'test/o_boss.png' });
  await p.evaluate(() => { G.en.concat(G.du ? [G.du.b] : []).filter((e) => e.t === 'boss').forEach((e) => (e.hp = 0)); }); await p.waitForTimeout(600); await p.evaluate(() => { for (const id in G.pl) G.pl[id].offer = null; }); await p.waitForTimeout(1200);
  console.log('boss win', JSON.stringify(await p.evaluate(() => ({ ph: G.ph, res: G.res && G.res.win }))));
  await run(2, () => { G.pl.me.hp = 0; G.lives = 0; G.pl.me.down = 1e9; G.pl.me.hp = 0; }, 'survive wipe');
  await run(0, () => { G.baseHp = 0; }, 'castle fall');
  console.log('errors', errs); await b.close();
})().catch((e) => { console.error('FAIL', e.message); process.exit(1); });
