const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const { spawn } = require('child_process');
(async () => {
  const relay = spawn('node', ['local-relay.js', '8798'], { cwd: '/home/claude/joseon-defense' }); await new Promise((r) => setTimeout(r, 600));
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const errs = [], out = { dialogs: [] };
  const mk = async (name) => { const ctx = await b.newContext({ viewport: { width: 1180, height: 820 } }); const p = await ctx.newPage();
    await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.45'); localStorage.setItem('hdg_relay', 'ws://localhost:8798/ws'); });
    p.on('pageerror', (e) => errs.push(e.message)); p.on('dialog', (d) => { out.dialogs.push(d.message()); d.dismiss(); });
    await p.goto('file:///home/claude/joseon-defense/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' }); await p.fill('#nick', name); return p; };
  const h = await mk('방장'); await h.click('#btnCreate'); await h.waitForSelector('#sRoom.on');
  const code = (await h.textContent('#roomLabel')).replace(/[^A-Z0-9]/g, '').slice(-4);
  const g1 = await mk('친구1'); await g1.fill('#roomCode', code); await g1.click('#btnJoin'); await g1.waitForSelector('#sRoom.on'); await h.waitForTimeout(500);
  out.lobbyJoinOk = await h.evaluate(() => __dbg.G.order.length);
  await h.click('#btnStart'); await h.waitForTimeout(1200); await h.evaluate(() => __dbg.hostCtl('fight')); await h.waitForTimeout(800);
  const g2 = await mk('지각생'); await g2.fill('#roomCode', code); await g2.click('#btnJoin'); await g2.waitForTimeout(2500);
  out.players = await h.evaluate(() => __dbg.G.order.length);
  console.log(JSON.stringify(out), errs); relay.kill(); await b.close();
})();
