// 다시 들어오기 / 연결 끊김 / 멈춤 시험 (로컬 릴레이 + 브라우저 3개)
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const { spawn } = require('child_process');
(async () => {
  const relay = spawn('node', ['local-relay.js', '8798'], { cwd: '/home/claude/joseon-defense' }); await new Promise((r) => setTimeout(r, 600));
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox', '--disable-background-timer-throttling', '--disable-renderer-backgrounding'] });
  const errs = [], pages = [], out = {}, dialogs = [];
  for (let i = 0; i < 3; i++) {
    const ctx = await b.newContext({ viewport: { width: 1180, height: 820 } }); const p = await ctx.newPage();
    await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.29'); localStorage.setItem('hdg_relay', 'ws://localhost:8798/ws'); });
    p.on('pageerror', (e) => errs.push(i + ':' + e.message)); p.on('dialog', (d) => { dialogs.push(i + ':' + d.type() + ':' + d.message().slice(0, 30)); d.dismiss(); });
    await p.goto('file:///home/claude/joseon-defense/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' }); await p.fill('#nick', '학생' + (i + 1)); pages.push(p);
  }
  await pages[0].click('#btnCreate'); await pages[0].waitForSelector('#sRoom.on');
  const code = (await pages[0].textContent('#roomLabel')).replace(/[^A-Z0-9]/g, '').slice(-4);
  for (let i = 1; i < 3; i++) { await pages[i].fill('#roomCode', code); await pages[i].click('#btnJoin'); await pages[i].waitForSelector('#sRoom.on'); }
  await pages[0].waitForTimeout(600);
  // 로비에서 나가기 경고 (방장, 친구 있음)
  await pages[0].evaluate(() => { window.__c = 0; window.confirm = () => { window.__c++; return false; }; }); await pages[0].click('#btnLeave'); out.hostLeaveConfirm = await pages[0].evaluate(() => window.__c);
  await pages[0].evaluate(() => { document.getElementById('selDur').value = '120'; }); await pages[0].click('#btnStart'); await pages[0].waitForTimeout(1200);
  await pages[0].evaluate(() => __dbg.hostCtl('fight')); await pages[0].waitForTimeout(1200);
  const info0 = await pages[0].evaluate(() => { const G = __dbg.G; const p = G.pl[G.order[1]]; p.cards.bow = 3; p.hp = 77; return { id: p.id, tk: !!p.tk, n: G.order.length }; }); out.before = info0;
  // 학생2 네트워크 끊김 (소켓만 닫기)
  await pages[1].evaluate(() => Net.ws.close()); await pages[0].waitForTimeout(700);
  out.away = await pages[0].evaluate(() => { const G = __dbg.G; return { n: G.order.length, aw: G.pl[G.order[1]].away > 0, name: G.pl[G.order[1]].name }; });
  out.dropBox = await pages[1].evaluate(() => getComputedStyle(document.getElementById('dropBox')).display);
  // 끊긴 동안 영웅은 맞아도 안 다침
  const hp1 = await pages[0].evaluate(() => { const G = __dbg.G; const p = G.pl[G.order[1]]; const h0 = p.hp; hurt(p, 50); return [h0, p.hp]; }); out.awayHurt = hp1;
  // 투표가 끊긴 학생 때문에 막히지 않는지: 학생3과 방장이 투표
  await pages[0].evaluate(() => { const G = __dbg.G; G.ev = { t: '시험', q: 'q', o: [{ n: 'a', k: 'food' }, { n: 'b', k: 'food' }], votes: {}, left: 14 }; G.evDone = [true, true]; });
  await pages[0].evaluate(() => { const G = __dbg.G; G.ev.votes[G.order[0]] = 0; G.ev.votes[G.order[2]] = 1; }); await pages[0].waitForTimeout(500);
  out.voteResolved = await pages[0].evaluate(() => !__dbg.G.ev);
  // 자동으로 다시 들어옴
  await pages[1].waitForTimeout(3500);
  out.after = await pages[0].evaluate(() => { const G = __dbg.G; const p = G.pl[G.order[1]]; return { n: G.order.length, away: p.away, hp: Math.round(p.hp), bow: p.cards.bow, id: p.id, name: p.name, keys: Object.keys(G.pl).length }; });
  out.guestSees = await pages[1].evaluate(() => { const me = V.pl.find((x) => x.id === Net.id); return me ? { name: me.name, hp: Math.round(me.hp), idOk: true } : null; });
  out.dropBoxAfter = await pages[1].evaluate(() => getComputedStyle(document.getElementById('dropBox')).display);
  // 입력도 다시 먹히는지
  const x0 = await pages[0].evaluate(() => { const G = __dbg.G; return G.pl[G.order[1]].x; }); await pages[1].evaluate(() => sendHost({ k: 'in', mx: 1, my: 0 })); await pages[0].waitForTimeout(1200);
  out.moved = await pages[0].evaluate((x) => { const G = __dbg.G; return Math.round(G.pl[G.order[1]].x - x); }, x0) > 20;
  // 대기 표시: 학생3 카드 고르는 중이면 다른 사람 화면에 이름이 보임
  await pages[0].evaluate(() => { const G = __dbg.G; const p = G.pl[G.order[2]]; p.offer = ['bow']; p.offT = 14; }); await pages[0].waitForTimeout(500);
  out.waitTag = await pages[0].evaluate(() => document.getElementById('waitTag').textContent);
  // 방장 멈춤 + 자동 재개
  await pages[0].evaluate(() => { const G = __dbg.G; G.pl[G.order[2]].offer = null; G.paused = true; G.pausedAt = Date.now() - 91000; }); await pages[0].waitForTimeout(500);
  out.autoResume = await pages[0].evaluate(() => !__dbg.G.paused);
  // 방장 화면 멈춤 감지 (스냅샷 끊기)
  await pages[0].evaluate(() => { window.__ns = Net.send; Net.send = () => {}; }); await pages[1].waitForTimeout(3200);
  out.lagTag = await pages[1].evaluate(() => getComputedStyle(document.getElementById('lagTag')).display);
  await pages[0].evaluate(() => { Net.send = window.__ns; });
  // 3분 넘게 안 돌아오면 정리
  await pages[2].evaluate(() => { Net.onDrop = null; Net.ws.close(); }); await pages[0].waitForTimeout(600);
  await pages[0].evaluate(() => { const G = __dbg.G; G.pl[G.order[2]].away = Date.now() - 181000; }); await pages[0].waitForTimeout(500);
  out.purged = await pages[0].evaluate(() => __dbg.G.order.length);
  console.log(JSON.stringify(out), JSON.stringify(dialogs), errs); await b.close(); relay.kill();
})();
