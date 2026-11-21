const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 851, height: 393 }, hasTouch: true }); const errs = [];
  p.on('pageerror', (e) => errs.push(String(e)));
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.36'); localStorage.setItem('jd_hid', '1'); });
  await p.goto('file:///home/claude/joseon-defense/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' }); await p.waitForTimeout(300);
  await p.tap('#btnRank'); await p.waitForTimeout(400); await p.screenshot({ path: '/tmp/dl_tab.png' });
  await p.tap('#dlGo'); await p.waitForTimeout(800);
  console.log('after go', await p.evaluate(() => [...document.querySelectorAll('.screen.on')].map((s) => s.id).join()), JSON.stringify(await p.evaluate(() => { const G = window.__dbg.G; return { daily: G.daily, mod: G.mod, dur: G.sel.dur, rd: G.rd, diff: G.sel.diff }; })));
  await p.tap('#bqOpts button >> nth=0'); await p.waitForTimeout(500); await p.tap('#btnFight'); await p.waitForTimeout(500);
  await p.evaluate(() => { const D = window.__dbg, G = D.G; G.evDone = [true, true]; for (let i = 0; i < 3000 && G.ph === 'battle'; i++) { for (const id of G.order) { const q = G.pl[id]; if (q.offer) { if (q.qz && q.qs === 0 && id === G.qzr) D.hostMsg(id, { k: 'qa', i: q.qz.a }); else if (q.qs !== 0 && q.qrd <= 0 && (!q.qz || id === G.qzr)) D.hostMsg(id, { k: 'card', i: 0 }); } q.hp = q.mx; } G.baseHp = G.baseMax; D.stepBattle(0.1); } });
  await p.waitForTimeout(1500); await p.screenshot({ path: '/tmp/dl_res.png' });
  console.log(await p.evaluate(() => ({ ach: localStorage.getItem('jd_ach'), dl: localStorage.getItem('jd_daily'), res: window.__dbg.G.res && window.__dbg.G.res.dl, rs: window.__dbg.G.res && window.__dbg.G.res.rs, panel: document.getElementById('dailyRes').innerText.slice(0, 60) })));
  await p.tap('#btnHome').catch(() => {}); await p.waitForTimeout(600);
  await p.evaluate(() => location.reload()); await p.waitForTimeout(3500);
  await p.tap('#btnRank').catch(() => {}); await p.tap('#bookTabs button[data-t=ach]'); await p.waitForTimeout(400); await p.screenshot({ path: '/tmp/ach_tab.png' });
  console.log('errs', errs); await b.close();
})();
