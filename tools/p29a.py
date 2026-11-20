g='src/game.js';t=open(g).read()
h='src/template.html';u=open(h).read()
def rep(a,b,n=1):
    global t
    assert t.count(a)==n,(a[:80],t.count(a)); t=t.replace(a,b)
def repu(a,b,n=1):
    global u
    assert u.count(a)==n,(a[:80],u.count(a)); u=u.replace(a,b)

# ---------- 전설 영웅 권율 ----------
rep("  admiral:{ n: '이순신',","  gwonyul:{ n: '권율', c: '#ff7a3a', rg: 340, dmg: 30, rt: 0.9, hp: 280, sp: 112, aoe: 40, tag: ['전설 영웅', '시작 무기: 화차'], d: '행주대첩의 명장! 화차로 불화살을 쏟아부어요 (협동전 보상 조각 10개로 열려요)' },\n  admiral:{ n: '이순신',")
rep("const START = { archer: 'bow',","const START = { gwonyul: 'hwacha', archer: 'bow',")
rep("admiral: 'h_militia' };","admiral: 'h_militia', gwonyul: 'h_militia' };")
rep("  admiral: { n: '학익진',","  gwonyul: { n: '행주 돌비', cd: 16, d: '주변 적에게 돌 비를 쏟아 피해를 주고 느리게 해요' },\n  admiral: { n: '학익진',")
rep("  else if (k === 'admiral') {","  else if (k === 'gwonyul') { for (const e of near(p.x, p.y, 320).slice(0, 16)) { dmgEnemy(e, dm(60)); e.slw = Math.max(e.slw || 0, G.t + 3); G.fx.push([e.x, e.y - 14, 26, 'hit']); } G.fx.push([p.x, p.y, 320, 'roar']); }\n  else if (k === 'admiral') {")
rep("const HERO_BLURB = {","const HERO_BLURB = { gwonyul: '행주대첩(1593)을 이끈 장군 권율이에요. 화차로 불화살을 쏟아부어요.',")
rep("ok = k === 'admiral' ? hidOK() : d.h[k];","ok = k === 'admiral' ? hidOK() : k === 'gwonyul' ? legOK('gwonyul') : d.h[k];")
rep("(k === 'admiral' ? '모든 라운드를 깨면 열려요' : '아직 써 보지 않았어요')","(k === 'admiral' ? '모든 라운드를 깨면 열려요' : k === 'gwonyul' ? '협동전 보상 조각 10개로 열려요' : '아직 써 보지 않았어요')")
repu('<button data-r="admiral" id="roleHid">🔒 히든</button>','<button data-r="admiral" id="roleHid">🔒 히든</button><button data-r="gwonyul" id="roleLeg">🔒 전설</button>')
rep("if (b.dataset.r === 'admiral' && !hidOK()) {","if (b.dataset.r === 'gwonyul' && !legOK('gwonyul')) { const c = cwLoad(); $('roleTip').innerHTML = `🔒 <b>전설 영웅</b> — 협동전을 깨서 영웅 조각 ${LEG.gwonyul.need}개를 모으면 열려요! (지금 ${c.sh}/${LEG.gwonyul.need})`; return; } if (b.dataset.r === 'admiral' && !hidOK()) {")
rep("function refreshHid() { const hb = $('roleHid');","function refreshHid() { { const lb = $('roleLeg'); if (lb) lb.textContent = legOK('gwonyul') ? '🌟 권율' : '🔒 전설'; } const hb = $('roleHid');")

