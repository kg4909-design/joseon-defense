g='src/game.js';t=open(g).read()
h='src/template.html';u=open(h).read()
def rep(a,b,n=1):
    global t
    assert t.count(a)==n,(a[:80],t.count(a)); t=t.replace(a,b)
def repu(a,b,n=1):
    global u
    assert u.count(a)==n,(a[:80],u.count(a)); u=u.replace(a,b)
rep("const CR_ORD = ['guard', 'ranger', 'supply'];","const CR_ORD = ['guard', 'ranger', 'supply'];\nconst CLV = [null, { hp: 1, dm: 1, cs: 12, dl: 1, bs: 1, ft: 16 }, { hp: 1.2, dm: 1.15, cs: 10, dl: 0.9, bs: 0.92, ft: 20 }, { hp: 1.45, dm: 1.3, cs: 8, dl: 0.78, bs: 0.85, ft: 24 }]; // 협동 난이도 1 연습 · 2 도전 · 3 극한")
# 난이도 적용
rep("G.baseMax = Math.round(600 * G.dif.bs","G.baseMax = Math.round((G.cm ? CLV[G.cl || 2].bs : 1) * 600 * G.dif.bs")
rep("* G.co.dm;","* G.co.dm * (G.cm ? CLV[G.cl || 2].dm : 1);",2)
rep("* G.dif.hp * (i < 6 && !G.endless ? 0.88 : 1);","* G.dif.hp * (i < 6 && !G.endless ? 0.88 : 1) * (G.cm ? CLV[G.cl || 2].hp : 1);")
rep("* (rd.df ? 1.1 : 1) * G.dif.hp, hs2 = aliveHeroes();","* (rd.df ? 1.1 : 1) * G.dif.hp * (G.cm ? CLV[G.cl || 2].hp : 1), hs2 = aliveHeroes();")
rep("const hs = (1 + 0.09 * G.dif.sc * G.sc) * G.dif.hp;","const hs = (1 + 0.09 * G.dif.sc * G.sc) * G.dif.hp * (G.cm ? CLV[G.cl || 2].hp : 1);")
rep("e.gt = G.cmOn ? 12 : 7;","e.gt = G.cmOn ? CLV[G.cl || 2].cs : 7;")
rep("G.cm = !!v.coop && !v.endless;","G.cm = !!v.coop && !v.endless; G.cl = Math.min(3, Math.max(1, (v.cl | 0) || 2));")
# 미션 준비
rep("G.campTotal = 2; }\n","G.campTotal = 2; }\n  G.cmS = !!G.cm && ob === 's'; G.cmR = !!G.cm && ob === 'r'; G.cmD = false; G.cmG = 0; G.cmOc = [0, 0]; G.cmPl = G.cmS ? [[G.ax - 260, G.ay], [G.ax + 260, G.ay]] : []; G.cmM = G.cmOn || G.cmS || G.cmR; G.cmDl = G.cmOn ? Math.round(G.dur * CLV[G.cl || 2].dl) : 0; if (G.cmR) G.dur = Math.min(G.dur, Math.round(140 * CLV[G.cl || 2].dl));\n")
rep("function beginBattle() { G.ph = 'battle'; if (G.cmOn) G.info = { id: Date.now() + Math.random(), tt: '🤝 협동 미션 · 이중 전선', tx: '성도 지키고, 멀리 있는 보급기지 2곳도 시간 안에 부수세요! 각자 역할 버튼을 써요' };",
 "function beginBattle() { G.ph = 'battle'; if (G.cmM) G.info = { id: Date.now() + Math.random(), tt: G.cmOn ? '🤝 협동 미션 · 이중 전선' : G.cmS ? '🤝 협동 미션 · 쌍둥이 봉화' : '🤝 협동 미션 · 속전속결', tx: G.cmOn ? '성도 지키고, 멀리 있는 보급기지 2곳도 시간 안에 부수세요! 각자 역할 버튼을 써요' : G.cmS ? '두 발판에 서로 다른 영웅이 동시에 서야 봉화가 차올라요! 시간 안에 올리세요' : '시간 안에 모든 기지를 부수세요! 늦으면 져요' };")
