const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const { spawn } = require('child_process');
(async () => {
  const relay = spawn('node', ['local-relay.js', '8796'], { cwd: '/home/claude/joseon-defense' }); await new Promise((r) => setTimeout(r, 600));
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  for (const [w, h, n] of [[844, 390, 'ph'], [1180, 820, 'tb']]) for (const mode of ['solo', 'room']) {
    const p = await b.newPage({ viewport: { width: w, height: h }, hasTouch: w < 900 });
    await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.47'); localStorage.setItem('hdg_relay', 'ws://localhost:8796/ws'); });
    await p.goto('file:///home/claude/work/game/dist/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' }); await p.fill('#nick', '학생');
    await p.click(mode === 'solo' ? '#btnSingle' : '#btnCreate'); await p.waitForSelector('#sRoom.on'); await p.waitForTimeout(400);
    await p.click('#rcNext'); await p.waitForTimeout(150);
    await p.screenshot({ path: `/tmp/s64_${n}_${mode}.png` }); await p.close();
  }
  relay.kill(); await b.close();
})();
