const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: +(process.argv[2]||1737), height: +(process.argv[3]||932) } });
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.32'); });
  await p.goto('file:///home/claude/work/game/dist/index.html');
  await p.click('#btnSingle'); await p.waitForTimeout(600);
  await p.screenshot({ path: 'test/room24.png' });
  const r = await p.evaluate(() => { const a = document.querySelector('#btnLeave').getBoundingClientRect(), b = document.querySelector('#diffRow').getBoundingClientRect(), c = document.querySelector('#btnStart').getBoundingClientRect(); return { leaveTop: Math.round(a.top), diffBottom: Math.round(b.bottom), startBottom: Math.round(c.bottom) }; });
  console.log(JSON.stringify(r));
  await b.close();
})();
