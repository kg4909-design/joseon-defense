const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const ctx = await b.newContext({ viewport: { width: 851, height: 393 }, hasTouch: true, isMobile: true });
  const p = await ctx.newPage(); const errs = [], cons = [];
  p.on('pageerror', (e) => errs.push(String(e))); p.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') cons.push(m.text()); });
  await p.addInitScript(() => { localStorage.removeItem('jd_tut'); localStorage.removeItem('jd_upd_seen'); localStorage.removeItem('jd_hid'); });
  await p.goto('file:///home/claude/joseon-defense/index.html'); await p.waitForTimeout(3500);
  await p.screenshot({ path: '/tmp/u35_1.png' });
  const vis = async () => p.evaluate(() => [...document.querySelectorAll('.screen.on')].map((s) => s.id).join(','));
  console.log('screen', await vis());
  await p.evaluate(() => { const m = document.getElementById('updModal'); if (m && m.classList.contains('on')) document.getElementById('umX').click(); });
  await p.tap('#btnSingle'); await p.waitForTimeout(500);
  await p.tap('#btnStart'); await p.waitForTimeout(800); console.log('screen', await vis());
  await p.screenshot({ path: '/tmp/u35_2.png' });
  await p.evaluate(()=>{[...document.querySelectorAll('button')].filter(b=>b.textContent.includes('건너뛰기')&&b.offsetParent).forEach(b=>b.click())}); await p.waitForTimeout(400); await p.tap('#bqOpts button >> nth=0').catch((e) => console.log('bq', e.message.slice(0, 80))); await p.waitForTimeout(800);
  await p.tap('#btnFight').catch((e) => console.log('fight', e.message.slice(0, 80))); await p.waitForTimeout(1500);
  console.log('screen', await vis());
  await p.screenshot({ path: '/tmp/u35_3.png' });
  for (let i = 0; i < 6; i++) { await p.waitForTimeout(8000); await p.screenshot({ path: `/tmp/u35_b${i}.png` }); console.log(i, JSON.stringify(await p.evaluate(() => { const G = window.__dbg && window.__dbg.G; return G ? { ph: G.ph, t: Math.round(G.t), sm: G.sm && G.sm.cur && G.sm.cur.k, cm: G.cm, obj: G.obj } : null; }))); }
  console.log('errs', errs, 'cons', cons.slice(0, 10)); await b.close();
})();
