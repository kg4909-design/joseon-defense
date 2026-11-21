const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  for (const [name, w, h] of [['tab', 1280, 800], ['s23', 780, 360], ['s23tall', 844, 390]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } }); await p.addInitScript(() => { try { { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.41'); }; } catch (e) {} }); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.goto('file:///home/claude/work/game/dist/index.html?fast=60'); await p.waitForSelector('#bwj-intro', { state: 'detached' });
    await p.screenshot({ path: `test/d_${name}_1lobby.png` });
    await p.fill('#nick', '하늘'); await p.click('#btnSingle'); await p.waitForSelector('#sRoom.on'); await p.screenshot({ path: `test/d_${name}_2room.png` });
    await p.click('#btnStart'); await p.waitForSelector('#sBrief.on'); await p.screenshot({ path: `test/d_${name}_3brief.png` });
    await p.click('#btnFight', { timeout: 3000 }).catch(async () => { await p.evaluate(() => document.querySelector('#btnFight').scrollIntoView()); await p.click('#bqOpts .qo'); await p.click('#btnFight'); });
    await p.waitForSelector('#sBattle.on'); await p.waitForTimeout(1200); await p.screenshot({ path: `test/d_${name}_4battle.png` });
    await p.evaluate(() => { __dbg.G.t = __dbg.G.dur; }); await p.waitForSelector('#sResult.on'); await p.waitForTimeout(600);
    const r = await p.evaluate(() => { const q = (s) => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return [Math.round(b.top), Math.round(b.bottom), e.offsetParent !== null]; }; return { vh: innerHeight, next: q('#btnNext'), skip: q('#btnSkip'), retry: q('#btnRetry') }; });
    console.log(name, JSON.stringify(r)); await p.screenshot({ path: `test/d_${name}_5result.png` });
    console.log('errors', errs); await p.close();
  }
  await b.close();
})().catch((e) => { console.error('FAIL', e.message); process.exit(1); });
