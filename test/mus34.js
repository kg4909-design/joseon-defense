const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
  const p = await b.newPage({ viewport: { width: 844, height: 390 } }); const errs = [];
  p.on('pageerror', (e) => errs.push(String(e)));
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.34'); localStorage.setItem('jd_hid', '1'); });
  await p.goto('file:///home/claude/joseon-defense/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' }); await p.waitForTimeout(300);
  await p.mouse.click(400, 200); await p.waitForTimeout(300);
  await p.click('#btnSingle'); await p.waitForTimeout(300);
  await p.evaluate(() => { const D = window.__dbg, G = D.G; D.hostCtl('start', { start: 3, dur: 300, diff: 'normal', coop: true, fix: 1, bots: 2, cl: 2 }); D.hostCtl('fight'); G.evDone = [true, true]; G.bossTimes = []; });
  await p.waitForTimeout(1500);
  const s0 = await p.evaluate(() => { const M = window.__dbg.MUS; return { cur: M.cur, ctx: window.__dbg.MUS && 1 }; });
  await p.evaluate(() => { const D = window.__dbg, G = D.G; const b = D.spawnBoss(G.order.map((i) => G.pl[i]), 0.8); const e = G.en.find((x) => x.t === 'boss'); if (e) D.beginDuel(e); });
  await p.waitForTimeout(2500);
  const s1 = await p.evaluate(() => { const M = window.__dbg.MUS, N = M.N.duel; return { cur: M.cur, paused: N ? N.e[0].paused : null, t: N ? N.e[0].currentTime : null, dur: N ? N.e[0].duration : null, gain: N ? N.out.gain.value : null, bgmGain: window.__dbg.BGM.bus && window.__dbg.BGM.bus.gain.value, du: !!window.__dbg.G.du }; });
  // 루프 크로스페이드 확인: 곡 끝 근처로 이동
  await p.evaluate(() => { const N = window.__dbg.MUS.N.duel; N.e[0].currentTime = N.e[0].duration - 3.5; });
  await p.waitForTimeout(2500);
  const s2 = await p.evaluate(() => { const N = window.__dbg.MUS.N.duel; return { xf: N.xf, i: N.i, p0: N.e[0].paused, p1: N.e[1].paused, t1: N.e[1].currentTime }; });
  await p.evaluate(() => { const D = window.__dbg; D.endDuel(true); });
  await p.waitForTimeout(2500);
  const s3 = await p.evaluate(() => { const M = window.__dbg.MUS; return { cur: M.cur, bgmGain: window.__dbg.BGM.bus.gain.value, p0: M.N.duel.e[0].paused, p1: M.N.duel.e[1].paused }; });
  console.log(JSON.stringify({ s0, s1, s2, s3 }), errs); await b.close();
})();
