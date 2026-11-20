const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const errs = [];
  const p = await b.newPage({ viewport: { width: 1180, height: 820 } });
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.33'); localStorage.setItem('jd_hid', '1'); localStorage.setItem('jd_cw', JSON.stringify({ tk: 0, sh: 3, own: { gwonyul: 1, gimsimin: 1, gwakjaeu: 1, hyujeong: 1, yujeong: 1, jinrin: 1 }, cos: [], eq: '', pity: 0, pity2: 0, cl: 0, ids: [] })); });
  p.on('pageerror', (e) => errs.push(String(e)));
  await p.goto('file:///home/claude/joseon-defense/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' }); await p.waitForTimeout(300);
  await p.click('#btnSingle'); await p.waitForTimeout(300);
  console.log('btns', await p.evaluate(() => [3, 4, 5, 6].map((i) => document.getElementById('roleLeg' + i).textContent)));
  const seq = await p.evaluate(() => { localStorage.setItem('jd_cw', JSON.stringify({ tk: 0, sh: 0, own: {}, cos: [], eq: '', pity: 0, pity2: 0, cl: 0, ids: [] })); const d = cwLoad(); const o = []; o.push(cwAddSh(d, 10), cwAddSh(d, 12), cwAddSh(d, 12), cwAddSh(d, 12), cwAddSh(d, 14), cwAddSh(d, 14), d.tk, d.sh); return o; });
  console.log('seq', JSON.stringify(seq));
  await p.evaluate(() => { localStorage.setItem('jd_cw', JSON.stringify({ tk: 0, sh: 3, own: { gwonyul: 1, gimsimin: 1, gwakjaeu: 1, hyujeong: 1, yujeong: 1, jinrin: 1 }, cos: [], eq: '', pity: 0, pity2: 0, cl: 0, ids: [] })); refreshHid(); });
  const CST = await p.evaluate(() => { for (let i = 0; i < 30; i++) { const o = ROUND_OBJ[i]; if (o === 'd' || o === 'b') return i; } return -1; });
  for (const role of ['gwakjaeu', 'hyujeong', 'yujeong', 'jinrin']) {
    await p.evaluate((r) => { document.getElementById('roleRow').querySelector(`[data-r=${r}]`).click(); }, role);
    await p.evaluate((c) => { window.__dbg.hostCtl('start', { start: c, dur: 240, diff: 'normal', wall: 0, coop: true, bots: 3, cl: 1 }); }, CST); await p.waitForTimeout(400);
    await p.evaluate(() => { const D = window.__dbg, G = D.G; D.hostCtl('fight'); G.evDone = [true, true]; G.bossTimes = []; }); await p.waitForFunction(() => window.__dbg.G.en.length >= 8, null, { timeout: 15000 }).catch(() => {}); await p.waitForTimeout(300);
    const r = await p.evaluate(() => {
      const D = window.__dbg, G = D.G, me = G.pl[G.order[0]], o = { role: me.role }, bot = G.pl[G.order[1]];
      me.x = G.ax + 60; me.y = G.ay + 40; bot.x = me.x + 80; bot.y = me.y; bot.hp = bot.mx * 0.5; bot.bfT = 0;
      G.en.slice(0, 8).forEach((e, i) => { e.x = me.x + 70 + (i % 4) * 25; e.y = me.y - 40 + (i >> 2) * 40; });
      const n0 = G.en.reduce((a, e) => a + e.hp, 0); const sp0 = heroStats(me).sp, ao = heroStats(me).aoe, hj0 = heroStats(bot).reg;
      const h0 = me.hp; hurt(me, 100); o.hurt = Math.round(h0 - me.hp); me.hp = me.mx;
      hostMsg(me.id, { k: 'skill' });
      o.cd = me.cd; o.dmg = Math.round(n0 - G.en.reduce((a, e) => a + e.hp, 0)); o.st = G.en.slice(0, 8).filter((e) => e.st > 0).length; o.spT = me.spT || 0; o.botBf = bot.bfT || 0; o.botHeal = Math.round((bot.hp / bot.mx) * 100); o.zT = me.zT || 0; o.spUp = +(heroStats(me).sp / sp0).toFixed(2); o.aoe = ao; o.reg = hj0;
      window.__fx = G.fx.length; return o; });
    await p.waitForTimeout(1200);
    const z = await p.evaluate(() => { const G = window.__dbg.G; return [G.pl[G.order[0]].zT || 0, G.en.filter((e) => e.slw > G.t).length]; });
    console.log(JSON.stringify(r), 'after1.2s zT,slow', z);
    await p.screenshot({ path: `/tmp/h32_${role}.png`, clip: { x: 150, y: 220, width: 780, height: 420 } });
    await p.evaluate(() => { window.__dbg.hostCtl('lobby'); }); await p.waitForTimeout(300);
  }
  console.log('errs', errs); await b.close();
})();
