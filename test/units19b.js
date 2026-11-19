const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  for (const mode of ['ranged-only', 'with-melee']) {
    const p = await b.newPage({ viewport: { width: 1280, height: 720 } }); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.20'); });
    await p.goto('file:///home/claude/work/game/dist/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' });
    await p.fill('#nick', '하늘'); await p.click('#btnSingle'); await p.waitForSelector('#sRoom.on');
    await p.evaluate(() => { document.getElementById('selStart').value = '3'; }); await p.click('#btnStart'); await p.waitForSelector('#sBrief.on');
    await p.click('#bqOpts .qo'); await p.click('#btnFight'); await p.waitForSelector('#sBattle.on');
    await p.evaluate((mode) => { const m = G.pl.me; G.need = 1e9; m.hp = m.mx = 1e5; m.cards = {}; m.x = G.ax - 40; m.y = G.ay + 600; G.units.fill(null);
      const set = mode === 'ranged-only' ? ['bow', 'bow', 'gun', 'gun', 'cannon', 'bow', 'gun', 'cannon'] : ['bow', 'gun', 'cannon', 'bow', 'spear', 'spear', 'cav', 'gun'];
      set.forEach((t, i) => { G.units[i] = { t, lv: 1, cd: 0 }; }); }, mode);
    await p.waitForTimeout(40000);
    console.log(mode, JSON.stringify(await p.evaluate(() => ({ t: Math.round(G.t), base: Math.round(G.baseHp), en: G.en.length, down: G.units.filter((u) => u && u.dn > 0).length }))), errs);
    await p.screenshot({ path: `/tmp/u19_${mode}.png` }); await p.close();
  }
  await b.close();
})();