# 봉화 로직
rep("function castCr(p) {","""function beaconStep(dt) {
  const FT = CLV[G.cl || 2].ft, hs_ = G.order.map((id) => G.pl[id]).filter((p) => p.hp > 0 && !(p.down > 0) && !p.away);
  const occ = G.cmPl.map(([x, y]) => hs_.filter((p) => Math.hypot(p.x - x, p.y - y) < 90).length); G.cmOc = occ.map((n) => (n > 0 ? 1 : 0));
  if (occ[0] > 0 && occ[1] > 0) G.cmG = Math.min(100, G.cmG + dt * 100 / FT); else if ((G.cl || 2) >= 2) G.cmG = Math.max(0, G.cmG - dt * 3);
  if (G.cmG >= 100) { G.cmD = true; for (const id of G.order) { const h = G.pl[id]; h.hp = Math.min(h.mx, h.hp + h.mx * 0.35); G.fx.push([h.x, h.y, 50, 'lvl']); } G.food += 120; for (const e of G.en) if (e.t !== 'boss' && e.t !== 'camp') dmgEnemy(e, 220 + 10 * G.sc); for (const q of G.cmPl) G.fx.push([q[0], q[1], 160, 'boom']); G.info = { id: Date.now() + Math.random(), tt: '🔥 봉화가 올랐어요!', tx: '응원군이 달려와 적을 쓸어내고, 모두 체력 35% 회복 · 군량 +120' }; }
}
function castCr(p) {""")
rep("  const dead = G.en.filter((e) => e.hp <= 0); for (const e of dead) enemyDeath(e);","  if (G.cmS && !G.cmD) beaconStep(dt);\n  const dead = G.en.filter((e) => e.hp <= 0); for (const e of dead) enemyDeath(e);")
rep("  else if (!G.endless && G.t >= G.dur) { if (G.cmOn && camps > 0) { endRound(false); G.res.cmf = camps; } else endRound(G.obj === 'd' || G.obj === 's' || G.obj === 'e'); }",
"""  else if (G.cmOn && camps > 0 && G.cmDl && G.t >= G.cmDl) { endRound(false); G.res.cmf = camps; G.res.cmk = 'c'; }
  else if (!G.endless && G.t >= G.dur) { const fl = (G.cmOn && camps > 0) ? 'c' : (G.cmS && !G.cmD) ? 'b' : (G.cmR && camps > 0) ? 'r' : ''; if (fl) { endRound(false); G.res.cmf = camps || 1; G.res.cmk = fl; } else endRound(G.obj === 'd' || G.obj === 's' || G.obj === 'e'); }""")
