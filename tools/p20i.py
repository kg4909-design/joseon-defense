g='src/game.js'; s=open(g).read()
def rep(a,b,c=1):
    global s
    assert s.count(a)==c,(s.count(a),a[:80]); s=s.replace(a,b)
# ---- damage multiplier (endless scaling)
s=s.replace("G.dif.dm","(G.dif.dm * (G.dmx || 1))")
# ---- boss stats / armor
rep("boss:   { n: '적장',   hp: 1900, sp: 22, dm: 40,","boss:   { n: '적장',   hp: 5200, sp: 22, dm: 55,")
rep("function dmgEnemy(e, d) { if (CRIT > 0 && Math.random() < CRIT) d *= 2; e.hp -= d;","function dmgEnemy(e, d) { if (CRIT > 0 && Math.random() < CRIT) d *= 2; if (e.t === 'boss') d = Math.max(d * 0.55, d - 8); /* 적장은 갑옷이 단단해요 */ e.hp -= d;")
# ---- progOf, boss pool/spawn/attack
rep("function spawnPos() {","""function progOf() { return G.endless ? (G.t % 60) / 60 : G.t / G.dur; }
const BOSS_EXTRA = [['도요토미 히데요시', '일본을 통일하고 조선 침략을 명령한 최고 지도자']];
function bossList(ch) { const seen = {}, out = []; BOSSN.forEach((b, i) => { if (b && (ch === undefined || R[i].ch === ch) && !seen[b[0]]) { seen[b[0]] = 1; out.push(b); } }); return out; }
function spawnBoss(hs, scale, fixed) { // 적장 등장: 장수 풀에서 번갈아 나와요
  const q = spawnPos() || [G.ax + 500, G.ay]; let nm;
  if (fixed) nm = fixed; else { const pool = G.endless ? bossList() : bossList(R[G.rd].ch); G.bpi = (G.bpi | 0) + 1; nm = pool[(G.bpi + (G.bpi0 | 0)) % pool.length]; }
  const e = spawn('boss', hs * scale, q); e.bn = nm; e.bi = G.bpi | 0; e.bk = rnd(3, 5); G.bn = nm; G.fx.push([q[0], q[1], 60, 'boss']); return e; }
function bossAttack(e) { // 적장 특수 공격: 붉은 원이 보이고 잠시 뒤 범위 피해 (홀수 번째 장수는 병사도 불러요)
  G.pj.push({ x: e.x, y: e.y - 14, vx: 0, vy: 0, life: 1.0, dm: 30 * (G.dif.dm * (G.dmx || 1)), k: 'cannon', tx: e.x, ty: e.y, R: 150 });
  if (e.bi % 2) { const hs0 = (1 + 0.09 * G.sc) * G.dif.hp; for (let k = 0; k < 4 && G.en.length < 260; k++) spawn('grunt', hs0, clampW(e.x + rnd(-70, 70), e.y + rnd(-70, 70))); G.fx.push([e.x, e.y, 50, 'warn']); } }
function endlessRound(r) { // 무한 모드: 라운드가 바뀔 때마다 한 번
  const n = r + 1; G.sc = r; G.dmx = 1 + 0.03 * r; G.er = r;
  G.nightRd = G.dif !== DIFF.easy && Math.random() < (G.dif === DIFF.hard ? 0.4 : 0.3);
  const ev = r % 5 === 4; G.evDone = [!ev, !ev]; G.waveT = Math.min(G.waveT, 6);
  const hs = (1 + 0.09 * G.sc) * G.dif.hp; let nb = 0, tx = G.nightRd ? '🌙 이번 라운드는 야간 전투예요!' : '적이 점점 강해져요';
  if (n === 99) { const e = spawnBoss(hs, 3.2, Math.random() < 0.5 ? BOSS_EXTRA[0] : ['홍타이지', '청의 황제']); e.fin = 1; e.bk = 4; tx = '⚠ 최종 보스! ' + e.bn[0] + '을(를) 쓰러뜨리면 클리어!'; }
  else { nb = n % 10 === 0 ? 1 + Math.floor(n / 30) : (n >= 30 && n % 5 === 0) ? 1 : (n >= 60 && n % 3 === 0) ? 1 : 0; for (let k = 0; k < nb; k++) spawnBoss(hs, 0.8 + 0.01 * n); if (nb) tx = '⚔ 적장 ' + nb + '명 등장!' + (G.nightRd ? ' (야간)' : ''); }
  G.info = { id: Date.now() + Math.random(), tt: '♾ ' + n + '번째 라운드' + (n === 99 ? ' · 최종' : ''), tx };
}
function spawnPos() {""")
# ---- spawn elite/pick prog
rep("(G.dif === DIFF.hard ? 0.26 : G.dif === DIFF.easy ? 0.06 : 0.16) * (G.t / G.dur))","(G.dif === DIFF.hard ? 0.26 : G.dif === DIFF.easy ? 0.06 : 0.16) * progOf())")
rep("const prog = G.t / G.dur, k = G.dif === DIFF.hard ? 1.5","const prog = progOf(), k = G.dif === DIFF.hard ? 1.5")
rep("const rd = R[G.rd], np = G.order.length, prog = G.t / G.dur;","const rd = R[G.rd], np = G.order.length, prog = progOf();")
# tick after G.t += dt
rep("  G.t += dt; if (G.buffAtk > 0) G.buffAtk -= dt;","  G.t += dt; if (G.endless) { const r = Math.floor(G.t / 60); if (r !== G.er) endlessRound(r); } if (G.buffAtk > 0) G.buffAtk -= dt;")
# night
rep("tg = nw.some((w) => prog >= w[0] && prog < w[1]) ? 1 : 0;","tg = (G.endless ? (G.nightRd && prog >= 0.08 && prog < 0.92) : nw.some((w) => prog >= w[0] && prog < w[1])) ? 1 : 0;")
# boss spawns
a=s.index("  if (G.obj === 'b' && !G.bossOut && G.t >= Math.max(6, G.dur - 70))")
b=s.index("\n",s.index("else if ((G.obj === 'd' || G.obj === 's') && !G.bossDone",a))
s=s[:a]+"""  if (G.obj === 'b' && !G.bossOut && !G.endless && G.t >= Math.max(6, G.dur - 70)) { G.bossOut = true; spawnBoss(hs, 0.9); }
  else if ((G.obj === 'd' || G.obj === 's') && !G.endless && G.bossI < (G.bossTimes || []).length && G.t >= G.bossTimes[G.bossI]) { G.bossI++; spawnBoss(hs, 0.85); }"""+s[b:]
