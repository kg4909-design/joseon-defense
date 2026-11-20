g=open('src/game.js').read()
def rep(o,n,c=1):
    global g
    assert g.count(o)==c,(o[:60],g.count(o)); g=g.replace(o,n)
# 모드 설정
rep("  G.mod = (G.endless || i === 0) ? null : [null, 'rich', 'vol', 'haste'][(i * 7 + 3) % 4];","  G.mod = (G.endless || i === 0) ? null : [null, 'rich', 'vol', 'haste'][(i * 7 + 3) % 4]; if (G.daily && G.dailyMod) G.mod = G.dailyMod;")
rep("if (c === 'start') { G.sel.start = v.start;","if (c === 'start') { G.daily = v.daily ? 1 : 0; G.dailyMod = v.daily ? v.mod : null; G.dailyDone = 0; G.duWins = 0; G.sel.start = v.start;")
rep("G.en = []; G.ev = null;","G.en = []; G.ev = null; if (!G.endless) { G.res.rs = { sm: G.sm ? G.sm.ok | 0 : 0, s3: G.s3 | 0, du: G.duWins | 0, cm: G.cm ? 1 : 0, hd: G.dif === DIFF.hard ? 1 : 0, ch: win ? [9, 19, 24, 29].indexOf(G.rd) : -1 }; if (G.daily && !G.dailyDone) { G.dailyDone = 1; G.res.dl = { sc: (win ? 1000 : 0) + (G.kc | 0) * 4 + (G.sm ? G.sm.ok | 0 : 0) * 200 + (G.castle ? Math.round(Math.max(0, G.baseHp) / G.baseMax * 300) : 0) + (G.qokT | 0) * 30 }; } }")
rep("function endDuel(win) {\n","function endDuel(win) {\n  if (win) G.duWins = (G.duWins | 0) + 1;\n")
rep("G.wx = null; G.wxEm = 1; G.wxHm = 1; G.wxSp = 1; G.wxNext = 60;","G.s3 = 0; G.wx = null; G.wxEm = 1; G.wxHm = 1; G.wxSp = 1; G.wxNext = 60;")
rep("if (S.stk >= 3) { S.stk = 0; doSummon(true);","if (S.stk >= 3) { S.stk = 0; G.s3 = (G.s3 | 0) + 1; doSummon(true);")

