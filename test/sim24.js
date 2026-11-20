const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const role = process.argv[2] || 'archer', diff = process.argv[3] || 'normal', dur = +(process.argv[4] || 180);
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1180, height: 820 } });
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.33'); });
  const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
  await p.goto('file:///home/claude/work/game/dist/index.html');
  await p.click('#btnSingle'); await p.waitForTimeout(400);
  await p.evaluate((l) => { window.__LIM = l; }, +(process.env.LIMIT || 99)); const out = await p.evaluate(({ role, diff, dur }) => {
    const D = window.__dbg, G0 = () => D.G; const rows = [];
    D.hostCtl('start', { start: 0, dur, diff, wall: 0 });
    const G = G0(); const id = G.order[0]; const h = G.pl[id]; h.role = role; 
    let att = 0;
    const UPC = [60, 90, 130, 180, 240];
    for (let guard = 0; guard < 70; guard++) {
      const G = G0(); if (G.ph === 'end' || rows.length >= (window.__LIM || 99)) break;
      if (G.ph === 'brief') { G.ph = 'battle'; }
      if (G.ph === 'result') { if (G.res.win) { D.hostMsg(id, { k: 'mer', i: 0 }); D.hostCtl('next'); att = 0; } else { att++; if (att >= 2) { G.res.win = true; D.hostCtl('next'); att = 0; } else D.hostCtl('retry'); } continue; }
      const rd = G.rd, ob = G.obj; const row = { rd, nm: D.R[rd].nm, ob, mod: G.mod, att, tl: [] }; let minB = 1e9, downs = 0, wasDown = false, hl30 = 0, b30 = 0, en30 = 0;
      let lastHp = h.hp;
      for (let i = 0; i < 30 * (dur + 40); i++) {
        const G = G0(); if (G.ph !== 'battle') break;
        const p = G.pl[id]; p.mvx = p.mvy = 0;
        if (G.ev) { G.ev = null; }
        if (p.offer) { if (p.qz && p.qs === 0) D.hostMsg(id, { k: 'qa', i: p.qz.a }); else D.hostMsg(id, { k: 'card', i: 0 }); }
        if (i % 15 === 0 && G.ph === 'battle' && G.obj !== 'e') { if (G.upg < 5 && G.food >= UPC[G.upg] + 60) D.hostMsg(id, { k: 'upg' }); else if (G.food >= 40 * (1 + 0.1 * G.sumN) + 10) D.hostMsg(id, { k: 'summon' }); }
        // 이동
        let tx = null, ty = null;
        if (G.obj === 'e') { tx = p.x + 500; ty = p.y; }
        else if (G.obj === 'r') { const c = G.en.filter((e) => e.t === 'camp').sort((a, b2) => Math.hypot(a.x - p.x, a.y - p.y) - Math.hypot(b2.x - p.x, b2.y - p.y))[0]; if (c) { tx = c.x; ty = c.y; } }
        else { let bd = 1e9, ne = null; for (const e of G.en) { const d = Math.hypot(e.x - p.x, e.y - p.y); if (d < bd) { bd = d; ne = e; } } const dc = Math.hypot(p.x - G.ax, p.y - G.ay); if (ne && bd < 420 && (G.obj !== 'd' || dc < 380)) { if (bd > 150) { tx = ne.x; ty = ne.y; } else if (bd < 90) { tx = p.x * 2 - ne.x; ty = p.y * 2 - ne.y; } } else if (dc > 150) { tx = G.ax; ty = G.ay; } }
        if (tx !== null) { const dx = tx - p.x, dy = ty - p.y, L = Math.hypot(dx, dy) || 1; p.mvx = dx / L; p.mvy = dy / L; }
        const t0 = G.t; D.stepBattle(1 / 30);
        if (G.castle) minB = Math.min(minB, G.baseHp);
        if (p.down > 0 && !wasDown) downs++; wasDown = p.down > 0;
        if (G.t < 30) { hl30 += Math.max(0, lastHp - p.hp); } lastHp = p.hp;
        if (Math.floor(G.t / 30) !== Math.floor(t0 / 30) && G.t < 300) row.tl.push(`${Math.floor(G.t)}s:Lv${p.lv}/en${G.en.length}/hp${Math.round(p.hp / p.mx * 100)}%${G.castle ? '/B' + Math.round(G.baseHp / G.baseMax * 100) : ''}`);
        if (Math.floor(G.t) === 30 && !row.b30) row.b30 = G.castle ? Math.round(G.baseHp / G.baseMax * 100) : null;
      }
      const G2 = G0(); row.win = !!(G2.res && G2.res.win); row.t = Math.round(G2.t); row.lv = h.lv; row.minB = G.castle ? Math.round(minB / G2.baseMax * 100) : null; row.downs = downs; row.hl30 = Math.round(hl30 / h.mx * 100); row.upg = G2.upg; row.units = G2.units.filter(Boolean).length; row.cards = Object.keys(h.cards).length;
      rows.push(row);
      if (G2.ph === 'battle') { G2.ph = 'result'; G2.res = { win: false }; }
    }
    return rows;
  }, { role, diff, dur });
  for (const r of out) console.log(`${r.rd} ${r.nm} [${r.ob}${r.mod ? '/' + r.mod : ''}] ${r.win ? 'WIN' : 'LOSE'}${r.att ? '(재도전)' : ''} t${r.t} Lv${r.lv} 최저성${r.minB} 다운${r.downs} 초반30s영웅피해${r.hl30}% 성30s:${r.b30} 카드${r.cards}종 병사${r.units} 강화${r.upg} | ${r.tl.join(' ')}`);
  console.log('errs', errs);
  await b.close();
})();
