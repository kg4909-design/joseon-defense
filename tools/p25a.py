f='src/game.js'; s=open(f).read()
def rep(a,b):
    global s
    assert s.count(a)==1,a[:80]; s=s.replace(a,b)

# ---- 버전/업데이트 노트
rep("const VER = 'v0.24';","const VER = 'v0.25';")
rep("  { v: 'v0.24',","  { v: 'v0.25', d: '11/20', t: ['📜 라운드가 끝나면 \"역사 한 컷\" 카드가 나와요: 실제 역사와 게임 속 설정을 나눠서 보여줘요', '🧠 레벨업 퀴즈를 맞히면 군량(또는 체력 회복)을 받고, 3문제 연속 정답이면 보너스가 더 커져요', '🔥 영웅마다 스킬이 달라졌어요 (화살비·함성·호국염불·집중포화·학익진)', '⚔ 적장마다 일기토 스타일이 달라요 (돌격형·포격형·파쇄형·결계형·지휘형). 이기면 스타일별 보상!'] },\n  { v: 'v0.24',")

# ---- B2 영웅 스킬
skill = r"""
// ===== 영웅 스킬: 영웅마다 다른 액티브 스킬 (역사적 사실이 아니라 게임 규칙이에요) =====
const SKILL = {
  archer:  { n: '화살비',   cd: 14, d: '가까운 적 10마리에게 화살을 쏟아부어요' },
  militia: { n: '함성',     cd: 15, d: '주변 적에게 피해를 주고 잠깐 멈춰 세워요' },
  monk:    { n: '호국염불', cd: 18, d: '주변 동료를 회복시키고 적을 느리게 해요' },
  gunner:  { n: '집중포화', cd: 16, d: '가까운 적 무리에 큰 폭발을 일으켜요' },
  admiral: { n: '학익진',   cd: 18, d: '넓은 범위의 적에게 피해를 주고 느리게 해요' }
};
function castSkill(p) {
  const k = SKILL[p.role] ? p.role : 'militia', S = SKILL[k], dm = (a) => a + 8 * G.sc, d2 = (e, x, y) => Math.hypot(e.x - x, e.y - y), near = (x, y, r) => G.en.filter((e) => d2(e, x, y) < r);
  p.cd = S.cd;
  if (k === 'archer') { const t = near(p.x, p.y, 330).sort((a, b) => d2(a, p.x, p.y) - d2(b, p.x, p.y)).slice(0, 10); for (const e of t) { dmgEnemy(e, dm(55)); G.fx.push([e.x, e.y - 14, 26, 'hit']); } G.fx.push([p.x, p.y, 60, 'puff']); }
  else if (k === 'monk') { for (const q of G.order) { const h = G.pl[q]; if (h.hp > 0 && Math.hypot(h.x - p.x, h.y - p.y) < 260) { h.hp = Math.min(h.mx, h.hp + h.mx * 0.35); G.fx.push([h.x, h.y, 50, 'lvl']); } } for (const e of near(p.x, p.y, 220)) e.slw = G.t + 4; G.fx.push([p.x, p.y, 220, 'roar']); }
  else if (k === 'gunner') { const t = near(p.x, p.y, 420).sort((a, b) => d2(a, p.x, p.y) - d2(b, p.x, p.y))[0], tx = t ? t.x : p.x + 140, ty = t ? t.y : p.y; for (const e of near(tx, ty, 120)) dmgEnemy(e, dm(130)); G.fx.push([tx, ty, 120, 'boom']); }
  else if (k === 'admiral') { for (const e of near(p.x, p.y, 300)) { dmgEnemy(e, dm(50)); e.slw = G.t + 5; } G.fx.push([p.x, p.y, 300, 'roar']); }
  else { for (const e of near(p.x, p.y, 125)) { dmgEnemy(e, dm(70)); e.st = 1.6; } G.fx.push([p.x, p.y, 125, 'roar']); }
}
"""
rep("// ===== 적장 일기토: 제한된 원형 무대에서 장수와 겨뤄요 (피하고 · 공격) =====", skill + "// ===== 적장 일기토: 제한된 원형 무대에서 장수와 겨뤄요 (피하고 · 공격) =====")
rep("p.cd <= 0 && !p.down) { p.cd = 15; for (const e of G.en) if (Math.hypot(e.x - p.x, e.y - p.y) < 125) { dmgEnemy(e, 70 + 8 * G.sc); e.st = 1.6; } G.fx.push([p.x, p.y, 125, 'roar']); }","p.cd <= 0 && !p.down) castSkill(p);")
rep("{ const sk = V.du ? '구르기' : '함성'; $('btnSkill').innerHTML","{ const sk = V.du ? '구르기' : (SKILL[p.role] || SKILL.militia).n; $('btnSkill').style.fontSize = sk.length > 3 ? '19px' : ''; $('btnSkill').innerHTML")
rep("+ R0.tag.map((x) => `<span class=\"tg\">${x}</span>`).join(''); };","+ R0.tag.map((x) => `<span class=\"tg\">${x}</span>`).join('') + `<br>🔥 스킬 <b>${SKILL[r].n}</b> — ${SKILL[r].d}`; };")

