import re
f='src/game.js'; s=open(f).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(a[:50],s.count(a)); s=s.replace(a,b)
rep("if (G.castle) { tx = G.ax + e.ox; ty = G.ay + e.oy; reach = e.t === 'shoot' ? e.rg * 0.9 : CR + 14 + T.st * 0.9 + e.ro; }",
"""if (G.castle) { if (e.hu === undefined) e.hu = e.t !== 'shoot' && Math.random() < 0.6; let hh = null; if (e.hu) { let bd2 = 340 * 340; for (const p of hs2) { const d2 = (p.x - e.x) ** 2 + (p.y - e.y) ** 2; if (d2 < bd2) { bd2 = d2; hh = p; } } } if (hh) { tp = hh; tx = hh.x; ty = hh.y; reach = T.r + 10 + T.st * 0.8; } else { tx = G.ax + e.ox; ty = G.ay + e.oy; reach = e.t === 'shoot' ? e.rg * 0.9 : CR + 14 + T.st * 0.9 + e.ro; } }""")
rep("else if (G.castle) G.baseHp -= T.dm * (G.dif.dm * (G.dmx || 1)) * (e.el ? 1.4 : 1) * dt; else if (tp.fz <= 0)",
    "else if (G.castle && !tp) G.baseHp -= T.dm * (G.dif.dm * (G.dmx || 1)) * (e.el ? 1.4 : 1) * 0.8 * dt; else if (tp && tp.fz <= 0)")
# 성 느린 자연 회복: 6초간 피해 없을 때
rep("  if (G.castle && G.baseHp <= 0) endRound(false);",
"""  if (G.castle) { if (G.baseHp < (G.bhPrev || 0) - 1e-6) G.bhQ = 6; else if ((G.bhQ = (G.bhQ || 0) - dt) <= 0 && G.baseHp > 0) G.baseHp = Math.min(G.baseMax, G.baseHp + G.baseMax * 0.006 * dt); G.bhPrev = G.baseHp; }
  if (G.castle && G.baseHp <= 0) endRound(false);""")
open(f,'w').write(s)
