import re
p='src/game.js';s=open(p).read()
def rep(a,b,c=1):
    global s
    assert s.count(a)==c,(a[:70],s.count(a)); s=s.replace(a,b)
# 1) pickQuiz -> shared quiz
i=s.index('function pickQuiz(p) {'); j=s.index('function offerCards(p) {')
new='''const QALL = (() => { const m = { '삼국 시대': 2, '남북국 시대': 3, '고려 시대': 4, '조선 초기': 5 }; const a = QB.map((x, i) => ({ id: 'b' + i, era: x[0], q: [x[1], x[2], x[3], x[4]] })); ER.forEach((x, i) => a.push({ id: 'e' + i, era: m[x[4]] != null ? m[x[4]] : 5, q: x })); R.forEach((r, i) => a.push({ id: 'r' + i, era: 6 + r.ch, ch: r.ch, q: r.q })); return a; })();
function nextQuiz() { // 이번 시대 · 지난 시대 · 더 먼저 배운 시대 문제를 섞어 한 문제를 골라요
  const ch = R[G.rd].ch, mx = 6 + ch; if (!G.qseen) G.qseen = {};
  const pool = QALL.filter((x) => x.era <= mx), A = pool.filter((x) => x.era === mx), B = pool.filter((x) => x.era >= 6 && x.era < mx), C = pool.filter((x) => x.era < 6);
  const bk = [A, B, C], rr = Math.random(); let b = rr < 0.35 ? 0 : rr < 0.55 ? 1 : 2; if (!bk[b].length) b = bk.findIndex((x) => x.length);
  let c = bk[b].filter((x) => !G.qseen[x.id]); if (!c.length) { for (const x of bk[b]) delete G.qseen[x.id]; c = bk[b]; }
  const it = c[rint(c.length)]; G.qseen[it.id] = 1; const q = it.q, idx = q[1].map((_, k) => k).sort(() => Math.random() - 0.5);
  return { q: q[0], o: idx.map((k) => q[1][k]), a: idx.indexOf(q[2]), w: q[3], tag: it.era === mx ? '이번 시대 문제 · ' + QERA[it.era] : '🕰 ' + QERA[it.era] };
}
function startQuiz() { // 한 판에 한 명(랜덤)이 문제를 풀고, 맞히면 모두 카드 4장·틀리면 2장이 열려요
  const ids = G.order, hs = ids.map((i) => G.pl[i]).filter((p) => !p.bot && !p.away), cand = hs.length ? hs : [G.pl[ids[0]]];
  const mn = Math.min(...cand.map((p) => p.qturn || 0)), pk = cand.filter((p) => (p.qturn || 0) === mn), qr = pk[rint(pk.length)]; qr.qturn = (qr.qturn || 0) + 1;
  const qz = nextQuiz(); qz.by = qr.id; qz.bn = qr.name; G.qzr = qr.id;
  for (const id of ids) { const p = G.pl[id]; offerCards(p); p.qz = Object.assign({}, qz); p.qs = 0; p.qrw = ''; p.offT = id === qr.id ? 30 : 45; }
}
function resolveQuiz(ok) {
  for (const id of G.order) { const q = G.pl[id]; if (q.offer && q.qz && q.qs === 0) { q.qs = ok ? 1 : 2; q.offer = q.offer.slice(0, ok ? 4 : 2); q.offT = Math.min(q.offT, 16); } }
  const qr = G.pl[G.qzr]; if (qr && !ok) { qr.qstk = 0; qr.qrw = ''; }
}
'''
s=s[:i]+new+s[j:]
rep("while (o.length < 3 && Object.keys(wt).length)","while (o.length < 4 && Object.keys(wt).length)")
rep("while (o.length < 3 && fb.length)","while (o.length < 4 && fb.length)")
# level up
rep("if (!p.offer) { offerCards(p); pickQuiz(p); p.offT = 30; } } }","} G.lvq = (G.lvq | 0) + 1; }")
# queue start inside battle step: before the hero loop 'for (const id of G.order) { const p = G.pl[id], S = heroStats(p), b = ROLE[p.role];'
rep("  for (const id of G.order) { const p = G.pl[id], S = heroStats(p), b = ROLE[p.role];\n","  if (G.lvq > 0 && !G.order.some((id) => G.pl[id].offer)) { G.lvq--; startQuiz(); }\n  for (const id of G.order) { const p = G.pl[id], S = heroStats(p), b = ROLE[p.role];\n")
# timeout
rep("if (p.offer) { p.offT -= dt; if (p.offT <= 0) { applyCard(p, p.offer[rint(p.offer.length)]); p.offer = null; p.qz = null; } }","if (p.offer) { p.offT -= dt; if (p.offT <= 0) { if (p.qz && p.qs === 0) resolveQuiz(false); else { applyCard(p, p.offer[rint(p.offer.length)]); p.offer = null; p.qz = null; } } }")
# qa handler
i=s.index("  else if (m.k === 'qa' && p.offer && p.qz && p.qs === 0"); j=s.index("  else if (m.k === 'card' && p.offer && p.qs !== 0")
qa='''  else if (m.k === 'qa' && p.offer && p.qz && p.qs === 0 && from === G.qzr && m.i >= 0 && m.i < p.qz.o.length) {
    if ((m.i | 0) === p.qz.a) { p.qok = (p.qok || 0) + 1; p.qstk = (p.qstk || 0) + 1; { const esc = G.obj === 'e'; let t = ''; if (esc) { p.hp = Math.min(p.mx, p.hp + p.mx * 0.25); t = '체력 +25%'; } else { G.food += 30; t = '군량 +30'; } if (p.qstk % 3 === 0) { for (const q of G.order) { const h = G.pl[q]; h.hp = Math.min(h.mx, h.hp + h.mx * 0.3); } if (!esc) G.food += 50; t += ' · 🔥연속 정답 보너스' + (esc ? ' 전원 체력 +30%' : ' 군량 +50 · 전원 체력 +30%'); G.fx.push([p.x, p.y, 90, 'lvl']); } p.qrw = t; } if (G.es) G.es.q++; G.qokT = (G.qokT || 0) + 1; resolveQuiz(true); } else resolveQuiz(false);
  }
'''
s=s[:i]+qa+s[j:]
# bots
rep("if (p.qz && p.qs === 0) hostMsg(p.id, { k: 'qa', i: Math.random() < 0.65 ? p.qz.a : rint(p.qz.o.length) }); else hostMsg(p.id, { k: 'card', i: botCard(p) });","if (p.qz && p.qs === 0) { if (p.id === G.qzr) hostMsg(p.id, { k: 'qa', i: Math.random() < 0.65 ? p.qz.a : rint(p.qz.o.length) }); } else hostMsg(p.id, { k: 'card', i: botCard(p) });")
# snapshot
rep("qz: p.qz ? { q: p.qz.q, o: p.qz.o, tag: p.qz.tag, ...","qz: p.qz ? { q: p.qz.q, o: p.qz.o, tag: p.qz.tag, by: p.qz.by, bn: p.qz.bn, ...")
# round end reset
rep("for (const id of G.order) { const p = G.pl[id]; p.offer = null; p.mo = null;","G.lvq = 0; for (const id of G.order) { const p = G.pl[id]; p.offer = null; p.qz = null; p.mo = null;")
# client UI
rep("box.innerHTML = `<div class=\"qzb\"><em>🧠 레벨 업! 맞히면 보너스 카드 1장 + 보상${p.qst ? ' · 🔥' + p.qst + '연속' : ''} · ${esc(p.qz.tag)}</em><b>${esc(p.qz.q)}</b><div class=\"qzo\">${p.qz.o.map((o, i) => `<button data-i=\"${i}\">${esc(o)}</button>`).join('')}</div></div>`;",
 "const mineQ = p.qz.by === Net.id, solo = V.pl.filter((x) => !x.bot).length <= 1; box.innerHTML = `<div class=\"qzb\"><em>${mineQ ? '🧠 레벨 업! 내 차례예요! 맞히면 카드 4장 · 틀리면 카드 2장' + (p.qst ? ' · 🔥' + p.qst + '연속' : '') : '👀 ' + esc(p.qz.bn || '친구') + ' 친구가 푸는 중! 같이 힌트를 알려 줘요 (맞히면 카드 4장 · 틀리면 2장)'} · ${esc(p.qz.tag)}</em><b>${esc(p.qz.q)}</b><div class=\"qzo\">${p.qz.o.map((o, i) => mineQ ? `<button data-i=\"${i}\">${esc(o)}</button>` : `<button data-i=\"${i}\" disabled style=\"opacity:.85\">${esc(o)}</button>`).join('')}</div></div>`;")
rep("box.querySelectorAll('button').forEach((d) => d.onpointerdown = () => sendHost({ k: 'qa', i: +d.dataset.i })); }","box.querySelectorAll('button').forEach((d) => d.onpointerdown = () => { if (mineQ) sendHost({ k: 'qa', i: +d.dataset.i }); }); }")
rep("${p.qs === 1 ? '⭕ 정답! 보너스 카드가 생겼어요!' + (p.qrw ? ' 🎁 ' + esc(p.qrw) : '') : '❌ 아쉬워요! (연속 정답이 끊겼어요)'}","${p.qs === 1 ? '⭕ ' + (p.qz.by === Net.id ? '정답! ' : esc(p.qz.bn || '친구') + ' 친구가 맞혔어요! ') + '카드 4장이 열렸어요!' + (p.qrw && p.qz.by === Net.id ? ' 🎁 ' + esc(p.qrw) : '') : '❌ 아쉬워요! 카드가 2장만 열려요'}")
open(p,'w').write(s)
