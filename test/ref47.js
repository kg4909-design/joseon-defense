const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 851, height: 393 } }); const errs = [];
  p.on('pageerror', (e) => errs.push(String(e)));
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.36'); localStorage.setItem('jd_hid', '1'); });
  await p.goto('file:///home/claude/work/game/dist/index.html'); await p.waitForTimeout(500);
  await p.click('#btnSingle'); await p.waitForTimeout(300);
  const r = await p.evaluate(() => { const D = window.__dbg, G = D.G; D.hostCtl('start', { start: 0, dur: 300, diff: 'easy', coop: false, bots: 0 }); D.hostCtl('fight'); G.evDone = [true, true]; G.bossTimes = []; G.sm = { cur: null, nt: 0.1, last: 'x', ok: 0, no: 0 }; let ok = false;
    for (let i = 0; i < 800 && !ok; i++) { for (const id of G.order) { const q = G.pl[id]; if (q.offer) { q.offer = null; q.qz = null; } } D.stepBattle(0.1); const m = G.sm && G.sm.cur; if (m && m.k !== 'ref') { G.sm.cur = null; G.sm.nt = 0.05; G.sm.last = m.k; continue; } if (m && m.k === 'ref') ok = true; }
    const h = G.pl[G.order[0]], m = G.sm.cur; if (!m) return 'none'; G.en = []; m.u.x = G.ax + 600; m.u.y = G.ay + 40; h.x = m.u.x - 80; h.y = m.u.y + 20; G.xp = 0; for (const id of G.order) { const q = G.pl[id]; q.offer = null; q.qz = null; } m.u.hp = 42; m.u.sx = null; return { ok, hp: m.u.hp }; });
  console.log(JSON.stringify(r)); await p.addStyleTag({ content: '#infoBox,#toast,#smTag,#raidTag,#wxTag,#coopTag,#ndTip,#intro{display:none!important}' }); await p.evaluate(() => { const e = document.elementFromPoint(425, 180); if (e && e.tagName !== 'CANVAS') { let n = e; while (n.parentElement && n.parentElement !== document.body && !n.parentElement.classList.contains('screen')) n = n.parentElement; n.style.display = 'none'; } }); await p.waitForTimeout(9000); await p.screenshot({ path: '/tmp/ref47.png' }); console.log('ERR', JSON.stringify(errs)); await b.close();
})();