# ---- C1 퀴즈 보상
rep("p.qs = 1; p.qok = (p.qok || 0) + 1; if (G.es) G.es.q++;","p.qs = 1; p.qok = (p.qok || 0) + 1; p.qstk = (p.qstk || 0) + 1; { const esc = G.obj === 'e'; let t = ''; if (esc) { p.hp = Math.min(p.mx, p.hp + p.mx * 0.25); t = '체력 +25%'; } else { G.food += 30; t = '군량 +30'; } if (p.qstk % 3 === 0) { for (const q of G.order) { const h = G.pl[q]; h.hp = Math.min(h.mx, h.hp + h.mx * 0.3); } if (!esc) G.food += 50; t += ' · 🔥연속 정답 보너스' + (esc ? ' 전원 체력 +30%' : ' 군량 +50 · 전원 체력 +30%'); G.fx.push([p.x, p.y, 90, 'lvl']); } p.qrw = t; } if (G.es) G.es.q++;")
rep("} else p.qs = 2;\n  }","} else { p.qs = 2; p.qstk = 0; p.qrw = ''; }\n  }")
rep("p.qs = 0;\n}\nfunction offerCards","p.qs = 0; p.qrw = '';\n}\nfunction offerCards")
rep("qs: p.qs | 0, qok: p.qok | 0,","qs: p.qs | 0, qok: p.qok | 0, qrw: p.qrw || '', qst: p.qstk | 0,")
rep("p.qs === 1 ? '⭕ 정답! 보너스 카드가 생겼어요!' : '❌ 아쉬워요!'}","p.qs === 1 ? '⭕ 정답! 보너스 카드가 생겼어요!' + (p.qrw ? ' 🎁 ' + esc(p.qrw) : '') : '❌ 아쉬워요! (연속 정답이 끊겼어요)'}")
rep("레벨 업! 문제를 맞히면 보너스 카드 1장 · ${esc(p.qz.tag)}</em>","레벨 업! 맞히면 보너스 카드 1장 + 보상${p.qst ? ' · 🔥' + p.qst + '연속' : ''} · ${esc(p.qz.tag)}</em>")