# ---- 업적/일일 도전 본문
code = r"""
// ===== 업적·칭호·일일 도전 (v0.33) — 이 기기에만 저장돼요 =====
const ACH = [
  ['first', '첫 승리', '라운드에서 처음 이겨요', '새내기 수비대', (s) => s.win >= 1],
  ['w10', '든든한 방패', '라운드를 10번 이겨요', '든든한 방패', (s) => s.win >= 10],
  ['w30', '불패의 수비대', '라운드를 30번 이겨요', '불패의 수비대', (s) => s.win >= 30],
  ['sm5', '척척 해결사', '서브미션을 5번 성공해요', '척척 해결사', (s) => s.sm >= 5],
  ['sm25', '미션 마스터', '서브미션을 25번 성공해요', '미션 마스터', (s) => s.sm >= 25],
  ['stk', '호흡 척척', '한 판에서 서브미션 3연속 성공!', '호흡 척척', (s) => s.s3 >= 1],
  ['du3', '일기토 도전자', '일기토에서 3번 이겨요', '일기토 도전자', (s) => s.du >= 3],
  ['du10', '적장 사냥꾼', '일기토에서 10번 이겨요', '적장 사냥꾼', (s) => s.du >= 10],
  ['q30', '역사 박사', '퀴즈를 30개 맞혀요', '역사 박사', (s) => s.q >= 30],
  ['q100', '역사 대박사', '퀴즈를 100개 맞혀요', '역사 대박사', (s) => s.q >= 100],
  ['coop', '함께 지켜요', '협동전에서 이겨요', '함께 지켜요', (s) => s.coop >= 1],
  ['hard', '불꽃 같은 용기', '어려움 난이도에서 이겨요', '불꽃 같은 용기', (s) => s.hard >= 1],
  ['c0', '임진왜란 지킴이', '임진왜란 마지막 라운드를 이겨요', '임진왜란 지킴이', (s) => s.ch0 >= 1],
  ['c1', '정유재란 지킴이', '정유재란 마지막 라운드를 이겨요', '정유재란 지킴이', (s) => s.ch1 >= 1],
  ['c2', '정묘호란 지킴이', '정묘호란 마지막 라운드를 이겨요', '정묘호란 지킴이', (s) => s.ch2 >= 1],
  ['c3', '병자호란 지킴이', '병자호란 마지막 라운드를 이겨요', '병자호란 지킴이', (s) => s.ch3 >= 1],
  ['d1', '오늘의 도전자', '일일 도전을 1번 해요', '오늘의 도전자', (s) => s.dly >= 1],
  ['d3', '꾸준한 도전', '일일 도전을 3일 연속 해요', '꾸준한 도전', (s) => s.dst >= 3]
];
function achLoad() { try { const d = JSON.parse(localStorage.getItem('jd_ach') || '{}'); return { st: d.st || {}, ok: d.ok || {}, ti: d.ti || '' }; } catch (e) { return { st: {}, ok: {}, ti: '' }; } }
function achSave(d) { try { localStorage.setItem('jd_ach', JSON.stringify(d)); } catch (e) {} }
function titleOf() { const d = achLoad(), a = ACH.find((x) => x[0] === d.ti && d.ok[x[0]]); return a ? a[3] : ''; }
const kstDay = (off) => new Date(Date.now() + 9 * 3600e3 + (off || 0) * 86400e3).toISOString().slice(0, 10);
function dailyCfg() { let s = (Math.floor((Date.now() + 9 * 3600e3) / 86400e3) * 2654435761) >>> 0; const r = () => { s = (s + 0x6D2B79F5) >>> 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; const rd = Math.floor(r() * R.length), diff = ['easy', 'normal', 'normal', 'hard'][Math.floor(r() * 4)], mod = ['rich', 'vol', 'haste'][Math.floor(r() * 3)]; return { rd, diff, mod }; }
function dailyLoad() { try { const d = JSON.parse(localStorage.getItem('jd_daily') || '{}'); return { best: d.best || {}, last: d.last || '', st: d.st | 0, hist: d.hist || [] }; } catch (e) { return { best: {}, last: '', st: 0, hist: [] }; } }
function dailySave(d) { const ks = Object.keys(d.best).sort().slice(-30), b = {}; ks.forEach((k) => { b[k] = d.best[k]; }); d.best = b; d.hist = d.hist.slice(-30); try { localStorage.setItem('jd_daily', JSON.stringify(d)); } catch (e) {} }
async function startDaily() { await startAs('single'); const c = dailyCfg(); hostCtl('start', { start: c.rd, dur: 180, diff: c.diff, coop: false, bots: 0, daily: 1, mod: c.mod }); }
let qokSeen = 0, duSeen = 0, lastResId = '';
function recordResult() {
  if (!V || !V.res || V.endless || !V.res.rs || V.res.id === lastResId) { const dr0 = $('dailyRes'); if (dr0 && !(V && V.res && V.res.dl)) dr0.style.display = 'none'; return; }
  lastResId = V.res.id; const rs = V.res.rs, win = V.res.win, d = achLoad(), st = d.st, inc = (k, n) => { if (n > 0) st[k] = (st[k] | 0) + n; };
  if (win) { inc('win', 1); if (rs.cm) inc('coop', 1); if (rs.hd) inc('hard', 1); if (rs.ch >= 0) inc('ch' + rs.ch, 1); }
  inc('sm', rs.sm | 0); inc('s3', rs.s3 | 0);
  if ((rs.du | 0) < duSeen) duSeen = 0; inc('du', (rs.du | 0) - duSeen); duSeen = rs.du | 0;
  const me2 = V.pl.find((x) => x.id === Net.id), q = me2 ? me2.qok | 0 : 0; if (q < qokSeen) qokSeen = 0; inc('q', q - qokSeen); qokSeen = q;
  const dr = $('dailyRes'); if (dr) dr.style.display = 'none';
  if (V.res.dl) {
    const day = kstDay(), D = dailyLoad(), sc = V.res.dl.sc | 0;
    if (!D.hist.includes(day)) { D.st = D.last === kstDay(-1) ? D.st + 1 : 1; D.last = day; D.hist.push(day); inc('dly', 1); st.dst = Math.max(st.dst | 0, D.st); }
    D.best[day] = Math.max(D.best[day] | 0, sc); dailySave(D);
    if (dr) { dr.style.display = 'block'; dr.innerHTML = `📅 <b>일일 도전 점수 ${sc}점</b> · 오늘 최고 ${D.best[day]}점 · 연속 ${D.st}일<br><small>점수 = 승리 1000 + 처치×4 + 서브미션 성공×200 + 성 체력(최대 300) + 퀴즈 정답×30</small>`; }
  }
  const nw = []; for (const a of ACH) if (!d.ok[a[0]] && a[4](st)) { d.ok[a[0]] = Date.now(); nw.push(a); } if (nw.length && !d.ti) d.ti = nw[0][0]; achSave(d);
  if (nw.length) setTimeout(() => toast('🏅 업적 달성! ' + nw.map((a) => a[1] + ' (칭호 「' + a[3] + '」)').join(' · ')), 1200);
}
"""
code = code.replace("\\\\", "\\")
i = "function buildBook(tab) {"
assert g.count(i) == 1
g = g.replace(i, code + i)
rep("  } else {\n    const rk = rankLoad();", r"""  } else if (tab === 'daily') {
    const c = dailyCfg(), D = dailyLoad(), day = kstDay(), r0 = R[c.rd], dn = { easy: '쉬움', normal: '보통', hard: '어려움' }[c.diff], md = MODS[c.mod];
    const hist = Object.keys(D.best).sort().slice(-7).reverse().map((k) => `<tr><td>${k}</td><td>${D.best[k]}점</td></tr>`).join('');
    h = `<p class="bk-n">📅 ${day} 오늘의 도전 — 하루 한 판, 3분! (점수는 이 기기에만 저장돼요 · 날마다 장면·난이도·규칙이 바뀌어요)</p><div class="bk-c"><b>${esc(CH[r0.ch].n)} · ${esc(r0.nm)}</b><span>난이도 ${dn} · 3분 · 오늘의 규칙 ${md[0]} ${md[1]} — ${md[2]}</span><small>오늘 최고 ${D.best[day] | 0}점 · 연속 ${D.last === day || D.last === kstDay(-1) ? D.st : 0}일</small></div><div style="margin:10px 0"><button id="dlGo">📅 오늘의 도전 시작</button></div>` + (hist ? '<table class="bk-t"><tr><th>날짜</th><th>최고 점수</th></tr>' + hist + '</table>' : '<p class="bk-n">아직 기록이 없어요. 첫 도전을 해 보세요!</p>');
  } else if (tab === 'ach') {
    const A = achLoad(), got = ACH.filter((a) => A.ok[a[0]]).length;
    h = `<p class="bk-n">🏅 업적 ${got}/${ACH.length} — 얻은 칭호를 골라 쓰면 방 화면에서 내 이름 앞에 보여요 (이 기기에만 저장돼요)</p><div class="bk-g">` + ACH.map((a) => { const ok = A.ok[a[0]]; return `<div class="bk-c${ok ? '' : ' lk'}"><b>${ok ? '🏅 ' : '🔒 '}${esc(a[1])}</b><span>${esc(a[2])}</span><small>${ok ? '칭호 「' + esc(a[3]) + '」' : '아직이에요'}</small>${ok ? `<button class="sec" data-ti="${a[0]}" style="margin-top:4px;font-size:13px;padding:3px 10px">${A.ti === a[0] ? '✅ 쓰는 중' : '이 칭호 쓰기'}</button>` : ''}</div>`; }).join('') + '</div>';
  } else {
    const rk = rankLoad();""")
