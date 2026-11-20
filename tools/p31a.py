g='src/game.js';t=open(g).read()
h='src/template.html';u=open(h).read()
def rep(a,b,n=1):
    global t
    assert t.count(a)==n,(a[:90],t.count(a)); t=t.replace(a,b)
def repu(a,b,n=1):
    global u
    assert u.count(a)==n,(a[:90],u.count(a)); u=u.replace(a,b)
def repline(prefix,new):
    global t
    ls=t.split('\n'); idx=[i for i,l in enumerate(ls) if l.startswith(prefix)]
    assert len(idx)==1,(prefix,len(idx)); ls[idx[0]]=new; t='\n'.join(ls)
# 버전/업데이트 노트
rep("const VER = 'v0.30';","const VER = 'v0.31';")
rep("const UPDATES = [\n","const UPDATES = [\n  { v: 'v0.31', d: '11/20', t: ['🌟 전설 영웅 김시민 등장! 진주대첩의 수성 명장 — 성 근처에서 받는 피해가 줄고, 스킬 \\'진주성 철벽\\'으로 성을 고치고 동료에게 방패막을 쳐 줘요', '영웅마다 고유 패시브와 스킬 이펙트가 생겼어요: 권율(주변 동료 공격력↑ · 돌이 쏟아지는 행주 돌비), 이순신(체력이 낮을수록 강해짐 · 학의 날개 모양 학익진), 김시민', '협동 보상 조각은 권율 → 김시민 순서로 모여요 (다음 패치마다 전설 영웅이 늘어요)', '전설·히든 영웅은 자기만의 색 후광이 둘러요'] },\n")
# 데이터
rep("  admiral:{ n: '이순신', c: '#ffd84a', rg: 250, dmg: 38, rt: 0.55, hp: 300, sp: 118, aoe: 0,  tag: ['히든 영웅', '시작 무기: 거북선'],",
    "  gimsimin:{ n: '김시민', c: '#4aa3ff', rg: 300, dmg: 28, rt: 0.8, hp: 330, sp: 104, aoe: 30, tag: ['전설 영웅', '시작 무기: 대포', '패시브: 성 근처에서 받는 피해 -30%'], d: '진주대첩의 수성 명장! 성을 지키는 데 강해요 (협동전 보상 조각 12개로 열려요)' },\n  admiral:{ n: '이순신', c: '#ffd84a', rg: 250, dmg: 38, rt: 0.55, hp: 300, sp: 118, aoe: 0,  tag: ['히든 영웅', '시작 무기: 거북선', '패시브: 체력이 낮을수록 공격력↑'],")
rep("tag: ['전설 영웅', '시작 무기: 화차'],","tag: ['전설 영웅', '시작 무기: 화차', '패시브: 주변 동료 공격력 +10%'],")
rep("const START = { gwonyul: 'hwacha',","const START = { gimsimin: 'cannon', gwonyul: 'hwacha',")
rep("gwonyul: 'h_militia' };","gwonyul: 'h_militia', gimsimin: 'h_cannon' };")
rep("const HERO_BLURB = { gwonyul:","const HERO_BLURB = { gimsimin: '진주대첩(1592)을 이끈 진주목사 김시민이에요. 3천여 명의 군사로 2만여 명의 왜군을 막아 냈어요.', gwonyul:")
rep("  admiral: { n: '학익진',   cd: 18, d: '넓은 범위의 적에게 피해를 주고 느리게 해요' }\n};",
    "  admiral: { n: '학익진',   cd: 18, d: '학의 날개처럼 넓게 펼친 파도로 적에게 피해를 주고 느리게 해요' },\n  gimsimin: { n: '진주성 철벽', cd: 20, d: '성 체력을 회복하고, 주변 동료에게 5초간 방패막을 쳐요. 가까운 적은 밀려나요' }\n};")
