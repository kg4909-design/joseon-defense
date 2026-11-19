f='src/game.js'; s=open(f).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(a[:60],s.count(a)); s=s.replace(a,b)
rep("const ramp = G.endless ? 1 : G.t < 30 ? 0.25 : G.t < 60 ? 0.25 + 0.75 * (G.t - 30) / 30 : 1;",
    "const ramp = G.endless ? 1 : G.t < 40 ? 0.2 : G.t < 100 ? 0.2 + 0.8 * (G.t - 40) / 60 : 1;\n  if (!G.endless && G.t < 40) gainXp(0.32 * dt);")
rep("G.waveT = G.endless || G.t >= 90 ? 14 : 20;","G.waveT = G.endless || G.t >= 120 ? 14 : 24;")
rep("* (G.firstRaid ? 0.6 : 1)); G.firstRaid = false;","* (G.endless ? 1 : Math.min(1, 0.45 + G.t / 180))); G.firstRaid = false;")
rep("V.t < 30 ? `🌱 준비","V.t < 40 ? `🌱 준비")
open(f,'w').write(s)
