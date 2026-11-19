g='src/game.js'; s=open(g).read()
def rep(a,b):
    global s
    assert s.count(a)==1,(s.count(a),a[:70]); s=s.replace(a,b)
rep("  grunt:  { n: '보병',   hp: 22,  sp: 38, dm: 6,  r: 9,  st: 0,   f: 8,  xp: 1 },","  grunt:  { n: '보병',   hp: 30,  sp: 38, dm: 5,  r: 9,  st: 0,   f: 8,  xp: 1 },")
rep("shoot:  { n: '조총·궁수', hp: 18, sp: 34, dm: 5,","shoot:  { n: '조총·궁수', hp: 13, sp: 34, dm: 5,")
rep("cav:    { n: '기병',   hp: 55,  sp: 82, dm: 9,  r: 11, st: 0,   f: 10, xp: 2 },","cav:    { n: '기병',   hp: 70,  sp: 82, dm: 7,  r: 11, st: 0,   f: 10, xp: 2 },\n  cannon: { n: '대포병', hp: 14,  sp: 28, dm: 4,  r: 10, st: 200, f: 14, xp: 4 },")
rep("tank:   { n: '중갑',   hp: 150, sp: 26, dm: 14, r: 14, st: 0,   f: 18, xp: 4 },","tank:   { n: '중갑',   hp: 150, sp: 26, dm: 14, r: 14, st: 0,   f: 18, xp: 6 },")
rep("ch: '궁', rg: 200, dmg: 9,","ch: '궁', rg: 200, dmg: 10,")
rep("rg: 240, dmg: 40, rt: 0.4, aoe: 0 }","rg: 240, dmg: 46, rt: 0.4, aoe: 0 }")
rep("rg: 290, dmg: 30, rt: 0.35, aoe: 48 }","rg: 290, dmg: 36, rt: 0.35, aoe: 48 }")
# spawn
rep("const T = ET[type], np = G.order.length, sc = hs *","const kind = type, T = ET[kind]; if (type === 'cannon') type = 'shoot'; const np = G.order.length, sc = hs *")
rep("Math.random() < Math.min(0.14, 0.015 + 0.004 * G.sc + 0.06 * (G.t / G.dur)), hm = el ? 2.8 : 1;","Math.random() < Math.min(G.dif === DIFF.hard ? 0.42 : G.dif === DIFF.easy ? 0.14 : 0.3, 0.015 + 0.004 * G.sc + (G.dif === DIFF.hard ? 0.26 : G.dif === DIFF.easy ? 0.06 : 0.16) * (G.t / G.dur)), hm = el ? 2.8 : 1;")
rep("  if (type === 'shoot') { const gf = CH[R[G.rd].ch].foe === '왜군'; e.rg = gf ? 380 : 260; e.pk = gf ? 'gun' : 'bow'; e.gt = rnd(1, 3); }","  if (type === 'shoot') { const gf = CH[R[G.rd].ch].foe === '왜군'; e.rg = gf ? 380 : 260; e.pk = gf ? 'gun' : 'bow'; e.gt = rnd(1, 3); if (kind === 'cannon') { e.pk = 'cannon'; e.rg = 430; e.gt = rnd(2, 4); } }")
# pickType
a=s.index("function pickType(rd) {"); b=s.index("\n",a)
s=s[:a]+"""function pickType(rd) { // 시간이 지날수록(특히 보통·어려움) 강한 적이 더 많이 나와요
  const prog = G.t / G.dur, k = G.dif === DIFF.hard ? 1.5 : G.dif === DIFF.easy ? 0.5 : 1, cvw = rd.cl === 'cav' ? 0.2 : 0.1;
  const wc = prog > 0.12 ? 0.02 + 0.09 * prog * k : 0, wt = prog > 0.2 ? 0.04 + 0.2 * prog * k : 0, ws = 0.2, r = Math.random() * (1.2 + wc + wt);
  return r < wc ? 'cannon' : r < wc + wt ? 'tank' : r < wc + wt + ws ? 'shoot' : r < wc + wt + ws + cvw ? 'cav' : 'grunt'; }"""+s[b:]
