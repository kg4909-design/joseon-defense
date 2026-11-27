const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const http = require('http'), net = require('net');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] }); const errs = [], o = {};
  const mk = async (q) => { const p = await b.newPage({ viewport: { width: 1180, height: 820 } }); await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.47'); }); p.on('pageerror', (e) => errs.push(e.message)); await p.goto('file:///home/claude/work/game/dist/index.html' + (q || '')); await p.waitForSelector('#bwj-intro', { state: 'detached' }); return p; };
  // A) 응답 없는 서버: 연결 중 표시 + 10초 후 안내 + 버튼 복구
  const srv = net.createServer((s) => { s.on('data', () => {}); }); await new Promise((r) => srv.listen(0, '127.0.0.1', r)); const port = srv.address().port;
  let p = await mk(); await p.evaluate((u) => { document.getElementById('relayUrl').value = u; }, 'ws://127.0.0.1:' + port + '/ws');
  await p.click('#btnCreate'); await p.waitForTimeout(600);
  o.during = await p.evaluate(() => [document.getElementById('err').textContent, document.getElementById('btnCreate').disabled, document.getElementById('btnCreate').textContent, document.getElementById('btnJoin').disabled]);
  await p.waitForTimeout(10500);
  o.after = await p.evaluate(() => [document.getElementById('err').textContent, document.getElementById('btnCreate').disabled, document.getElementById('btnCreate').textContent]);
  await p.close(); srv.close();
  // B) 탈출 미션 포위 + 오른쪽 끝: 되돌려짐 반복 없음
  p = await mk(); await p.click('#btnSingle'); await p.waitForSelector('#sRoom.on'); await p.click('#btnStart'); await p.waitForTimeout(300);
  o.esc = await p.evaluate(() => { const D = __dbg; D.hostCtl('start', { start: 0, dur: 300, diff: 'normal', wall: 0 }); const G = D.G; G.rd = 0; D.hostCtl('start', { start: 0, dur: 300, diff: 'normal', wall: 0 });
    const rd = D.R.findIndex((r, i) => 0); return null; });
  o.esc = await p.evaluate(() => { const D = __dbg; const ei = D.R.map((r, i) => i).find((i) => { D.hostCtl('start', { start: i, dur: 300, diff: 'normal', wall: 0 }); return D.G.obj === 'e'; });
    const G = D.G; D.hostCtl('fight'); const me = G.pl[G.order[0]]; G.ph = 'battle'; G.t = G.dur * 0.23; G.ringN = 0; me.x = 2900; me.y = G.wh / 2; me.hp = me.mx;
    const sf0 = G.sf || 0; for (let i = 0; i < 240; i++) { D.stepBattle(1 / 30); me.mvx = 1; me.mvy = 0; } return { ei, ring: !!G.ring, sf: (G.sf || 0) - sf0, x: Math.round(me.x), cx: G.ring && Math.round(G.ring.cx) }; });
  await p.close();
  // C) 문제 풀이 중 스페이스: 스킬 안 나감
  p = await mk(); await p.click('#btnSingle'); await p.waitForSelector('#sRoom.on'); await p.click('#btnStart'); await p.waitForTimeout(300);
  o.key = await p.evaluate(async () => { const D = __dbg; D.hostCtl('start', { start: 0, dur: 300, diff: 'normal', wall: 0 }); D.hostCtl('fight'); const G = D.G, me = G.pl[G.order[0]]; G.ph = 'battle'; me.cd = 0; D.stepBattle(0.1);
    document.getElementById('sBattle').classList.add('pick'); window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', code: 'Space' })); await new Promise((r) => setTimeout(r, 200)); const a = me.cd;
    document.getElementById('sBattle').classList.remove('pick'); window.dispatchEvent(new KeyboardEvent('keyup', { key: ' ', code: 'Space' })); window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', code: 'Space' })); await new Promise((r) => setTimeout(r, 300)); return [a, me.cd > 0]; });
  await p.close();
  console.log(JSON.stringify(o, null, 1), 'ERR', JSON.stringify(errs)); await b.close(); srv.close && 0;
})();
