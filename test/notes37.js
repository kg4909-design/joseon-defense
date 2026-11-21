const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 844, height: 390 }, hasTouch: true });
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.41'); });
  const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
  await p.goto('file:///home/claude/work/game/dist/index.html'); await p.waitForTimeout(400);
  await p.click('#btnSingle'); await p.waitForTimeout(300);
  await p.evaluate(() => { const D = window.__dbg; D.hostCtl('start', { start: 3, dur: 180, diff: 'normal', wall: 0 }); D.G.ph = 'battle'; });
  await p.waitForTimeout(1500);
  const r = await p.evaluate(() => {
    const D = window.__dbg, G = D.G; G.t = 40; G.wx = 'rain'; G.wv = 40; G.info = { id: 'x1', tt: '테스트', tx: '알림' }; if (G.sm) G.sm.nt = 20;
    return new Promise((res) => setTimeout(() => { const vis = [...document.querySelectorAll('#notes>*')].filter((e) => getComputedStyle(e).display !== 'none' && getComputedStyle(e).visibility !== 'hidden' && e.textContent && (e.id !== 'infoBox' || e.classList.contains('on'))).map((e) => e.id + ':' + e.textContent.slice(0, 20)); res(vis); }, 600));
  });
  console.log(JSON.stringify(r)); console.log('ERR', errs); await b.close();
})();
