const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 960, height: 540 } });
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.34'); });
  const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
  await p.goto('file:///home/claude/work/game/dist/index.html'); await p.waitForTimeout(400);
  await p.click('#btnSingle'); await p.waitForTimeout(300);
  const r = await p.evaluate(() => {
    const D = window.__dbg, G = D.G, o = {}; D.hostCtl('start', { start: 1, dur: 300, diff: 'normal', wall: 0 }); G.ph = 'battle'; G.du = null; const me = G.pl[G.order[0]];
    const run = (sec) => { for (let i = 0; i < sec * 30; i++) { if (G.ph !== 'battle') break; G.paused = false; G.ev = null; me.offer = null; me.qz = null; me.hp = me.mx = 9999; D.stepBattle(1 / 30); } };
    o.obj = G.obj; run(2); G.t = G.dur * 0.22 + 0.1; run(1);
    const sh = () => G.en.filter((e) => e.t === 'shld');
    o.ring = !!G.ring; o.n = sh().length; const x0 = me.x; run(5); o.noAdvance = Math.abs(me.x - x0) < 5;
    me.x += 900; run(1); o.clamped = Math.hypot(me.x - G.ring.cx, me.y - G.ring.cy) <= G.ring.R; o.outsideMobs = G.en.filter((e) => e.t !== 'shld' && e.t !== 'boss' && Math.hypot(e.x - G.ring.cx, e.y - G.ring.cy) > G.ring.R + 90).length;
    o.mobs = G.en.length - o.n;
    window.__shot = 1; o.R = Math.round(G.ring.R);
    return o;
  });
  console.log(JSON.stringify(r));
  await p.evaluate(() => { const G = window.__dbg.G; G.paused = false; }); await p.waitForTimeout(500); await p.screenshot({ path: '/tmp/ring.png' });
  const r2 = await p.evaluate(() => {
    const D = window.__dbg, G = D.G, o = {}; const me = G.pl[G.order[0]];
    const run = (sec) => { for (let i = 0; i < sec * 30; i++) { if (G.ph !== 'battle') break; G.paused = false; G.ev = null; me.offer = null; me.qz = null; me.hp = me.mx = 9999; D.stepBattle(1 / 30); } };
    o.pre = { ring: !!G.ring, ph: G.ph, n: G.en.filter((e) => e.t === 'shld').length, t: G.t }; const sh = () => G.en.filter((e) => e.t === 'shld'); const s0 = sh()[3]; s0.hp = -1; run(1); o.mid = { ring: !!G.ring, ph: G.ph };
    o.afterKill = { n: sh().length, brk: G.ring ? !!G.ring.brk : 'nullring', info: G.info && G.info.tt }; const x1 = me.x; run(3); o.dissolved = !G.ring && sh().length === 0; o.adv = me.x > x1 - 1;
    G.t = G.dur * 0.5 + 0.1; run(1); o.second = !!G.ring; G.t += 52; run(1); o.timeout = { ring: !!G.ring, brk: G.ring ? !!G.ring.brk : null, info: G.info && G.info.tt, ringN: G.ringN };
    return o;
  });
  console.log(JSON.stringify(r2)); console.log('ERR', JSON.stringify(errs)); await b.close();
})();
