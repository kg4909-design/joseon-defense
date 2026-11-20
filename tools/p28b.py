g='src/game.js';t=open(g).read()
h='src/template.html';u=open(h).read()
def rep(a,b,n=1):
    global t
    assert t.count(a)==n,(a[:70],t.count(a)); t=t.replace(a,b)
def repu(a,b,n=1):
    global u
    assert u.count(a)==n,(a[:70],u.count(a)); u=u.replace(a,b)
BOT = r"""
// ----- 협동전 봇 (빈자리 채우기) -----
const BOT_ROLES = ['militia', 'monk', 'gunner', 'archer'], BOT_NM = { guard: '🤖방패봇', ranger: '🤖불화살봇', supply: '🤖보급봇' };
function dropBots() { for (const id of [...G.order]) if (G.pl[id] && G.pl[id].bot) { delete G.pl[id]; if (G.ev) delete G.ev.votes[id]; if (G.ans) delete G.ans[id]; } G.order = G.order.filter((id) => G.pl[id]); }
function fillBots(total) {
  dropBots(); total = Math.min(4, total | 0); let k = 0;
  while (G.order.length < total) { const used = new Set(G.order.map((id) => G.pl[id].role)), r = BOT_ROLES.find((x) => !used.has(x)) || 'archer', id = 'bot' + (++k); addPlayer(id, '🤖봇' + k, r); G.pl[id].bot = true; }
}
let lastBt = 0;
function botAI() {
  const now = performance.now(), dt = Math.min(0.2, (now - lastBt) / 1000); lastBt = now;
  if (!G || !G.cm || G.paused) return;
  const all = G.order.map((id) => G.pl[id]), bots = all.filter((p) => p && p.bot); if (!bots.length) return;
  const hum = all.filter((p) => !p.bot && !p.away && p.hp > 0 && !(p.down > 0)), d2 = (a, x, y) => Math.hypot(a.x - x, a.y - y), ch = (m) => Math.random() < dt / m;
  const camps = G.en.filter((e) => e.t === 'camp');
  for (const p of bots) {
    const B = p.bt = p.bt || { o: 0, dir: 1, df: 0, s: 0 }; B.df -= dt; if (B.df <= 0) { B.df = 2 + Math.random() * 2; B.dir = -B.dir; }
    if (G.ph === 'brief') { const q = R[G.rd].q; if (q && G.ans[p.id] == null && ch(2.5)) hostMsg(p.id, { k: 'ans', i: Math.random() < 0.65 ? q[2] : rint(q[1].length) }); continue; }
    if (G.ph === 'result') { if (p.mo && ch(2)) hostMsg(p.id, { k: 'mer', i: rint(p.mo.length) }); continue; }
    if (G.ph !== 'battle') continue;
    if (G.ev) { if (G.ev.votes[p.id] == null && ch(1.8)) hostMsg(p.id, { k: 'vote', i: rint(2) }); p.mvx = p.mvy = 0; continue; }
    if (p.offer) { B.o += dt; if (B.o > 1.6) { B.o = 0.6; if (p.qz && p.qs === 0) hostMsg(p.id, { k: 'qa', i: Math.random() < 0.65 ? p.qz.a : rint(p.qz.o.length) }); else hostMsg(p.id, { k: 'card', i: rint(p.offer.length) }); } } else B.o = 0;
    if (p.hp <= 0 || p.down > 0) { p.mvx = p.mvy = 0; continue; }
    let tx = G.ax, ty = G.ay, stop = 110;
    if (G.du) {
      const b = G.du.b; p.mvx = p.mvy = 0;
      if (G.du.ph === 'fight') { const dx = p.x - b.x, dy = p.y - b.y, L = Math.hypot(dx, dy) || 1, want = G.du.R * 0.5, rad = (want - L) / want, tx_ = -dy / L * B.dir + dx / L * -rad * 0.9, ty_ = dx / L * B.dir + dy / L * -rad * 0.9, l2 = Math.hypot(tx_, ty_) || 1; p.mvx = tx_ / l2; p.mvy = ty_ / l2; if (p.cd <= 0 && ch(2.2)) hostMsg(p.id, { k: 'skill' }); }
      continue;
    }
    const foes = G.en.filter((e) => e.t !== 'camp'), near = (r) => foes.filter((e) => d2(e, p.x, p.y) < r);
    if (p.cr === 'ranger') { const c = camps.slice().sort((a, b) => d2(a, p.x, p.y) - d2(b, p.x, p.y))[0]; if (c) { tx = c.x; ty = c.y; stop = 230; } else { const e = foes.slice().sort((a, b) => d2(a, G.ax, G.ay) - d2(b, G.ax, G.ay))[0]; if (e && d2(e, G.ax, G.ay) < 650) { tx = e.x; ty = e.y; stop = 240; } else stop = 170; } }
    else if (p.cr === 'supply') { const f = hum.slice().sort((a, b) => a.hp / a.mx - b.hp / b.mx)[0] || all.find((q) => q.id !== p.id && q.hp > 0); if (f) { tx = f.x; ty = f.y; stop = 120; } }
    else { stop = 120; }
    const dx = tx - p.x, dy = ty - p.y, L = Math.hypot(dx, dy);
    if (L > stop) { p.mvx = dx / L; p.mvy = dy / L; } else { const ax = -dy / (L || 1) * B.dir, ay = dx / (L || 1) * B.dir; p.mvx = ax * 0.35; p.mvy = ay * 0.35; }
    if (p.cd <= 0 && near(300).length >= 3 && ch(1.5)) hostMsg(p.id, { k: 'skill' });
    if (G.cm && p.cr && (p.cc || 0) <= 0) {
      let go = false;
      if (p.cr === 'guard') go = (G.castle && G.baseHp < G.baseMax * 0.6 && G.bInv <= 0) || near(240).length >= 8;
      else if (p.cr === 'ranger') go = near(380).length >= 5 || camps.some((c) => d2(c, p.x, p.y) < 380);
      else go = all.some((q) => q.hp > 0 && q.hp < q.mx * 0.5) || all.some((q) => q.down > 0 && q.down < 1e8);
      if (go && ch(0.8)) hostMsg(p.id, { k: 'cr' });
    }
    B.s += dt; if (B.s > 3.5) { B.s = 0;
      if (p.cr === 'supply' && G.obj !== 'e' && G.food >= summonCost() + 60 && G.units.some((x, i) => i < slotsOpen(G.upg) && !x)) hostMsg(p.id, { k: 'summon' });
      if (p.cr === 'guard' && G.castle && G.baseHp < G.baseMax * 0.6 && G.food >= G.dif.rc + 30 && (G.repCd || 0) <= 0) hostMsg(p.id, { k: 'rep' }); }
  }
}
"""
rep("function hostTick() {", BOT.lstrip('\n')+"function hostTick() { botAI();")
# 시작/로비
rep("G.cm = !!v.coop && !v.endless; G.cyc = 0;","G.cm = !!v.coop && !v.endless; fillBots(G.cm ? (v.bots | 0) : 0); G.cyc = 0;")
rep("else if (c === 'lobby') { G.ph = 'lobby'; }","else if (c === 'lobby') { dropBots(); G.ph = 'lobby'; }")
rep("p.cr = G.cm ? CR_ORD[n % 3] : ''; p.cc = 0;","p.cr = G.cm ? CR_ORD[n % 3] : ''; if (p.bot && p.cr) p.name = BOT_NM[p.cr]; p.cc = 0;")
rep("if (np === 1 && G.pl[G.order[0]].offer) return;","{ const hu = G.order.filter((id) => !G.pl[id].bot); if (hu.length === 1 && G.pl[hu[0]].offer) return; }")
rep("diff: diffSel, coop: true };","diff: diffSel, coop: true, bots: +$('selBots').value };")
rep("const CRD = {","const CRD0 = 0; const CRD = {")  # harmless marker
repu('<button id="btnStart">게임 시작</button>','<div class="row" style="margin:10px 0">🤝 협동전 빈자리 <select id="selBots"><option value="0">봇으로 안 채움</option><option value="2">총 2명이 되게 봇 채우기</option><option value="3" selected>총 3명이 되게 봇 채우기</option><option value="4">총 4명이 되게 봇 채우기</option></select></div>\n      <button id="btnStart">게임 시작</button>')
open(g,'w').write(t);open(h,'w').write(u)
