const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 844, height: 390 } }); const errs = [];
  p.on('pageerror', (e) => errs.push(String(e)));
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.39'); localStorage.setItem('jd_hid', '1'); });
  await p.goto('file:///home/claude/joseon-defense/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' }); await p.waitForTimeout(300);
  await p.click('#btnSingle'); await p.waitForTimeout(300);
  const r = await p.evaluate(() => {
    const D = window.__dbg, G = D.G; D.hostCtl('start', { start: 3, dur: 300, diff: 'easy', coop: true, fix: 1, obj: 'e', bots: 2, cl: 1 }); D.hostCtl('fight'); G.evDone = [true, true]; G.order.slice(1).forEach((i) => { G.pl[i].bot = true; });
    const me = G.pl[G.order[0]], bot = G.pl[G.order[1]]; const h2 = 'h2'; G.pl[h2] = Object.assign({}, bot, { id: h2, name: '민수', bot: false, offer: null }); G.order.push(h2); const h2p = G.pl[h2];
    const sf0 = G.sf; const out = {};
    me.x = G.ww - 700; h2p.x = 800; bot.x = 500; for (let i = 0; i < 20; i++) { me.hp = me.mx; h2p.hp = h2p.mx; D.stepBattle(0.1); }
    out.blocked = { shifted: G.sf !== sf0, esw: G.esw, snap: D.makeSnap().esw, meX: Math.round(me.x) };
    h2p.x = G.ww - 700; D.stepBattle(0.1); D.stepBattle(0.1);
    out.passed = { shifted: G.sf !== sf0 };
    // 안전장치: 25초 뒤 함께 이동
    me.x = G.ww - 700; h2p.x = 800; h2p.down = 0; const sfA = G.sf; for (let i = 0; i < 120; i++) { me.hp = me.mx; D.stepBattle(0.1); } out.wait12s = { shifted: G.sf !== sfA, esl: G.esl };
    for (let i = 0; i < 160; i++) { me.hp = me.mx; h2p.hp = h2p.mx; D.stepBattle(0.1); if (G.sf !== sfA) break; } out.auto = { shifted: G.sf !== sfA, lagX: Math.round(h2p.x), meX: Math.round(me.x) };
    // 봇만 뒤처지면?
    const sf1 = G.sf; me.x = G.ww - 700; h2p.x = G.ww - 700; bot.x = 300; D.stepBattle(0.1);
    out.botIgnored = { shifted: G.sf !== sf1 };
    // 쓰러진 친구는 기다리지 않음
    const sf2 = G.sf; me.x = G.ww - 700; h2p.x = 800; h2p.down = 9; D.stepBattle(0.1);
    out.downIgnored = { shifted: G.sf !== sf2, esw: G.esw };
    return out;
  });
  console.log(JSON.stringify(r)); console.log('errs', errs); await b.close();
})();
