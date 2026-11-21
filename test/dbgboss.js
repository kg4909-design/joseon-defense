const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } }); await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.34'); }); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto('file:///home/claude/work/game/dist/index.html?fast=60'); await p.waitForSelector('#bwj-intro', { state: 'detached' });
  await p.fill('#nick', 'a'); await p.click('#btnSingle'); await p.waitForSelector('#sRoom.on'); await p.click('#btnStart'); await p.waitForSelector('#sBrief.on'); await p.click('#bqOpts .qo'); await p.click('#btnFight'); await p.waitForSelector('#sBattle.on');
  await p.evaluate(() => { startRound(4); G.food = 999; G.ph = 'battle'; for (let k = 0; k < 6; k++) doSummon(false); G.pl.me.hp = 1e5; G.pl.me.mx = 1e5; });
  for (let i = 0; i < 4; i++) { await p.waitForTimeout(2500); console.log(JSON.stringify(await p.evaluate(() => ({ obj: G.obj, t: Math.round(G.t), dur: G.dur, out: G.bossOut, du: !!G.du, ph: G.ph, bd: G.bossDead, ens: G.en.map((e) => e.t).join() })))); }
  await p.evaluate(() => { G.en.concat(G.du ? [G.du.b] : []).filter((e) => e.t === 'boss').forEach((e) => (e.hp = 0)); }); await p.waitForTimeout(3000);
  console.log(JSON.stringify(await p.evaluate(() => ({ off: !!G.pl.me.offer, ph: G.ph, bd: G.bossDead, res: G.res && G.res.win, du: !!G.du })))); console.log(errs); await b.close();
})();
