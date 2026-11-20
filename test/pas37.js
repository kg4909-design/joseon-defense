const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 844, height: 390 }, hasTouch: true });
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.33'); });
  const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
  await p.goto('file:///home/claude/work/game/dist/index.html'); await p.waitForTimeout(400);
  const o = [];
  // 로비: 팁, 버튼, 탭
  o.push('tip ' + (await p.textContent('#pasTip')).slice(0, 60));
  await p.click('#btnPas'); await p.waitForTimeout(200);
  o.push('tab cards ' + await p.evaluate(() => document.querySelectorAll('#bookBody .bk-c').length) + ' sBook ' + await p.evaluate(() => document.getElementById('sBook').classList.contains('on')));
  // 식량 지급 후 강화
  await p.evaluate(() => { const d = window.__dbg.pasLoad(); d.food = 1000; window.__dbg.pasSave(d); });
  await p.click('#bookBack'); await p.click('#btnPas'); await p.waitForTimeout(100);
  await p.click('button[data-pu="dm"]'); await p.waitForTimeout(100);
  await p.click('button[data-pu="dm"]'); await p.waitForTimeout(100);
  o.push('after upg ' + JSON.stringify(await p.evaluate(() => { const d = window.__dbg.pasLoad(); return { f: d.food, lv: d.lv, eq: d.eq, act: window.__dbg.pasActive() }; })));
  // 판 시작 + 스탯 적용
  await p.click('#bookBack'); await p.click('#btnSingle'); await p.waitForTimeout(300);
  const r = await p.evaluate(() => {
    const D = window.__dbg; D.hostCtl('start', { start: 3, dur: 180, diff: 'normal', wall: 0 }); const G = D.G; G.ph = 'battle'; const me = G.pl[G.order[0]];
    const out = { ps: me.ps, altars: G.altars.length };
    const base = D.heroStats0(me), st = D.heroStats(me); out.dmgRatio = +(st.dmg / base.dmg).toFixed(3);
    const a = G.altars[0]; me.x = a.x; me.y = a.y; me.hp = 1; for (let i = 0; i < 160; i++) D.stepBattle(1 / 30);
    out.altN = G.altN; out.d = a.d; out.snapAl = D.makeSnap().al.length;
    G.food = 250; G.kc = 600; G.lvC = 9;
    return out;
  });
  o.push(JSON.stringify(r));
  // 정산
  const s2 = await p.evaluate(() => { const D = window.__dbg; const a = D.pasSettle({ food: 250, win: true, kc: 600, lv: 9, t: 170, al: 2, bk: 1, wl: 2 }); const d = D.pasLoad(); return { bank: a.bank, nw: a.nw.map((g) => g[1]), slots: a.slots, eq: d.eq, st: d.st }; });
  o.push(JSON.stringify(s2));
  console.log(o.join('\n')); console.log('ERR', errs); await b.close();
})();
