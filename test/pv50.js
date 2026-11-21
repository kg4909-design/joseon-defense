const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] }); const errs = [];
  const p = await b.newPage({ viewport: { width: 844, height: 390 }, hasTouch: true }); p.on('pageerror', (e) => errs.push(String(e)));
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.38'); localStorage.setItem('jd_cw', JSON.stringify({ tk: 5, sh: 0, own: {}, cos: ['a_blue'], eq: '', eq2: '', pity: 0, pity2: 0 })); });
  await p.goto('file:///home/claude/work/game/dist/index.html'); await p.waitForTimeout(5500);
  await p.click('#btnCw'); await p.waitForTimeout(500);
  const cnt = async () => p.evaluate(() => { const c = document.getElementById('cwPv'), d = c.getContext('2d').getImageData(0, 0, 300, 120).data; let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i] && !(d[i - 3] === 217 && d[i - 2] === 234 && d[i - 1] === 208)) n++; return n; });
  const base = await cnt();
  await p.evaluate(() => document.querySelector('button[data-a="a_gold"]').click()); await p.waitForTimeout(700);
  console.log('base', base, 'afterLockedPreview', await cnt(), await p.evaluate(() => document.getElementById('cwPvL').textContent));
  await p.evaluate(() => document.querySelector('button[data-a="a_blue"]').click()); await p.waitForTimeout(700);
  console.log('equipped', await p.evaluate(() => JSON.parse(localStorage.getItem('jd_cw')).eq), await cnt());
  await p.screenshot({ path: '/tmp/pv50.png' }); console.log('ERR', JSON.stringify(errs)); await b.close();
})();
