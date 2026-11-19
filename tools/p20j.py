g='src/game.js'; s=open(g).read()
def rep(a,b,c=1):
    global s
    assert s.count(a)==c,(s.count(a),a[:80]); s=s.replace(a,b)
rep("e.pk === 'cannon' ? 1 : 0]);","e.pk === 'cannon' ? 1 : 0, e.bn || 0]);")
# end screen
a=s.index("  if (V.endless && V.es && V.es.over) {"); b=s.index("    hostOnly('btnEndless', false); return;\n  }",a)
s=s[:a]+"""  if (V.endless && V.es && V.es.over) {
    const e = V.es, score = e.tot + e.k + e.q * 30 + (e.clear ? 1000 : 0), nm = (V.pl.find((x) => x.id === Net.id) || {}).name || '학생';
    let rk = rankLoad(); rk.push({ n: nm, s: score, t: e.tot, k: e.k, q: e.q, r: e.r, d: Date.now() }); rk.sort((a, b) => b.s - a.s); rk = rk.slice(0, 30); try { localStorage.setItem('jd_rank', JSON.stringify(rk)); } catch (x) {}
    const pos = rk.findIndex((x) => x.s === score && x.t === e.tot && x.k === e.k) + 1;
    $('endH').textContent = e.clear ? '🏆 99라운드 클리어!' : '♾ 무한 모드 종료!';
    $('endText').innerHTML = `<p><b>${e.r}번째 라운드</b>${e.clear ? '의 최종 보스를 쓰러뜨렸어요! 대단해요!' : '까지 버텼어요!'}</p><p>⏱ 버틴 시간 <b>${fmtT(e.tot)}</b> · ⚔ 처치 <b>${e.k}</b>마리 · 🧠 퀴즈 정답 <b>${e.q}</b>개</p><p>점수 = 버틴 초 + 처치 수 + 퀴즈 정답×30${e.clear ? ' + 클리어 보너스 1000' : ''} → <b>${score}점</b>${pos ? ` (내 기기 기록 ${pos}위)` : ''}</p><small>랭킹은 이 기기에만 저장돼요. 시작 화면의 🏆 랭킹에서 볼 수 있어요.</small>`;
"""+s[b:]
# dex boss by name
rep("  if (V.ph === 'battle' && (V.en || []).some((e) => e[1] === 'boss') && !d.b[V.rd]) { d.b[V.rd] = 1; ch = true; }","  if (V.ph === 'battle') { d.bn = d.bn || {}; for (const e of V.en || []) if (e[1] === 'boss') { const nm = (e[8] || V.bn || BOSSN[V.rd] || [''])[0]; if (nm && !d.bn[nm]) { d.bn[nm] = 1; ch = true; } } }")
rep("const seen = {}; BOSSN.forEach((b, i) => { if (!b) return; (seen[b[0]] = seen[b[0]] || { d: b[1], r: [], ok: 0 }).r.push(i); if (d.b[i]) seen[b[0]].ok = 1; });","const seen = {}; BOSSN.concat(BOSS_EXTRA).forEach((b, i) => { if (!b) return; const x = (seen[b[0]] = seen[b[0]] || { d: b[1], r: [], ok: 0 }); if (i < BOSSN.length) x.r.push(i); if ((d.bn || {})[b[0]] || d.b[i]) x.ok = 1; });")
rep("'출현: ' + x.r.map((i) => esc(R[i].nm)).join(', ')","(x.r.length ? '출현: ' + x.r.map((i) => esc(R[i].nm)).join(', ') : '무한 모드 최종 보스')")
# updates
rep("const VER = 'v0.22';","const VER = 'v0.23';")
rep("const UPDATES = [\n","""const UPDATES = [
  { v: 'v0.23', d: '11/20', t: ['♾ 무한 모드 개편: 한 전장에서 라운드마다 1분, 99라운드까지! 레벨·카드가 계속 쌓여요', '라운드가 오를수록 적이 강해지고 정예와 적장이 더 많이 나와요. 가끔 밤이 와요', '99라운드는 최종 보스 (도요토미 히데요시 또는 홍타이지). 쓰러뜨리면 클리어!', '일반 모드 적장: 더 단단해지고(체력↑·갑옷), 붉은 원 범위 공격을 해요. 2분마다 나오고 고니시·와키자카 같은 장수가 번갈아 나와요', '업데이트 노트 팝업에서 닫기 버튼이 항상 보여요'] },
""")
open(g,'w').write(s)
