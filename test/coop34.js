const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 844, height: 390 } }); const errs = [];
  p.on('pageerror', (e) => errs.push(String(e)));
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.41'); localStorage.setItem('jd_hid', '1'); });
  await p.goto('file:///home/claude/joseon-defense/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' }); await p.waitForTimeout(300);
  await p.click('#btnSingle'); await p.waitForTimeout(400); const seen = {}; let escShot = false;
  for (let i = 0; i < 14; i++) {
    const r = await p.evaluate(() => { const D = window.__dbg; D.hostCtl('start', { start: 0, dur: 240, diff: 'normal', coop: true, bots: 2, cl: 2 }); const G = D.G; const brief = document.getElementById('bkGoal').textContent; return { obj: G.obj, dur: G.sel.dur, rd: G.rd, brief }; });
    seen[r.obj] = (seen[r.obj] || 0) + 1;
    if (i === 0) console.log('brief:', r.brief, 'dur', r.dur);
    if (r.obj === 'e' && !escShot) { await p.evaluate(() => window.__dbg.hostCtl('fight')); await p.waitForTimeout(1500); console.log('esc display', await p.evaluate(() => getComputedStyle(document.getElementById('escGo')).display)); await p.screenshot({ path: '/tmp/ui33/coop_esc.png' }); escShot = true; }
  }
  console.log('objs', seen, 'errs', errs); await b.close();
})();
