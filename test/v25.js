const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1180, height: 820 } });
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.39'); });
  const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
  await p.goto('file:///home/claude/work/game/dist/index.html'); await p.waitForTimeout(400);
  await p.click('#btnSingle'); await p.waitForTimeout(300);
  const r = await p.evaluate(() => {
    const D = window.__dbg, out = {};
    D.hostCtl('start', { start: 0, dur: 180, diff: 'normal', wall: 0 }); const G = D.G, id = G.order[0], h = G.pl[id]; G.ph = 'battle'; G.t = 40;
    // 1) 스킬: 역할별
    out.skills = {};
    for (const role of ['archer', 'militia', 'monk', 'gunner', 'admiral']) {
      h.role = role; h.cd = 0; h.down = 0; h.hp = h.mx * 0.5; G.en = []; for (let i = 0; i < 12; i++) { const e = D.spawn('grunt', 1, [h.x + 60 + i * 12, h.y + (i % 3) * 20]); }
      const hp0 = G.en.reduce((a, e) => a + e.hp, 0), h0 = h.hp; D.hostMsg(id, { k: 'skill' });
      out.skills[role] = { cd: h.cd, dmg: Math.round(hp0 - G.en.reduce((a, e) => a + e.hp, 0)), heal: Math.round(h.hp - h0), slow: G.en.filter((e) => (e.slw || 0) > G.t).length, stun: G.en.filter((e) => e.st > 0).length };
    }
    // 2) 퀴즈 보상
    G.obj = 'd'; h.role = 'archer'; h.qstk = 0; const res = [];
    for (let i = 0; i < 3; i++) { D.pickQuiz(h); h.offer = ['sword', 'bow', 'forge']; h.offT = 14; const f0 = G.food; D.hostMsg(id, { k: 'qa', i: h.qz.a }); res.push([G.food - f0, h.qrw, h.qstk, h.qs]); h.offer = null; }
    D.pickQuiz(h); h.offer = ['sword', 'bow', 'forge']; D.hostMsg(id, { k: 'qa', i: (h.qz.a + 1) % 3 }); res.push([h.qs, h.qstk, h.qrw]);
    out.quiz = res;
    // 3) 스냅샷 직렬화
    out.snap = JSON.stringify(D.makeSnap(G)).length > 100;
    return out;
  });
  console.log(JSON.stringify(r, null, 1));
  // 4) 결과 카드 UI
  await p.evaluate(() => { const D = window.__dbg; D.hostCtl('start', { start: 4, dur: 180, diff: 'normal', wall: 0 }); });
  await p.waitForTimeout(300);
  await p.evaluate(() => { const D = window.__dbg, G = D.G; G.ph = 'battle'; G.t = G.dur; });
  await p.waitForTimeout(2500);
  console.log('card', await p.evaluate(() => document.getElementById('rsHist').innerText.slice(0, 400)));
  await p.screenshot({ path: 'test/v25_result.png' });
  await p.setViewportSize({ width: 844, height: 390 }); await p.waitForTimeout(400); await p.screenshot({ path: 'test/v25_result_844.png' });
  console.log('errs', errs); await b.close();
})();
