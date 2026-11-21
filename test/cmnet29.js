const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const { spawn } = require('child_process');
const N = 3, FILE = 'file:///home/claude/joseon-defense/index.html';
(async () => {
  const relay = spawn('node', ['local-relay.js', '8798'], { cwd: '/home/claude/joseon-defense' }); await new Promise((r) => setTimeout(r, 600));
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox', '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows'] });
  const errs = [], pages = [], out = {};
  for (let i = 0; i < N; i++) {
    const ctx = await b.newContext({ viewport: { width: 1180, height: 820 } }); const p = await ctx.newPage();
    await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.40'); localStorage.setItem('hdg_relay', 'ws://localhost:8798/ws'); });
    p.on('pageerror', (e) => errs.push(i + ':' + e.message)); p.on('dialog', (d) => d.dismiss());
    await p.goto(FILE); await p.waitForSelector('#bwj-intro', { state: 'detached' }); await p.fill('#nick', '학생' + (i + 1)); pages.push(p);
  }
  await pages[0].click('#btnCreate'); await pages[0].waitForSelector('#sRoom.on');
  const code = (await pages[0].textContent('#roomLabel')).replace(/[^A-Z0-9]/g, '').replace(/^.*?(?=[A-Z2-9]{4}$)/, '');
  for (let i = 1; i < N; i++) { await pages[i].fill('#roomCode', code); await pages[i].click('#btnJoin'); await pages[i].waitForSelector('#sRoom.on', { timeout: 5000 }); }
  await pages[0].waitForTimeout(800);
  await pages[0].click('#btnCoop'); await pages[0].waitForTimeout(1500);
  out.guestsPh = await Promise.all(pages.map((p) => p.evaluate(() => __dbg.V.ph + '|cm=' + __dbg.V.cm)));
  await pages[0].evaluate(() => { __dbg.hostCtl('fight'); __dbg.G.evDone = [true, true]; }); await pages[0].waitForTimeout(2000);
  out.crBtns = await Promise.all(pages.map((p) => p.evaluate(() => { const b = document.getElementById('btnCr'); return getComputedStyle(b).display + ':' + b.textContent.replace(/\s+/g, ''); })));
  out.tag = await pages[2].evaluate(() => document.getElementById('coopTag').textContent);
  // 손님2(보급)가 버튼 누르기 -> 방장 쿨다운 반영
  await pages[2].evaluate(() => document.getElementById('btnCr').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))); await pages[2].waitForTimeout(800);
  out.supplyCc = await pages[0].evaluate(() => __dbg.G.order.map((id) => __dbg.G.pl[id].cc | 0));
  out.guestBtnAfter = await pages[2].evaluate(() => document.getElementById('btnCr').textContent.replace(/\s+/g, ''));
  console.log(JSON.stringify(out)); console.log('errs', errs); await b.close(); relay.kill();
})();
