const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 844, height: 390 }, hasTouch: true });
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.36'); });
  const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
  await p.goto('file:///home/claude/work/game/dist/index.html'); await p.waitForTimeout(400);
  await p.click('#btnSingle'); await p.waitForTimeout(300);
  const r = await p.evaluate(() => {
    const D = window.__dbg, G = D.G, o = {}; D.hostCtl('start', { start: 0, dur: 180, diff: 'normal', wall: 0 }); G.ph = 'battle'; G.units = []; G.en = [];
    G.units[0] = { t: 'bow', lv: 1, cd: 1 }; 
    D.stepBattle(1 / 30); o.hp0 = G.units.map((u) => u && [u.t, Math.round(u.hp), u.mh]);
    // 궁병 자리에 적 배치
    const sp = D.slotPos(0, G.ax, G.ay); for (let i = 0; i < 6; i++) D.spawn('grunt', D.hsNow(), [sp[0] + i * 3, sp[1]]);
    let t = 0; while (G.units[0] && t < 900) { D.stepBattle(1 / 30); t++; for (const e of G.en) { e.x = sp[0]; e.y = sp[1]; } } o.diedAfter = t; o.enLeft = G.en.length; o.hpEnd = G.units[0] && G.units[0].hp; o.bow = !!G.units[0]; o.lost = G.uLost;
    o.summon = D.doSummon(false) ; o.slot0 = !!G.units[0]; return o; });
  console.log(JSON.stringify(r)); console.log('ERR', errs); await b.close();
})();
