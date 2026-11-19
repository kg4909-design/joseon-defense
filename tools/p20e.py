g='src/game.js'; s=open(g).read()
def rep(a,b):
    global s
    assert s.count(a)==1,(s.count(a),a[:70]); s=s.replace(a,b)
rep("s.sh = g.shots;","""{ const WM = { archer: 'bow', bow: 'bow', cannon: 'cannon', gun: 'musket', hwa: 'hwacha', stone: 'stone', thrust: 'spear', slash: 'sword' };
      for (const sh of g.shots) { if (sh[9] != null) continue; for (const id of g.order) { const p = g.pl[id], w = WM[sh[5]]; if (w && sh[0] === p.x && sh[1] === p.y - 20) { if ((p.cards[w] || 0) >= 5 || p.cards['evo_' + w]) sh[9] = 1; break; } } } }
    s.sh = g.shots;""")
rep("    if (f.k === 'sh') { const a = f.a, kd = a[5] || ''; const dx = a[2] - a[0], dy = a[3] - a[1], L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;","""    if (f.k === 'sh') { const a = f.a, kd = a[5] || ''; const dx = a[2] - a[0], dy = a[3] - a[1], L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
      if (a[9] === 1) { const tt = Math.min(1, t * 1.6); cx.save(); cx.globalAlpha = 0.55 * (1 - tt); cx.strokeStyle = '#ffe27a'; cx.lineWidth = 7 * (1 - tt * 0.6); cx.lineCap = 'round'; cx.beginPath(); cx.moveTo(a[0], a[1]); cx.lineTo(a[2], a[3]); cx.stroke(); cx.globalAlpha = 0.9 * (1 - tt); cx.lineWidth = 3; cx.beginPath(); cx.arc(a[2], a[3], 8 + tt * 30, 0, 7); cx.stroke(); if (!LOW) { cx.fillStyle = '#fff6c0'; for (let k = 0; k < 5; k++) { const an = k * 1.26 + tt * 2; cx.beginPath(); cx.arc(a[2] + Math.cos(an) * (10 + tt * 26), a[3] + Math.sin(an) * (10 + tt * 26), 2.4 * (1 - tt), 0, 7); cx.fill(); } } cx.restore(); }""")
open(g,'w').write(s)
