g='src/game.js'; s=open(g).read()
def rep(a,b):
    global s
    assert s.count(a)==1,(s.count(a),a[:70]); s=s.replace(a,b)
rep("function updateHUD() {","""let dexT = 0;
function dexLoad() { try { return Object.assign({ s: {}, h: {}, b: {} }, JSON.parse(localStorage.getItem('jd_dex') || '{}')); } catch (e) { return { s: {}, h: {}, b: {} }; } }
function dexRec() { // 도감: 이 기기에서 만난 시너지·영웅·적장을 기록해요
  if (++dexT % 20) return; const me = V.pl.find((x) => x.id === Net.id); if (!me) return; const d = dexLoad(); let ch = false;
  if (!d.h[me.role]) { d.h[me.role] = 1; ch = true; }
  for (const y of SYN) { const lv = me.cards[y.a] && me.cards[y.b] ? ((me.cards[y.a] >= 5 && me.cards[y.b] >= 5) ? 2 : 1) : 0; if (lv > (d.s[y.k] || 0)) { d.s[y.k] = lv; ch = true; } }
  if (V.ph === 'battle' && (V.en || []).some((e) => e[1] === 'boss') && !d.b[V.rd]) { d.b[V.rd] = 1; ch = true; }
  if (ch) try { localStorage.setItem('jd_dex', JSON.stringify(d)); } catch (e) {}
}
const HERO_BLURB = { archer: '활을 쏘는 사수예요. 멀리서 일직선의 적을 꿰뚫어요.', militia: '나라를 지키려고 스스로 일어난 백성 군대, 의병이에요. 환도로 앞의 적을 베어요.', monk: '임진왜란 때 서산대사 휴정, 사명대사 유정 같은 스님들이 승병을 이끌고 싸웠어요.', gunner: '화약 무기인 화포(대포)를 다루는 병사예요. 한 방에 무리를 날려요.', admiral: '이순신(1545~1598)은 조선 수군을 이끈 장수예요. 한산도 대첩을 이끌었고 노량 해전에서 전사했어요.' };
function buildBook(tab) {
  tab = tab || 'syn'; show('sBook'); document.querySelectorAll('#bookTabs button').forEach((b) => b.classList.toggle('on', b.dataset.t === tab));
  const d = dexLoad(), B = $('bookBody'); let h = '';
  if (tab === 'syn') {
    const got = SYN.filter((y) => d.s[y.k]).length; h = `<p class="bk-n">발견한 시너지 ${got}/${SYN.length} — 두 카드를 함께 가지면 보너스, 둘 다 Lv.5면 특별 효과가 열려요!</p><div class="bk-g">` + SYN.map((y) => { const lv = d.s[y.k] | 0; return `<div class="bk-c${lv ? '' : ' lk'}"><div class="bk-i"><img src="${ICON(y.a)}"><span>+</span><img src="${ICON(y.b)}"></div><b>${lv ? esc(y.n) : '???'}</b><span>${lv ? esc(y.d) : '아직 못 찾았어요'}</span><small>${lv ? esc(y.t) : (WEAP[y.a] ? '무기 + 무기' : '능력 + 능력') + ' 조합'}</small><em>${lv === 2 ? '⭐ 특별 효과 발견: ' + esc(y.sd) : lv ? '🔒 둘 다 Lv.5 → ' + esc(y.sd) : ''}</em></div>`; }).join('') + '</div>';
  } else if (tab === 'hero') {
    h = '<div class="bk-g">' + Object.keys(ROLE).map((k) => { const r = ROLE[k], ok = k === 'admiral' ? hidOK() : d.h[k]; return `<div class="bk-c${ok ? '' : ' lk'}"><b>${ok ? esc(r.n) : '???'}</b><span>${ok ? esc(HERO_BLURB[k]) : (k === 'admiral' ? '모든 라운드를 깨면 열려요' : '아직 써 보지 않았어요')}</span><small>${ok ? esc(r.tag.join(' · ')) : ''}</small></div>`; }).join('') + '</div>';
  } else if (tab === 'boss') {
    const seen = {}; BOSSN.forEach((b, i) => { if (!b) return; (seen[b[0]] = seen[b[0]] || { d: b[1], r: [], ok: 0 }).r.push(i); if (d.b[i]) seen[b[0]].ok = 1; });
    const ks = Object.keys(seen); h = `<p class="bk-n">만난 적장 ${ks.filter((k) => seen[k].ok).length}/${ks.length} — 적장 설명은 교과서 밖 보충이라 선생님 확인이 필요해요.</p><div class="bk-g">` + ks.map((k) => { const x = seen[k]; return `<div class="bk-c${x.ok ? '' : ' lk'}"><b>${x.ok ? esc(k) : '???'}</b><span>${x.ok ? esc(x.d) : '아직 만나지 못했어요'}</span><small>${x.ok ? '출현: ' + x.r.map((i) => esc(R[i].nm)).join(', ') : ''}</small></div>`; }).join('') + '</div>';
  } else {
    const rk = rankLoad(); h = '<p class="bk-n">🏆 무한 모드 랭킹 (이 기기에만 저장돼요) · 점수 = 버틴 초 + 처치 수 + 퀴즈 정답×30</p>' + (rk.length ? '<table class="bk-t"><tr><th>순위</th><th>이름</th><th>점수</th><th>버틴 시간</th><th>처치</th><th>퀴즈</th><th>라운드</th></tr>' + rk.map((x, i) => `<tr><td>${i + 1}</td><td>${esc(x.n)}</td><td><b>${x.s}</b></td><td>${fmtT(x.t)}</td><td>${x.k}</td><td>${x.q}</td><td>${x.r}</td></tr>`).join('') + '</table>' : '<p>아직 기록이 없어요. 방에서 ♾ 무한 모드로 시작해 보세요!</p>');
  }
  B.innerHTML = h; B.scrollTop = 0;
}
function updateHUD() {
  dexRec();""")
