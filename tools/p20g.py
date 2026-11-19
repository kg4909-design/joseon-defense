g='src/game.js'; s=open(g).read()
def rep(a,b):
    global s
    assert s.count(a)==1,(s.count(a),a[:70]); s=s.replace(a,b)
rep("bow:    { n: '궁병',   c: '#e6c84a', ch: '궁', rg: 190,","bow:    { n: '궁병',   c: '#e6c84a', ch: '궁', rg: 200,")
rep("rg: 230, dmg: 40, rt: 0.4, aoe: 0 }","rg: 240, dmg: 40, rt: 0.4, aoe: 0 }")
rep("ch: '포', rg: 210, dmg: 30, rt: 0.35, aoe: 48 }","ch: '포', rg: 290, dmg: 30, rt: 0.35, aoe: 48 }")
rep("spear:  { n: '창병',   c: '#58b86a', ch: '창', rg: 130, dmg: 22, rt: 0.8, aoe: 0 }","spear:  { n: '창병',   c: '#58b86a', ch: '창', rg: 130, dmg: 14, rt: 0.8, aoe: 0 }")
rep("rg: 120, dmg: 12, rt: 2.0, aoe: 0 }","rg: 120, dmg: 9, rt: 1.3, aoe: 0 }")
rep("u.mh = (u.t === 'cav' ? 90 : 80) * (1 + 0.7 * (u.lv - 1));","u.mh = (u.t === 'cav' ? 70 : 60) * (1 + 0.6 * (u.lv - 1));")
rep("const spd = (u.t === 'cav' ? 190 : 105) * dt;","const spd = ET[u.t === 'cav' ? 'cav' : 'grunt'].sp * 1.2 * dt; // 적 보병·기병과 같은 속도")
rep("const dm = T.dmg * 1.3 * LVM[u.lv - 1] * umul;","const dm = T.dmg * LVM[u.lv - 1] * umul;")
rep("tg.x = q[0]; tg.y = q[1]; tg.st = Math.max(tg.st, 0.3); }","tg.x = q[0]; tg.y = q[1]; }")
rep("clampW(tg.x + dx / d * 34, tg.y + dy / d * 34)","clampW(tg.x + dx / d * 18, tg.y + dy / d * 18)")
# hero range
rep("  return { dmg, as: (1 + 0.12 * n('train'))","""  const WR = { bow: 340, nu: 330, cannon: 380, musket: 420, rocket: 400, stone: 270, turtle: 360, hwacha: 340, spear: 150, flail: 120, bomb: 340 };
  let rg = 0; for (const k in WR) if (c[k]) rg = Math.max(rg, WR[k]); if (c.sword) rg = Math.max(rg, 133 + 12 * c.sword + (c.evo_sword ? 45 : 0)); if (c.buddha) rg = Math.max(rg, 105 + 16 * c.buddha + (c.evo_buddha ? 40 : 0));
  return { rg, dmg, as: (1 + 0.12 * n('train'))""")
open(g,'w').write(s)
