const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  for (const [w,h] of [[1280,720],[740,360]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } }); const errs=[]; p.on('pageerror', e=>errs.push(String(e)));
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.36'); });
  await p.goto('file:///home/claude/work/game/dist/index.html'); await p.waitForTimeout(4500);
  await p.click('#bwj-badge button.mg'); await p.waitForTimeout(4200);
  const r = await p.evaluate(() => [...document.querySelectorAll('#bwj-gm .gc')].map(c => c.textContent.replace(/\s+/g,' ').slice(0,40) + ' | ' + (c.querySelector('a')?.href||'-')));
  const bx = await p.evaluate(()=>{const r=document.querySelector('#bwj-gm .bx').getBoundingClientRect();return [r.top>=0,r.bottom<=innerHeight]});
  console.log(w, JSON.stringify(r), bx, errs);
  if (w===740) await p.screenshot({path:'/tmp/gm.png'});
  await p.click('#bwj-gm .cl'); console.log('closed', await p.evaluate(()=>!document.getElementById('bwj-gm')));
  await p.close(); }
  await b.close();
})();