rep("gwonyul: { n: '행주 돌비', cd: 16, d: '주변 적에게 돌 비를 쏟아 피해를 주고 느리게 해요' },","gwonyul: { n: '행주 돌비', cd: 16, d: '하늘에서 돌이 쏟아져 주변 적에게 피해를 주고 느리게 해요' },")
# 스킬
rep("G.fx.push([p.x, p.y, 320, 'roar']); }\n  else if (k === 'admiral') { for (const e of near(p.x, p.y, 300)) { dmgEnemy(e, dm(50)); e.slw = G.t + 5; } G.fx.push([p.x, p.y, 300, 'roar']); }",
    "G.fx.push([p.x, p.y, 320, 'gw']); }\n  else if (k === 'admiral') { for (const e of near(p.x, p.y, 300)) { dmgEnemy(e, dm(50)); e.slw = G.t + 5; } G.fx.push([p.x, p.y, 300, 'hk']); }\n  else if (k === 'gimsimin') { if (G.castle) { G.baseHp = Math.min(G.baseMax, G.baseHp + G.baseMax * 0.12); G.fx.push([G.ax, G.ay, 110, 'lvl']); } for (const q of G.order) { const h = G.pl[q]; if (h.hp > 0 && !h.away && Math.hypot(h.x - p.x, h.y - p.y) < 260) { h.sdT = 5; G.fx.push([h.x, h.y, 50, 'lvl']); } } for (const e of near(p.x, p.y, 170)) { if (e.t === 'camp' || e.t === 'boss') continue; const a = Math.atan2(e.y - p.y, e.x - p.x), q2 = clampW(e.x + Math.cos(a) * 70, e.y + Math.sin(a) * 70); e.x = q2[0]; e.y = q2[1]; e.slw = Math.max(e.slw || 0, G.t + 2); } G.fx.push([p.x, p.y, 260, 'ks']); }")
# 패시브
rep("function heroStats(p) {","function gwAura(p) { for (const id of G.order) { const h = G.pl[id]; if (h && h.role === 'gwonyul' && h.hp > 0 && !(h.down > 0) && !h.away && Math.hypot(h.x - p.x, h.y - p.y) < 300) return true; } return false; }\nfunction heroStats(p) {")
rep("const dmg = (p.cr === 'ranger' ? 1.1 : 1) *","const dmg = (p.cr === 'ranger' ? 1.1 : 1) * (p.role === 'admiral' ? 1 + 0.5 * lowHp : 1) * (gwAura(p) ? 1.1 : 1) *")
rep("function hurt(p, v) { if (p.away) return; p.hp -= v * (1 - Math.min(0.55, 0.08 * ((p.cards && p.cards.guard) || 0))); }",
    "function hurt(p, v) { if (p.away) return; let m = 1 - Math.min(0.55, 0.08 * ((p.cards && p.cards.guard) || 0)); if (p.sdT > 0) m *= 0.4; if (p.role === 'gimsimin' && G.castle && Math.hypot(p.x - G.ax, p.y - G.ay) < 320) m *= 0.7; p.hp -= v * m; }")
