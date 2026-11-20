p='src/game.js';s=open(p).read()
def rep(a,b,c=1):
    global s
    assert s.count(a)==c,(a[:60],s.count(a)); s=s.replace(a,b)
rep("const VER = 'v0.31';","const VER = 'v0.32';")
rep("const UPDATES = [\n","""const UPDATES = [
  { v: 'v0.32', d: '11/20', t: ['🌟 전설 영웅 4명 더 등장! 곽재우(홍의장군) · 휴정(서산대사) · 유정(사명대사) · 진린(명나라 수군 도독, 교과서 밖 보충)', '곽재우: 이동이 빠르고, 스킬 \\'홍의 분신\\'으로 적을 잠깐 멈춰 세워요 · 휴정: 근처 동료가 천천히 회복하고, 스킬 \\'격문\\'으로 동료 공격력을 올려요', '유정: 단단하고, 스킬 \\'호국 결계\\'로 6초 동안 사라지지 않는 결계를 펼쳐 적을 느리게 하고 다치게 해요 · 진린: 스킬 \\'명군 지원 포격\\'으로 여러 곳에 포탄을 떨어뜨려요', '전설 영웅 조각은 권율 → 김시민 → 곽재우 → 휴정 → 유정 → 진린 순서로 모여요. 영웅 그림도 새로 바뀌었어요.'] },
""")
# ROLE
rep("  gimsimin:{ n: '김시민'","""  gwakjaeu:{ n: '곽재우', c: '#ff4a3a', rg: 200, dmg: 26, rt: 0.65, hp: 230, sp: 128, aoe: 0, tag: ['전설 영웅', '시작 무기: 환도', '패시브: 이동 +25%'], d: '홍의장군! 붉은 옷으로 날쌔게 달리며 싸워요 (협동전 보상 조각 12개 모으면 열려요)' },
  hyujeong:{ n: '휴정', c: '#ffd34d', rg: 190, dmg: 18, rt: 0.9, hp: 260, sp: 108, aoe: 25, tag: ['전설 영웅', '시작 무기: 불경', '패시브: 근처 동료 회복'], d: '서산대사! 동료를 북돋우는 후방 지원 영웅이에요 (협동전 보상 조각 12개 모으면 열려요)' },
  yujeong:{ n: '유정', c: '#c28aff', rg: 220, dmg: 30, rt: 1.0, hp: 420, sp: 100, aoe: 35, tag: ['전설 영웅', '시작 무기: 철퇴', '패시브: 받는 피해 -15%'], d: '사명대사! 아주 단단한 승병장이에요 (협동전 보상 조각 14개 모으면 열려요)' },
  jinrin:{ n: '진린', c: '#ff9a3a', rg: 360, dmg: 34, rt: 0.95, hp: 300, sp: 100, aoe: 60, tag: ['전설 영웅', '교과서 밖 보충', '시작 무기: 대포', '패시브: 폭발 범위 +15%'], d: '명나라 수군 도독! 조선 수군과 함께 싸운 연합군 장수예요 (협동전 보상 조각 14개 모으면 열려요)' },
  gimsimin:{ n: '김시민'""")
rep("const START = { gimsimin: 'cannon',","const START = { gwakjaeu: 'sword', hyujeong: 'buddha', yujeong: 'flail', jinrin: 'cannon', gimsimin: 'cannon',")
rep("  gimsimin: { n: '진주성 철벽'","""  gwakjaeu: { n: '홍의 분신', cd: 17, d: '붉은 옷 분신이 나타나 주변 적을 헷갈리게 해 2초 멈춰 세우고, 나는 5초 동안 더 빨라져요' },
  hyujeong: { n: '격문', cd: 20, d: '나라를 지키자는 글로 동료를 북돋아 체력을 회복시키고 6초 동안 공격력을 올려요' },
  yujeong: { n: '호국 결계', cd: 22, d: '6초 동안 사라지지 않는 결계를 펼쳐 안의 적을 느리게 하고 계속 다치게 해요' },
  jinrin: { n: '명군 지원 포격', cd: 22, d: '명나라 수군의 대포가 여러 곳에 포탄을 떨어뜨려요' },
  gimsimin: { n: '진주성 철벽'""")
