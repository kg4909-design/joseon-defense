const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const VP = [[1180, 820, 'tab1'], [1280, 800, 'tab2'], [1766, 936, 'tab3'], [844, 390, 'ph1'], [667, 375, 'ph2'], [932, 430, 'ph3']];
const only = process.argv[2] ? process.argv[2].split(',') : null;
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const errs = [];
  for (const [w, h, nm] of VP) {
    if (only && !only.includes(nm)) continue;
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.40'); localStorage.setItem('jd_hid', '1'); localStorage.setItem('jd_cw', JSON.stringify({ tk: 3, sh: 3, own: { gwonyul: 1 }, cos: [], eq: '', pity: 0, pity2: 0, cl: 0, ids: [] })); });
    p.on('pageerror', (e) => errs.push(String(e)));
    await p.goto('file:///home/claude/joseon-defense/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' }); await p.waitForTimeout(300);
    const shot = async (n) => { await p.screenshot({ path: `/tmp/ui33/${nm}_${n}.png` }); };
    await shot('1lobby');
    await p.click('#btnSingle'); await p.waitForTimeout(400); await shot('2room');
    await p.evaluate(() => { window.__dbg.hostCtl('start', { start: 0, dur: 240, diff: 'normal', wall: 0, coop: true, bots: 3, cl: 2 }); }); await p.waitForTimeout(600); await shot('3brief');
    await p.evaluate(() => { const D = window.__dbg, G = D.G; D.hostCtl('fight'); G.evDone = [true, true]; G.bossTimes = []; }); await p.waitForTimeout(1500); await shot('4battle');
    await p.evaluate(() => { window.__dbg.G.lvq = 1; }); await p.waitForTimeout(900); await shot('5quiz');
    await p.evaluate(() => { const G = window.__dbg.G, me = G.pl[G.order[0]]; hostMsg(G.qzr, { k: 'qa', i: G.pl[G.qzr].qz.a }); }); await p.waitForTimeout(600); await shot('6cards');
    await p.evaluate(() => { const G = window.__dbg.G; for (const id of G.order) { const q = G.pl[id]; if (q.offer) { q.offer = null; q.qz = null; } } hostMsg(G.order[0], { k: 'skill' }); }); await p.waitForTimeout(250); await shot('7skill');
    await p.evaluate(() => { const D = window.__dbg; D.endRound(true); }); await p.waitForTimeout(900); await shot('8result');
    await p.close();
  }
  console.log('errs', errs); await b.close();
})();