rep("S = heroStats(p), b = ROLE[p.role];\n    if (p.fz > 0) p.fz -= dt; if (p.cd > 0) p.cd -= dt; if (p.cc > 0) p.cc -= dt;","S = heroStats(p), b = ROLE[p.role];\n    if (p.fz > 0) p.fz -= dt; if (p.cd > 0) p.cd -= dt; if (p.cc > 0) p.cc -= dt; if (p.sdT > 0) p.sdT -= dt;")
rep("au: p.aura || '', cr: p.cr || '',","au: p.aura || '', sd: p.sdT > 0 ? 1 : 0, cr: p.cr || '',")
# 전설 해금 일반화
repline("const LEG = {","const LEG = { gwonyul: { need: 10, n: '권율', btn: 'roleLeg' }, gimsimin: { need: 12, n: '김시민', btn: 'roleLeg2' } };\nconst HAUR = { gwonyul: { c: '#ffb13a', r: 2 }, gimsimin: { c: '#5ab4ff', r: 2 }, admiral: { c: '#7fe6ff', r: 2 } }; // 전설·히든 영웅 기본 후광\nconst FXL = { boss: 1.2, lvl: 1.0, gw: 1.1, hk: 1.2, ks: 1.4 };")
repline("function cwAddSh(","function cwTarget(d) { return Object.keys(LEG).find((k) => !d.own[k]) || ''; }\nfunction cwAddSh(d, n) { let un = ''; while (n > 0) { const k = cwTarget(d); if (!k) { d.tk += n; break; } const take = Math.min(n, LEG[k].need - d.sh); d.sh += take; n -= take; if (d.sh >= LEG[k].need) { d.own[k] = 1; d.sh = 0; un = un || k; } } return un; }")
rep("const un = cwAddSh(d, r.rw.sh); d.tk += r.rw.tk; d.cl++; cwSave(d); return (cwShown[r.id] = { tk: r.rw.tk, sh: r.rw.sh, un, have: d.sh, owned: !!d.own.gwonyul, all: d.tk });",
    "const un = cwAddSh(d, r.rw.sh); d.tk += r.rw.tk; d.cl++; cwSave(d); return (cwShown[r.id] = { tk: r.rw.tk, sh: r.rw.sh, un, have: d.sh, tg: cwTarget(d), all: d.tk });")
