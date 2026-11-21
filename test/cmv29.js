const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const errs = [];
  for (const [w, h] of [[1180, 820], [844, 390]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.38'); localStorage.setItem('jd_cw', JSON.stringify({ tk: 0, sh: 10, own: { gwonyul: 1 }, cos: ['a_gold', 'a_fire'], eq: 'a_fire', pity: 0, pity2: 0, cl: 0, ids: [] })); });
    p.on('pageerror', (e) => errs.push(String(e)));
    await p.goto('file:///home/claude/joseon-defense/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' }); await p.click('#btnSingle'); await p.waitForTimeout(300);
    await p.evaluate(() => { me.role = 'gwonyul'; sendProf(); });
    await p.evaluate(() => { const D = window.__dbg; D.hostCtl('start', { start: 2, dur: 240, diff: 'normal', wall: 0, coop: true, fix: 1, bots: 3, cl: 3 }); });
    await p.waitForTimeout(500);
    const t = await p.evaluate(() => { const G = window.__dbg.G; return { role: G.pl[G.order[0]].role, aura: G.pl[G.order[0]].aura, names: G.order.map((id) => G.pl[id].name), cmS: G.cmS, pl: G.cmPl }; }); console.log(w, JSON.stringify(t));
    await p.evaluate(() => { const D = window.__dbg, G = D.G; D.hostCtl('fight'); G.evDone = [true, true]; G.bossTimes = []; const me = G.pl[G.order[0]]; me.x = G.cmPl[0][0] + 150; me.y = G.cmPl[0][1] + 40; });
    await p.waitForTimeout(2500);
    const sk = await p.evaluate(() => { const G = window.__dbg.G, me = G.pl[G.order[0]]; G.en.slice(0, 5).forEach((e) => { e.x = me.x + 60; e.y = me.y; }); const n0 = G.en.reduce((a, e) => a + e.hp, 0); hostMsg(me.id, { k: 'skill' }); return { cd: me.cd, dmg: Math.round(n0 - G.en.reduce((a, e) => a + e.hp, 0)) }; }); console.log('skill', JSON.stringify(sk));
    await p.waitForTimeout(1200); await p.screenshot({ path: `/tmp/cmv_bat_${w}.png` });
    console.log('tag', await p.evaluate(() => document.getElementById('coopTag').textContent));
    // 결과 화면 보상
    await p.evaluate(() => { const D = window.__dbg, G = D.G; for (const id of G.order) { G.pl[id].hp = G.pl[id].mx = 1e7; } G.cmD = true; G.t = G.dur - 0.01; });
    await p.waitForTimeout(1500);
    console.log('res', await p.evaluate(() => [document.getElementById('rsTitle').textContent, document.getElementById('rsReward').innerHTML, document.getElementById('sResult').classList.contains('on')]));
    await p.screenshot({ path: `/tmp/cmv_res_${w}.png` }); await p.close();
  }
  console.log('errs', errs); await b.close();
})();