# castSkill
rep("  else if (k === 'gimsimin') { if (G.castle)","""  else if (k === 'gwakjaeu') { for (const e of near(p.x, p.y, 340)) { if (e.t === 'camp') continue; if (e.t === 'boss') e.slw = Math.max(e.slw || 0, G.t + 3); else { e.st = 2.2; dmgEnemy(e, dm(35)); } G.fx.push([e.x, e.y - 14, 26, 'hit']); } p.spT = 5; G.fx.push([p.x, p.y, 340, 'hg']); }
  else if (k === 'hyujeong') { for (const q of G.order) { const h = G.pl[q]; if (h.hp > 0 && !h.away && Math.hypot(h.x - p.x, h.y - p.y) < 420) { h.hp = Math.min(h.mx, h.hp + h.mx * 0.15); h.bfT = 6; G.fx.push([h.x, h.y, 50, 'lvl']); } } G.fx.push([p.x, p.y, 420, 'hj']); }
  else if (k === 'yujeong') { p.zT = 6; p.zx = p.x; p.zy = p.y; p.zk = 0; for (const e of near(p.x, p.y, 210)) e.slw = Math.max(e.slw || 0, G.t + 3); G.fx.push([p.x, p.y, 210, 'yj']); }
  else if (k === 'jinrin') { const t = near(p.x, p.y, 460).sort(() => Math.random() - 0.5).slice(0, 8); for (const e of t) { for (const e2 of near(e.x, e.y, 90)) dmgEnemy(e2, dm(70)); G.fx.push([e.x, e.y, 90, 'boom']); } G.fx.push([p.x, p.y, 460, 'jr']); }
  else if (k === 'gimsimin') { if (G.castle)""")