rep("  B.innerHTML = h; B.scrollTop = 0;\n","  B.innerHTML = h; B.scrollTop = 0;\n  const dg = B.querySelector('#dlGo'); if (dg) dg.onclick = startDaily;\n  B.querySelectorAll('button[data-ti]').forEach((b) => { b.onclick = () => { const A = achLoad(); A.ti = b.dataset.ti; achSave(A); buildBook('ach'); }; });\n")
rep("function buildResult() {\n","function buildResult() {\n  recordResult();\n")
rep("<li><b>${esc(p.name)}</b>","<li>${p.id === Net.id && titleOf() ? '<small>[' + esc(titleOf()) + ']</small> ' : ''}<b>${esc(p.name)}</b>")
rep("$('btnRank').onclick = () => buildBook('rank');","$('btnRank').onclick = () => buildBook('daily');")
rep("t: ['🎯 혼자 하기(게임 시작)에서도","t: ['📅 일일 도전(하루 한 판, 날마다 새 규칙)과 🏅 업적·칭호가 생겼어요! 도감 화면의 「도전·업적」에서 볼 수 있어요', '🌧 협동 이벤트 3종: 성 위험하면 🏰 성벽 수리 작전, 🌧🌫🌙 날씨 변화, 연속 실패하면 😞 사기 하락', '🔥 어려움에서는 적 장수 난입 · 양쪽 습격 · 갑옷 입은 적(스킬로 깨기)이 나와요', '🎯 혼자 하기(게임 시작)에서도")
open('src/game.js','w').write(g)
t=open('src/template.html').read()
def trep(o,n):
    global t
    assert t.count(o)==1,o; t=t.replace(o,n)
trep('<button id="btnRank">🏆 랭킹</button>','<button id="btnRank">🏅 도전·업적</button>')
trep('<button data-t="rank">랭킹</button>','<button data-t="rank">랭킹</button><button data-t="daily">일일 도전</button><button data-t="ach">업적·칭호</button>')
trep('<h2 id="rsTitle"></h2><div id="rsReward"></div>','<h2 id="rsTitle"></h2><div id="rsReward"></div><div class="panel" id="dailyRes" style="display:none"></div>')
open('src/template.html','w').write(t)
