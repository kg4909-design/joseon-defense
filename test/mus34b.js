const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
  const p = await b.newPage({ viewport: { width: 844, height: 390 } }); const errs = [], bad = [];
  p.on('pageerror', (e) => errs.push(String(e))); p.on('requestfailed', (r) => bad.push(r.url()));
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.42'); localStorage.setItem('jd_hid', '1'); });
  await p.goto('file:///home/claude/joseon-defense/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' }); await p.waitForTimeout(300);
  await p.mouse.click(400, 200); await p.waitForTimeout(1200);
  const cur = () => p.evaluate(() => { const M = window.__dbg.MUS, N = M.N[M.cur]; return { cur: M.cur, playing: N ? !N.e[N.i].paused : null, bad: Object.keys(M.N).filter((k) => M.N[k].bad) }; });
  const out = { lobby: await cur() };
  await p.click('#btnSingle'); await p.waitForTimeout(800); out.room = await cur();
  for (const st of [0, 10, 20, 25]) {
    await p.evaluate((st) => { const D = window.__dbg; D.hostCtl('start', { start: st, dur: 300, diff: 'normal', coop: true, fix: 1, bots: 1, cl: 2 }); }, st); await p.waitForTimeout(900); const br = await cur();
    await p.evaluate(() => window.__dbg.hostCtl('fight')); await p.waitForTimeout(1200); out['ch' + st] = [br.cur, (await cur()).cur, (await cur()).playing];
    await p.evaluate(() => window.__dbg.endRound(true)); await p.waitForTimeout(900); out['res' + st] = (await cur()).cur;
  }
  console.log(JSON.stringify(out), 'bad', bad, errs); await b.close();
})();
