f='src/game.js'; s=open(f).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(a[:60],s.count(a)); s=s.replace(a,b)
rep("const VER = 'v0.23';","const VER = 'v0.24';")
rep("const UPDATES = [\n","""const UPDATES = [
  { v: 'v0.24', d: '11/20', t: ['🎖 공훈 보상: 전투에서 이기면 3가지 중 1개를 골라요. 다음 라운드부터 계속 쌓여요 (체력·공격·군량·성벽·혼·회복)', '전장 변수가 생겼어요: 풍년(군량↑) · 의병 합류(병사 2명 시작) · 질풍(적이 빠른 대신 혼↑)', '적이 거점만 집중 공격하지 않아요. 가까운 영웅을 먼저 쫓는 적이 많아요. 성은 잠시 맞지 않으면 천천히 회복해요', '연속 라운드의 목표가 겹치지 않도록 바꿨고, 초반 라운드(옥포 해전 등) 난이도를 낮췄어요'] },
""")
rep("const ROUND_OBJ = ['d', 'e', 's', 'b', 'b', 'd', 'r', 'r', 'd', 'd', 's', 'd', 'd', 'b', 's', 's', 'r', 'e', 'r', 'b', 'd', 'd', 's', 'd', 's', 'e', 'd', 's', 'b', 'd'];",
"""const ROUND_OBJ = ['d', 'e', 's', 'r', 'b', 'd', 's', 'r', 'd', 'b', 's', 'd', 's', 'b', 'd', 's', 'r', 'e', 'r', 'b', 'd', 's', 'e', 'd', 's', 'e', 'd', 's', 'b', 'd'];
const MER = { hp: ['❤️', '튼튼한 몸', '영웅 체력 +10%'], dmg: ['⚔️', '날카로운 칼날', '공격력 +6%'], fd: ['🌾', '넉넉한 군량', '라운드 시작 군량 +20'], wall: ['🧱', '든든한 성벽', '성 체력 +12%'], xp: ['✨', '배움의 열기', '혼(경험치) 획득 +10%'], reg: ['🩹', '약초 주머니', '영웅 체력이 천천히 회복'] };
const MODS = { rich: ['🌾', '풍년', '군량 획득이 30% 늘어요'], vol: ['🤝', '의병 합류', '병사 2명과 함께 시작해요'], haste: ['💨', '질풍', '적이 조금 빨라지고 혼을 더 얻어요'] };""")
# hooks
rep("const dmg = (1 + 0.3 * n('forge'))","const dmg = (1 + 0.06 * ((p.mer && p.mer.dmg) || 0)) * (1 + 0.3 * n('forge'))")
rep("mxm: 1 + 0.4 * n('armor') + (sa.armor_guard ? 0.1 : 0) };","mxm: (1 + 0.4 * n('armor') + (sa.armor_guard ? 0.1 : 0)) * (1 + 0.1 * ((p.mer && p.mer.hp) || 0)) };")
rep("reg: (0.004 * n('medic')","reg: (0.004 * n('medic') + 0.003 * ((p.mer && p.mer.reg) || 0)")
rep("m = Math.max(m, 1 + 0.15 * (p.cards.study || 0)","m = Math.max(m, 1 + 0.1 * ((p.mer && p.mer.xp) || 0) + 0.15 * (p.cards.study || 0)")
rep("return m; }\nfunction roadY","return m * (G.mod === 'haste' ? 1.25 : 1); }\nfunction roadY")
rep("const v = e.sp * dt * (G.slowT > 0 ? 0.6 : 1)","const v = e.sp * dt * (G.mod === 'haste' ? 1.08 : 1) * (G.slowT > 0 ? 0.6 : 1)")
# startRound
rep("G.baseMax = Math.round(600 * (1 + 0.2 * (G.wallN || 0))); G.baseHp = G.baseMax;",
"G.baseMax = Math.round(600 * (1 + 0.2 * (G.wallN || 0)) * (1 + 0.12 * Math.max(0, ...G.order.map((id) => (G.pl[id].mer && G.pl[id].mer.wall) || 0)))); G.baseHp = G.baseMax;\n  G.mod = (G.endless || i === 0) ? null : [null, 'rich', 'vol', 'haste'][(i * 7 + 3) % 4]; G.dmx = i < 6 && !G.endless ? 0.85 : 1;")
rep("G.food = 110 + G.bonus + G.dif.fd; G.bonus = 0; G.foodMul = 1;","G.food = 110 + G.bonus + G.dif.fd + 20 * Math.max(0, ...G.order.map((id) => (G.pl[id].mer && G.pl[id].mer.fd) || 0)); G.bonus = 0; G.foodMul = G.mod === 'rich' ? 1.3 : 1;")
rep("const hs = (1 + 0.09 * G.sc) * (rd.df ? 1.1 : 1) * G.dif.hp;","const hs = (1 + 0.09 * G.sc) * (rd.df ? 1.1 : 1) * G.dif.hp * (i < 6 && !G.endless ? 0.88 : 1);")
rep("if (ob !== 'e') for (let j = 0; j < Math.min(5, Math.floor(i0 / 4)); j++) doSummon(true);","if (ob !== 'e') for (let j = 0; j < Math.min(5, Math.floor(i0 / 4)) + (G.mod === 'vol' ? 2 : 0); j++) doSummon(true);")
rep("p.mx = Math.round(ROLE[p.role].hp * G.dif.hh); p.hp = p.mx; p.down = 0; p.cd = 0; p.offer = null; p.fz = 3;","p.mx = Math.round(ROLE[p.role].hp * G.dif.hh * heroStats(p).mxm); p.hp = p.mx; p.down = 0; p.cd = 0; p.offer = null; p.mo = null; p.fz = 3;")
# reset mer at start; offers at win
rep("for (const id of G.order) G.pl[id].cards = {};","for (const id of G.order) { G.pl[id].cards = {}; G.pl[id].mer = {}; }")
rep("  for (const id of G.order) { const p = G.pl[id]; p.offer = null; }\n  if (G.es)","  for (const id of G.order) { const p = G.pl[id]; p.offer = null; p.mo = null; if (win && !G.endless) { const ks = Object.keys(MER).filter((k) => ((p.mer || {})[k] || 0) < 5); p.mo = ks.sort(() => Math.random() - 0.5).slice(0, 3); } }\n  if (G.es)")
rep("function nextRound() {\n  G.bonus = 0;","function autoMer() { for (const id of G.order) { const p = G.pl[id]; if (p.mo && p.mo.length) { p.mer = p.mer || {}; const k = p.mo[rint(p.mo.length)]; p.mer[k] = (p.mer[k] || 0) + 1; p.mo = null; } } }\nfunction nextRound() {\n  autoMer(); G.bonus = 0;")
rep("  else if (m.k === 'ans' &&","  else if (m.k === 'mer' && G.ph === 'result' && p.mo && m.i >= 0 && m.i < p.mo.length) { p.mer = p.mer || {}; const k = p.mo[m.i | 0]; p.mer[k] = (p.mer[k] || 0) + 1; p.mo = null; }\n  else if (m.k === 'ans' &&")
rep("offer: p.offer, offT: p.offT,","offer: p.offer, offT: p.offT, mo: p.mo || null, mer: p.mer || {},")
rep("s.obj = g.obj;","s.obj = g.obj; s.mod = g.mod || null;")
# client: brief goal + result merit box
rep("${r.df ? ' (역사에서는 어려웠던 싸움! 시간을 벌면 성공이에요)' : ''}</small>`;","${r.df ? ' (역사에서는 어려웠던 싸움! 시간을 벌면 성공이에요)' : ''}</small>` + (V.mod ? `<br><small style=\"color:#7a4a00\">${MODS[V.mod][0]} 전장 변수 · <b>${MODS[V.mod][1]}</b> — ${MODS[V.mod][2]}</small>` : '');")
rep("  $('qBox').style.display = 'none'; $('rsSave')","  { const me = V.pl.find((x) => x.id === Net.id), box = $('merBox'); if (win && me && me.mo && me.mo.length) { box.style.display = 'block'; box.innerHTML = '<div style=\"font-weight:bold;margin-bottom:4px\">🎖 공훈을 1개 골라요 <small>(다음 라운드부터 계속 쌓여요)</small></div><div class=\"row\">' + me.mo.map((k, i) => `<button class=\"sec merb\" data-i=\"${i}\">${MER[k][0]} ${MER[k][1]}<br><small>${MER[k][2]} · 지금 Lv.${(me.mer && me.mer[k]) || 0}</small></button>`).join('') + '</div>'; box.querySelectorAll('.merb').forEach((b) => b.onclick = () => { sendHost({ k: 'mer', i: +b.dataset.i }); box.innerHTML = '<div>🎖 공훈을 받았어요!</div>'; }); } else box.style.display = 'none'; }\n  $('qBox').style.display = 'none'; $('rsSave')")
open(f,'w').write(s)
t='src/template.html'; h=open(t).read()
a='<div id="qBox">'; assert h.count(a)==1
h=h.replace(a,'<div class="panel" id="merBox" style="display:none"></div>\n  '+a)
open(t,'w').write(h)