rep("$('btnEndless').onclick = () => hostCtl('endless');","$('btnDex').onclick = () => buildBook('syn'); $('btnRank').onclick = () => buildBook('rank'); $('bookBack').onclick = () => show('sLobby'); document.querySelectorAll('#bookTabs button').forEach((b) => b.onclick = () => buildBook(b.dataset.t)); $('btnEndless').onclick = () => hostCtl('endless');")
open(g,'w').write(s)
t='src/template.html'; h=open(t).read()
def r2(a,b):
    global h
    assert h.count(a)==1,(h.count(a),a[:60]); h=h.replace(a,b)
r2('<button id="btnFs">⛶ 전체화면</button>','<button id="btnFs">⛶ 전체화면</button><button id="btnDex">📖 도감</button><button id="btnRank">🏆 랭킹</button>')
r2('<div class="screen" id="sEnd">','<div class="screen" id="sBook"><div class="row" style="justify-content:space-between;margin:0"><h2 style="margin:0">📖 도감 · 🏆 랭킹</h2><button id="bookBack" class="sec">← 처음으로</button></div><div id="bookTabs" class="row" style="margin:8px 0"><button data-t="syn">시너지</button><button data-t="hero">영웅</button><button data-t="boss">적장</button><button data-t="rank">랭킹</button></div><div id="bookBody"></div></div>\n<div class="screen" id="sEnd">')
css="""
#btnDex{left:340px;bottom:14px;font-size:15px;padding:8px 14px}#btnRank{left:450px;bottom:14px;font-size:15px;padding:8px 14px}
@media (max-height:620px){#btnDex{left:250px;bottom:6px;font-size:12px;padding:5px 10px}#btnRank{left:322px;bottom:6px;font-size:12px;padding:5px 10px}}
#sBook{overflow:hidden}#bookBody{height:400px;overflow-y:auto;-webkit-overflow-scrolling:touch;padding-bottom:20px}
#bookTabs button{font-size:16px;padding:6px 16px;opacity:.7}#bookTabs button.on{opacity:1;outline:3px solid #5b4636}
.bk-n{font-size:14px;margin:4px 0 8px;font-weight:700}.bk-g{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.bk-c{background:#fffaf0;border:2px solid #5b4636;border-radius:14px;padding:8px 12px;color:#3b2a1c;box-shadow:0 3px 0 rgba(91,70,54,.28);font-size:13px;line-height:1.4}
.bk-c b{display:block;font-size:17px}.bk-c span{display:block}.bk-c small{display:block;opacity:.75;margin-top:2px}.bk-c em{display:block;font-style:normal;font-size:12px;font-weight:800;color:#2f6b2a;margin-top:3px}
.bk-c.lk{filter:grayscale(1);opacity:.65}.bk-i{display:flex;align-items:center;gap:6px;margin-bottom:2px}.bk-i img{width:34px;height:34px;image-rendering:pixelated}
.bk-t{width:100%;border-collapse:collapse;background:#fffaf0;color:#3b2a1c;font-size:15px;border-radius:12px;overflow:hidden}.bk-t th,.bk-t td{padding:6px 8px;border-bottom:1px solid #d9c9a8;text-align:center}.bk-t th{background:#ffe9b8}
"""
i=h.rindex("</style>"); h=h[:i]+css+h[i:]
open(t,'w').write(h)
