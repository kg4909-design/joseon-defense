const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  for (const [w, h] of [[1180, 820], [1766, 936], [844, 390], [667, 375]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.37'); });
    const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
    await p.goto('file:///home/claude/joseon-defense/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' }); await p.click('#btnSingle'); await p.waitForTimeout(300);
    await p.screenshot({ path: `/tmp/cm_lobby_${w}.png` });
    await p.evaluate(() => { const D = window.__dbg, G = D.G; D.hostCtl('start', { start: 0, dur: 240, diff: 'normal', wall: 0, coop: true }); });
    await p.waitForTimeout(600);
    await p.evaluate(() => { const G = window.__dbg.G; window.__dbg.hostCtl('fight'); G.evDone = [true, true]; });
    await p.waitForTimeout(7000);
    const r = await p.evaluate(() => { const q = (id) => { const e = document.getElementById(id); if (!e) return null; const r = e.getBoundingClientRect(); return { d: getComputedStyle(e).display, x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }; }; return { cr: q('btnCr'), skill: q('btnSkill'), summon: q('btnSummon'), rep: q('btnRep'), up: q('btnUp'), tag: q('coopTag'), txt: document.getElementById('coopTag').textContent }; });
    const ov = (a, c) => a && c && a.d !== 'none' && c.d !== 'none' && a.x < c.x + c.w && c.x < a.x + a.w && a.y < c.y + c.h && c.y < a.y + a.h;
    console.log(w, JSON.stringify(r), 'overlap:', ['skill', 'summon', 'rep', 'up'].filter((k) => ov(r.cr, r[k])), errs);
    await p.screenshot({ path: `/tmp/cm_bat_${w}.png` }); await p.close();
  }
  await b.close();
})();
