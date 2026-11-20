f='src/game.js'; s=open(f).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:80]); s=s.replace(a,b)
coop = r"""
// ===== 협동 인원 보정: 적 '수'는 조금만 늘리고(렉 방지), 대신 단단하고 정예·적장이 더 나와요 =====
// [적 수 배율, 적 체력 배율, 적 공격 배율, 정예 확률 가산, 추가 적장 수]  (1명·2명·3명·4명)
const COOP = [{ c: 1, h: 1, dm: 1, el: 0, gen: 0 }, { c: 1.25, h: 1.35, dm: 1.1, el: 0.06, gen: 0 }, { c: 1.45, h: 1.7, dm: 1.2, el: 0.12, gen: 1 }, { c: 1.6, h: 2.05, dm: 1.3, el: 0.18, gen: 2 }];
const coopOf = () => COOP[Math.min(4, Math.max(1, G.order.length)) - 1];
const enCap = () => (Net.mode === 'online' ? Math.min(220, isLow() ? 130 : 260) : (isLow() ? 130 : 260));
"""
rep("(isLow() ? 130 : 260)","enCap()",3)
rep("const startCards = (role)", coop.strip("\n") + "\nconst startCards = (role)")
rep("G.dmx = i < 6 && !G.endless ? 0.85 : 1;","G.co = coopOf(); G.dmx = (i < 6 && !G.endless ? 0.85 : 1) * G.co.dm;")
rep("G.dmx = 1 + 0.03 * r; G.er = r;","G.co = coopOf(); G.dmx = (1 + 0.03 * r) * G.co.dm; G.er = r;")
rep("sc = hs * (type === 'boss' ? (1 + 0.5 * (np - 1)) : 1);","CO = G.co || COOP[0], sc = hs * (type === 'boss' ? (1 + 0.7 * (np - 1)) : CO.h);")
rep("Math.random() < Math.min(G.dif === DIFF.hard ? 0.42","Math.random() < (G.co ? G.co.el : 0) + Math.min(G.dif === DIFF.hard ? 0.42")
rep("* (1 + 0.5 * (np - 1)) * (rd.df ? 1.12 : 1)","* (G.co || COOP[0]).c * (rd.df ? 1.12 : 1)")
rep("const n = Math.round((14 + Math.floor(G.sc / 2) * 2 + Math.round(prog * 12)) * (G.endless ? 1 : Math.min(1, 0.45 + G.t / 180)));","const n = Math.round((14 + Math.floor(G.sc / 2) * 2 + Math.round(prog * 12)) * (G.endless ? 1 : Math.min(1, 0.45 + G.t / 180)) * (G.co || COOP[0]).c);")
# 추가 적장
rep("G.bossTimes = (ob === 'd' || ob === 's') ? (P >= 170 ? [120, 240].filter((x) => x < P - 15) : [Math.max(P * 0.5, P - 60)]) : [];","G.bossTimes = (ob === 'd' || ob === 's') ? (P >= 170 ? [120, 240].filter((x) => x < P - 15) : [Math.max(P * 0.5, P - 60)]) : []; if ((ob === 'd' || ob === 's') && coopOf().gen) { const ex = coopOf().gen, at = [Math.max(35, P * 0.3), Math.max(60, P * 0.68)]; for (let q = 0; q < ex; q++) G.bossTimes.push(at[q]); G.bossTimes.sort((a, b) => a - b); }")
# 방 화면 안내
rep("$('plist').innerHTML = V.pl.map(","{ const n = V.pl.length, CO = COOP[Math.min(4, n) - 1]; $('coopInfo').innerHTML = n > 1 ? `👥 <b>${n}명 협동</b> · 적이 더 단단해지고(체력 ×${CO.h}) 정예${CO.gen ? '와 적장' : ''}이 더 자주 나와요` : '🙋 혼자 하기 · 사람이 늘수록 적이 더 단단해지고 정예·적장이 늘어요'; } $('plist').innerHTML = V.pl.map(")
# 링크 복사 + ?room= 자동 입력
rep("$('relayUrl').value = localStorage.getItem('hdg_relay') || DEFAULT_RELAY;","$('relayUrl').value = localStorage.getItem('hdg_relay') || DEFAULT_RELAY; { const rc = (Q.get('room') || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6); if (rc) $('roomCode').value = rc; if (Q.get('relay')) { $('relayUrl').value = Q.get('relay'); } }")
rep("$('roomLabel').textContent = Net.mode === 'online' ? '방 코드  ' + Net.room : '혼자 하기';","$('roomLabel').textContent = Net.mode === 'online' ? '방 코드  ' + Net.room : '혼자 하기'; $('btnCopy').style.display = Net.mode === 'online' && Net.host ? 'inline-block' : 'none'; $('btnCopy').onclick = () => { const u = new URL(location.href.split('#')[0]); u.search = ''; u.searchParams.set('room', Net.room); if ($('relayUrl').value && $('relayUrl').value !== DEFAULT_RELAY) u.searchParams.set('relay', $('relayUrl').value.trim()); const t = u.toString(); const ok = () => { $('btnCopy').textContent = '✅ 복사했어요!'; setTimeout(() => ($('btnCopy').textContent = '🔗 초대 링크 복사'), 1800); }; try { navigator.clipboard.writeText(t).then(ok, () => prompt('이 주소를 복사해 친구에게 보내세요', t)); } catch (e) { prompt('이 주소를 복사해 친구에게 보내세요', t); } };")
open(f,'w').write(s)
t=open('src/template.html').read()
a='<h2 id="roomLabel"></h2>'
assert t.count(a)==1
t=t.replace(a,'<h2 id="roomLabel"></h2><div class="row" style="margin:-4px 0 8px"><button id="btnCopy" class="sec" style="display:none">🔗 초대 링크 복사</button></div><div id="coopInfo" style="margin-bottom:10px;font-size:16px"></div>')
open('src/template.html','w').write(t)
