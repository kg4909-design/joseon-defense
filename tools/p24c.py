f='src/game.js'; s=open(f).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(a[:60],s.count(a)); s=s.replace(a,b)
rep("G.waveT = 22; G.gi = 0;","G.waveT = G.endless ? 22 : 40; G.firstRaid = !G.endless; G.ambN = 0; G.bm = [false, false]; G.bInv = 0; G.bInvHp = 0; G.repCd = 0; G.gi = 0;")
rep("G.info = null; G.ambT = 8;","G.info = null; G.ambT = G.endless ? 8 : 26;")
rep("G.xp = 0; G.need = 8; G.crates = [];","G.xp = 0; G.need = 5; G.lvC = 0; G.crates = ob === 'e' ? [{ x: 760, y: roadY(760, ww, wh), k: 'gmc' }] : [];")
rep("G.need = Math.round(G.need * 1.28 + 3);","G.need = (G.lvC = (G.lvC || 0) + 1) === 1 ? 8 : Math.round(G.need * 1.28 + 3);")
rep("G.spawnT -= dt * rate * 1.6 * (1 + 1.5 * prog)","const ramp = G.endless ? 1 : G.t < 30 ? 0.25 : G.t < 60 ? 0.25 + 0.75 * (G.t - 30) / 30 : 1;\n  G.spawnT -= dt * ramp * rate * 1.6 * (1 + 1.5 * prog)")
rep("G.waveT = 14; const q = spawnPos(); if (q) { const n = 14 + Math.floor(G.sc / 2) * 2 + Math.round(prog * 12);",
    "G.waveT = G.endless || G.t >= 90 ? 14 : 20; const q = spawnPos(); if (q) { const n = Math.round((14 + Math.floor(G.sc / 2) * 2 + Math.round(prog * 12)) * (G.firstRaid ? 0.6 : 1)); G.firstRaid = false;")
rep("n = 4 + Math.round(prog * 5);","n = 4 + Math.round(prog * 5) - ((G.ambN = (G.ambN || 0) + 1) === 1 ? 2 : 0);")
# base milestone + repair cooldown
rep("  if (G.castle) { if (G.baseHp < (G.bhPrev || 0) - 1e-6)",
"""  if (G.castle) { G.repCd = Math.max(0, (G.repCd || 0) - dt);
    if (G.bInv > 0) { G.bInv -= dt; if (G.baseHp < G.bInvHp) G.baseHp = G.bInvHp; G.bhQ = 6; G.bfx = (G.bfx || 0) - dt; if (G.bfx <= 0) { G.bfx = 0.6; G.fx.push([G.ax, G.ay, 90, 'lvl']); } }
    else { const fr = G.baseHp / G.baseMax; for (let k = 1; k >= 0; k--) if (!G.bm[k] && fr <= (k ? 0.33 : 0.66) && G.baseHp > 0) { G.bm[0] = true; G.bm[k] = true; G.bInv = 3; G.bInvHp = G.baseHp; const M = [['🛡 의병이 성을 지키기 위해 고군분투합니다!', '잠시 동안 성이 안전해요. 그 틈에 전열을 정비하세요!'], ['🛡 성벽 위로 의병들이 몰려들었어요!', '백성들이 힘을 모아 3초간 성을 지켜요'], ['🛡 승병과 백성이 성문을 막아 냅니다!', '잠깐 숨을 돌릴 수 있어요. 성 수리 버튼도 눌러 보세요']][rint(3)]; G.info = { id: Date.now() + Math.random(), tt: (k ? '⚠️ 성이 위태로워요! ' : '') + M[0], tx: M[1] }; G.fx.push([G.ax, G.ay, 100, 'lvl']); break; } } }
  if (G.castle) { if (G.baseHp < (G.bhPrev || 0) - 1e-6)""")
rep("  else if (m.k === 'mer' &&","  else if (m.k === 'rep' && G.ph === 'battle' && G.castle && !G.paused && G.food >= 60 && G.baseHp > 0 && G.baseHp < G.baseMax && (G.repCd || 0) <= 0) { G.food -= 60; G.baseHp = Math.min(G.baseMax, G.baseHp + G.baseMax * 0.2); G.repCd = 5; G.fx.push([G.ax, G.ay, 80, 'sum']); }\n  else if (m.k === 'mer' &&")
rep("s.mod = g.mod || null;","s.mod = g.mod || null; s.bi = g.bInv > 0 ? 1 : 0; s.rcd = Math.ceil(g.repCd || 0); s.wv = g.obj === 'e' ? g.ambT : g.waveT;")
# client
rep("$('btnUp').onpointerdown = () => sendHost({ k: 'upg' });","$('btnUp').onpointerdown = () => sendHost({ k: 'upg' }); $('btnRep').onpointerdown = () => sendHost({ k: 'rep' });")
rep("$('btnSummon').innerHTML = `소집<br>","{ const br = $('btnRep'); br.style.display = V.castle ? 'flex' : 'none'; br.innerHTML = '성 수리<br><small>' + (V.rcd > 0 ? V.rcd + '초' : '🌾60') + '</small>'; br.classList.toggle('dis', V.food < 60 || V.bh >= V.bm || V.rcd > 0); const rt = $('raidTag'); let tx = ''; if (V.bi) tx = '🛡 성이 잠시 안전해요!'; else if (V.ph === 'battle' && V.wv > 0 && !V.endless) { const n = Math.ceil(V.wv); tx = V.obj === 'e' ? `⚠️ 매복까지 ${n}초` : V.t < 30 ? `🌱 준비 시간 · 대규모 습격까지 ${n}초` : `⚔️ 대규모 습격까지 ${n}초`; } rt.textContent = tx; rt.style.display = tx ? 'block' : 'none'; }\n  $('btnSummon').innerHTML = `소집<br>")
open(f,'w').write(s)
t='src/template.html'; h=open(t).read()
a='<button id="btnUp"></button>'; assert h.count(a)==1
h=h.replace(a,a+'<button id="btnRep" style="display:none"></button><div id="raidTag" style="display:none"></div>')
a='#btnUp small{font-size:12px}'; assert h.count(a)==1
h=h.replace(a,"#btnRep{position:absolute;right:108px;bottom:112px;width:76px;height:76px;border-radius:50%;background:#f3c969;border:3px solid var(--line);box-shadow:0 5px 0 var(--line);color:var(--txt);font-size:15px;line-height:1.15;padding:0;margin:0;flex-direction:column;align-items:center;justify-content:center}#btnRep small{font-size:12px}#btnRep.dis{filter:grayscale(.7);opacity:.7}#sBattle.lefty #btnRep{right:auto;left:108px}#raidTag{position:absolute;left:50%;top:60px;transform:translateX(-50%);padding:5px 14px;border-radius:16px;background:rgba(40,30,20,.78);color:#fff;font-size:15px;font-weight:800;pointer-events:none;white-space:nowrap;z-index:5}\n"+a)
h=h.replace(".noarmy #btnSummon,.noarmy #btnSkill,.noarmy #btnUp,",".noarmy #btnSummon,.noarmy #btnSkill,.noarmy #btnUp,.noarmy #btnRep,")
open(t,'w').write(h)
