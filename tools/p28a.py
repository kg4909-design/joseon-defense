g='src/game.js';t=open(g).read()
h='src/template.html';u=open(h).read()
def rep(a,b,n=1):
    global t
    assert t.count(a)==n,(a[:70],t.count(a)); t=t.replace(a,b)
def repu(a,b,n=1):
    global u
    assert u.count(a)==n,(a[:70],u.count(a)); u=u.replace(a,b)
# 역할 상수 + 능력 정보
rep("function heroStats(p) {","const CR_ORD = ['guard', 'ranger', 'supply'];\nconst CRD = { guard: { n: '방패 수비대', ic: '🛡', ab: '방벽', cd: 28, d: '성이 4초간 안전 + 성 체력 8% 회복 + 가까운 적 밀어내기', ps: '내 체력 +25%' }, ranger: { n: '불화살 유격대', ic: '🔥', ab: '불화살', cd: 22, d: '주변 적에게 큰 피해! 보급기지에는 최대 체력의 20%', ps: '공격력 +10% · 이동 +12%' }, supply: { n: '군량 보급대', ic: '🌾', ab: '보급', cd: 26, d: '모든 영웅 체력 30% 회복 + 군량 +30, 쓰러진 동료도 일으켜요', ps: '체력이 천천히 차올라요' } };\nfunction heroStats(p) {")
rep("const dmg = (1 + 0.06 * ((p.mer && p.mer.dmg) || 0))","const dmg = (p.cr === 'ranger' ? 1.1 : 1) * (1 + 0.06 * ((p.mer && p.mer.dmg) || 0))")
rep("sp: b.sp * 1.2 *","sp: b.sp * 1.2 * (p.cr === 'ranger' ? 1.12 : 1) *")
rep("reg: (0.004 * n('medic')","reg: ((p.cr === 'supply' ? 0.004 : 0) + 0.004 * n('medic')")
rep("mxm: (1 + 0.4 * n('armor')","mxm: (p.cr === 'guard' ? 1.25 : 1) * (1 + 0.4 * n('armor')")
# 쿨다운 감소
rep("if (p.fz > 0) p.fz -= dt; if (p.cd > 0) p.cd -= dt;","if (p.fz > 0) p.fz -= dt; if (p.cd > 0) p.cd -= dt; if (p.cc > 0) p.cc -= dt;",2)
# 시작
rep("G.endless = !!v.endless; G.cyc = 0;","G.endless = !!v.endless; G.cm = !!v.coop && !v.endless; G.cyc = 0;")
# startRound: 역할 배정 + 미션
rep("p.cards = startCards(p.role); p.sn = {}; p.rv = 0;","p.cr = G.cm ? CR_ORD[n % 3] : ''; p.cc = 0; p.cards = startCards(p.role); p.sn = {}; p.rv = 0;")
rep("  if (ob !== 'e') for (let j = 0; j < Math.min(5, Math.floor(i0 / 4))","  G.cmOn = !!G.cm && ob === 'd'; if (G.cmOn) { const pos = [[ww * 0.14, wh * 0.2], [ww * 0.86, wh * 0.8]]; for (const q of pos) { G.campPos.push(q); spawn('camp', hs * 0.9, q); } G.campTotal = 2; }\n  if (ob !== 'e') for (let j = 0; j < Math.min(5, Math.floor(i0 / 4))")
# 전투 시작 안내
rep("function beginBattle() { G.ph = 'battle';","function beginBattle() { G.ph = 'battle'; if (G.cmOn) G.info = { id: Date.now() + Math.random(), tt: '🤝 협동 미션 · 이중 전선', tx: '성도 지키고, 멀리 있는 보급기지 2곳도 시간 안에 부수세요! 각자 역할 버튼을 써요' };")
# 시간 종료 판정
rep("else if (!G.endless && G.t >= G.dur) endRound(G.obj === 'd' || G.obj === 's' || G.obj === 'e');","else if (!G.endless && G.t >= G.dur) { if (G.cmOn && camps > 0) { endRound(false); G.res.cmf = camps; } else endRound(G.obj === 'd' || G.obj === 's' || G.obj === 'e'); }")
# 능력 메시지
rep("  else if (m.k === 'skill' && G.ph === 'battle' && !G.du && p.cd <= 0 && !p.down) castSkill(p);","  else if (m.k === 'skill' && G.ph === 'battle' && !G.du && p.cd <= 0 && !p.down) castSkill(p);\n  else if (m.k === 'cr' && G.ph === 'battle' && !G.du && G.cm && p.cr && (p.cc || 0) <= 0 && !p.down && p.hp > 0) castCr(p);")
rep("function castSkill(p) {","""function castCr(p) {
  const D = CRD[p.cr]; p.cc = D.cd; const d2 = (e, x, y) => Math.hypot(e.x - x, e.y - y);
  if (p.cr === 'guard') { G.bInv = Math.max(G.bInv, 4); G.bInvHp = G.baseHp; G.baseHp = Math.min(G.baseMax, G.baseHp + G.baseMax * 0.08); for (const e of G.en) if (e.t !== 'camp' && e.t !== 'boss' && d2(e, p.x, p.y) < 240) { const a = Math.atan2(e.y - p.y, e.x - p.x), q = clampW(e.x + Math.cos(a) * 90, e.y + Math.sin(a) * 90); e.x = q[0]; e.y = q[1]; e.slw = Math.max(e.slw || 0, G.t + 2); } G.fx.push([p.x, p.y, 240, 'roar']); G.fx.push([G.ax, G.ay, 120, 'lvl']); }
  else if (p.cr === 'ranger') { for (const e of G.en) { if (d2(e, p.x, p.y) >= 380) continue; if (e.t === 'camp') { e.hp -= e.mx * 0.2; G.fx.push([e.x, e.y, 70, 'boom']); } else if (e.t === 'boss') dmgEnemy(e, 40 + 8 * G.sc); else { dmgEnemy(e, 90 + 12 * G.sc); G.fx.push([e.x, e.y - 14, 30, 'hit']); } } G.fx.push([p.x, p.y, 380, 'boom']); }
  else if (p.cr === 'supply') { for (const q of G.order) { const h = G.pl[q]; if (h.away) continue; if (h.down > 0 && h.down < 1e8) { h.down = 0; h.hp = h.mx * 0.4; } h.hp = Math.min(h.mx, h.hp + h.mx * 0.3); G.fx.push([h.x, h.y, 50, 'lvl']); } G.food += 30; G.fx.push([p.x, p.y, 160, 'lvl']); }
}
function castSkill(p) {""")
# 스냅샷
rep("role: p.role, x: p.x, y: p.y,","role: p.role, cr: p.cr || '', cc: Math.ceil(p.cc || 0), x: p.x, y: p.y,")
rep("s.mod = g.mod || null;","s.mod = g.mod || null; s.cm = g.cm ? 1 : 0; s.cmn = g.cmOn ? g.en.filter((e) => e.t === 'camp').length : -1;")
# 클라이언트 렌더
rep("$('btnSkill').classList.toggle('dis', p.cd > 0 || p.down > 0);","$('btnSkill').classList.toggle('dis', p.cd > 0 || p.down > 0);\n  { const bc = $('btnCr'), D = CRD[p.cr]; if (V.cm && D && V.ph === 'battle') { bc.style.display = 'flex'; bc.innerHTML = p.cc > 0 ? `${D.ic} ${D.ab}<br><small>${p.cc}초</small>` : `${D.ic} ${D.ab}<br><small>준비!</small>`; bc.classList.toggle('dis', p.cc > 0 || p.down > 0 || !!V.du); } else bc.style.display = 'none'; const ct = $('coopTag'); const ctx = (V.cm && V.ph === 'battle' && V.cmn >= 0) ? (V.cmn > 0 ? `🏕 보급기지 ${V.cmn}/2 남음 · 시간 안에 부숴요!` : '🏕 보급기지 모두 격파! 성을 지켜요') : ''; ct.textContent = ctx; ct.style.display = ctx ? 'block' : 'none'; }")
rep("$('btnSkill').onpointerdown = () => sendHost({ k: 'skill' });","$('btnSkill').onpointerdown = () => sendHost({ k: 'skill' });\n  $('btnCr').onpointerdown = () => sendHost({ k: 'cr' });")
rep("$('btnStartE').onclick =","$('btnCoop').onclick = () => { draftSel = { start: +$('selStart').value, dur: +$('selDur').value, diff: diffSel, coop: true }; hostCtl('start', draftSel); };\n  $('btnStartE').onclick =")
# 결과 화면 실패 문구
rep("$('rsTitle').textContent = win ? (r.df ? '버텨 냈어요!' : '승리!') : '거점이 무너졌어요…';","$('rsTitle').textContent = win ? (r.df ? '버텨 냈어요!' : '승리!') : (V.res.cmf ? '보급기지를 못 부쉈어요…' : '거점이 무너졌어요…');")
# 로비 설명
repu('<button id="btnStartE" class="sec">♾ 무한 모드로 시작</button></div>','<button id="btnStartE" class="sec">♾ 무한 모드로 시작</button> <button id="btnCoop" class="sec">🤝 협동전으로 시작</button>\n      <div class="note" style="margin-top:6px;font-size:13px">🤝 협동전: 친구마다 역할(수비·유격·보급)이 생기고, 성 방어 라운드에서 보급기지 2곳을 함께 부숴야 해요. 보급기지를 못 부수면 져요.</div></div>')
repu('<button id="btnSummon">소집</button><button id="btnSkill">함성</button>','<button id="btnSummon">소집</button><button id="btnSkill">함성</button><button id="btnCr" style="display:none"></button>')
repu('<div id="raidTag" style="display:none"></div>','<div id="raidTag" style="display:none"></div><div id="coopTag" style="display:none"></div>')
repu('#raidTag,#pauseTag,#toast,#waitTag,#lagTag{','#raidTag,#coopTag,#pauseTag,#toast,#waitTag,#lagTag{')
repu('#btnRep{position:absolute;','#btnCr{position:absolute;right:14px;bottom:128px;width:78px;height:78px;border-radius:50%;background:#bfe3c9;border:3px solid var(--line);box-shadow:0 5px 0 var(--line);color:var(--txt);font-size:15px;font-weight:900;line-height:1.15;padding:0;margin:0;flex-direction:column;align-items:center;justify-content:center;z-index:6}#btnCr small{font-size:12px;font-weight:800;color:var(--sub)}#btnCr:active{box-shadow:0 1px 0 var(--line);transform:translateY(4px)}#btnCr.dis{opacity:.55}\n#sBattle.lefty #btnCr{right:auto;left:14px}.noarmy #btnCr{display:none!important}\n#btnRep{position:absolute;')
open(g,'w').write(t);open(h,'w').write(u)
