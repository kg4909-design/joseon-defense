p='src/game.js'; s=open(p).read()
def rep(a,b):
    global s
    assert s.count(a)==1,(s.count(a),a[:70]); s=s.replace(a,b)
# host: quiz picker
rep("function offerCards(p) {", r"""function pickQuiz(p) {
  const ch = R[G.rd].ch, bk = [[], [], ER.map((x, i) => ['e' + i, x, x[4]])];
  R.forEach((r, i) => { const it = ['r' + i, r.q, CH[r.ch].n]; if (r.ch === ch) bk[0].push(it); else if (r.ch < ch) bk[1].push(it); });
  if (!p.qseen) p.qseen = {};
  let b = Math.random() < 0.4 ? 0 : Math.random() < 0.5 ? 1 : 2; if (!bk[b].length) b = bk[1].length ? 1 : 2;
  let c = bk[b].filter((x) => !p.qseen[x[0]]); if (!c.length) { for (const x of bk[b]) delete p.qseen[x[0]]; c = bk[b]; }
  const it = c[rint(c.length)]; p.qseen[it[0]] = 1; const q = it[1], idx = q[1].map((_, i) => i).sort(() => Math.random() - 0.5);
  p.qz = { q: q[0], o: idx.map((i) => q[1][i]), a: idx.indexOf(q[2]), w: q[3], tag: b === 0 ? '이번 시대 문제' : b === 1 ? '지난 시대 문제' : '더 먼저 배운 시대 · ' + it[2] }; p.qs = 0;
}
function offerCards(p) {""")
rep("if (!p.offer) offerCards(p); } }", "if (!p.offer) { offerCards(p); pickQuiz(p); p.offT = 30; } } }")
rep("  else if (m.k === 'card' && p.offer && m.i >= 0 && m.i < 3) {", r"""  else if (m.k === 'qa' && p.offer && p.qz && p.qs === 0 && m.i >= 0 && m.i < p.qz.o.length) {
    if ((m.i | 0) === p.qz.a) { p.qs = 1; p.qok = (p.qok || 0) + 1; G.qokT = (G.qokT || 0) + 1; const keep = p.offer.slice(), t = p.offT; offerCards(p); const ex = p.offer.filter((x) => !keep.includes(x)); p.offer = ex.length ? keep.concat(ex[0]) : keep; p.offT = t; } else p.qs = 2;
  }
  else if (m.k === 'card' && p.offer && p.qs !== 0 && m.i >= 0 && m.i < p.offer.length) {""")
rep("if (p.offT <= 0) { applyCard(p, p.offer[rint(p.offer.length)]); p.offer = null; } }", "if (p.offT <= 0) { applyCard(p, p.offer[rint(p.offer.length)]); p.offer = null; p.qz = null; } }")
rep("applyCard(p, p.offer[m.i | 0]); p.offer = null; }", "applyCard(p, p.offer[m.i | 0]); p.offer = null; p.qz = null; }")
rep("offer: p.offer, offT: p.offT,", "offer: p.offer, offT: p.offT, qz: p.qz ? { q: p.qz.q, o: p.qz.o, tag: p.qz.tag, ...(p.qs ? { a: p.qz.a, w: p.qz.w } : {}) } : null, qs: p.qs | 0, qok: p.qok | 0,")
# client
rep("const ok = p.offer ? p.offer.join() : '';", "const ok = p.offer ? p.offer.join() + '|' + (p.qz ? p.qz.q : '') + p.qs : '';")
rep("else { box.style.display = 'flex'; box.innerHTML = p.offer.map(", r"""else if (p.qz && !p.qs) { box.style.display = 'flex'; box.className = 'qz'; box.innerHTML = `<div class="qzb"><em>🧠 레벨 업! 문제를 맞히면 보너스 카드 1장 · ${esc(p.qz.tag)}</em><b>${esc(p.qz.q)}</b><div class="qzo">${p.qz.o.map((o, i) => `<button data-i="${i}">${esc(o)}</button>`).join('')}</div></div>`; box.querySelectorAll('button').forEach((d) => d.onpointerdown = () => sendHost({ k: 'qa', i: +d.dataset.i })); }
  else { box.style.display = 'flex'; box.className = p.offer.length > 3 ? 'c4' : ''; box.innerHTML = (p.qz ? `<div class="qres ${p.qs === 1 ? 'ok' : 'no'}">${p.qs === 1 ? '⭕ 정답! 보너스 카드가 생겼어요!' : '❌ 아쉬워요!'} ${esc(p.qz.w || '')}</div>` : '') + p.offer.map(""")
open(p,'w').write(s)
t='src/template.html'; h=open(t).read()
css="""
#cards.qz{width:640px!important;left:50%!important;transform:translateX(-50%)}
.qzb{background:#fffaf0;border:3px solid #5b4636;border-radius:18px;padding:10px 16px;color:#3b2a1c;width:100%;box-shadow:0 4px 0 rgba(91,70,54,.35)}
.qzb em{display:block;font-style:normal;font-size:12px;font-weight:800;color:#2f6b2a}.qzb b{display:block;font-size:16px;margin:4px 0 8px;line-height:1.35}
.qzo{display:flex;gap:8px}.qzo button{flex:1;font-size:15px;padding:8px 6px;border-radius:12px;border:2px solid #5b4636;background:#ffe9b8;font-weight:800;color:#3b2a1c}
#cards.c4{width:700px!important}#cards.c4 .card{width:160px!important}
.qres{position:absolute;bottom:100%;left:0;right:0;margin-bottom:6px;border-radius:12px;padding:6px 12px;font-size:13px;font-weight:800;color:#fff;background:#2f6b2a}.qres.no{background:#a8322a}
"""
i=h.rindex("</style>"); h=h[:i]+css+h[i:]
open(t,'w').write(h)
