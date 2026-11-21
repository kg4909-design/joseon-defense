const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 960, height: 540 } });
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.39'); });
  const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
  await p.goto('file:///home/claude/work/game/dist/index.html'); await p.waitForTimeout(4200);
  await p.click('#btnSingle'); await p.waitForTimeout(300);
  await p.evaluate(() => { const D = window.__dbg, G = D.G; D.hostCtl('start', { start: 4, dur: 300, diff: 'normal', wall: 0 }); G.ph = 'battle'; const me = G.pl[G.order[0]]; me.cards = { bow: 3 }; G.en = []; D.spawnBoss(0.8, 0.8); G.du.ph = 'fight'; G.du.tm = 100; G.du.b.hp = G.du.b.mx * 0.5; G.du.at = 99; const b = G.du.b; G.du.tl.push({ k: 'lane', x: b.x - 300, y: b.y + 120, x2: b.x + 300, y2: b.y + 230, t: 500, t0: 500 }, { k: 'donut', x: b.x, y: b.y, r: 330, x2: 120, t: 500, t0: 500 }); G.du.pj.push({ x: b.x - 150, y: b.y - 120, vx: 0, vy: 0.001, life: 99 }); G.du.pj.push({ x: b.x + 150, y: b.y + 120, vx: -1, vy: 1, life: 99 }); window.__dbg.freeze = 1; me.hp = me.mx = 99999; });
  await p.waitForTimeout(400); await p.waitForTimeout(100); await p.screenshot({ path: '/tmp/duelshot.png' });
  console.log('ERR', JSON.stringify(errs)); await b.close();
})();
