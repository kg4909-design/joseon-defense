const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 800 } }); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.addInitScript(() => { { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.38'); }; if (!localStorage.getItem('jd_sv_2')) localStorage.setItem('jd_sv_2', JSON.stringify({ ts: Date.now(), rd: 4, dur: 300, diff: 'hard', wall: 2, role: 'gunner', name: '민수', ver: 'v0.16' })); });
  await p.goto('file:///home/claude/work/game/dist/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' });
  await p.click('#btnLoad'); await p.waitForTimeout(300); await p.screenshot({ path: '/tmp/sv_load.png' });
  console.log('buttons', await p.evaluate(() => [...document.querySelectorAll('.svb')].map((b) => b.textContent + (b.disabled ? '[x]' : ''))));
  await p.click('.svb[data-k="2"]'); await p.waitForSelector('#sBrief.on');
  console.log(JSON.stringify(await p.evaluate(() => ({ rd: __dbg.G.rd, wall: __dbg.G.wallN, diff: __dbg.G.sel.diff, role: __dbg.G.pl.me && __dbg.G.pl.me.role, ph: __dbg.G.ph }))));
  // 일시정지 → 저장
  await p.click('#bqOpts .qo'); await p.click('#btnFight'); await p.waitForSelector('#sBattle.on'); await p.waitForTimeout(500);
  await p.evaluate(() => document.getElementById('btnPause').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))); await p.waitForTimeout(300);
  await p.click('#pSave'); await p.waitForTimeout(200); await p.click('.svb[data-k="3"]'); await p.waitForTimeout(200);
  console.log('slot3', await p.evaluate(() => localStorage.getItem('jd_sv_3')));
  await p.screenshot({ path: '/tmp/sv_pause.png' });
  console.log('errs', errs); await b.close();
})().catch((e) => { console.error('FAIL', e.message); process.exit(1); });