# death
rep("const T = ET[e.t]; if (e.t === 'boss') G.bossDead = true;","const T = ET[e.pk === 'cannon' ? 'cannon' : e.t]; if (e.t === 'boss') G.bossDead = true;")
rep("v: T.xp * (e.el ? 4 : 1) }","v: T.xp * (e.el ? 5 : 1) }")
# shooting
rep("e.gt = e.pk === 'gun' ? 2.6 : 1.9; let tgx, tgy;","e.gt = e.pk === 'cannon' ? 4.6 : e.pk === 'gun' ? 2.6 : 1.9; let tgx, tgy;")
rep("v = e.pk === 'gun' ? 330 : 230; G.pj.push({ x: e.x, y: e.y - 14, vx: dx2 / L2 * v, vy: dy2 / L2 * v, life: e.rg / v + 0.25, dm: (e.pk === 'gun' ? 11 : 7) * G.dif.dm * (e.el ? 1.4 : 1), k: e.pk });",
    "v = e.pk === 'cannon' ? 210 : e.pk === 'gun' ? 330 : 230; if (e.pk === 'cannon') G.pj.push({ x: e.x, y: e.y - 14, vx: dx2 / L2 * v, vy: dy2 / L2 * v, life: L2 / v, dm: 26 * G.dif.dm * (e.el ? 1.3 : 1), k: 'cannon', tx: tgx, ty: tgy }); else G.pj.push({ x: e.x, y: e.y - 14, vx: dx2 / L2 * v, vy: dy2 / L2 * v, life: e.rg / v + 0.25, dm: (e.pk === 'gun' ? 14 : 9) * G.dif.dm * (e.el ? 1.4 : 1), k: e.pk });")
rep("  for (let i = G.pj.length - 1; i >= 0; i--) { const b = G.pj[i]; b.x += b.vx * dt; b.y += b.vy * dt; b.life -= dt; let hit = false;",
"""  for (let i = G.pj.length - 1; i >= 0; i--) { const b = G.pj[i]; b.x += b.vx * dt; b.y += b.vy * dt; b.life -= dt; let hit = false;
    if (b.k === 'cannon') { if (b.life <= 0) { const BR = 80; for (const h of hs2) if (h.fz <= 0 && Math.hypot(h.x - b.tx, h.y - b.ty) < BR) hurt(h, b.dm); for (const u of G.units) if (u && (u.t === 'spear' || u.t === 'cav') && !(u.dn > 0) && u.x !== undefined && Math.hypot(u.x - b.tx, u.y - b.ty) < BR) u.hp -= b.dm * 0.8; if (G.castle && Math.hypot(G.ax - b.tx, G.ay - b.ty) < CR + BR * 0.5) G.baseHp -= b.dm * 1.6; G.fx.push([b.tx, b.ty, BR, 'boom']); G.pj.splice(i, 1); } continue; }""")
rep("s.pj = g.pj.slice(0, 90).map((b) => [Math.round(b.x), Math.round(b.y), Math.round(b.vx), Math.round(b.vy), b.k]);","s.pj = g.pj.slice(0, 90).map((b) => [Math.round(b.x), Math.round(b.y), Math.round(b.vx), Math.round(b.vy), b.k, b.tx !== undefined ? Math.round(b.tx) : 0, b.ty !== undefined ? Math.round(b.ty) : 0]);")
rep("e.hp / e.mx, e.ef > 0 ? 1 : 0, e.el]);","e.hp / e.mx, e.ef > 0 ? 1 : 0, e.el, e.pk === 'cannon' ? 1 : 0]);")
rep("  for (const b of V.pj || []) { const x = b[0] + b[2] * pdt,","  for (const b of V.pj || []) { if (b[4] === 'cannon') { const x = b[0] + b[2] * pdt, y = b[1] + b[3] * pdt; cx.strokeStyle = 'rgba(255,60,40,' + (0.55 + 0.3 * Math.sin(tm * 10)) + ')'; cx.lineWidth = 3; cx.setLineDash([8, 6]); cx.beginPath(); cx.arc(b[5], b[6], 80, 0, 7); cx.stroke(); cx.setLineDash([]); cx.fillStyle = 'rgba(255,60,40,.12)'; cx.fill(); cx.fillStyle = '#2b2b2b'; cx.beginPath(); cx.arc(x, y - 6, 7, 0, 7); cx.fill(); cx.strokeStyle = '#ff9a3a'; cx.lineWidth = 2; cx.stroke(); continue; }\n    const x = b[0] + b[2] * pdt,")
rep("sy: 1 - Math.sin(ph * 2) * 0.02, flash: e[5] });","sy: 1 - Math.sin(ph * 2) * 0.02, flash: e[5] });\n      if (e[7]) { cx.fillStyle = '#e98a3c'; cx.strokeStyle = '#5b3a1c'; cx.lineWidth = 2; cx.beginPath(); cx.arc(q[0], fy - h - 4, 9, 0, 7); cx.fill(); cx.stroke(); cx.fillStyle = '#fff'; cx.font = 'bold 11px sans-serif'; cx.textAlign = 'center'; cx.fillText('포', q[0], fy - h); cx.textAlign = 'left'; }")
open(g,'w').write(s)
