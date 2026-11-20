p='src/game.js';s=open(p).read()
def rep(a,b,c=1):
    global s
    assert s.count(a)==c,(a[:70],s.count(a)); s=s.replace(a,b)
# duel: weapon-specific attacks
i=s.index("  for (const p of hs) { p.dcd = (p.dcd || 0) - dt;"); j=s.index("  // 장수 행동")
new='''  for (const p of hs) { const S = heroStats(p), dd = Math.hypot(b.x - p.x, b.y - p.y); let any = false;
    for (const k in DW) { const L = p.cards[k]; if (!L) continue; any = true; const w = DW[k], key = 'd_' + k; p[key] = (p[key] || 0) - dt * S.as; if (p[key] > 0) continue; if (dd > w[0] + 30) { p[key] = 0; continue; }
      const ev = p.cards['evo_' + k] ? 1.3 : 1; p[key] = Math.max(w[3], w[1] - w[2] * L); dmgEnemy(b, (w[4] + w[5] * L) * S.dmg * ev * 0.8); G.shots.push([p.x, p.y - 20, b.x, b.y - 20, L >= 5 ? 2 : L >= 3 ? 1 : 0, w[6]]); if (k === 'buddha' || k === 'sword' || k === 'flail') G.fx.push([b.x, b.y - 14, 26, 'hit']); if (k === 'cannon' || k === 'bomb' || k === 'turtle') G.fx.push([b.x, b.y, 50, 'boom']); if (k === 'buddha') for (const h of hs) if (Math.hypot(h.x - p.x, h.y - p.y) < 170) h.hp = Math.min(h.mx, h.hp + h.mx * 0.006); }
    if (!any) { p.dcd = (p.dcd || 0) - dt; if (p.dcd <= 0 && dd <= 190) { p.dcd = 0.7 / S.as; dmgEnemy(b, 26 * S.dmg); G.shots.push([p.x, p.y - 20, b.x, b.y - 20, 0, 'archer']); } }
    while (G.shots.length > 60) G.shots.shift(); }
'''
s=s[:i]+new+s[j:]
rep("function duelStep(dt) {","// 보스전(결투) 무기표: [사거리, 쿨다운, 레벨당 단축, 최소 쿨다운, 기본 피해, 레벨당 피해, 모양]\nconst DW = { bow: [260, 1.0, 0.1, 0.5, 18, 8, 'archer'], nu: [280, 1.3, 0.12, 0.7, 16, 8, 'bow'], cannon: [380, 2.0, 0.2, 1.0, 40, 18, 'cannon'], musket: [360, 0.9, 0.08, 0.45, 26, 12, 'gun'], rocket: [400, 2.2, 0.25, 1.2, 34, 14, 'hwa'], stone: [270, 0.9, 0.1, 0.45, 18, 9, 'stone'], turtle: [360, 1.8, 0.2, 0.9, 32, 13, 'cannon'], hwacha: [300, 3.0, 0.4, 1.5, 60, 25, 'hwa'], spear: [190, 1.0, 0.1, 0.5, 20, 9, 'thrust'], sword: [175, 0.9, 0.1, 0.45, 22, 10, 'thrust'], flail: [160, 0.6, 0, 0.6, 16, 8, 'thrust'], bomb: [340, 2.4, 0.3, 1.2, 60, 28, 'cannon'], buddha: [190, 0.6, 0, 0.6, 6, 4, 'bow'] };\nfunction duelStep(dt) {")
# range balance: bow 340->260, nu 330->290, musket 420->370
rep("const WR = { bow: 340, nu: 330, cannon: 380, musket: 420,","const WR = { bow: 260, nu: 290, cannon: 380, musket: 370,")
rep("const t = nearest(p.x, p.y, 340); if (t) { p.bw =","const t = nearest(p.x, p.y, 260); if (t) { p.bw =")
rep("L = lineHit(p, a, 340, 9, dm, nh)","L = lineHit(p, a, 260, 9, dm, nh)")
rep("const t = nearest(p.x, p.y, 330); if (t) { p.nw =","const t = nearest(p.x, p.y, 290); if (t) { p.nw =")
rep("L = lineHit(p, a, 330, 8, dm, c.nu >= 4 ? 2 : 1)","L = lineHit(p, a, 290, 8, dm, c.nu >= 4 ? 2 : 1)")
rep("const t = nearest(p.x, p.y, 420); if (t) { p.mk =","const t = nearest(p.x, p.y, 370); if (t) { p.mk =")
rep("lineHit(p, a, 420, 10, dm, 4)","lineHit(p, a, 370, 10, dm, 4)")
rep("archer: { n: '궁수',   c: '#f2d65a', rg: 300,","archer: { n: '궁수',   c: '#f2d65a', rg: 260,")
open(p,'w').write(s)
