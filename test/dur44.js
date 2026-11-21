const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 844, height: 390 }, hasTouch: true });
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.41'); });
  const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
  await p.goto('file:///home/claude/work/game/dist/index.html'); await p.waitForTimeout(400);
  await p.click('#btnSingle'); await p.waitForTimeout(300);
  const r = await p.evaluate(() => { const D = window.__dbg; D.hostCtl('start', { start: 0, dur: 180, diff: 'normal', wall: 0 }); const G = D.G; G.ph = 'battle'; const me = G.pl[G.order[0]]; const o = {};
    me.role = 'hyujeong'; me.cards = {}; me.ps = {}; me.cd = 0; me.down = 0; D.hostMsg(me.id, { k: 'skill' }); o.base = me.bfT;
    me.bfT = 0; me.cd = 0; me.cards = { gong: 2 }; me.ps = { du: 5 }; D.hostMsg(me.id, { k: 'skill' }); o.boost = me.bfT; o.exp = 6 * (1.25) * 1.3; return o; });
  console.log(JSON.stringify(r)); console.log('ERR', JSON.stringify(errs)); await b.close();
})();