# stats
rep("(gwAura(p) ? 1.1 : 1) *","(gwAura(p) ? 1.1 : 1) * (p.bfT > 0 ? 1.3 : 1) *")
rep("sp: b.sp * 1.2 *","sp: b.sp * 1.2 * (p.role === 'gwakjaeu' ? 1.25 : 1) * (p.spT > 0 ? 1.5 : 1) *")
rep("aoe: 1 + 0.12 * n('powder')","aoe: (p.role === 'jinrin' ? 0.15 : 0) + 1 + 0.12 * n('powder')")
rep("reg: ((p.cr === 'supply' ? 0.004 : 0) +","reg: ((p.cr === 'supply' ? 0.004 : 0) + (hjAura(p) ? 0.004 : 0) +")
rep("function heroStats(p) {","function hjAura(p) { for (const id of G.order) { const h = G.pl[id]; if (h && h.role === 'hyujeong' && h.hp > 0 && !(h.down > 0) && !h.away && Math.hypot(h.x - p.x, h.y - p.y) < 300) return true; } return false; }\nfunction heroStats(p) {")
rep("if (p.sdT > 0) m *= 0.4;","if (p.sdT > 0) m *= 0.4; if (p.role === 'yujeong') m *= 0.85;")
# timers
rep("if (p.sdT > 0) p.sdT -= dt;","if (p.sdT > 0) p.sdT -= dt; if (p.spT > 0) p.spT -= dt; if (p.bfT > 0) p.bfT -= dt; if (p.zT > 0) { p.zT -= dt; p.zk -= dt; if (p.zk <= 0) { p.zk = 0.5; for (const e of G.en) if (e.t !== 'camp' && Math.hypot(e.x - p.zx, e.y - p.zy) < 210) { e.slw = Math.max(e.slw || 0, G.t + 1); dmgEnemy(e, 8 + 2 * G.sc); } } }",2)
# client
rep("const LEG = { gwonyul: { need: 10, n: '권율', btn: 'roleLeg' }, gimsimin: { need: 12, n: '김시민', btn: 'roleLeg2' } };","const LEG = { gwonyul: { need: 10, n: '권율', btn: 'roleLeg' }, gimsimin: { need: 12, n: '김시민', btn: 'roleLeg2' }, gwakjaeu: { need: 12, n: '곽재우', btn: 'roleLeg3' }, hyujeong: { need: 12, n: '휴정', btn: 'roleLeg4' }, yujeong: { need: 14, n: '유정', btn: 'roleLeg5' }, jinrin: { need: 14, n: '진린', btn: 'roleLeg6' } };")
rep("admiral: { c: '#7fe6ff', r: 2 } };","admiral: { c: '#7fe6ff', r: 2 }, gwakjaeu: { c: '#ff4a3a', r: 2 }, hyujeong: { c: '#ffe27a', r: 2 }, yujeong: { c: '#c28aff', r: 2 }, jinrin: { c: '#ff9a3a', r: 2 } };")
rep("gw: 1.4, hk: 1.2, ks: 1.4 };","gw: 1.4, hk: 1.2, ks: 1.4, hg: 1.2, hj: 1.4, yj: 6, jr: 1.5 };")
rep("const HERO_BLURB = {","""const HERO_BLURB = { gwakjaeu: '임진왜란 때 가장 먼저 의병을 일으킨 홍의장군 곽재우예요. 붉은 옷을 입고 날쌔게 싸웠어요.', hyujeong: '서산대사 휴정은 임진왜란이 나자 승려들에게 나라를 지키자는 글을 보내 승병을 일으키게 했어요.', yujeong: '사명대사 유정은 휴정의 제자로 승병을 이끌었고, 전쟁이 끝난 뒤 일본에 가서 포로를 데려오는 데 힘썼어요.', jinrin: '명나라 수군 장수 진린은 정유재란 때 조선 수군과 연합해 노량해전에서 이순신과 함께 싸웠어요. (교과서 밖 보충)',""")
rep("(p.role === 'gwonyul' || p.role === 'admiral' || p.role === 'gimsimin') ? 76 : 62","(p.role === 'admiral' || LEG[p.role]) ? 76 : 62")
rep("else if (f[3] === 'ks') SFX.p('lvl');","else if (f[3] === 'ks' || f[3] === 'hj' || f[3] === 'yj') SFX.p('lvl'); else if (f[3] === 'hg') SFX.p('puff'); else if (f[3] === 'jr') SFX.p('boom');")
rep("if (f[3] === 'gw' || f[3] === 'hk') shake = Math.max(shake, 0.3);","if (f[3] === 'gw' || f[3] === 'hk' || f[3] === 'jr') shake = Math.max(shake, 0.3);")
rep("    else if (f.k === 'night') { }","""    else if (f.k === 'hg') { const R = f.r, w = Math.min(1, t * 3.5), fa = 1 - t; cx.save(); cx.globalAlpha = 0.35 * fa; cx.fillStyle = '#ff3a2a'; cx.beginPath(); cx.arc(f.x, f.y, R * w, 0, 7); cx.fill(); cx.globalAlpha = fa; cx.strokeStyle = '#ffd0c0'; cx.lineWidth = 4; cx.stroke();
      for (let k = 0; k < 6; k++) { const a = k * 1.047 + t * 3, rr = R * 0.7 * w, px = f.x + Math.cos(a) * rr, py = f.y + Math.sin(a) * rr * 0.6; cx.globalAlpha = 0.8 * fa; cx.fillStyle = '#e8362a'; cx.beginPath(); cx.ellipse(px, py - 12, 9, 15, 0, 0, 7); cx.fill(); cx.fillStyle = '#ffe3b0'; cx.beginPath(); cx.arc(px, py - 30, 7, 0, 7); cx.fill(); cx.strokeStyle = '#7a1a10'; cx.lineWidth = 2; cx.stroke(); }
      cx.restore(); }
    else if (f.k === 'hj') { const R = f.r, fa = t < 0.6 ? 1 : 1 - (t - 0.6) / 0.4; cx.save(); for (let k = 0; k < 2; k++) { const w = Math.min(1, Math.max(0, t * 2.2 - k * 0.25)); cx.globalAlpha = 0.8 * fa * (1 - w * 0.4); cx.strokeStyle = k ? '#fff3b0' : '#ffd34d'; cx.lineWidth = 5 - k * 2; cx.beginPath(); cx.arc(f.x, f.y, R * w, 0, 7); cx.stroke(); }
      cx.globalAlpha = 0.85 * fa; cx.fillStyle = '#fff3a0'; for (let k = 0; k < 14; k++) { const a = k * 0.449, rr = R * (0.25 + 0.7 * ((k * 0.37) % 1)) * Math.min(1, t * 2.2), yy = f.y + Math.sin(a) * rr * 0.6 - t * 40 * (1 + (k % 3) * 0.3); cx.fillRect(f.x + Math.cos(a) * rr - 2, yy - 6, 4, 12); }
      cx.restore(); }
    else if (f.k === 'yj') { const R = f.r, w = Math.min(1, t * 8), fa = t < 0.9 ? 1 : 1 - (t - 0.9) / 0.1, pu = 1 + 0.03 * Math.sin(t * 40); cx.save(); const gr = cx.createRadialGradient(f.x, f.y, R * 0.1, f.x, f.y, R * w * pu); gr.addColorStop(0, 'rgba(194,138,255,.05)'); gr.addColorStop(1, 'rgba(194,138,255,' + 0.38 * fa + ')'); cx.fillStyle = gr; cx.beginPath(); cx.arc(f.x, f.y, R * w * pu, 0, 7); cx.fill(); cx.globalAlpha = fa; cx.strokeStyle = '#f0dcff'; cx.lineWidth = 4; cx.stroke(); cx.strokeStyle = '#ffd34d'; cx.lineWidth = 2;
      for (let k = 0; k < 8; k++) { const a = k * 0.785 + t * 6, rr = R * w * 0.6; cx.beginPath(); cx.ellipse(f.x + Math.cos(a) * rr * 0.55, f.y + Math.sin(a) * rr * 0.55, rr * 0.45, rr * 0.16, a, 0, 7); cx.stroke(); }
      cx.restore(); }
    else if (f.k === 'jr') { const R = f.r, fa = t < 0.6 ? 1 : 1 - (t - 0.6) / 0.4; cx.save(); cx.globalAlpha = 0.5 * fa; cx.strokeStyle = '#ffb347'; cx.lineWidth = 3; cx.setLineDash([14, 10]); cx.beginPath(); cx.arc(f.x, f.y, R * Math.min(1, t * 3), 0, 7); cx.stroke(); cx.setLineDash([]);
      for (let k = 0; k < 8; k++) { const u = (t * 1.6 - k * 0.07) % 1.2; if (u < 0 || u > 1) continue; const a = k * 2.4, rr = R * (0.3 + 0.6 * ((k * 0.31) % 1)), tx = f.x + Math.cos(a) * rr, ty = f.y + Math.sin(a) * rr * 0.7; cx.globalAlpha = 0.9 * fa; cx.fillStyle = '#2a2018'; cx.beginPath(); cx.arc(tx, ty - (1 - u) * 260, 7, 0, 7); cx.fill(); cx.strokeStyle = '#ff9a3a'; cx.lineWidth = 3; cx.beginPath(); cx.moveTo(tx, ty - (1 - u) * 260 - 7); cx.lineTo(tx, ty - (1 - u) * 260 - 30); cx.stroke(); }
      cx.restore(); }
    else if (f.k === 'night') { }""")
open(p,'w').write(s)
t='src/template.html';h=open(t).read()
a='<button data-r="gimsimin" id="roleLeg2">🔒 전설</button>'
assert h.count(a)==1
h=h.replace(a,a+'<button data-r="gwakjaeu" id="roleLeg3">🔒 전설</button><button data-r="hyujeong" id="roleLeg4">🔒 전설</button><button data-r="yujeong" id="roleLeg5">🔒 전설</button><button data-r="jinrin" id="roleLeg6">🔒 전설</button>')
open(t,'w').write(h)
