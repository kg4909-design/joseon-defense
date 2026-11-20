g='src/game.js'; s=open(g).read()
def rep(a,b,c=1):
    global s
    assert s.count(a)==c,(a[:70],s.count(a)); s=s.replace(a,b)
# 1) 기존 일회성 협동 미션(보급기지 2곳)을 없애고 서브미션이 계속 이어지게
rep("G.cmOn = !!G.cm && ob === 'd'; if (G.cmOn) {","G.cmOn = false; if (G.cmOn) {")
rep("if (!G.cm || G.obj === 'e' || G.cmM || G.endless) { G.sm = null; return; }","if (!G.cm || G.obj === 'e' || G.endless) { G.sm = null; return; }")
rep("(k !== 'twin' || np >= 2)","(k !== 'twin' || (np >= 2 && !G.cmS))")
rep("S.nt = 5 + rnd(0, 3); }","S.nt = 10; }")
# 2) 실패 페널티 + 연속 성공 보너스
pen = r"""
function hsNow() { const rd = R[G.rd]; return (1 + 0.09 * G.dif.sc * G.sc) * (rd.df ? 1.1 : 1) * G.dif.hp * (G.cm ? CLV[G.cl || 2].hp : 1); }
function waveAround(n, r) { const hs = hsNow(), al = aliveHeroes(), c = al.length ? al[rint(al.length)] : { x: G.ax, y: G.ay }; for (let i = 0; i < n && G.en.length < 260; i++) { const a = rnd(0, 6.283); spawn(i % 5 === 0 ? 'cav' : 'grunt', hs, clampW(c.x + Math.cos(a) * r + rnd(-60, 60), c.y + Math.sin(a) * r * 0.7 + rnd(-60, 60))); } }
function smPenalty(k) {
  const al = aliveHeroes(), hurtAll = (f) => { for (const h of al) h.hp = Math.max(1, h.hp - h.mx * f); };
  if (k === 'camp') { waveAround(14, 620); G.spFast = G.t + 15; return '적 증원 도착! 15초 동안 적이 빨리 나와요'; }
  if (k === 'conv') { const l = Math.round(G.food * 0.25); G.food = Math.max(0, G.food - l); return '군량 -' + l; }
  if (k === 'ref') { hurtAll(0.2); return '슬픔에 잠겨 영웅 체력 -20%'; }
  if (k === 'twin') { waveAround(12, 600); return '봉화를 놓쳐 적이 습격해요!'; }
  if (k === 'herb') { hurtAll(0.15); return '독한 안개… 영웅 체력 -15%'; }
  if (k === 'rush') { if (G.castle) { G.baseHp = Math.max(1, G.baseHp - G.baseMax * 0.15); return '성 체력 -15%'; } hurtAll(0.15); return '영웅 체력 -15%'; }
  if (k === 'fast') { waveAround(12, 640); return '적이 더 몰려와요!'; }
  return '';
}
function smStreak(S) { S.stk = (S.stk | 0) + 1; if (S.stk >= 3) { S.stk = 0; doSummon(true); doSummon(true); return ' 🎉 3연속 성공! 지원군 합류!'; } return ''; }
"""
rep("function smInfo(tt, tx) {", pen + "function smInfo(tt, tx) {")
rep("function smEnd(S, ok, msg) { const m = S.cur; if (ok) S.ok++; else S.no++; smInfo((ok ? '✅ 미션 성공! ' : '⌛ 미션 실패… ') + SMD[m.k][0], msg);","function smEnd(S, ok, msg) { const m = S.cur; if (ok) { S.ok++; msg += smStreak(S); } else { S.no++; S.stk = 0; msg = msg + ' · ' + smPenalty(m.k); } smInfo((ok ? '✅ 미션 성공! ' : '⌛ 미션 실패… ') + SMD[m.k][0], msg);")
rep("G.t < (G.spSlow || 0) ? 0.55 : 1);","G.t < (G.spSlow || 0) ? 0.55 : 1) * (G.t < (G.spFast || 0) ? 1.4 : 1);")
# 3) 일기토 패배 페널티
rep("else { b.dueled = true; b.bk = 3; const q = spawnPos() || [G.ax + 500, G.ay]; b.x = q[0]; b.y = q[1]; G.en.push(b); G.info = { id: Date.now() + Math.random(), tt: '😤 일기토에서 밀렸어요', tx: bnm(b) + '이(가) 남은 체력으로 전장에 뛰어들었어요!' }; }",
"else { b.dueled = true; b.bk = 3; const q = spawnPos() || [G.ax + 500, G.ay]; b.x = q[0]; b.y = q[1]; G.en.push(b); let pt; if (G.castle && Math.random() < 0.5) { G.baseHp = Math.max(1, Math.min(G.baseHp, G.baseMax * 0.12)); G.fx.push([G.ax, G.ay, 120, 'boom']); pt = '적장이 성에 심각한 타격을 입혔습니다! 성이 무너지기 직전이에요 (성 수리!)'; } else { waveAround(26, 620); pt = '적장이 병력을 휘몰아칩니다! 대규모 웨이브가 몰려와요!'; } G.info = { id: Date.now() + Math.random(), tt: '😤 일기토에서 승리하지 못했습니다…', tx: pt }; }")
open(g,'w').write(s)
