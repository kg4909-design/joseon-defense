g='src/game.js'; s=open(g).read()
def rep(a,b,cnt=1):
    global s
    assert s.count(a)==cnt,(s.count(a),a[:70]); s=s.replace(a,b)
rep("G.rd = i; G.paused = false;","G.rd = i; G.sc = i + (G.cyc || 0) * R.length; G.paused = false;")
rep("const hs = (1 + 0.09 * i) * (rd.df","const hs = (1 + 0.09 * G.sc) * (rd.df")
rep("0.015 + 0.004 * G.rd +","0.015 + 0.004 * G.sc +")
rep("const hs = (1 + 0.09 * G.rd) *","const hs = (1 + 0.09 * G.sc) *")
rep("0.9 * prog + 0.018 * G.rd)","0.9 * prog + 0.018 * G.sc)")
rep("const n = 14 + Math.floor(G.rd / 2) * 2","const n = 14 + Math.floor(G.sc / 2) * 2")
rep("dmgEnemy(e, 70 + 8 * G.rd)","dmgEnemy(e, 70 + 8 * G.sc)")
rep("function enemyDeath(e) {","function enemyDeath(e) {\n  if (G.es) G.es.k++;")
rep("G.food += ok * 15; }","G.food += ok * 15; if (G.es) G.es.q += ok; }")
rep("p.qs = 1; p.qok = (p.qok || 0) + 1;","p.qs = 1; p.qok = (p.qok || 0) + 1; if (G.es) G.es.q++;")
# endRound
rep("  saveGame('auto', win ? G.rd + 1 : G.rd);\n}","""  if (G.es) { G.es.tot += win ? G.dur : G.t; if (!win) { G.es.over = true; G.ph = 'end'; } }
  else saveGame('auto', win ? G.rd + 1 : G.rd);
}""")
rep("  if (G.rd + 1 >= R.length) { G.ph = 'end'; return; } startRound(G.rd + 1);","""  if (G.rd + 1 >= R.length) { if (!G.endless) { G.ph = 'end'; return; } G.cyc = (G.cyc || 0) + 1; startRound(0); return; } startRound(G.rd + 1);""")
rep("G.wallN = v.wall | 0; for (const id of G.order) G.pl[id].cards = {}; startRound(v.start); }","G.wallN = v.wall | 0; G.endless = !!v.endless; G.cyc = 0; G.es = G.endless ? { tot: 0, k: 0, q: 0, from: v.start, over: false } : null; for (const id of G.order) G.pl[id].cards = {}; startRound(v.start); }\n  else if (c === 'endless' && G.ph === 'end' && !G.endless) { G.endless = true; G.cyc = 1; G.bonus = 0; G.es = { tot: 0, k: 0, q: 0, from: 0, over: false }; G.ph = 'brief'; startRound(0); }")
rep("s.paused = ","s.endless = !!g.endless; s.es = g.es ? { tot: Math.round(g.es.tot + (g.ph === 'battle' ? g.t : 0)), k: g.es.k, q: g.es.q, over: !!g.es.over } : null; s.cyc = g.cyc | 0; s.paused = ")
# client: endless HUD / brief label / end screen
rep("  $('bkChap').textContent = `${ch.n} (${ch.y}) · ${idx}/${tot}라운드`;","  $('bkChap').textContent = V.endless ? `♾ 무한 모드 · ${V.cyc * R.length + V.rd + 1}번째 라운드 (난이도 계속 상승)` : `${ch.n} (${ch.y}) · ${idx}/${tot}라운드`;")
a=s.index("function buildEnd() {"); b=s.index("\n}\n",a)+3
s=s[:a]+r"""function rankLoad() { try { return JSON.parse(localStorage.getItem('jd_rank') || '[]'); } catch (e) { return []; } }
function fmtT(t) { return String(Math.floor(t / 60)).padStart(2, '0') + ':' + String(t % 60).padStart(2, '0'); }
function buildEnd() {
  show('sEnd'); const hostOnly = (id, on) => { $(id).style.display = on && Net.host ? 'inline-block' : 'none'; };
  if (V.endless && V.es && V.es.over) {
    const e = V.es, score = e.tot + e.k + e.q * 30, nm = (V.pl.find((x) => x.id === Net.id) || {}).name || '학생';
    let rk = rankLoad(); rk.push({ n: nm, s: score, t: e.tot, k: e.k, q: e.q, r: V.cyc * R.length + V.rd + 1, d: Date.now() }); rk.sort((a, b) => b.s - a.s); rk = rk.slice(0, 30); try { localStorage.setItem('jd_rank', JSON.stringify(rk)); } catch (x) {}
    const pos = rk.findIndex((x) => x.s === score && x.t === e.tot && x.k === e.k) + 1;
    $('endH').textContent = '♾ 무한 모드 종료!';
    $('endText').innerHTML = `<p><b>${V.cyc * R.length + V.rd + 1}번째 라운드</b>까지 버텼어요!</p><p>⏱ 버틴 시간 <b>${fmtT(e.tot)}</b> · ⚔ 처치 <b>${e.k}</b>마리 · 🧠 퀴즈 정답 <b>${e.q}</b>개</p><p>점수 = 버틴 초 + 처치 수 + 퀴즈 정답×30 → <b>${score}점</b>${pos ? ` (내 기기 기록 ${pos}위)` : ''}</p><small>랭킹은 이 기기에만 저장돼요. 시작 화면의 🏆 랭킹에서 볼 수 있어요.</small>`;
    hostOnly('btnEndless', false); return;
  }
  try { localStorage.setItem('jd_hid', '1'); } catch (e) {} refreshHid();
  $('endH').textContent = '끝까지 지켜 냈어요! 🎉';
  $('endText').innerHTML = CH.map((c) => `<p><b>${c.n}</b> — ${esc(c.sum)} <small>(${c.pg})</small></p>`).join('') + '<p><b>⭐ 히든 영웅 이순신 해금!</b> 방에서 역할을 고를 때 이순신을 고를 수 있어요. 거북선의 포로 싸워요.</p><p><b>이제 무한 모드로 돌입합니다!</b> 30라운드가 끝없이 이어지고 적이 계속 강해져요. 버틴 시간·처치 수·퀴즈 정답으로 랭킹을 겨뤄 보세요.</p>';
  hostOnly('btnEndless', true);
}
"""+s[b:]
rep("$('btnNext').onclick = () => hostCtl('next');","$('btnEndless').onclick = () => hostCtl('endless'); $('btnNext').onclick = () => hostCtl('next');")
rep("$('btnStart').onclick = () => { draftSel = { start: +$('selStart').value, dur: +$('selDur').value, diff: diffSel }; hostCtl('start', draftSel); };","$('btnStart').onclick = () => { draftSel = { start: +$('selStart').value, dur: +$('selDur').value, diff: diffSel }; hostCtl('start', draftSel); };\n  $('btnStartE').onclick = () => { draftSel = { start: +$('selStart').value, dur: +$('selDur').value, diff: diffSel, endless: true }; hostCtl('start', draftSel); };")
open(g,'w').write(s)
t='src/template.html'; h=open(t).read()
def r2(a,b):
    global h
    assert h.count(a)==1,(h.count(a),a[:60]); h=h.replace(a,b)
r2('      <button id="btnStart">게임 시작</button></div>','      <button id="btnStart">게임 시작</button> <button id="btnStartE" class="sec">♾ 무한 모드로 시작</button></div>')
r2('<div class="screen" id="sEnd"><h2>끝까지 지켜 냈어요! 🎉</h2><div class="panel" id="endText" style="font-size:16px;white-space:normal"></div><button onclick="location.reload()">처음으로</button></div>','<div class="screen" id="sEnd"><h2 id="endH">끝까지 지켜 냈어요! 🎉</h2><div class="panel" id="endText" style="font-size:16px;white-space:normal"></div><button id="btnEndless" style="display:none">♾ 무한 모드 시작!</button> <button onclick="location.reload()">처음으로</button></div>')
open(t,'w').write(h)
