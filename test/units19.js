const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } }); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.26'); });
  await p.goto('file:///home/claude/work/game/dist/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' });
  await p.fill('#nick', '하늘'); await p.click('#btnSingle'); await p.waitForSelector('#sRoom.on');
  await p.evaluate(() => { document.getElementById('selStart').value = '3'; }); await p.click('#btnStart'); await p.waitForSelector('#sBrief.on');
  await p.click('#bqOpts .qo'); await p.click('#btnFight'); await p.waitForSelector('#sBattle.on');
  await p.evaluate(() => { const m = G.pl.me; G.need = 1e9; m.hp = m.mx = 1e5; G.units.fill(null); G.units[0] = { t: 'spear', lv: 1, cd: 0 }; G.units[1] = { t: 'cav', lv: 1, cd: 0 }; G.units[2] = { t: 'spear', lv: 2, cd: 0 }; G.units[3] = { t: 'bow', lv: 1, cd: 0 }; m.x = G.ax - 40; m.y = G.ay + 400; });
  for (let k = 0; k < 6; k++) { await p.waitForTimeout(3000); console.log(JSON.stringify(await p.evaluate(() => ({ t: Math.round(G.t), base: Math.round(G.baseHp), en: G.en.length, u: G.units.filter((u) => u && u.mh).map((u) => [u.t, Math.round(Math.hypot(u.x - G.ax, u.y - G.ay)), Math.round(u.hp), u.dn > 0 ? 'dn' : ''].join(':')) })))); }
  await p.screenshot({ path: '/tmp/units19.png' }); console.log('errs', errs); await b.close();
})();
