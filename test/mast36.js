const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] }); const errs = [];
  const p = await b.newPage({ viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true }); p.on('pageerror', (e) => errs.push(e.message));
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.33'); localStorage.setItem('jd_mast', JSON.stringify({ archer: 100 })); });
  await p.goto('file:///home/claude/joseon-defense/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' }); await p.waitForTimeout(400);
  const tip = await p.evaluate(() => document.getElementById('mastTip').textContent);
  await p.click('#btnSingle'); await p.waitForTimeout(300);
  const out = await p.evaluate(() => {
    const D = window.__dbg, o = {}; D.hostCtl('start', { start: 0, dur: 180, diff: 'normal', exp: true }); const G = D.G, h = G.pl[G.order[0]];
    o.mlv = h.mlv; o.sig = G.sig; o.exp = G.exp; o.mast = [mastOf('archer').lv, mastText('archer', 5)];
    const m0 = ROLE.archer.hp; o.mx = h.mx; o.base = Math.round(m0 * G.dif.hh);
    h.cards.bow = 4; h.cards.armor = 3; h.cards.evo_bow = 1; h.lv = 7; G.ph = 'result'; G.res = { win: true };
    D.hostCtl('next'); const h2 = G.pl[G.order[0]]; o.next = { rd: G.rd, sig: G.sig, bow: h2.cards.bow, armor: h2.cards.armor, evo: h2.cards.evo_bow || 0, lv: h2.lv, carry: !!G.carry };
    G.rd = 9; G.ph = 'result'; G.res = { win: true }; h2.cards.bow = 6; D.hostCtl('next'); const h3 = G.pl[G.order[0]]; o.chap = { rd: G.rd, bow: h3.cards.bow, lv: h3.lv, carry: !!G.carry };
    const a = [1, 2, 3, 4].map(() => { const r = mastAward('militia', { sm: 2, du: 0 }, true, 3); return [r.gain, r.lv, r.up]; }); o.award = a;
    return o; });
  console.log(tip); console.log(JSON.stringify(out)); console.log(errs); await b.close();
})();