# ---------- 보관함 데이터 ----------
rep("function hidOK() {","""const LEG = { gwonyul: { need: 10 } };
const AUR = { a_blue: { n: '파란 기운', r: 0, c: '#6db8ff' }, a_green: { n: '초록 기운', r: 0, c: '#6fd07d' }, a_pink: { n: '분홍 기운', r: 0, c: '#ff9ec4' }, a_white: { n: '하얀 기운', r: 0, c: '#ffffff' }, a_orange: { n: '주황 기운', r: 0, c: '#ffa94d' },
  a_fire: { n: '불꽃 기운', r: 1, c: '#ff5a2a' }, a_ice: { n: '얼음 기운', r: 1, c: '#8fe9ff' }, a_bolt: { n: '번개 기운', r: 1, c: '#ffe14a' }, a_gold: { n: '전설의 황금 후광', r: 2, c: '#ffd24a' } };
const RN = ['일반', '희귀', '전설'], RC = ['#7a6a55', '#2f78c8', '#c98a00'];
function cwLoad() { try { const d = JSON.parse(localStorage.getItem('jd_cw') || 'null'); if (d && typeof d === 'object') return { tk: d.tk | 0, sh: d.sh | 0, own: d.own || {}, cos: Array.isArray(d.cos) ? d.cos : [], eq: AUR[d.eq] ? d.eq : '', pity: d.pity | 0, pity2: d.pity2 | 0, cl: d.cl | 0, ids: Array.isArray(d.ids) ? d.ids : [] }; } catch (e) {} return { tk: 0, sh: 0, own: {}, cos: [], eq: '', pity: 0, pity2: 0, cl: 0, ids: [] }; }
function cwSave(d) { try { localStorage.setItem('jd_cw', JSON.stringify(d)); } catch (e) {} }
function legOK(k) { return !!cwLoad().own[k]; }
function cwAddSh(d, n) { if (d.own.gwonyul) { d.tk += n; return false; } d.sh += n; if (d.sh >= LEG.gwonyul.need) { d.own.gwonyul = 1; d.tk += d.sh - LEG.gwonyul.need; d.sh = 0; return true; } return false; }
const cwShown = {};
function cwCredit() { // 결과 화면에서 이 기기에 보상을 한 번만 넣어요
  const r = V && V.res; if (!r || !r.win || !r.rw || !r.id) return null; if (cwShown[r.id]) return cwShown[r.id];
  const d = cwLoad(); if (d.ids.includes(r.id)) return null; d.ids.push(r.id); if (d.ids.length > 40) d.ids.shift();
  const un = cwAddSh(d, r.rw.sh); d.tk += r.rw.tk; d.cl++; cwSave(d); return (cwShown[r.id] = { tk: r.rw.tk, sh: r.rw.sh, un, have: d.sh, owned: !!d.own.gwonyul, all: d.tk });
}
function cwDraw() {
  const d = cwLoad(); if (d.tk < 1) return null; d.tk--; d.pity++; d.pity2++; let r;
  if (d.pity2 >= 30) r = 2; else if (d.pity >= 10) r = Math.random() < 0.2 ? 2 : 1; else { const x = Math.random(); r = x < 0.05 ? 2 : x < 0.3 ? 1 : 0; }
  if (r >= 1) d.pity = 0; if (r === 2) d.pity2 = 0;
  const pool = Object.keys(AUR).filter((k) => AUR[k].r === r), id = pool[rint(pool.length)], dup = d.cos.includes(id); let sh = 0, un = false;
  if (!dup) d.cos.push(id); else { sh = 1 + r; un = cwAddSh(d, sh); }
  cwSave(d); return { id, r, dup, sh, un };
}
function openCw(msg) {
  const d = cwLoad(), box = $('cwBox'), L = LEG.gwonyul; box.classList.add('on');
  const pct = d.own.gwonyul ? 100 : Math.round(d.sh / L.need * 100);
  let h = `<div class="cwr"><span>🎟 뽑기권 <b>${d.tk}</b>장</span><span>🧩 권율 조각 <b>${d.own.gwonyul ? '완성' : d.sh + '/' + L.need}</b></span></div><div class="bar" style="margin:4px 0 8px"><i style="width:${pct}%;background:#ffb73a"></i></div>`;
  h += d.own.gwonyul ? '<p class="cwn">🌟 전설 영웅 <b>권율</b>을 얻었어요! 방에서 "내 역할"에 나와요. 조각이 더 생기면 뽑기권으로 바뀌어요.</p>' : '<p class="cwn">협동전을 깨면 조각을 얻어요. 10개를 모으면 전설 영웅 <b>권율</b>이 열려요!</p>';
  h += `<div class="cwd"><button id="cwGo" ${d.tk < 1 ? 'class="dis"' : ''}>🎟 1장으로 뽑기</button><small>확률: 일반 70% · 희귀 25% · 전설 5% · 10번째엔 희귀 이상, 30번째엔 전설 확정 (지금 ${d.pity}/10 · ${d.pity2}/30) · 이미 있는 꾸미기가 나오면 영웅 조각이 돼요</small></div>`;
  h += `<div id="cwRes">${msg || ''}</div><b style="font-size:14px">내 꾸미기 (눌러서 장착)</b><div class="cwg">` + Object.keys(AUR).map((k) => { const A = AUR[k], has = d.cos.includes(k); return `<button data-a="${k}" class="${has ? '' : 'lk'}${d.eq === k ? ' on' : ''}"><i style="border-color:${has ? A.c : '#bbb'}"></i>${has ? A.n : '???'}<small style="color:${RC[A.r]}">${RN[A.r]}</small></button>`; }).join('') + '</div>';
  $('cwBody').innerHTML = h;
  $('cwGo').onclick = () => { const r = cwDraw(); if (!r) return; const A = AUR[r.id]; openCw(`<div class="cwp" style="border-color:${RC[r.r]}">✨ <b style="color:${RC[r.r]}">${RN[r.r]}</b> · ${A.n}${r.dup ? ` — 이미 있어서 🧩 조각 +${r.sh}` : ' — 새로 얻었어요!'}${r.un ? '<br>🌟 전설 영웅 권율이 열렸어요!' : ''}</div>`); refreshHid(); };
  $('cwBody').querySelectorAll('.cwg button').forEach((b) => { b.onclick = () => { const c = cwLoad(); if (!c.cos.includes(b.dataset.a)) return; c.eq = c.eq === b.dataset.a ? '' : b.dataset.a; cwSave(c); me.aura = c.eq; sendProf(); openCw(); }; });
}
function hidOK() {""")
# 오라 전송/적용
rep("function sendProf() { sendHost({ k: 'prof', name: me.name, role: me.role, tk: TK }); }","function sendProf() { sendHost({ k: 'prof', name: me.name, role: me.role, tk: TK, aura: me.aura || '' }); }")
rep("if (ROLE[m.role]) p.role = m.role; }","if (ROLE[m.role]) p.role = m.role; } if (p || G.pl[from]) { const q0 = G.pl[from]; q0.aura = AUR[m.aura] ? m.aura : ''; }")
rep("role: p.role, cr: p.cr || '',","role: p.role, au: p.aura || '', cr: p.cr || '',")
rep("      shade(q[0], fy, 20);\n","""      shade(q[0], fy, 20);
      { const A = AUR[p.au] || (p.role === 'gwonyul' ? AUR.a_gold : null); if (A && !dn) { const pu = A.r ? 1 + 0.12 * Math.sin(tm * 4) : 1; cx.save(); cx.strokeStyle = A.c; cx.lineWidth = A.r === 2 ? 5 : 3.5; cx.globalAlpha = 0.85; cx.beginPath(); cx.ellipse(q[0], fy, 30 * pu, 12 * pu, 0, 0, 7); cx.stroke(); if (A.r >= 1) { cx.globalAlpha = 0.3; cx.fillStyle = A.c; cx.fill(); } if (A.r === 2) { cx.globalAlpha = 0.9; cx.beginPath(); cx.ellipse(q[0], fy, 40 * pu, 16 * pu, 0, 0, 7); cx.stroke(); if (!LOW) { cx.fillStyle = '#fff3a0'; for (let k = 0; k < 4; k++) { const a = tm * 2 + k * 1.57; cx.fillRect(q[0] + Math.cos(a) * 36 * pu - 1.5, fy + Math.sin(a) * 14 * pu - 7.5, 3, 3); } } } cx.restore(); } }
""")
# me.aura 초기값
rep("let me = { name: '', role: 'archer' };","let me = { name: '', role: 'archer', aura: (() => { try { const d = JSON.parse(localStorage.getItem('jd_cw') || 'null'); return d && d.eq ? String(d.eq) : ''; } catch (e) { return ''; } })() };")
# 로비 버튼/오버레이
repu('<button id="btnDex">📖 도감</button>','<button id="btnDex">📖 도감</button><button id="btnCw">🎁 보관함·뽑기</button>')
repu('<div id="saveBox">','<div id="cwBox"><div class="pp"><h3>🎁 내 보관함</h3><div id="cwBody"></div><button id="cwClose" class="sec" style="margin-top:8px">닫기</button></div></div>\n<div id="saveBox">')
repu('#saveBox{display:none;','#cwBox{display:none;position:absolute;inset:0;background:rgba(30,24,16,.55);z-index:41;align-items:center;justify-content:center}#cwBox.on{display:flex}#cwBox .pp{display:flex;flex-direction:column;max-height:94%;width:min(560px,94%);box-sizing:border-box}#cwBody{overflow-y:auto;min-height:0;flex:1 1 auto;-webkit-overflow-scrolling:touch}\n.cwr{display:flex;justify-content:space-between;font-size:17px;font-weight:800}.cwn{font-size:14px;margin:2px 0 8px}.cwd{text-align:center;margin:6px 0}.cwd small{display:block;font-size:12px;margin-top:4px;color:var(--sub)}.cwp{border:3px solid;border-radius:14px;padding:8px;margin:8px 0;text-align:center;font-size:16px;background:#fffbe9}\n.cwg{display:grid;grid-template-columns:repeat(auto-fill,minmax(112px,1fr));gap:6px;margin-top:6px}.cwg button{display:flex;flex-direction:column;align-items:center;gap:2px;font-size:13px;padding:6px 4px}.cwg button i{width:34px;height:14px;border:4px solid;border-radius:50%}.cwg button.lk{opacity:.5}.cwg button.on{outline:3px solid #e8402f}.cwg small{font-size:11px;font-weight:800}\n#rsReward{display:none;margin:6px auto;padding:7px 12px;border:3px solid #c98a00;border-radius:14px;background:#fff6d6;font-size:16px;font-weight:800;text-align:center;max-width:92%}\n#saveBox{display:none;')
repu('<h2 id="rsTitle"></h2>','<h2 id="rsTitle"></h2><div id="rsReward"></div>')
rep("$('btnDex').onclick = () => buildBook('syn');","$('btnCw').onclick = () => openCw(); $('cwClose').onclick = () => $('cwBox').classList.remove('on'); $('btnDex').onclick = () => buildBook('syn');")
# 결과 화면 보상 표시
rep("  $('rsTitle').style.color = win ? '#2f6b2a' : '#a8322a';","""  $('rsTitle').style.color = win ? '#2f6b2a' : '#a8322a';
  { const rw = $('rsReward'), c = cwCredit(); if (c) { rw.style.display = 'block'; rw.innerHTML = `🎁 협동 보상 · 🎟 뽑기권 +${c.tk}${c.sh ? ` · 🧩 ${c.owned && !c.un ? '(권율 완성→뽑기권으로)' : '권율 조각'} +${c.sh}${c.owned ? '' : ` (${c.have}/${LEG.gwonyul.need})`}` : ''}${c.un ? '<br>🌟 전설 영웅 권율이 열렸어요!' : ''}<br><small>보관함에서 뽑기를 해 보세요!</small>`; } else rw.style.display = 'none'; }""")
# 보상 계산 (호스트)
rep("G.ph = 'result'; G.res = { win, rd: G.rd };","G.ph = 'result'; G.res = { win, rd: G.rd, id: Date.now() + '' + rint(1000) }; if (win && G.cm && !G.endless) { const m = G.cmM ? 1 : 0; G.res.rw = { sh: (G.cl || 1) + m, tk: 1 + m + ((G.cl || 1) >= 2 ? 1 : 0) }; }")
open(g,'w').write(t);open(h,'w').write(u)
