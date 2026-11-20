import re
g='src/game.js';t=open(g).read()
def rep(a,b,n=1):
    global t
    assert t.count(a)==n,(a[:70],t.count(a)); t=t.replace(a,b)
# A) Net
rep("let ok = false; Net.ws = ws;","let ok = false; Net.ws = ws; Net.gotClosed = false;")
rep("else if (m.sys === 'closed') Net.onClosed();","else if (m.sys === 'closed') { Net.gotClosed = true; Net.onClosed(); }")
rep("ws.onclose = () => { if (ok) Net.onClosed(); };","ws.onclose = () => { if (!ok || Net.gotClosed) return; if (Net.host || !Net.onDrop) Net.onClosed(); else Net.onDrop(); };")
rep("onData: () => {}, onJoin: () => {}, onLeave: () => {}, onClosed: () => {},","onData: () => {}, onJoin: () => {}, onLeave: () => {}, onClosed: () => {}, onDrop: null, gotClosed: false,")
# B) token
rep("let me = { name: '', role: 'archer' };","let me = { name: '', role: 'archer' };\nconst TK = (() => { try { let k = sessionStorage.getItem('hdg_tk'); if (!k) { k = Math.random().toString(36).slice(2, 12) + Date.now().toString(36).slice(-4); sessionStorage.setItem('hdg_tk', k); } return k; } catch (e) { return Math.random().toString(36).slice(2, 14); } })();")
rep("function sendProf() { sendHost({ k: 'prof', name: me.name, role: me.role }); }","function sendProf() { sendHost({ k: 'prof', name: me.name, role: me.role, tk: TK }); }")
rep("if (!p) addPlayer(from, m.name, m.role); else { p.name = String(m.name || p.name).slice(0, 8); if (ROLE[m.role]) p.role = m.role; } return; }","if (!p) addPlayer(from, m.name, m.role); else { p.name = String(m.name || p.name).slice(0, 8); if (ROLE[m.role]) p.role = m.role; } { const q = G.pl[from]; if (q && m.tk) q.tk = String(m.tk).slice(0, 24); } return; }")
# C) host handlers
rep("Net.onJoin = () => {}; Net.onLeave = (id) => { if (G.pl[id]) { delete G.pl[id]; G.order = G.order.filter((x) => x !== id); if (G.ev) delete G.ev.votes[id]; } };\n    Net.onData = (from, d) => { if (d.k === 'prof' && !G.pl[from] && G.ph !== 'lobby') return; hostMsg(from, d); };",
"G.pl[Net.id].tk = TK;\n    Net.onJoin = () => {}; Net.onLeave = (id) => { const p = G.pl[id]; if (!p) return; if (G.ph === 'lobby' || G.ph === 'end' || id === G.order[0]) { delete G.pl[id]; G.order = G.order.filter((x) => x !== id); if (G.ev) delete G.ev.votes[id]; } else { p.away = Date.now(); p.mvx = p.mvy = 0; G.info = { id: Date.now() + Math.random(), tt: '📶 ' + p.name + ' 연결이 끊겼어요', tx: '3분 안에 다시 들어오면 이어서 할 수 있어요.' }; } };\n    Net.onData = (from, d) => { if (d.k === 'prof' && !G.pl[from] && G.ph !== 'lobby') { rejoin(from, d); return; } hostMsg(from, d); };")
rep("function sendProf() {","""// 끊겼던 친구가 같은 기기·같은 탭으로 다시 들어오면 영웅을 그대로 돌려줘요
function rejoin(from, d) {
  const tk = String(d.tk || ''); if (!tk) return; const p = G.order.map((id) => G.pl[id]).find((x) => x && x.tk === tk); if (!p || p.id === G.order[0]) return;
  const old = p.id; G.pl[from] = p; delete G.pl[old]; p.id = from; G.order = G.order.map((x) => (x === old ? from : x)); p.away = 0;
  if (G.ev && G.ev.votes[old] != null) { G.ev.votes[from] = G.ev.votes[old]; delete G.ev.votes[old]; } if (G.ans && G.ans[old] != null) { G.ans[from] = G.ans[old]; delete G.ans[old]; }
  G.info = { id: Date.now() + Math.random(), tt: '🔌 ' + p.name + ' 다시 들어왔어요', tx: '이어서 함께 싸워요!' };
}
function sendProf() {""")
# D) away effects
rep("function hurt(p, v) { p.hp -=","function hurt(p, v) { if (p.away) return; p.hp -=")
rep("const allVoted = G.ev && 0;","",0) if False else None
n=t.count("const allVoted = G.order.every((id) => G.ev.votes[id] != null);"); assert n==2,n
t=t.replace("const allVoted = G.order.every((id) => G.ev.votes[id] != null);","const allVoted = G.order.every((id) => G.pl[id].away || G.ev.votes[id] != null);")
rep("else if (m.k === 'pause' && G.ph === 'battle' && (G.order.length === 1 || from === G.order[0])) G.paused = !!m.v;","else if (m.k === 'pause' && G.ph === 'battle' && (G.order.length === 1 || from === G.order[0])) { G.paused = !!m.v; G.pausedAt = G.paused ? Date.now() : 0; }")
rep("function hostTick() { const now = performance.now();","function hostTick() { if (Net.mode === 'online') { const nw = Date.now(); for (const id of [...G.order]) { const p = G.pl[id]; if (p && p.away && nw - p.away > 180000) { delete G.pl[id]; G.order = G.order.filter((x) => x !== id); if (G.ev) delete G.ev.votes[id]; } } if (G.paused && G.pausedAt && G.order.length > 1 && nw - G.pausedAt > 90000) { G.paused = false; G.pausedAt = 0; } }\n  const now = performance.now();")
rep("return { id, name: p.name, role: p.role, x: p.x,","return { id, name: p.name, aw: p.away ? 1 : 0, role: p.role, x: p.x,")
# E) guest reconnect
rep("      let code = ($('roomCode').value || '').trim().toUpperCase();","      let code = ($('roomCode').value || '').trim().toUpperCase(); Net.rurl = url;")
rep("      await Net.connect(url, code, mode === 'create');","      Net.rcode = code; await Net.connect(url, code, mode === 'create');")
rep("} else { Net.onData = (from, d) => { if (d.s) { V = d.s; } }; sendProf(); }","} else { Net.onData = (from, d) => { if (d.s) { V = d.s; lastSnapAt = performance.now(); } }; Net.onDrop = reconnectLoop; sendProf(); }\n  keepAwake(); if (Net.host && Net.mode === 'online') window.addEventListener('beforeunload', (e) => { if (G && G.order.length > 1) { e.preventDefault(); e.returnValue = ''; } });")
rep("let acc = 0, lastT = performance.now();","""// ----- 연결이 끊겼을 때 다시 들어가기 / 화면 꺼짐 방지 / 방장 멈춤 알림 -----
let lastSnapAt = performance.now(), dropT = 0, wl = null, wasHid = false;
function dropBox(on) { let d = document.getElementById('dropBox'); if (!d) { d = document.createElement('div'); d.id = 'dropBox'; document.body.appendChild(d); } d.style.display = on ? 'block' : 'none'; return d; }
function reconnectLoop() {
  if (dropT) return; const box = dropBox(true); let n = 0, busy = false;
  dropT = setInterval(async () => {
    if (busy) return; busy = true; n++; box.textContent = '📶 연결이 끊겼어요. 다시 연결하는 중… (' + n + ')';
    try { await Net.connect(Net.rurl, Net.rcode, false); clearInterval(dropT); dropT = 0; dropBox(false); lastSnapAt = performance.now(); sendProf(); toast('다시 연결됐어요!'); }
    catch (e) { busy = false; if (e === '그런 방이 없어요' || n >= 30) { clearInterval(dropT); dropT = 0; alert('방에 다시 들어가지 못했어요. 처음 화면으로 돌아갑니다.'); location.reload(); } }
  }, 2000);
}
async function keepAwake() { try { if (navigator.wakeLock && !wl && document.visibilityState === 'visible') { wl = await navigator.wakeLock.request('screen'); wl.addEventListener('release', () => { wl = null; }); } } catch (e) { wl = null; } }
document.addEventListener('visibilitychange', () => { if (document.hidden) wasHid = true; else { keepAwake(); if (wasHid && G && Net.host && Net.mode === 'online' && G.order.length > 1) toast('⚠ 방장 화면이 가려지면 친구 화면이 멈춰요. 이 화면을 켜 둬 주세요.'); wasHid = false; } });
setInterval(() => { const lag = Net.mode === 'online' && !Net.host && V && V.ph === 'battle' && !dropT && performance.now() - lastSnapAt > 2500; const t = document.getElementById('lagTag'); if (t) t.style.display = lag ? 'block' : 'none'; }, 500);
function confirmLeave() { return !(Net.host && Net.mode === 'online' && G && G.order.length > 1) || confirm('방장이 나가면 방이 닫히고 모든 친구가 나가게 돼요. 정말 나갈까요?'); }
let acc = 0, lastT = performance.now();""")
rep("$('btnLeave').onclick = () => location.reload();","$('btnLeave').onclick = () => { if (confirmLeave()) location.reload(); };")
rep("$('btnHome').onclick = () => location.reload();","$('btnHome').onclick = () => { if (confirmLeave()) location.reload(); };")
# F) UI: wait tag, vote names, pause auto text
rep("if (V.ev && $('evV')) { const c = [0, 0]; for (const k in V.ev.votes) c[V.ev.votes[k]]++; $('evV').textContent = `투표 ${c[0]} : ${c[1]}  ·  ${Math.ceil(V.ev.left)}초`; }",
"if (V.ev && $('evV')) { const c = [0, 0]; for (const k in V.ev.votes) c[V.ev.votes[k]]++; const wt = V.pl.length > 1 ? V.pl.filter((x) => !x.aw && V.ev.votes[x.id] == null).map((x) => x.name) : []; $('evV').textContent = `투표 ${c[0]} : ${c[1]}  ·  ${Math.ceil(V.ev.left)}초` + (wt.length ? ' · 기다리는 중: ' + wt.join(', ') : ''); }\n  { const wtag = $('waitTag'); if (wtag) { let tx = ''; if (V.pl.length > 1) { const a = V.pl.filter((x) => x.aw).map((x) => x.name), w = V.pl.filter((x) => x.id !== Net.id && x.offer).map((x) => x.name); if (a.length) tx = '📶 연결 끊김: ' + a.join(', ') + ' (다시 들어올 수 있어요)'; else if (w.length) tx = '🃏 카드 고르는 중: ' + w.join(', '); } wtag.textContent = tx; wtag.style.display = tx ? 'block' : 'none'; } $('pAuto').style.display = (V.paused && V.pl.length > 1) ? 'block' : 'none'; }")
open(g,'w').write(t)
p='src/template.html';s=open(p).read()
a='<div id="raidTag" style="display:none"></div><div id="pauseTag"></div></div>'
assert s.count(a)==1
s=s.replace(a,'<div id="raidTag" style="display:none"></div><div id="pauseTag"></div><div id="waitTag" style="display:none"></div><div id="lagTag" style="display:none">📶 방장 화면이 멈춘 것 같아요. 잠시만 기다려 주세요…</div></div>')
a='<div id="pWait" style="display:none">방장이 멈췄어요. 잠시만 기다려요.</div>'
assert s.count(a)==1
s=s.replace(a,'<div id="pWait" style="display:none">방장이 멈췄어요. 잠시만 기다려요. (최대 1분 30초, 지나면 자동으로 다시 시작해요)</div><div id="pAuto" style="display:none;font-size:13px;margin-top:6px;color:#7a6652">친구들이 있을 때는 90초 뒤 자동으로 다시 시작해요.</div>')
s=s.replace("#raidTag,#pauseTag,#toast{","#raidTag,#pauseTag,#toast,#waitTag,#lagTag{")
s=s.replace("#pauseTag{color:#ffe9a0}","#pauseTag,#lagTag{color:#ffe9a0}")
css="\n#dropBox{display:none;position:fixed;left:50%;top:14px;transform:translateX(-50%);z-index:99990;background:rgba(168,50,42,.95);color:#fff;font-weight:800;font-size:16px;padding:8px 18px;border-radius:99px;border:2px solid rgba(255,255,255,.4);box-shadow:0 3px 0 rgba(0,0,0,.3);pointer-events:none}\n"
i=s.rindex('</style>'); s=s[:i]+css+s[i:]
open(p,'w').write(s)