# startRound
rep("G.bossOut = false; G.bossDead = false; G.campPos = [];","G.bossOut = false; G.bossDead = false; G.finalDead = false; G.campPos = []; G.dmx = 1; G.er = -1; G.nightRd = false; G.bpi0 = rint(5); G.bossI = 0; G.bossTimes = (ob === 'd' || ob === 's') ? (P >= 170 ? [120, 240].filter((x) => x < P - 15) : [Math.max(P * 0.5, P - 60)]) : [];")
rep("  const hs = (1 + 0.09 * G.sc) * (rd.df ? 1.1 : 1) * G.dif.hp;\n  if (ob === 'r')","  if (G.endless) G.dur = 1e9;\n  const hs = (1 + 0.09 * G.sc) * (rd.df ? 1.1 : 1) * G.dif.hp;\n  if (ob === 'r')")
# boss timer in enemy loop
rep("    if (e.st > 0) e.st -= dt; else { let tx, ty, reach, tp = null;","    if (e.t === 'boss') { e.bk -= dt; if (e.bk <= 0) { e.bk = e.bi % 2 ? 9 : 7; bossAttack(e); } }\n    if (e.st > 0) e.st -= dt; else { let tx, ty, reach, tp = null;")
# cannon blast radius
rep("if (b.life <= 0) { const BR = 80;","if (b.life <= 0) { const BR = b.R || 80;")
rep("Math.round(b.tx) : 0, b.ty !== undefined ? Math.round(b.ty) : 0]);","Math.round(b.tx) : 0, b.ty !== undefined ? Math.round(b.ty) : 0, b.R || 80]);")
rep("cx.arc(b[5], b[6], 80, 0, 7); cx.stroke(); cx.setLineDash([]); cx.fillStyle = 'rgba(255,60,40,.12)'; cx.fill(); cx.fillStyle = '#2b2b2b'; cx.beginPath(); cx.arc(x, y - 6, 7, 0, 7); cx.fill(); cx.strokeStyle = '#ff9a3a'; cx.lineWidth = 2; cx.stroke(); continue; }","cx.arc(b[5], b[6], b[7] || 80, 0, 7); cx.stroke(); cx.setLineDash([]); cx.fillStyle = 'rgba(255,60,40,.12)'; cx.fill(); if ((b[7] || 80) <= 100) { cx.fillStyle = '#2b2b2b'; cx.beginPath(); cx.arc(x, y - 6, 7, 0, 7); cx.fill(); cx.strokeStyle = '#ff9a3a'; cx.lineWidth = 2; cx.stroke(); } continue; }")
# death flags
rep("if (e.t === 'boss') G.bossDead = true;","if (e.t === 'boss') { G.bossDead = true; if (e.fin) G.finalDead = true; }")
rep("  else if (G.obj === 'b' && G.bossDead) endRound(true);","  else if (G.endless && G.finalDead) endRound(true);\n  else if (G.obj === 'b' && G.bossDead) endRound(true);")
rep("  else if (G.t >= G.dur) endRound(","  else if (!G.endless && G.t >= G.dur) endRound(")
rep("if (G.es) { G.es.tot += win ? G.dur : G.t; if (!win) { G.es.over = true; G.ph = 'end'; } }","if (G.es) { G.es.tot = Math.floor(G.t); G.es.r = G.er + 1; G.es.over = true; G.es.clear = !!win; G.ph = 'end'; }")
# hostCtl
rep("G.endless = !!v.endless; G.cyc = 0;","G.endless = !!v.endless; G.cyc = 0; G.bpi = 0;")
rep("G.es = G.endless ? { tot: 0, k: 0, q: 0, from: v.start, over: false } : null; for (const id of G.order) G.pl[id].cards = {}; startRound(v.start); }","G.es = G.endless ? { tot: 0, k: 0, q: 0, from: v.start, over: false, r: 1, clear: false } : null; for (const id of G.order) G.pl[id].cards = {}; { let st = v.start; if (G.endless) { st = 0; for (let i = v.start; i < R.length; i++) if (ROUND_OBJ[i] === 'd') { st = i; break; } } startRound(st); } }")
rep("G.endless = true; G.cyc = 1; G.bonus = 0; G.es = { tot: 0, k: 0, q: 0, from: 0, over: false }; G.ph = 'brief'; startRound(0); }","G.endless = true; G.cyc = 0; G.bpi = 0; G.bonus = 0; G.es = { tot: 0, k: 0, q: 0, from: 0, over: false, r: 1, clear: false }; G.ph = 'brief'; startRound(0); }")
# snapshot
rep("s.endless = !!g.endless; s.es = g.es ? { tot: Math.round(g.es.tot + (g.ph === 'battle' ? g.t : 0)), k: g.es.k, q: g.es.q, over: !!g.es.over } : null; s.cyc = g.cyc | 0; s.rd = g.rd;","s.endless = !!g.endless; s.es = g.es ? { tot: g.es.over ? g.es.tot : Math.floor(g.t), k: g.es.k, q: g.es.q, over: !!g.es.over, r: g.es.over ? g.es.r : g.er + 1, clear: !!g.es.clear } : null; s.er = g.er | 0; s.bn = g.bn || null; s.rd = g.rd;")
# client HUD
rep("$('hudName').textContent = r.nm; const rem = Math.max(0, Math.ceil(V.dur - V.t));","$('hudName').textContent = V.endless ? '♾ ' + ((V.er | 0) + 1) + '라운드' : r.nm; const rem = V.endless ? Math.ceil(60 - (V.t % 60)) : Math.max(0, Math.ceil(V.dur - V.t));")
rep("$('barT').style.width = Math.min(100, V.t / V.dur * 100) + '%';","$('barT').style.width = Math.min(100, (V.endless ? (V.t % 60) / 60 : V.t / V.dur) * 100) + '%';")
# banner names
rep("bossBan = 3.6; bossName = ET.boss.n; }","bossBan = 3.6; bossName = ET.boss.n; bannerBn = V.bn || BOSSN[V.rd] || ['적장', '']; }")
rep("let autoLow = false, fAcc = 0, fN = 0, skipF = 0, bossBan = 0, bossName = '';","let autoLow = false, fAcc = 0, fN = 0, skipF = 0, bossBan = 0, bossName = '', bannerBn = ['적장', ''];")
rep("bn = BOSSN[V.rd] || ['적장', ''], off =","bn = bannerBn, off =")
rep("cx.fillText('적장 ' + ((BOSSN[V.rd] || [''])[0]), W / 2, by + 13);","cx.fillText('적장 ' + (((bs[8] || V.bn || BOSSN[V.rd] || [''])[0]) || ''), W / 2, by + 13);")
# brief text
rep("$('bkText').textContent = (first ? ch.sum + '\\n\\n' : '') + r.b;","$('bkText').textContent = (V.endless ? '♾ 무한 모드: 한 전장에서 라운드마다 1분씩, 99라운드까지 이어져요. 라운드가 오를수록 적이 강해지고 적장이 더 자주 나와요. 레벨과 카드는 계속 쌓이고, 가끔 밤이 와요. 99라운드에는 최종 보스가 기다려요!\\n\\n' : '') + (first ? ch.sum + '\\n\\n' : '') + r.b;")
rep("$('bkChap').textContent = V.endless ? `♾ 무한 모드 · ${V.cyc * R.length + V.rd + 1}번째 라운드 (난이도 계속 상승)`","$('bkChap').textContent = V.endless ? `♾ 무한 모드 · 라운드당 1분 · 99라운드까지`")
open(g,'w').write(s)