repline("  { const rw = $('rsReward')","  { const rw = $('rsReward'), c = cwCredit(); if (c) { rw.style.display = 'block'; const tn = c.tg ? LEG[c.tg].n : ''; rw.innerHTML = `🎁 협동 보상 · 🎟 뽑기권 +${c.tk}${c.sh ? ` · 🧩 ${tn ? tn + ' 조각' : '(전설 완성→뽑기권으로)'} +${c.sh}${tn ? ` (${c.have}/${LEG[c.tg].need})` : ''}` : ''}${c.un ? `<br>🌟 전설 영웅 ${LEG[c.un].n}이(가) 열렸어요!` : ''}<br><small>보관함에서 뽑기를 해 보세요!</small>`; } else rw.style.display = 'none'; }")
repline("  const d = cwLoad(), box = $('cwBox'), L = LEG.gwonyul;","  const d = cwLoad(), box = $('cwBox'), tg = cwTarget(d), L = tg ? LEG[tg] : null; box.classList.add('on');")
repline("  const pct = d.own.gwonyul","  const pct = L ? Math.round(d.sh / L.need * 100) : 100;")
repline("  let h = `<div class=\"cwr\">","  let h = `<div class=\"cwr\"><span>🎟 뽑기권 <b>${d.tk}</b>장</span><span>🧩 ${L ? L.n + ' 조각 <b>' + d.sh + '/' + L.need + '</b>' : '전설 영웅 <b>모두 완성</b>'}</span></div><div class=\"bar\" style=\"margin:4px 0 8px\"><i style=\"width:${pct}%;background:#ffb73a\"></i></div>`;")
repline("  h += d.own.gwonyul ?","  { const got = Object.keys(LEG).filter((k) => d.own[k]).map((k) => LEG[k].n); h += L ? `<p class=\"cwn\">협동전을 깨면 조각을 얻어요. ${L.need}개를 모으면 전설 영웅 <b>${L.n}</b>이 열려요!${got.length ? '<br>🌟 얻은 전설 영웅: ' + got.join(', ') : ''}</p>` : '<p class=\"cwn\">🌟 전설 영웅을 모두 얻었어요! 조각은 뽑기권으로 바뀌어요.</p>'; }")
rep("${r.un ? '<br>🌟 전설 영웅 권율이 열렸어요!' : ''}","${r.un ? '<br>🌟 전설 영웅 ' + LEG[r.un].n + '이(가) 열렸어요!' : ''}")
rep("function refreshHid() { { const lb = $('roleLeg'); if (lb) lb.textContent = legOK('gwonyul') ? '🌟 권율' : '🔒 전설'; }","function refreshHid() { for (const k of Object.keys(LEG)) { const lb = $(LEG[k].btn); if (lb) lb.textContent = legOK(k) ? '🌟 ' + LEG[k].n : '🔒 전설'; }")
a=t.index("if (b.dataset.r === 'gwonyul' && !legOK('gwonyul'))"); b=t.index("if (b.dataset.r === 'admiral'",a)
t=t[:a]+"if (LEG[b.dataset.r] && !legOK(b.dataset.r)) { const c = cwLoad(), tg = cwTarget(c), k = b.dataset.r; $('roleTip').innerHTML = tg === k ? `🔒 <b>전설 영웅 ${LEG[k].n}</b> — 협동전을 깨서 영웅 조각 ${LEG[k].need}개를 모으면 열려요! (지금 ${c.sh}/${LEG[k].need})` : `🔒 <b>전설 영웅 ${LEG[k].n}</b> — 먼저 ${LEG[tg].n}을(를) 열면 조각이 ${LEG[k].n} 쪽으로 모여요!`; return; } "+t[b:]
rep("ok = k === 'admiral' ? hidOK() : k === 'gwonyul' ? legOK('gwonyul') : d.h[k];","ok = k === 'admiral' ? hidOK() : LEG[k] ? legOK(k) : d.h[k];")
rep("(k === 'admiral' ? '모든 라운드를 깨면 열려요' : k === 'gwonyul' ? '협동전 보상 조각 10개로 열려요' : '아직 써 보지 않았어요')","(k === 'admiral' ? '모든 라운드를 깨면 열려요' : LEG[k] ? '협동전 보상 조각 ' + LEG[k].need + '개로 열려요' : '아직 써 보지 않았어요')")
# 후광·방패 그리기
rep("{ const A = AUR[p.au] || (p.role === 'gwonyul' ? AUR.a_gold : null); if (A && !dn) {","{ if (p.sd && !dn) { cx.save(); cx.globalAlpha = 0.26 + 0.08 * Math.sin(tm * 6); cx.fillStyle = '#6ec6ff'; cx.beginPath(); cx.ellipse(q[0], fy - 22, 34, 46, 0, 0, 7); cx.fill(); cx.globalAlpha = 0.9; cx.strokeStyle = '#dff3ff'; cx.lineWidth = 2.5; cx.stroke(); cx.restore(); } }\n      { const A = AUR[p.au] || HAUR[p.role] || null; if (A && !dn) {")
# 이펙트 수명·소리·흔들림
rep("life: f[3] === 'boss' ? 1.2 : f[3] === 'lvl' ? 1.0 : 0.38, mx: f[3] === 'boss' ? 1.2 : f[3] === 'lvl' ? 1.0 : 0.38 });","life: FXL[f[3]] || 0.38, mx: FXL[f[3]] || 0.38 });")
rep("else if (f[3] === 'boom') SFX.p('boom');","else if (f[3] === 'boom' || f[3] === 'gw' || f[3] === 'hk') SFX.p('boom'); else if (f[3] === 'ks') SFX.p('lvl');")
rep("if (f[3] === 'roar' || f[3] === 'boss') shake = Math.max(shake, 0.35);","if (f[3] === 'roar' || f[3] === 'boss') shake = Math.max(shake, 0.35); if (f[3] === 'gw' || f[3] === 'hk') shake = Math.max(shake, 0.3);")
rep("    else if (f.k === 'night') { }\n","""    else if (f.k === 'gw') { const R = f.r, n = LOW ? 8 : 16; cx.save(); cx.globalAlpha = (1 - t) * 0.5; cx.strokeStyle = '#ff9a3c'; cx.lineWidth = 4; cx.beginPath(); cx.arc(f.x, f.y, R * (0.3 + 0.7 * t), 0, 7); cx.stroke();
      for (let k = 0; k < n; k++) { const sd = k * 2.399, rr = R * 0.9 * Math.sqrt((k + 0.5) / n), tx = f.x + Math.cos(sd) * rr, ty = f.y + Math.sin(sd) * rr * 0.8, u = (t - (k % 4) * 0.12) / 0.45; if (u < 0 || u > 1.6) continue;
        if (u < 1) { const yy = ty - (1 - u) * 150; cx.globalAlpha = 0.95; cx.fillStyle = '#8a6a4a'; cx.beginPath(); cx.arc(tx, yy, 7, 0, 7); cx.fill(); cx.strokeStyle = '#4a3322'; cx.lineWidth = 2; cx.stroke(); cx.globalAlpha = 0.35; cx.strokeStyle = '#ffc27a'; cx.lineWidth = 3; cx.beginPath(); cx.moveTo(tx, yy - 6); cx.lineTo(tx, yy - 28); cx.stroke(); }
        else { const v = (u - 1) / 0.6; cx.globalAlpha = (1 - v) * 0.8; cx.strokeStyle = '#ffd7a0'; cx.lineWidth = 3 * (1 - v) + 1; cx.beginPath(); cx.ellipse(tx, ty, 8 + v * 16, 4 + v * 8, 0, 0, 7); cx.stroke(); } }
      cx.restore(); }
    else if (f.k === 'hk') { const R = f.r, w = Math.min(1, t * 2.2), fa = t < 0.6 ? 1 : 1 - (t - 0.6) / 0.4; cx.save(); cx.fillStyle = '#4fa3ff';
      for (const s of [-1, 1]) { cx.globalAlpha = 0.5 * fa; cx.beginPath(); cx.moveTo(f.x, f.y); cx.quadraticCurveTo(f.x + s * R * 0.55 * w, f.y - R * 0.7 * w, f.x + s * R * w, f.y - R * 0.12 * w); cx.quadraticCurveTo(f.x + s * R * 0.62 * w, f.y + R * 0.12 * w, f.x, f.y + 6); cx.fill(); cx.globalAlpha = 0.95 * fa; cx.strokeStyle = '#eaf6ff'; cx.lineWidth = 3; cx.stroke(); }
      cx.globalAlpha = 0.7 * fa; cx.strokeStyle = '#bfe6ff'; cx.lineWidth = 3; for (let k = 0; k < 3; k++) { const rr = R * (0.35 + 0.3 * k) * w; cx.beginPath(); cx.arc(f.x, f.y, rr, 0.15 * Math.PI, 0.85 * Math.PI); cx.stroke(); cx.beginPath(); cx.arc(f.x, f.y, rr, 1.15 * Math.PI, 1.85 * Math.PI); cx.stroke(); }
      cx.restore(); }
    else if (f.k === 'ks') { const R = f.r, w = Math.min(1, t * 3), fa = t < 0.7 ? 1 : 1 - (t - 0.7) / 0.3; cx.save(); const gr = cx.createRadialGradient(f.x, f.y, R * 0.2 * w, f.x, f.y, R * w); gr.addColorStop(0, 'rgba(120,200,255,0)'); gr.addColorStop(1, 'rgba(120,200,255,' + 0.45 * fa + ')'); cx.fillStyle = gr; cx.beginPath(); cx.arc(f.x, f.y, R * w, 0, 7); cx.fill(); cx.globalAlpha = fa; cx.strokeStyle = '#e4f5ff'; cx.lineWidth = 4; cx.stroke();
      cx.lineWidth = 2; for (let k = 0; k < 6; k++) { const a = k * 1.047 + t * 1.5; cx.beginPath(); cx.moveTo(f.x + Math.cos(a) * R * w * 0.55, f.y + Math.sin(a) * R * w * 0.55); cx.lineTo(f.x + Math.cos(a + 0.5) * R * w * 0.9, f.y + Math.sin(a + 0.5) * R * w * 0.9); cx.stroke(); }
      cx.restore(); }
    else if (f.k === 'night') { }
""")
repu('<button data-r="gwonyul" id="roleLeg">🔒 전설</button>','<button data-r="gwonyul" id="roleLeg">🔒 전설</button><button data-r="gimsimin" id="roleLeg2">🔒 전설</button>')
open(g,'w').write(t);open(h,'w').write(u)
print('ok')