# 스냅샷
rep("s.cm = g.cm ? 1 : 0; s.cmn = g.cmOn ? g.en.filter((e) => e.t === 'camp').length : -1;","s.cm = g.cm ? 1 : 0; s.cmm = g.cmOn ? 'c' : g.cmS ? 'b' : g.cmR ? 'r' : ''; s.cmn = (g.cmOn || g.cmR) ? (g.du ? g.du.enSaved : g.en).filter((e) => e.t === 'camp').length : -1; s.cg = Math.round(g.cmG || 0); s.cgd = g.cmD ? 1 : 0; s.cpl = g.cmS ? g.cmPl.map((q, i) => [q[0], q[1], (g.cmOc || [])[i] | 0]) : null; s.cdl = g.cmOn ? Math.max(0, Math.ceil(g.cmDl - g.t)) : g.cmR ? Math.max(0, Math.ceil(g.dur - g.t)) : 0; s.cl = g.cl | 0;")
# 클라이언트 표시
rep("const ctx = (V.cm && V.ph === 'battle' && V.cmn >= 0) ? (V.cmn > 0 ? `🏕 보급기지 ${V.cmn}/2 남음 · 시간 안에 부숴요!` : '🏕 보급기지 모두 격파! 성을 지켜요') : '';","const ctx = (V.cm && V.ph === 'battle') ? cmText() : '';")
rep("function beaconStep(dt) {","""function cmText() {
  const mm = (s) => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  if (V.cmm === 'c') return V.cmn > 0 ? `🏕 보급기지 ${V.cmn}/2 · ⏱ ${mm(V.cdl)} 안에 부숴요!` : '🏕 보급기지 모두 격파! 성을 지켜요';
  if (V.cmm === 'b') return V.cgd ? '🔥 봉화가 올랐어요! 응원군이 달려왔어요' : `🔥 봉화 ${V.cg}% · 두 발판에 한 명씩 서야 차올라요`;
  if (V.cmm === 'r') return V.cmn > 0 ? `⚡ 속전속결 · 기지 ${V.cmn}곳 · ⏱ ${mm(V.cdl)}` : '';
  return '';
}
function beaconStep(dt) {""")
rep("(V.res.cmf ? '보급기지를 못 부쉈어요…' : '거점이 무너졌어요…')","(V.res.cmf ? ({ b: '봉화를 못 올렸어요…', r: '시간 안에 못 부쉈어요…' }[V.res.cmk] || '보급기지를 못 부쉈어요…') : '거점이 무너졌어요…')")
rep("\n  if (V.obj === 'e') (V.goals || []).forEach((q, i) => {","\n  if (V.cpl && !V.cgd) V.cpl.forEach((q) => { cx.save(); cx.strokeStyle = q[2] ? '#ffd34d' : '#fff'; cx.fillStyle = q[2] ? 'rgba(255,211,77,.38)' : 'rgba(255,255,255,.2)'; cx.lineWidth = 5; cx.beginPath(); cx.ellipse(q[0], q[1], 90, 46, 0, 0, 7); cx.fill(); cx.stroke(); cx.fillStyle = '#fff'; cx.font = '800 26px sans-serif'; cx.textAlign = 'center'; cx.fillText('🔥', q[0], q[1] + 9); cx.restore(); });\n  if (V.obj === 'e') (V.goals || []).forEach((q, i) => {")
# 봇 봉화
rep("    const dx = tx - p.x, dy = ty - p.y, L = Math.hypot(dx, dy);\n    if (L > stop) { p.mvx = dx / L; p.mvy = dy / L; } else {","    let hold = false; if (G.cmS && !G.cmD) { const bi = bots.indexOf(p), ix = hum.length > 0 ? (bi === 0 ? 0 : -1) : (bi < 2 ? bi : -1); if (ix >= 0) { tx = G.cmPl[ix][0]; ty = G.cmPl[ix][1]; stop = 30; hold = true; } }\n    const dx = tx - p.x, dy = ty - p.y, L = Math.hypot(dx, dy);\n    if (L > stop) { p.mvx = dx / L; p.mvy = dy / L; } else if (hold) { p.mvx = p.mvy = 0; } else {")
rep("diff: diffSel, coop: true, bots: +$('selBots').value };","diff: diffSel, coop: true, bots: +$('selBots').value, cl: +$('selCl').value };")
repu('<div class="row" style="margin:10px 0">🤝 협동전 빈자리','<div class="row" style="margin:10px 0">🤝 협동 난이도 <select id="selCl"><option value="1">1 · 연습</option><option value="2" selected>2 · 도전 (기본)</option><option value="3">3 · 극한 (보상 최대)</option></select></div>\n      <div class="row" style="margin:10px 0">🤝 협동전 빈자리')
repu("보급기지를 못 부수면 져요.</div>","미션은 라운드마다 달라요(🏕 이중 전선·🔥 쌍둥이 봉화·⚡ 속전속결). 깨면 🎟 뽑기권과 🧩 전설 영웅 조각을 받아요.</div>")
open(g,'w').write(t);open(h,'w').write(u)
