import re
p='src/game.js'; s=open(p).read()
def rep(a,b):
    global s
    assert s.count(a)==1,(s.count(a),a[:60]); s=s.replace(a,b)
a=s.index("  $('rsHist').innerHTML = `<b>역사 이야기</b>")
b=s.index("\n",a)
new = r"""  { const nx = R[V.rd + 1], ch = CH[r.ch];
    $('rsHist').innerHTML = `<div class="rv"><div class="rvh">📜 복기 카드 <small>${esc(r.pl)} · ${r.yr}년</small></div>`
      + `<div class="rvs"><b>${esc(r.nm)}</b> — ${esc(ch.n)}(${esc(ch.y)})</div>`
      + `<div class="rvt">${esc(r.r)}</div>`
      + (win && r.df ? `<small>※ 실제 역사에서 이 전투는 조선에게 어려운 싸움이었어요. 게임에서는 '시간 벌기'로 표현했어요.</small>` : '')
      + `<div class="rvq"><b>🔑 꼭 기억해요</b><br>${esc(r.q[0])}<br>👉 <b>${esc(r.q[1][r.q[2]])}</b> — ${esc(r.q[3])}</div>`
      + (win && nx ? `<div class="rvn">▶ 다음 전투: <b>${esc(nx.nm)}</b> (${esc(nx.pl)} · ${nx.yr}년)</div>` : '') + `</div>`; }"""
s=s[:a]+new+s[b:]
rep("  $('rsWait').style.display = Net.host ? 'none' : 'block';\n}",
"""  $('rsWait').style.display = Net.host ? 'none' : 'block';
  // 읽기 시간 강제: 10초 동안 버튼이 잠겨요
  clearInterval(rvTm); let left = FAST ? 1 : 10; const L = [['btnNext', '다음 라운드'], ['btnRetry', '다시 도전'], ['btnSkip', '역사 확인했으니 다음으로']];
  const paint = () => { for (const [id, tx] of L) { const b = $(id); b.disabled = left > 0; b.textContent = left > 0 ? `📖 읽는 중… ${left}` : tx; } };
  paint(); rvTm = setInterval(() => { left--; paint(); if (left <= 0) clearInterval(rvTm); }, 1000);
}
let rvTm = 0;""")
rep("const UPDATES","const UPDATES") if False else None
open(p,'w').write(s)
t='src/template.html'; h=open(t).read()
css="""
.rv{font-size:16px;line-height:1.5;white-space:normal}.rvh{font-size:20px;font-weight:900;margin-bottom:4px}.rvh small{font-size:14px;opacity:.75;margin-left:6px}.rvs{margin-bottom:6px}.rvt{margin:6px 0}.rvq{margin-top:8px;padding:8px 12px;border-radius:12px;background:rgba(255,200,80,.25)}.rvn{margin-top:8px;opacity:.85}
#rsHost button:disabled{opacity:.55;filter:grayscale(.4)}
"""
i=h.rindex("</style>"); h=h[:i]+css+h[i:]
open(t,'w').write(h)
