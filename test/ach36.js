const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] }); const errs = [];
  const p = await b.newPage({ viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 }); p.on('pageerror', (e) => errs.push(e.message));
  const ok = {}; ['first','w10','w30','sm5','sm25','stk','du3','du10','q30','q100','coop','hard','c0','c1','c2','c3','d1','d3'].forEach((k) => ok[k] = 1);
  await p.addInitScript((o) => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.39'); localStorage.setItem('jd_ach', JSON.stringify({ st: {}, ok: o, ti: 'first', lf: 'l_dragon', bd: 'b_gold' })); }, ok);
  await p.goto('file:///home/claude/joseon-defense/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' }); await p.waitForTimeout(400);
  await p.click('#btnRank'); await p.waitForTimeout(300); await p.click('#bookTabs button[data-t="ach"]'); await p.waitForTimeout(900);
  await p.screenshot({ path: '/tmp/ach36.png' });
  await p.click('button[data-rw="b_rain"]'); await p.waitForTimeout(200);
  console.log(await p.evaluate(() => JSON.stringify([JSON.parse(localStorage.getItem('jd_ach')).bd, JSON.parse(localStorage.getItem('jd_ach')).lf])));
  await p.reload(); await p.waitForSelector('#bwj-intro', { state: 'detached' }); await p.waitForTimeout(400);
  await p.click('#btnSingle'); await p.waitForTimeout(300);
  await p.evaluate(() => { const D = window.__dbg; D.hostCtl('start', { start: 0, dur: 180, diff: 'normal', wall: 0, bots: 2, coop: true }); });
  await p.waitForTimeout(600);
  await p.evaluate(() => { const G = window.__dbg.G; G.ph = 'battle'; G.t = 40; G.pl[G.order[0]].mvx = 0.3; });
  await p.evaluate(() => { const D = window.__dbg; D.gainXp(999); });
  for (let i = 0; i < 18; i++) { await p.evaluate(() => window.__dbg.stepBattle(1 / 30)); await p.waitForTimeout(40); }
  await p.screenshot({ path: '/tmp/lv36.png', clip: { x: 230, y: 80, width: 380, height: 230 } });
  console.log(await p.evaluate(() => { const G = window.__dbg.G; return G.order.map((i) => [G.pl[i].name, G.pl[i].bdr, G.pl[i].lvfx]); }), errs); await b.close();
})();
