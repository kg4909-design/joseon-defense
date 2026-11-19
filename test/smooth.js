const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } }); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto('file:///home/claude/work/game/dist/index.html?fast=60'); await p.waitForSelector('#bwj-intro', { state: 'detached' });
  await p.fill('#nick', '하늘'); await p.click('#btnSingle'); await p.waitForSelector('#sRoom.on'); await p.click('#btnStart'); await p.waitForSelector('#sBrief.on'); await p.click('#btnFight'); await p.waitForSelector('#sBattle.on');
  await p.evaluate(() => { G.pl.me.hp = 1e5; G.pl.me.mx = 1e5; });
  await p.keyboard.down('d'); await p.waitForTimeout(600);
  const r = await p.evaluate(() => new Promise((res) => { const a = []; let n = 0; const f = () => { const q = RP.get('me'); a.push([q[0], q[1], cam.x]); if (++n < 150) requestAnimationFrame(f); else res(a); }; f(); }));
  await p.keyboard.up('d');
  const st = (arr) => { const d = []; for (let i = 1; i < arr.length; i++) d.push(arr[i] - arr[i - 1]); const m = d.reduce((a, c) => a + c, 0) / d.length, sd = Math.sqrt(d.reduce((a, c) => a + (c - m) ** 2, 0) / d.length); return { mean: m.toFixed(2), sd: sd.toFixed(2), cv: (sd / Math.abs(m || 1)).toFixed(2) }; };
  console.log('hero x', st(r.map((q) => q[0])), 'cam x', st(r.map((q) => q[2])), errs); await b.close();
})();
