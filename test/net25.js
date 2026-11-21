// 온라인 통합 시험: 로컬 릴레이 + 브라우저 N개 (방 만들기 / 코드 입장 / 시작 / 동기화 / 입력)
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const { spawn } = require('child_process');
const N = +(process.argv[2] || 4), FILE = process.env.GAME || 'file:///home/claude/joseon-defense/index.html';
(async () => {
  const relay = spawn('node', ['local-relay.js', '8799'], { cwd: '/home/claude/joseon-defense' }); await new Promise((r) => setTimeout(r, 600));
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox', '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows'] });
  const errs = [], pages = [], out = {};
  for (let i = 0; i < N; i++) {
    const ctx = await b.newContext({ viewport: { width: 1180, height: 820 } }); const p = await ctx.newPage();
    await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.34'); localStorage.setItem('hdg_relay', 'ws://localhost:8799/ws'); });
    p.on('pageerror', (e) => errs.push(i + ':' + e.message)); p.on('dialog', (d) => d.dismiss());
    await p.goto(FILE); await p.waitForSelector('#bwj-intro', { state: 'detached' }); await p.fill('#nick', '학생' + (i + 1)); pages.push(p);
  }
  await pages[0].click('#btnCreate'); await pages[0].waitForSelector('#sRoom.on');
  const code = (await pages[0].textContent('#roomLabel')).replace(/[^A-Z0-9]/g, '').replace(/^.*?(?=[A-Z2-9]{4}$)/, ''); out.code = code;
  for (let i = 1; i < N; i++) { await pages[i].fill('#roomCode', code); await pages[i].click('#btnJoin'); await pages[i].waitForSelector('#sRoom.on', { timeout: 5000 }); }
  await pages[0].waitForTimeout(800);
  out.hostPlayers = await pages[0].evaluate(() => __dbg.G.order.length);
  // 5번째 접속은 거절돼야 함
  if (N === 4) { const ctx = await b.newContext(); const p = await ctx.newPage(); await p.addInitScript(() => { localStorage.setItem('hdg_relay', 'ws://localhost:8799/ws'); localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.34'); }); await p.goto(FILE); await p.waitForSelector('#bwj-intro', { state: 'detached' }); await p.fill('#roomCode', code); await p.click('#btnJoin'); await p.waitForTimeout(800); out.fifth = await p.textContent('#err'); }
  if (process.env.SHOT) { await pages[0].screenshot({ path: 'test/net_host_1180.png' }); await pages[1].screenshot({ path: 'test/net_guest_1180.png' }); for (const q of [pages[0], pages[1]]) await q.setViewportSize({ width: 844, height: 390 }); await pages[0].waitForTimeout(400); await pages[0].screenshot({ path: 'test/net_host_844.png' }); await pages[1].screenshot({ path: 'test/net_guest_844.png' }); for (const q of [pages[0], pages[1]]) await q.setViewportSize({ width: 1180, height: 820 }); }
  // 영웅 선택 동기화
  const roles = ['archer', 'militia', 'monk', 'gunner'];
  for (let i = 1; i < N; i++) await pages[i].evaluate((r) => { me.role = r; sendProf(); }, roles[i]);
  await pages[0].waitForTimeout(500);
  out.roles = await pages[0].evaluate(() => __dbg.G.order.map((id) => __dbg.G.pl[id].role));
  // 시작
  await pages[0].evaluate(() => { document.getElementById('selDur').value = '120'; }); await pages[0].click('#btnStart');
  await pages[0].waitForTimeout(1500);
  out.guestPhase = await Promise.all(pages.slice(1).map((p) => p.evaluate(() => V && V.ph)));
  // 브리핑 → 전투
  await pages[0].evaluate(() => { __dbg.hostCtl('fight'); }); await pages[0].waitForTimeout(1500);
  // 입력: 게스트1이 오른쪽으로 이동
  const x0 = await pages[0].evaluate(() => { const G = __dbg.G; return G.pl[G.order[1]].x; });
  await pages[1].evaluate(() => sendHost({ k: 'in', mx: 1, my: 0 })); await pages[0].waitForTimeout(1500);
  const x1 = await pages[0].evaluate(() => { const G = __dbg.G; return G.pl[G.order[1]].x; });
  out.move = [Math.round(x0), Math.round(x1)];
  // 스냅샷 수신 빈도 / 크기
  const probe = await pages[1].evaluate(() => new Promise((res) => { let n = 0, sz = 0, t0 = performance.now(); const o = Net.onData; Net.onData = (f, d) => { o(f, d); n++; sz += JSON.stringify(d).length; }; setTimeout(() => { Net.onData = o; res({ hz: +(n / ((performance.now() - t0) / 1000)).toFixed(1), kb: +(sz / n / 1024).toFixed(1) }); }, 3000); }));
  out.snap = probe;
  await pages[0].evaluate(() => { const G = __dbg.G; G.en = []; for (let i = 0; i < 210; i++) __dbg.spawn('grunt', 1, [G.ax + 200 + (i % 30) * 14, G.ay - 200 + Math.floor(i / 30) * 40]); });
  out.snapLoaded = await pages[1].evaluate(() => new Promise((res) => { let n = 0, sz = 0, mx = 0, t0 = performance.now(); const o = Net.onData; Net.onData = (f, d) => { o(f, d); n++; const l = JSON.stringify(d).length; sz += l; mx = Math.max(mx, l); }; setTimeout(() => { Net.onData = o; res({ hz: +(n / ((performance.now() - t0) / 1000)).toFixed(1), avgKB: +(sz / n / 1024).toFixed(1), maxKB: +(mx / 1024).toFixed(1), enemies: V.en.length }); }, 3000); }));
  out.guestsSeeAll = await Promise.all(pages.slice(1).map((p) => p.evaluate(() => V.pl.length)));
  // 게스트 스킬·소집
  out.skillcd = await pages[2 % N].evaluate(() => { sendHost({ k: 'skill' }); return 1; }); await pages[0].waitForTimeout(400);
  out.guestCd = await pages[0].evaluate(() => { const G = __dbg.G; return Math.round(G.pl[G.order[2 % G.order.length]].cd); });
  // 게스트 이탈
  await pages[N - 1].close(); await pages[0].waitForTimeout(700); out.afterLeave = await pages[0].evaluate(() => __dbg.G.order.length);
  console.log(JSON.stringify(out, null, 1)); console.log('errs', errs);
  await b.close(); relay.kill();
})();
