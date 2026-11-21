const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const errs = [];
  for (const [w, h] of [[1180, 820], [844, 390]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.35'); });
    p.on('pageerror', (e) => errs.push(String(e)));
    await p.goto('file:///home/claude/joseon-defense/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' }); await p.waitForTimeout(300);
    const r = await p.evaluate(() => {
      const o = {}; localStorage.removeItem('jd_cw');
      // 보상 지급(한 번만)
      V = { res: { win: true, id: 'x1', rw: { sh: 3, tk: 3 } } }; const c1 = cwCredit(); const c1b = cwCredit(); V.res.id = 'x1'; o.once = JSON.stringify([c1.tk, c1.sh, c1b === c1]); const d = cwLoad(); o.after = [d.tk, d.sh, d.cl];
      // 해금: 조각 10
      for (let i = 2; i < 6; i++) { V = { res: { win: true, id: 'x' + i, rw: { sh: 3, tk: 1 } } }; cwCredit(); } const d2 = cwLoad(); o.unlock = [d2.sh, !!d2.own.gwonyul, d2.tk];
      // 뽑기 보장
      localStorage.setItem('jd_cw', JSON.stringify({ tk: 100, sh: 0, own: {}, cos: [], eq: '', pity: 0, pity2: 0, cl: 0, ids: [] }));
      const rs = []; let since = 0, worst = 0, leg = 0; for (let i = 0; i < 60; i++) { const r = cwDraw(); rs.push(r.r); since = r.r >= 1 ? 0 : since + 1; worst = Math.max(worst, since); if (r.r === 2) leg++; }
      o.draw = { n: rs.length, worstNoRare: worst, legendary: leg, dist: [0, 1, 2].map((k) => rs.filter((x) => x === k).length), tkLeft: cwLoad().tk, sh: cwLoad().sh, own: !!cwLoad().own.gwonyul, cos: cwLoad().cos.length };
      localStorage.setItem('jd_cw', JSON.stringify({ tk: 0, sh: 0, own: {}, cos: [], eq: '', pity: 0, pity2: 0, cl: 0, ids: [] })); o.noTk = cwDraw();
      return o;
    });
    console.log(w, JSON.stringify(r));
    // UI
    await p.evaluate(() => localStorage.setItem('jd_cw', JSON.stringify({ tk: 3, sh: 4, own: {}, cos: ['a_blue', 'a_fire'], eq: 'a_fire', pity: 2, pity2: 5, cl: 3, ids: [] })));
    await p.click('#btnCw'); await p.waitForTimeout(300); await p.screenshot({ path: `/tmp/cw_${w}.png` });
    await p.click('#cwGo'); await p.waitForTimeout(300); await p.screenshot({ path: `/tmp/cw2_${w}.png` });
    const box = await p.evaluate(() => { const e = document.querySelector('#cwBox .pp').getBoundingClientRect(); return [Math.round(e.top), Math.round(e.bottom), innerHeight]; }); console.log('box', box);
    await p.click('#cwClose');
    await p.evaluate(() => { show('sRoom'); document.getElementById('roleLeg').click(); }); await p.waitForTimeout(100);
    console.log('legTip', await p.evaluate(() => document.getElementById('roleTip').textContent));
    await p.close();
  }
  console.log('errs', errs); await b.close();
})();
