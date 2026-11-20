f='src/game.js'; s=open(f).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(a[:60],s.count(a)); s=s.replace(a,b)
rep("easy: { n: '쉬움', hp: 0.7, sp: 0.65, dm: 0.65, fd: 50, hh: 1.3 }, normal: { n: '보통', hp: 1, sp: 0.9, dm: 1, fd: 0, hh: 1 }, hard: { n: '어려움', hp: 1.3, sp: 1.2, dm: 1.3, fd: -20, hh: 0.9 }",
    "easy: { n: '쉬움', hp: 0.6, sp: 0.55, dm: 0.5, fd: 50, hh: 1.4, bs: 1.5, bb: 0.55, rc: 40, rh: 0.35, bi: 4, pr: 0.12 }, normal: { n: '보통', hp: 1, sp: 0.9, dm: 1, fd: 0, hh: 1, bs: 1, bb: 1, rc: 50, rh: 0.3, bi: 3, pr: 0.2 }, hard: { n: '어려움', hp: 1.3, sp: 1.2, dm: 1.3, fd: -20, hh: 0.9, bs: 0.9, bb: 1.25, rc: 70, rh: 0.25, bi: 1.5, pr: 0.4 }")
rep("G.baseMax = Math.round(600 * (1 + 0.2 * (G.wallN || 0))","G.baseMax = Math.round(600 * G.dif.bs * (1 + 0.2 * (G.wallN || 0))")
rep("const e = spawn('boss', hs * scale, q);","const e = spawn('boss', hs * scale * G.dif.bb, q);")
rep("G.t < 40 ? 0.2 : G.t < 100 ? 0.2 + 0.8 * (G.t - 40) / 60 : 1;","G.t < 40 ? G.dif.pr : G.t < 100 ? G.dif.pr + (1 - G.dif.pr) * (G.t - 40) / 60 : 1;")
rep("G.bInv = 3;","G.bInv = G.dif.bi;")
rep("G.food >= 60 && G.baseHp > 0","G.food >= G.dif.rc && G.baseHp > 0")
rep("G.food -= 60; G.baseHp = Math.min(G.baseMax, G.baseHp + G.baseMax * 0.2);","G.food -= G.dif.rc; G.baseHp = Math.min(G.baseMax, G.baseHp + G.baseMax * G.dif.rh);")
rep("s.rcd = Math.ceil(g.repCd || 0);","s.rcd = Math.ceil(g.repCd || 0); s.rc = g.dif.rc; s.rh = Math.round(g.dif.rh * 100); s.bis = g.dif.bi;")
rep("(V.rcd > 0 ? V.rcd + '초' : '🌾60')","(V.rcd > 0 ? V.rcd + '초' : '🌾' + V.rc + ' · +' + V.rh + '%')")
rep("V.food < 60 || V.bh >= V.bm || V.rcd > 0","V.food < V.rc || V.bh >= V.bm || V.rcd > 0")
rep("'백성들이 힘을 모아 3초간 성을 지켜요'","'백성들이 힘을 모아 잠시 성을 지켜요'")
open(f,'w').write(s)
