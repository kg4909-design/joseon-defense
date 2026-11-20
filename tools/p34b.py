g='src/game.js'; s=open(g).read()
def rep(a,b,c=1):
    global s
    assert s.count(a)==c,(a[:70],s.count(a)); s=s.replace(a,b)
# --- mission engine
eng = r"""
// ===== 협동 서브미션 (v0.34): 30초 안팎마다 새 임무가 이어져요 =====
const SMD = {
  camp: ['🔥 보급기지 습격', '적 보급기지를 부수세요! 성공하면 적이 20초 동안 느리게 나와요'],
  conv: ['🌾 식량 수송대 차단', '몰래 지나가는 식량부대 4명을 모두 잡으세요! 성공하면 군량이 크게 올라요'],
  ref: ['🚶 피난민 호위', '피난민이 깃발까지 가도록 지켜 주세요! 성공하면 혼(경험치)이 많이 올라요'],
  twin: ['🔥 쌍둥이 봉화', '서로 다른 두 영웅이 두 봉화 발판에 동시에 서세요! 성공하면 전원 회복 + 공격 버프'],
  herb: ['🌿 약초 수집', '지도에 나타난 약초 4개를 모으세요! 성공하면 전원 체력이 크게 회복돼요'],
  rush: ['🛡 돌격 막아내기', '35초 동안 아무도 쓰러지지 않고 버티세요! 성공하면 카드가 열려요'],
  fast: ['⚡ 빠른 처치 경쟁', '30초 안에 적을 많이 처치하세요! 성공하면 공격력이 30초 동안 올라요']
};
function smInfo(tt, tx) { G.info = { id: Date.now() + Math.random(), tt, tx }; }
function smEnd(S, ok, msg) { const m = S.cur; if (ok) S.ok++; else S.no++; smInfo((ok ? '✅ 미션 성공! ' : '⌛ 미션 실패… ') + SMD[m.k][0], msg); if (m.e) { const i = G.en.indexOf(m.e); if (i >= 0 && m.e.hp > 0) G.en.splice(i, 1); } for (const c of m.cv || []) { const i = G.en.indexOf(c); if (i >= 0) G.en.splice(i, 1); } S.cur = null; S.nt = 5 + rnd(0, 3); }
function smStart(S, hs2, hs) {
  const np = hs2.length, base = G.castle ? [G.ax, G.ay] : [hs2.reduce((a, h) => a + h.x, 0) / np, hs2.reduce((a, h) => a + h.y, 0) / np];
  const ks = Object.keys(SMD).filter((k) => k !== S.last && (k !== 'twin' || np >= 2)); const k = ks[rint(ks.length)], a = rnd(0, 6.283), P = (r, aa) => clampW(base[0] + Math.cos(aa) * r, base[1] + Math.sin(aa) * r, 40);
  const m = { k, t: 40, a: 0, b: 1, pts: [] }; S.last = k; S.cur = m;
  if (k === 'camp') { const e = spawn('camp', hs, P(rnd(520, 640), a)); e.sm = 1; e.gt = 1e9; e.hp = e.mx = 380 + 50 * np; m.e = e; m.b = 1; }
  else if (k === 'conv') { m.cv = []; const p0 = P(640, a), tg = [-Math.sin(a), Math.cos(a)]; for (let i = 0; i < 4; i++) { const e = spawn('grunt', hs, clampW(p0[0] + tg[0] * -i * 38, p0[1] + tg[1] * -i * 38)); e.sm = 2; e.cv = [tg[0] * 52, tg[1] * 52]; e.hp = e.mx = 45; e.d0 = 0; m.cv.push(e); } m.b = 4; m.t = 42; }
  else if (k === 'ref') { const p0 = P(150, a), p1 = P(560, a + 2.4); m.u = { x: p0[0], y: p0[1], hp: 100 }; m.g = p1; m.amb = false; m.t = 48; m.b = 100; }
  else if (k === 'twin') { const c = P(330, a), nx = -Math.sin(a) * 80, ny = Math.cos(a) * 80; m.pa = clampW(c[0] + nx, c[1] + ny); m.pb = clampW(c[0] - nx, c[1] - ny); m.pg = 0; m.b = 100; }
  else if (k === 'herb') { m.h = []; for (let i = 0; i < 4; i++) m.h.push(P(rnd(240, 440), a + i * 1.57 + rnd(-0.3, 0.3))); m.b = 4; m.t = 38; }
  else if (k === 'rush') { m.t = 35; m.rt = 1; m.b = 35; }
  else if (k === 'fast') { m.t = 30; m.k0 = G.kc || 0; m.need = 14 + 5 * np; m.b = m.need; }
  smInfo('🎯 서브미션! ' + SMD[k][0], SMD[k][1]);
}
function subStep(dt, hs2, hs) {
  if (!G.cm || G.obj === 'e' || G.cmM || G.endless) { G.sm = null; return; }
  const S = G.sm = G.sm || { cur: null, nt: 20, last: '', ok: 0, no: 0 };
  if (G.du || G.ev || G.order.some((id) => G.pl[id].offer) || !hs2.length) return;
  if (!S.cur) { S.nt -= dt; if (S.nt <= 0 && G.t < G.dur - 28) smStart(S, hs2, hs); return; }
  const m = S.cur; m.t -= dt; const np = hs2.length;
  if (m.k === 'camp') { if (m.e.hp <= 0 || !G.en.includes(m.e)) { G.spSlow = G.t + 20; return smEnd(S, true, '적이 20초 동안 느리게 나와요!'); } m.a = 0; }
  else if (m.k === 'conv') { let dead = 0; for (const c of m.cv) { if (c.hp <= 0 || !G.en.includes(c)) dead++; else { c.d0 += 52 * dt; if (c.d0 > 1100 || c.x < 5 || c.y < 5 || c.x > G.ww - 5 || c.y > G.wh - 5) { c.hp = 0; c.esc = 1; } } } m.a = m.cv.filter((c) => c.hp <= 0 && !c.esc).length; const esc = m.cv.filter((c) => c.esc).length; if (esc > 0) { G.en = G.en.filter((e) => !e.esc); return smEnd(S, false, '식량부대가 도망쳤어요'); } if (m.a >= 4) { const f = Math.round(130 * G.foodMul); G.food += f; return smEnd(S, true, '군량 +' + f); } }
  else if (m.k === 'ref') { const u = m.u; let thr = 0; for (const e of G.en) { if (e.t === 'camp' || e.cv) continue; const d = Math.hypot(e.x - u.x, e.y - u.y); if (d < 40 && thr < 3) { thr++; u.hp -= ET[e.t].dm * 1.2 * dt; } else if (d < 90) thr = Math.max(thr, 0.5); } const gd = Math.hypot(m.g[0] - u.x, m.g[1] - u.y), tot = Math.hypot(m.g[0] - m.u.sx || 1, 1); if (m.u.sx == null) { m.u.sx = u.x; m.u.sy = u.y; m.u.d0 = gd; } if (thr < 0.5) { u.x += (m.g[0] - u.x) / (gd || 1) * 42 * dt; u.y += (m.g[1] - u.y) / (gd || 1) * 42 * dt; } m.a = Math.round((1 - gd / (m.u.d0 || 1)) * 100); if (!m.amb && m.a >= 40) { m.amb = true; for (let i = 0; i < 7; i++) spawn('grunt', hs, clampW(m.g[0] + rnd(-140, 140), m.g[1] + rnd(-140, 140))); } if (u.hp <= 0) return smEnd(S, false, '피난민이 쓰러졌어요'); if (gd < 30) { gainXp(Math.max(4, Math.round(G.need * 0.7))); return smEnd(S, true, '혼(경험치) 보너스!'); } }
  else if (m.k === 'twin') { const near = (pt) => hs2.filter((h) => Math.hypot(h.x - pt[0], h.y - pt[1]) < 62), A = near(m.pa), B = near(m.pb); const okp = A.length && B.length && (A.length > 1 || B.length > 1 || A[0] !== B[0]) && !(A.length === 1 && B.length === 1 && A[0] === B[0]); m.on = okp ? 1 : 0; m.pg = okp ? Math.min(100, m.pg + dt * 100 / 6) : Math.max(0, m.pg - dt * 8); m.a = Math.round(m.pg); if (m.pg >= 100) { for (const h of hs2) h.hp = Math.min(h.mx, h.hp + h.mx * 0.35); G.buffAtk = Math.max(G.buffAtk || 0, 15); return smEnd(S, true, '전원 회복 + 공격 15초 강화!'); } }
  else if (m.k === 'herb') { m.h = m.h.filter((q) => { for (const h of hs2) if (Math.hypot(h.x - q[0], h.y - q[1]) < 48) { m.a++; G.fx.push([q[0], q[1], 40, 'sum']); return false; } return true; }); if (m.a >= 4) { for (const h of hs2) h.hp = Math.min(h.mx, h.hp + h.mx * 0.6); return smEnd(S, true, '전원 체력 60% 회복!'); } }
  else if (m.k === 'rush') { m.a = Math.round(35 - m.t); if (G.order.some((id) => G.pl[id].down > 0)) { return smEnd(S, false, '쓰러진 친구가 있어서 실패'); } m.rt -= dt; if (m.rt <= 0) { m.rt = 5; const h = hs2[rint(np)], a = rnd(0, 6.283); for (let i = 0; i < 7 + np; i++) spawn(i % 4 === 0 ? 'cav' : 'grunt', hs, clampW(h.x + Math.cos(a + rnd(-0.5, 0.5)) * 640, h.y + Math.sin(a + rnd(-0.5, 0.5)) * 440)); } if (m.t <= 0) { G.lvq = (G.lvq | 0) + 1; return smEnd(S, true, '카드가 열려요!'); } return; }
  else if (m.k === 'fast') { m.a = Math.min(m.need, (G.kc || 0) - m.k0); if (m.a >= m.need) { G.buffAtk = Math.max(G.buffAtk || 0, 30); return smEnd(S, true, '공격력 30초 강화!'); } }
  if (m.t <= 0) smEnd(S, false, m.k === 'camp' ? '기지가 아직 남아 있어요' : '시간이 다 됐어요');
}
"""
rep("function applyShared(q, id) {", eng + "function applyShared(q, id) {")
# hook call before dead filter
rep("  const dead = G.en.filter((e) => e.hp <= 0); for (const e of dead) enemyDeath(e);","  subStep(dt, hs2, hs);\n  const dead = G.en.filter((e) => e.hp <= 0); for (const e of dead) enemyDeath(e);")
rep("const camps = G.en.filter((e) => e.t === 'camp').length, wipe","const camps = G.en.filter((e) => e.t === 'camp' && !e.sm).length, wipe")
# kill counter
rep("function enemyDeath(e) {\n  if (G.es) G.es.k++;","function enemyDeath(e) {\n  if (G.es) G.es.k++; if (!e.sm) G.kc = (G.kc || 0) + 1;")
# convoy movement
rep("    if (e.t === 'camp') { e.gt -= dt;","    if (e.cv) { e.x += e.cv[0] * dt; e.y += e.cv[1] * dt; continue; }\n    if (e.t === 'camp') { e.gt -= dt;")
# spawn slow
rep("  G.waveT -= dt;","  G.waveT -= dt * (G.t < (G.spSlow || 0) ? 0.6 : 1);")
rep("* (G.obj === 'r' ? 0.45 : G.obj === 'e' ? 1.25 : 1);","* (G.obj === 'r' ? 0.45 : G.obj === 'e' ? 1.25 : 1) * (G.t < (G.spSlow || 0) ? 0.55 : 1);")
# reset per battle: in startRound
rep("G.info = null; G.ambT = G.endless ? 8 : 34;","G.info = null; G.sm = null; G.spSlow = 0; G.kc = 0; G.ambT = G.endless ? 8 : 34;")
# snapshot
rep("s.qzr = g.qzr;","""s.qzr = g.qzr; { const S = g.sm, m = S && S.cur; s.sm = m ? { k: m.k, n: SMD[m.k][0], t: Math.ceil(Math.max(0, m.t)), a: m.a, b: m.b, ok: S.ok, pts: smPts(m) } : (S ? { ok: S.ok, nt: Math.ceil(S.nt) } : null); }""")
rep("function subStep(dt, hs2, hs) {","""function smPts(m) {
  const r = (v) => Math.round(v);
  if (m.k === 'camp') return m.e && m.e.hp > 0 ? [[r(m.e.x), r(m.e.y), '🔥']] : [];
  if (m.k === 'conv') return m.cv.filter((c) => c.hp > 0).map((c) => [r(c.x), r(c.y), '🌾']);
  if (m.k === 'ref') return [[r(m.u.x), r(m.u.y), '🚶'], [r(m.g[0]), r(m.g[1]), '🚩']];
  if (m.k === 'twin') return [[r(m.pa[0]), r(m.pa[1]), m.on ? '🟢' : '🔥'], [r(m.pb[0]), r(m.pb[1]), m.on ? '🟢' : '🔥']];
  if (m.k === 'herb') return m.h.map((q) => [r(q[0]), r(q[1]), '🌿']);
  return [];
}
function subStep(dt, hs2, hs) {""")
# bot twin
rep("    const dx = tx - p.x, dy = ty - p.y, L = Math.hypot(dx, dy);\n    if (L > stop)","    if (!hold && G.sm && G.sm.cur && G.sm.cur.k === 'twin' && bots.indexOf(p) === 0) { tx = G.sm.cur.pb[0]; ty = G.sm.cur.pb[1]; stop = 14; hold = true; }\n    const dx = tx - p.x, dy = ty - p.y, L = Math.hypot(dx, dy);\n    if (L > stop)")
open(g,'w').write(s)
