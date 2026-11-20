g='src/game.js'; s=open(g).read()
def rep(a,b,c=1):
    global s
    assert s.count(a)==c,(a[:70],s.count(a)); s=s.replace(a,b)
# escape gate
rep("const ESHIFT = 1600;","""function escGo(hs2) { // 탈출: 살아있는 사람 친구 모두가 오른쪽 끝에 닿아야 다음 구간으로 넘어가요 (봇은 제외)
  const edge = G.ww - 800, hu = hs2.filter((h) => !h.bot && !h.away); G.esw = null;
  if (!hu.length) return Math.max(...hs2.map((h) => h.x)) > edge;
  const lag = hu.filter((h) => h.x <= edge); if (lag.length === 0) return true;
  if (hu.some((h) => h.x > edge)) { G.esw = lag.map((h) => h.name); for (const h of hu) h.x = Math.min(h.x, G.ww - 140); }
  return false;
}
const ESHIFT = 1600;""")
rep("if (hs2.length && Math.max(...hs2.map((h) => h.x)) > G.ww - 800) {","if (hs2.length && escGo(hs2)) {")
rep("s.qzr = g.qzr;","s.qzr = g.qzr; s.esw = g.obj === 'e' ? (g.esw || null) : null;")
rep("else if (w.length) tx = '🃏 '","else if (V.esw && V.esw.length) tx = '🚩 ' + V.esw.join(', ') + ' 친구가 아직 도착하지 못했습니다! 모두 오른쪽 끝에 닿아야 나아가요'; else if (w.length) tx = '🃏 '")
# when escape shift happens reset esw
rep("G.es = G.endless ? {","G.esw = null; G.es = G.endless ? {")
# start param obj
rep("else G.cmObj = null; { let st = v.start;","else G.cmObj = v.obj || null; { let st = v.start;")
# cadence 40s start-to-start, 30s limit, escape kinds
rep("const m = { k, t: 40, a: 0, b: 1, pts: [] }; S.last = k; S.cur = m;","const m = { k, t: 30, a: 0, b: 1, pts: [], t0: G.t }; S.last = k; S.cur = m;")
rep("const ks = Object.keys(SMD).filter((k) => k !== S.last && (k !== 'twin' || (np >= 2 && !G.cmS)));","const ks = Object.keys(SMD).filter((k) => k !== S.last && (k !== 'twin' || (np >= 2 && !G.cmS)) && (G.obj !== 'e' || k === 'rush' || k === 'fast'));")
rep("m.b = 4; m.t = 42; }","m.b = 4; m.t = 30; }")
rep("m.amb = false; m.t = 48; m.b = 100; }","m.amb = false; m.t = 30; m.b = 100; }")
rep("m.b = 4; m.t = 38; }","m.b = 4; m.t = 30; }")
rep("else if (k === 'rush') { m.t = 35; m.rt = 1; m.b = 35; }","else if (k === 'rush') { m.t = 30; m.rt = 1; m.b = 30; }")
rep("m.a = Math.round(35 - m.t);","m.a = Math.round(30 - m.t);")
rep("p1 = P(560, a + 2.4)","p1 = P(420, a + 2.4)")
rep("u.x += (m.g[0] - u.x) / (gd || 1) * 42 * dt; u.y += (m.g[1] - u.y) / (gd || 1) * 42 * dt;","u.x += (m.g[0] - u.x) / (gd || 1) * 50 * dt; u.y += (m.g[1] - u.y) / (gd || 1) * 50 * dt;")
rep("rush: ['🛡 돌격 막아내기', '35초 동안","rush: ['🛡 돌격 막아내기', '30초 동안")
rep("S.nt = 10; }","S.nt = Math.max(4, 40 - (G.t - m.t0)); }")
rep("const S = G.sm = G.sm || { cur: null, nt: 20,","const S = G.sm = G.sm || { cur: null, nt: 15,")
rep("G.t < G.dur - 28)","G.t < G.dur - 32)")
# escape: allow missions
rep("if (!G.cm || G.obj === 'e' || G.endless) { G.sm = null; return; }","if (!G.cm || G.endless) { G.sm = null; return; }")
open(g,'w').write(s)
