g=open('src/game.js').read()
def rep(o,n,c=1):
    global g
    assert g.count(o)==c,(o[:60],g.count(o)); g=g.replace(o,n)
# --- SMD rep
rep("  fast: ['⚡ 빠른 처치 경쟁'","  rep: ['🏰 성벽 수리 작전', '성이 위험해요! 영웅이 성 가까이에서 8초 동안 버티며 수리하세요! 성공하면 성 체력 30% 회복'],\n  fast: ['⚡ 빠른 처치 경쟁'")
rep("  if (k === 'fast') { waveAround(12, 640); return '적이 더 몰려와요!'; }","  if (k === 'fast') { waveAround(12, 640); return '적이 더 몰려와요!'; }\n  if (k === 'rep') { G.baseHp = Math.max(1, G.baseHp - G.baseMax * 0.1); waveAround(8, 560); return '성 체력 -10% · 적이 습격해요'; }")
rep("(k !== 'twin' || (np >= 2 && !G.cmS)) &&","(k !== 'twin' || (np >= 2 && !G.cmS)) && (k !== 'rep' || (G.castle && G.baseHp < G.baseMax * 0.8)) &&")
rep("const k = ks[rint(ks.length)], a = rnd(0, 6.283), P =","const k = (G.castle && G.baseHp < G.baseMax * 0.55 && S.last !== 'rep') ? 'rep' : ks[rint(ks.length)], a = rnd(0, 6.283), P =")
rep("  else if (k === 'rush') { m.t = 30; m.rt = 1; m.b = 30; }","  else if (k === 'rush') { m.t = 30; m.rt = 1; m.b = 30; }\n  else if (k === 'rep') { m.t = 30; m.b = 8; m.a = 0; m.sec = 0; }")
rep("  if (m.k === 'herb') return m.h.map","  if (m.k === 'rep') return [[r(G.ax), r(G.ay), '🏰']];\n  if (m.k === 'herb') return m.h.map")
rep("  else if (m.k === 'fast') { m.a = Math.min(m.need,","  else if (m.k === 'rep') { if (hs2.some((h) => Math.hypot(h.x - G.ax, h.y - G.ay) < 170)) m.sec += dt; m.a = Math.min(8, Math.floor(m.sec)); if (m.sec >= 8) { G.baseHp = Math.min(G.baseMax, G.baseHp + G.baseMax * 0.3); return smEnd(S, true, '성 체력 30% 회복!'); } }\n  else if (m.k === 'fast') { m.a = Math.min(m.need,")
# morale
rep("else { S.no++; S.stk = 0; msg = msg + ' · ' + smPenalty(m.k); }","else { S.no++; S.stk = 0; S.fl = (S.fl | 0) + 1; msg = msg + ' · ' + smPenalty(m.k); if (S.fl >= 2) { G.moraleT = G.t + 25; msg += ' · 😞 사기 하락! 25초 동안 공격력 -15% (미션 성공하면 회복)'; } }")
rep("if (ok) { S.ok++; msg += smStreak(S); }","if (ok) { S.ok++; S.fl = 0; if (G.t < (G.moraleT || 0)) { G.moraleT = 0; msg += ' · 😊 사기 회복!'; } msg += smStreak(S); }")
rep("(G.buffAtk > 0 ? 1.4 : 1) * (1 + 0.12 * n('spirit')","(G.buffAtk > 0 ? 1.4 : 1) * (G.t < (G.moraleT || 0) ? 0.85 : 1) * (1 + 0.12 * n('spirit')")
# weather hooks
rep("const v = e.sp * dt * (G.mod === 'haste' ? 1.08 : 1)","const v = e.sp * dt * (G.wxEm || 1) * (G.mod === 'haste' ? 1.08 : 1)")
rep("p.mvx * S.sp * spm * dt","p.mvx * S.sp * spm * (G.wxHm || 1) * dt")
rep("p.mvy * S.sp * dt","p.mvy * S.sp * (G.wxHm || 1) * dt",2)
rep("(G.t < (G.spFast || 0) ? 1.4 : 1);","(G.t < (G.spFast || 0) ? 1.4 : 1) * (G.wxSp || 1);")
# armor
rep("function dmgEnemy(e, d) { if (CRIT","function dmgEnemy(e, d) { if (e.arm && !(G.t < (G.skUntil || 0))) d *= 0.15; if (CRIT")
rep("function castSkill(p) {\n","function castSkill(p) {\n  G.skUntil = G.t + 6;\n")
# reset
rep("G.info = null; G.sm = null; G.spSlow = 0;","G.wx = null; G.wxEm = 1; G.wxHm = 1; G.wxSp = 1; G.wxNext = 60; G.moraleT = 0; G.skUntil = 0; G.hdT = 45; G.hd2 = null; G.info = null; G.sm = null; G.spSlow = 0;")
# evStep
rep("function applyShared(q, id) {","""const WXD = { rain: ['🌧 비가 내려요!', '영웅 이동 -15% · 적은 25% 느려져요. 25초 뒤 그쳐요'], fog: ['🌫 안개가 짙어요!', '시야가 흐려지고 적이 25% 더 많이 몰려와요 (25초)'], night: ['🌙 밤이 되었어요!', '어두워지고 적이 10% 빨라져요 (25초)'] };
function wxSet(k) { G.wx = { k, end: G.t + 25 }; G.wxEm = k === 'rain' ? 0.75 : k === 'night' ? 1.1 : 1; G.wxHm = k === 'rain' ? 0.85 : 1; G.wxSp = k === 'fog' ? 1.25 : 1; smInfo(WXD[k][0], WXD[k][1]); }
function wxEnd() { G.wx = null; G.wxEm = 1; G.wxHm = 1; G.wxSp = 1; G.wxNext = G.t + rnd(70, 100); smInfo('☀ 날씨가 개었어요', '다시 맑아졌어요'); }
function evStep(dt, hs2, hs) {
  if (G.endless || G.du || G.ev || !hs2.length || G.order.some((id) => G.pl[id].offer)) return;
  if (G.wx) { if (G.t >= G.wx.end) wxEnd(); } else if (G.t >= G.wxNext && G.t < G.dur - 30 && !(G.sm && G.sm.cur && G.t - G.sm.cur.t0 < 4)) wxSet(['rain', 'fog', 'night'][rint(3)]);
  if (G.dif !== DIFF.hard) return;
  const np = hs2.length, ctr = G.castle ? [G.ax, G.ay] : [hs2.reduce((a, h) => a + h.x, 0) / np, hs2.reduce((a, h) => a + h.y, 0) / np];
  for (const e of G.en) if (e.hb != null && e.hp > 0) { e.hb -= dt; if (e.hb <= 0) { e.hb = 4; G.fx.push([e.x, e.y, 150, 'boom']); for (const h of hs2) if (Math.hypot(h.x - e.x, h.y - e.y) < 150) h.hp = Math.max(1, h.hp - h.mx * 0.12); } }
  if (G.hd2) { G.hd2.t -= dt; if (G.hd2.t <= 0) { const a = G.hd2.a; G.hd2 = null; for (let s = 0; s < 2; s++) for (let i = 0; i < 8 + 2 * np; i++) { const aa = a + s * Math.PI + rnd(-0.3, 0.3); spawn(i % 5 === 0 ? 'cav' : 'grunt', hs, clampW(ctr[0] + Math.cos(aa) * 560, ctr[1] + Math.sin(aa) * 400)); } } return; }
  G.hdT -= dt; if (G.hdT > 0 || G.t >= G.dur - 25) return; G.hdT = rnd(50, 65); const k = rint(3);
  if (k === 0) { const a = rnd(0, 6.283), e = spawn('tank', hs, clampW(ctr[0] + Math.cos(a) * 600, ctr[1] + Math.sin(a) * 420)); e.hp = e.mx = e.mx * (4 + np); e.hb = 4; for (let i = 0; i < 8; i++) spawn('grunt', hs, clampW(e.x + rnd(-90, 90), e.y + rnd(-90, 90))); smInfo('⚠ 적 장수가 난입했어요!', '큰 적이 4초마다 땅을 내리쳐 주변 영웅이 다쳐요. 멀리서 쓰러뜨리세요!'); }
  else if (k === 1) { G.hd2 = { t: 3, a: rnd(0, 6.283) }; smInfo('⚠ 양쪽에서 습격이 와요! (3초 뒤)', '둘로 갈라진 적이 양옆에서 몰려와요. 가운데로 모여요!'); }
  else { const h = hs2[rint(np)], a = rnd(0, 6.283); for (let i = 0; i < 10 + 2 * np; i++) { const e = spawn(i % 4 === 0 ? 'cav' : 'grunt', hs, clampW(h.x + Math.cos(a + rnd(-0.6, 0.6)) * 560, h.y + Math.sin(a + rnd(-0.6, 0.6)) * 400)); e.arm = 1; } smInfo('🛡 갑옷 입은 적이 몰려와요!', '평범한 공격은 거의 안 통해요! 영웅 스킬을 쓰면 6초 동안 갑옷이 깨져요'); }
}
function applyShared(q, id) {""")
rep("  subStep(dt, hs2, hs);\n","  subStep(dt, hs2, hs); evStep(dt, hs2, hs);\n")
# snapshot
rep("s.qzr = g.qzr;","s.wx = g.wx ? g.wx.k : ''; s.mor = g.t < (g.moraleT || 0) ? Math.ceil(g.moraleT - g.t) : 0; s.qzr = g.qzr;")
# client overlay
rep("  { const st = $('smTag'), m = V.sm;","  { const ov = $('wxOv'), wt = $('wxTag'); if (ov) { ov.className = V.ph === 'battle' && V.wx ? 'on ' + V.wx : ''; } if (wt) { const tx = V.ph === 'battle' ? [V.wx ? ({ rain: '🌧 비', fog: '🌫 안개', night: '🌙 밤' }[V.wx]) : '', V.mor ? '😞 사기 하락 ' + V.mor + '초' : ''].filter(Boolean).join(' · ') : ''; wt.textContent = tx; wt.style.display = tx ? 'block' : 'none'; } }\n  { const st = $('smTag'), m = V.sm;")
open('src/game.js','w').write(g)
t=open('src/template.html').read()
o='<div id="smTag" style="display:none"></div>'
assert t.count(o)==1
t=t.replace(o,o+'<div id="wxTag" style="display:none"></div>')
o2='<div class="screen" id="sBattle">'
t=t.replace(o2,o2+'<div id="wxOv"></div>',1)
t=t.replace('#smTag,#raidTag,','#wxTag,#smTag,#raidTag,',1)
t=t.replace('</style>\n','#wxOv{position:absolute;inset:0;pointer-events:none;z-index:3;opacity:0;transition:opacity 1.2s}#wxOv.on{opacity:1}\n#wxOv.rain{background:linear-gradient(rgba(40,60,90,.28),rgba(40,60,90,.28)),repeating-linear-gradient(105deg,rgba(220,235,255,.0) 0 12px,rgba(220,235,255,.35) 12px 13px);animation:rainm .35s linear infinite}\n@keyframes rainm{to{background-position:0 0,-30px 60px}}\n#wxOv.fog{background:radial-gradient(ellipse at 50% 50%,rgba(235,240,245,.15),rgba(235,240,245,.62))}\n#wxOv.night{background:radial-gradient(ellipse at 50% 50%,rgba(10,14,40,.2),rgba(8,10,34,.7))}\n</style>\n',1) if False else t
open('src/template.html','w').write(t)
