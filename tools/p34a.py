g='src/game.js'; s=open(g).read()
def rep(a,b,c=1):
    global s
    assert s.count(a)==c,(a[:70],s.count(a)); s=s.replace(a,b)
# startQuiz: offer from quizzer, humans see copy, bots none
rep("  for (const id of ids) { const p = G.pl[id]; offerCards(p); p.qz = Object.assign({}, qz); p.qs = 0; p.qrw = ''; p.offT = id === qr.id ? 30 : 45; }\n}",
"""  offerCards(qr); qr.qz = Object.assign({}, qz); qr.qs = 0; qr.qrw = ''; qr.offT = 30; G.chs = {};
  for (const id of ids) { const p = G.pl[id]; if (p === qr) continue; p.offer = p.bot ? null : qr.offer.slice(); p.qz = p.bot ? null : Object.assign({}, qz); p.qs = 0; p.qrw = ''; p.offT = 45; }
}
function applyShared(q, id) { // 대표가 고른 카드: 능력·보급은 모두에게, 무기는 대표만(다른 친구는 가진 무기 +1)
  const card = CARDS.find((x) => x.id === id), nm = card ? card.n : id; let t = '';
  if (id.startsWith('evo_')) { applyCard(q, id); t = '진화는 대표 친구만!'; }
  else if (WEAP[id]) { applyCard(q, id); for (const oid of G.order) { if (oid === q.id) continue; const o = G.pl[oid], ws = Object.keys(WEAP).filter((k) => POOL[k] && (o.cards[k] || 0) > 0 && o.cards[k] < 5); if (ws.length) applyCard(o, ws[rint(ws.length)]); } t = '친구들은 가진 무기가 한 단계 올라요'; }
  else if (ABIL[id]) { applyCard(q, id); const an = (o) => Object.keys(ABIL).filter((k) => o.cards[k]).length; for (const oid of G.order) { if (oid === q.id) continue; const o = G.pl[oid], L = o.cards[id] || 0; if (L < 5 && (L > 0 || an(o) < AMAX)) applyCard(o, id); } t = '모두에게 적용!'; }
  else { applyCard(q, id); t = '모두에게 적용!'; }
  G.info = { id: Date.now() + Math.random(), tt: '🃏 ' + q.name + ' 친구가 「' + nm + '」 선택!', tx: t };
  for (const oid of G.order) { const o = G.pl[oid]; o.offer = null; o.qz = null; } G.chs = {};
}""")
# timeout: only quizzer's timer
rep("    if (p.offer) { p.offT -= dt; if (p.offT <= 0) { if (p.qz && p.qs === 0) resolveQuiz(false); else { applyCard(p, p.offer[rint(p.offer.length)]); p.offer = null; p.qz = null; } } }",
"    if (p.offer && (!p.qz || id === G.qzr)) { p.offT -= dt; if (p.offT <= 0) { if (p.qz && p.qs === 0) resolveQuiz(false); else if (p.qz) applyShared(p, p.offer[rint(p.offer.length)]); else { applyCard(p, p.offer[rint(p.offer.length)]); p.offer = null; } } }")
# card message
rep("  else if (m.k === 'card' && p.offer && p.qs !== 0 && m.i >= 0 && m.i < p.offer.length) { applyCard(p, p.offer[m.i | 0]); p.offer = null; p.qz = null; }",
"""  else if (m.k === 'card' && p.offer && p.qs !== 0 && m.i >= 0 && m.i < p.offer.length && (!p.qz || from === G.qzr)) { if (p.qz) applyShared(p, p.offer[m.i | 0]); else { applyCard(p, p.offer[m.i | 0]); p.offer = null; } }
  else if (m.k === 'cheer' && p.offer && p.qz && p.qs !== 0 && from !== G.qzr && m.i >= 0 && m.i < p.offer.length) { G.chs = G.chs || {}; G.chs[from] = [m.i | 0, 8]; }""")
# snapshot
rep("s.paused = g.paused;","s.ch = Object.keys(g.chs || {}).map((id) => [g.pl[id] ? g.pl[id].name : '', g.chs[id][0]]); s.paused = g.paused;")
# decay cheers each step
rep("  if (G.lvq > 0 && !G.order.some((id) => G.pl[id].offer)) {","  if (G.chs) for (const k in G.chs) { G.chs[k][1] -= dt; if (G.chs[k][1] <= 0) delete G.chs[k]; }\n  if (G.lvq > 0 && !G.order.some((id) => G.pl[id].offer)) {")
# client: waitTag
rep("w = V.pl.filter((x) => x.id !== Net.id && x.offer).map((x) => x.name);","w = V.pl.filter((x) => x.id !== Net.id && x.offer && V.qzr === x.id).map((x) => x.name);")
rep("tx = '🃏 카드 고르는 중: ' + w.join(', ');","tx = '🃏 ' + w.join(', ') + ' 친구가 우리 모두의 카드를 고르는 중!';")
# result banner + card render
rep("'카드 4장이 열렸어요!' + (p.qrw && p.qz.by === Net.id ? ' 🎁 ' + esc(p.qrw) : '')","(p.qz.by === Net.id ? '카드 4장 중 하나를 골라요! (능력은 모두에게)' : '카드 4장이 열렸어요! 친구에게 추천 💬') + (p.qrw && p.qz.by === Net.id ? ' 🎁 ' + esc(p.qrw) : '')")
rep("'❌ 아쉬워요! 카드가 2장만 열려요'","'❌ 아쉬워요! 카드가 2장만 열려요' + (p.qz.by === Net.id ? ' · 하나를 골라요' : '')")
rep("<span class=\"ty\">${WEAP[base] ? '무기' : ABIL[base] ? '능력' : '보급'}</span>${syn}","<span class=\"ty\">${WEAP[base] ? '무기' : ABIL[base] ? '능력' : '보급'}</span><i class=\"sy\" style=\"color:#2f6b2a\">${evo || WEAP[base] ? '👤 나만 (친구는 무기 +1)' : '🌐 모두에게!'}</i>${syn}${(V.ch || []).filter((r) => r[1] === i).length ? `<em class=\"rcm\">👍 ${esc((V.ch || []).filter((r) => r[1] === i).map((r) => r[0]).join(', '))}</em>` : ''}")
rep("box.querySelectorAll('.card').forEach((d) => d.onpointerdown = () => { sendHost({ k: 'card', i: +d.dataset.i }); box.style.display = 'none'; lastOffer = ''; }); } }",
"const mineC = !p.qz || p.qz.by === Net.id; box.querySelectorAll('.card').forEach((d) => d.onpointerdown = () => { if (mineC) { sendHost({ k: 'card', i: +d.dataset.i }); box.style.display = 'none'; lastOffer = ''; } else sendHost({ k: 'cheer', i: +d.dataset.i }); }); } }")
rep("const ok = p.offer ? p.offer.join() + '|' + (p.qz ? p.qz.q : '') + p.qs : '';","const ok = p.offer ? p.offer.join() + '|' + (p.qz ? p.qz.q : '') + p.qs + '|' + JSON.stringify(V.ch || []) : '';")
open(g,'w').write(s)
