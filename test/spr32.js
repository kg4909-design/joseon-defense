const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const errs = [];
  const p = await b.newPage({ viewport: { width: 1180, height: 820 } });
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.32'); localStorage.setItem('jd_hid', '1'); localStorage.setItem('jd_cw', JSON.stringify({ tk: 0, sh: 0, own: { gwonyul: 1, gimsimin: 1 }, cos: [], eq: '', pity: 0, pity2: 0, cl: 0, ids: [] })); });
  p.on('pageerror', (e) => errs.push(String(e)));
  await p.goto('file:///home/claude/joseon-defense/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' }); await p.click('#btnSingle'); await p.waitForTimeout(300);
  for (const role of ['gwakjaeu','hyujeong','jinrin']) {
    await p.evaluate((r) => { me.role = r; sendProf(); }, role);
    await p.evaluate(() => { window.__dbg.hostCtl('start', { start: 0, dur: 240, diff: 'normal', wall: 0, coop: true, bots: 3, cl: 1 }); }); await p.waitForTimeout(400);
    await p.evaluate(() => { const D = window.__dbg, G = D.G; D.hostCtl('fight'); G.evDone = [true, true]; G.bossTimes = []; });
    await p.waitForFunction(() => window.__dbg.G.en.length >= 10, null, { timeout: 15000 }).catch(() => {}); await p.waitForTimeout(300);
    await p.evaluate(() => { const D = window.__dbg, G = D.G, me = G.pl[G.order[0]]; for (const id of G.order) { G.pl[id].offer = null; G.pl[id].qz = null; } me.x = G.ax - 120; me.y = G.ay + 150; G.en.forEach((e, i) => { e.x = me.x + Math.cos(i * 0.9) * (90 + (i % 3) * 60); e.y = me.y + Math.sin(i * 0.9) * (70 + (i % 3) * 40); }); G.paused = false; });
    await p.waitForTimeout(100);
    await p.evaluate(() => { const D = window.__dbg, G = D.G, me = G.pl[G.order[0]]; for (const id of G.order) { G.pl[id].offer = null; G.pl[id].qz = null; } hostMsg(me.id, { k: 'skill' }); });
    for (const ms of [120, 250, 300]) { await p.waitForTimeout(ms); await p.screenshot({ path: `/tmp/spr_${role}_${ms}_${Math.random() < 2 ? 'a' : 'b'}.png`, clip: { x: 150, y: 220, width: 780, height: 420 } }); }
    await p.evaluate(() => { window.__dbg.hostCtl('lobby'); }); await p.waitForTimeout(300);
  }
  console.log('errs', errs); await b.close();
})();
