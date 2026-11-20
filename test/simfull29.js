const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const total = +(process.argv[2] || 3), diff = process.argv[3] || 'normal', maxR = +(process.argv[4] || 12), dur = +(process.argv[5] || 180);
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1180, height: 820 } });
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.33'); });
  const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
  await p.goto('file:///home/claude/joseon-defense/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' }); await p.click('#btnSingle'); await p.waitForTimeout(200);
  const r = await p.evaluate(([total, diff, maxR, dur, START, NOCAMP, CL]) => {
    const D = window.__dbg, G = D.G, log = [];
    D.hostCtl('start', { start: START, dur, diff, wall: 0, coop: true, bots: total, cl: CL });
    G.pl[G.order[0]].bot = true; // 사람도 봇이 대신 조종
    let guard = 0, fails = 0;
    while (G.rd < maxR + (START) && guard++ < 400) {
      const rd = G.rd; let tries = 0;
      // brief
      for (let i = 0; i < 200 && G.ph === 'brief'; i++) { D.botAI(0.1); if (G.order.every((id) => G.ans[id] != null) || R_noq(rd)) break; }
      function R_noq(i) { return !D.R[i].q; }
      if (NOCAMP) { G.en = G.en.filter((e) => e.t !== 'camp'); G.cmOn = false; } D.hostCtl('fight');
      const o = { rd, obj: G.obj, camps0: G.en.filter((e) => e.t === 'camp').length, hs: 0 }; let cK = null, duels = 0, evs = 0, stuck = 0, lastSig = '', downs = 0, offersMax = 0;
      for (let i = 0; i < 30 * (dur + 400) && G.ph === 'battle'; i++) {
        if (G.du) duels++; if (G.ev) evs++;
        D.botAI(1 / 30); D.stepBattle(1 / 30);
        if (G.ph === 'battle' && G.du && G.du.ph === 'warn' && !G.du.b) stuck++;
        if (G.ph === 'battle' && G.cmOn && !G.du) { const c = G.en.filter((e) => e.t === 'camp').length; if (cK == null && c === 0) cK = Math.round(G.t); }
        if (i % 30 === 0) { const sig = [G.t.toFixed(0), G.en.length, G.du ? G.du.tm.toFixed(0) : ''].join(); if (G.du || G.ev) { if (sig === lastSig) stuck++; } lastSig = sig; downs = Math.max(downs, G.order.filter((id) => G.pl[id].down > 0).length); }
      }
      o.k = G.cmOn ? 'c' : G.cmS ? 'b' : G.cmR ? 'r' : '-'; o.g = G.cmG | 0; o.rw = G.res && G.res.rw ? G.res.rw.sh + '/' + G.res.rw.tk : ''; o.res = G.ph === 'battle' ? 'TIMEOUT' : (G.res.win ? 'WIN' : 'LOSE' + (G.res.cmf ? '(기지' + G.res.cmf + ')' : '')); o.t = Math.round(G.t); o.base = Math.round(G.baseHp / G.baseMax * 100); o.campKill = cK; o.duelSec = Math.round(duels / 30); o.evSec = Math.round(evs / 30); o.stuck = stuck; o.maxDown = downs; o.lv = G.order.map((id) => G.pl[id].lv).join('/'); o.food = G.food; o.hp = G.order.map((id) => Math.round(G.pl[id].hp / G.pl[id].mx * 100)).join('/');
      log.push(o);
      if (G.ph === 'battle') break;
      for (let i = 0; i < 60 && G.ph === 'result'; i++) D.botAI(0.1);
      if (G.res.win) D.hostCtl('next'); else { fails++; if (fails > 3) { D.hostCtl('skip'); if (G.ph === 'result') D.hostCtl('retry'); fails = 0; } else D.hostCtl('retry'); }
      if (G.ph !== 'brief') { log.push({ weird: G.ph }); break; }
    }
    return log;
  }, [total, diff, maxR, dur, +(process.env.START || 0), !!process.env.NOCAMP, +(process.env.CL || 2)]);
  for (const l of r) console.log(JSON.stringify(l)); console.log('errs', errs); await b.close();
})();
