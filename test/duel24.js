const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1180, height: 820 } });
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.31'); });
  const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
  await p.goto('file:///home/claude/work/game/dist/index.html'); await p.waitForTimeout(400);
  await p.click('#btnSingle'); await p.waitForTimeout(300);
  const r = await p.evaluate(() => {
    const D = window.__dbg, out = [];
    const run = (label, cards, diff, rdIdx, dodge) => {
      D.hostCtl('start', { start: rdIdx, dur: 180, diff, wall: 0 }); const G = D.G, id = G.order[0], h = G.pl[id]; G.ph = 'battle';
      h.cards = Object.assign({}, cards); h.hp = h.mx = Math.round(h.mx * (1 + 0.1 * (cards.armor || 0))); G.t = (G.obj === 'b') ? 109.99 : 119.99; G.ev = null; G.evDone = [true, true];
      for (let i = 0; i < 5; i++) { G.ev = null; h.offer = null; D.stepBattle(1 / 30); if (G.du) break; }
      if (!G.du) return out.push(label + ': 일기토 시작 안 됨 (obj ' + G.obj + ')');
      const bn = G.du.b.bn, mx = G.du.b.mx; let t = 0, hl = 0, last = h.hp;
      for (let i = 0; i < 30 * 90 && G.du; i++) { G.ev = null; h.offer = null;
        if (dodge && G.du.ph === 'fight') { // 간단한 회피: 붉은 표시 안이면 바깥으로
          let mx2 = 0, my2 = 0; for (const tl of G.du.tl) { const d = Math.hypot(h.x - tl.x, h.y - tl.y); const rr = (tl.r || 0) + 40; if ((tl.k === 'ring' || tl.k === 'slam') && d < rr) { mx2 += (h.x - tl.x) / (d || 1); my2 += (h.y - tl.y) / (d || 1); } if (tl.k === 'dash') { const ax = tl.x2 - tl.x, ay = tl.y2 - tl.y, L = Math.hypot(ax, ay) || 1, px = h.x - tl.x, py = h.y - tl.y, c = (px * ay - py * ax) / L; if (Math.abs(c) < 70) { mx2 += -ay / L * Math.sign(c || 1); my2 += ax / L * Math.sign(c || 1); } } if (tl.k === 'fan') { const a = Math.atan2(h.y - tl.y, h.x - tl.x); let da = Math.abs(a - tl.a); if (da > Math.PI) da = 2 * Math.PI - da; if (da < 0.75) { mx2 += -Math.sin(tl.a); my2 += Math.cos(tl.a); } } }
          const bd = Math.hypot(G.du.b.x - h.x, G.du.b.y - h.y); if (!mx2 && !my2) { if (bd < 200) { mx2 = (h.x - G.du.b.x) / bd; my2 = (h.y - G.du.b.y) / bd; } }
          const l = Math.hypot(mx2, my2) || 1; h.mvx = mx2 / l; h.mvy = my2 / l; if (!mx2 && !my2) { h.mvx = h.mvy = 0; } }
        if (dodge === 2) h.hp = h.mx; D.stepBattle(1 / 30); t += 1 / 30; hl += Math.max(0, last - h.hp); last = h.hp; }
      out.push(`${label} [${bn}] ${G.du ? '미결(' + Math.round(G.du.b.hp / mx * 100) + '%)' : (G.bossDead ? '승리' : '패배→전장복귀')} ${t.toFixed(0)}s 받은피해 ${Math.round(hl)}/${h.mx}`);
    };
    run('약함 불사 TTK', { bow: 1 }, 'normal', 0, 2);
    run('중간 불사 TTK', { bow: 3, nu: 2, train: 2 }, 'normal', 0, 2);
    run('강함 불사 TTK', { bow: 5, nu: 4, cannon: 3, forge: 3, train: 3 }, 'normal', 0, 2);
    run('약함(활1) 가만히', { bow: 1 }, 'normal', 0, false);
    run('약함(활1) 회피', { bow: 1 }, 'normal', 0, true);
    run('중간(활3,쇠뇌2,훈련2) 회피', { bow: 3, nu: 2, train: 2 }, 'normal', 0, true);
    run('강함(활5,쇠뇌4,화포3,단련3) 회피', { bow: 5, nu: 4, cannon: 3, forge: 3, train: 3 }, 'normal', 0, true);
    run('중간 쉬움', { bow: 3, nu: 2, train: 2 }, 'easy', 0, true);
    run('중간 어려움', { bow: 3, nu: 2, train: 2 }, 'hard', 0, true);
    run('중간 4(b라운드)', { bow: 3, nu: 2, train: 2 }, 'normal', 4, true);
    return out;
  });
  console.log(r.join('\n'), errs);
  await b.close();
})();
