const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1595, height: 905 } });
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.39'); });
  await p.goto('file:///home/claude/work/game/dist/index.html'); await p.waitForTimeout(5500);
  console.log(JSON.stringify(await p.evaluate(() => [...document.getElementById('lobMain').children].map((e) => [e.id || e.className, Math.round(e.getBoundingClientRect().top), Math.round(e.getBoundingClientRect().height), getComputedStyle(e).marginTop]))));
  console.log(await p.evaluate(() => document.getElementById('lobMenu').innerHTML.slice(0, 900)));
  await b.close();
})();