# ---- A7 일기토 장수별 스타일
style = r"""
// ===== 적장 스타일: 일기토 패턴 (장수의 실제 전투 방식이 아니라 게임용 설정이에요) =====
const STY = {
  charge: { n: '돌격형', h: '빠르게 달려들어요! 붉은 돌진선에서 비켜요', w: { dash: 4, ring: 1, fan: 1, slam: 1 }, rw: 'food', rt: '군량 +80' },
  barrage: { n: '포격형', h: '탄이 부채꼴로 날아와요! 사이로 피해요', w: { dash: 1, ring: 1, fan: 4, slam: 1 }, rw: 'volun', rt: '병사 3명 합류' },
  smash: { n: '파쇄형', h: '붉은 원이 연달아 내리쳐요! 원 밖으로 나가요', w: { dash: 1, ring: 1, fan: 1, slam: 4 }, rw: 'atk', rt: '30초간 모두 공격력 +40%' },
  ward: { n: '결계형', h: '몸 주변이 크게 터져요! 멀리 떨어져요', w: { dash: 1, ring: 4, fan: 1, slam: 1 }, rw: 'camp', rt: '영웅 체력 +35%' },
  lord: { n: '지휘형', h: '여러 공격을 섞어 써요! 침착하게 피해요', w: { dash: 2, ring: 2, fan: 2, slam: 2 }, rw: 'camp', rt: '영웅 체력 +35%' }
};
const STYOF = { '고니시 유키나가': 'charge', '시마즈 요시히로': 'charge', '아민': 'charge', '도도 다카토라': 'barrage', '와키자카 야스하루': 'barrage', '구루시마 미치후사': 'barrage', '가토 기요마사': 'smash', '용골대': 'smash', '안코쿠지 에케이': 'ward', '호소카와 다다오키': 'ward', '마푸타': 'ward', '우키타 히데이에': 'lord', '구로다 나가마사': 'lord', '홍타이지': 'lord' };
const styOf = (b) => STY[STYOF[bnm(b)] || 'lord'], styK = (b) => STYOF[bnm(b)] || 'lord';
"""
rep("function beginDuel(e) {", style.strip("\n") + "\nfunction beginDuel(e) {")
rep("tx: '원 안에서 붉은 표시를 피하며 공격하세요 (함성 버튼 = 구르기)' };","tx: styOf(e).n + ' — ' + styOf(e).h + ' (스킬 버튼 = 구르기)' };")
# 패턴 선택: 가중치 + 특기
rep("const P = ['ring', 'dash', 'fan', 'slam'].filter((x) => x !== D.last), k = P[rint(P.length)]; D.last = k;","const SW = styOf(b).w, P = ['ring', 'dash', 'fan', 'slam'].filter((x) => x !== D.last); let tw = 0; for (const x of P) tw += SW[x]; let rr0 = Math.random() * tw, k = P[0]; for (const x of P) { rr0 -= SW[x]; if (rr0 <= 0) { k = x; break; } } D.last = k;\n      if (enr && D.tl.length < 6 && Math.random() < 0.4) { const sk = styK(b), ex = (o) => D.tl.push(o), cl = (v, lo, hi) => Math.max(lo, Math.min(hi, v)); if (sk === 'charge') ex({ k: 'fan', x: b.x, y: b.y, a: Math.atan2(near.y - b.y, near.x - b.x), t: 1.6, t0: 1.6 }); else if (sk === 'barrage') { const a0 = Math.atan2(near.y - b.y, near.x - b.x); for (const o of [-0.6, 0.6]) ex({ k: 'fan', x: b.x, y: b.y, a: a0 + o, t: 1.0 + (o > 0 ? 0.25 : 0), t0: 1.25 }); } else if (sk === 'smash') { for (let i = 0; i < 3; i++) { const h = hs[rint(hs.length)]; ex({ k: 'slam', x: cl(h.x + rnd(-90, 90), D.cx - D.R + 30, D.cx + D.R - 30), y: cl(h.y + rnd(-90, 90), D.cy - D.R + 30, D.cy + D.R - 30), r: 72, t: 1.5 + i * 0.3, t0: 1.5 + i * 0.3 }); } } else if (sk === 'ward') ex({ k: 'ring', x: near.x, y: near.y, r: 110, t: 1.6, t0: 1.6 }); else { ex({ k: 'ring', x: b.x, y: b.y, r: 140, t: 1.1, t0: 1.1 }); for (let i = 0; i < 2; i++) { const h = hs[rint(hs.length)]; ex({ k: 'slam', x: h.x, y: h.y, r: 72, t: 1.6 + i * 0.3, t0: 1.6 + i * 0.3 }); } } }")
# 승리 보상
rep("G.food += 60; gainXp(8 + G.sc * 0.4);","G.food += 60; gainXp(8 + G.sc * 0.4); { const ST = styOf(b); applyEvent(ST.rw); G.stRw = ST.n + ' 보상: ' + ST.rt; }")
rep("s.du = g.du ? { cx:","s.du = g.du ? { sn: styOf(g.du.b).n, cx:")
open(f,'w').write(s)
