const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const VP = [[667, 375], [844, 390], [932, 430], [1180, 820], [1024, 768], [1452, 882]];
const only = process.argv[2] ? process.argv[2].split(',') : null;
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  for (const [w, h] of VP) {
    const p = await b.newPage({ viewport: { width: w, height: h }, hasTouch: w < 1000 });
    await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.36'); localStorage.setItem('jd_sv_1', JSON.stringify({ ts: Date.now(), rd: 0, dur: 180, diff: 'normal', wall: 0, role: 'archer', name: 'a', ver: 'v0.24' })); });
    const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
    await p.goto('file:///home/claude/work/game/dist/index.html'); await p.waitForTimeout(5500);
    const chk = async (name) => {
      if (only && !only.includes(name)) return;
      await p.waitForTimeout(250);
      const r = await p.evaluate(() => {
        const vis = (e) => { const s = getComputedStyle(e), r = e.getBoundingClientRect(); return s.display !== 'none' && s.visibility !== 'hidden' && r.width > 4 && r.height > 4 && +s.opacity > 0.05; };
        const bs = [...document.querySelectorAll('button,select,input')].filter(vis).map((e) => { const r = e.getBoundingClientRect(); return { id: e.id || e.textContent.trim().slice(0, 8), l: r.left, t: r.top, r: r.right, b: r.bottom }; });
        const out = [], W = innerWidth, H = innerHeight;
        for (const x of bs) if (x.l < -2 || x.t < -2 || x.r > W + 2 || x.b > H + 2) out.push('밖:' + x.id + `(${Math.round(x.l)},${Math.round(x.t)},${Math.round(x.r)},${Math.round(x.b)})`);
        for (let i = 0; i < bs.length; i++) for (let j = i + 1; j < bs.length; j++) { const a = bs[i], c = bs[j]; const ox = Math.min(a.r, c.r) - Math.max(a.l, c.l), oy = Math.min(a.b, c.b) - Math.max(a.t, c.t); if (ox > 6 && oy > 6) out.push('겹침:' + a.id + '×' + c.id); }
        return out.slice(0, 12);
      });
      console.log(`${w}x${h} ${name}:`, r.length ? r.join(' | ') : 'OK');
      if (process.env.SHOT) await p.screenshot({ path: `test/au_${w}x${h}_${name}.png` });
    };
    await chk('lobby');
    await p.evaluate(() => openSaves('load', 0)); await chk('saves'); await p.evaluate(() => $('svClose').click());
    await p.evaluate(() => openUpd(true)); await chk('upd'); await p.evaluate(() => closeUpd());
    await p.click('#btnDex'); await chk('dex'); await p.evaluate(() => show('sLobby'));
    await p.click('#btnSingle'); await chk('room');
    await p.click('#btnStart'); await chk('brief');
    await p.click('#bqOpts .qo'); await p.click('#btnFight'); await p.waitForSelector('#sBattle.on'); await p.waitForTimeout(1200); await chk('battle');
    await p.evaluate(() => { const D = window.__dbg, G = D.G, pl = G.pl[G.order[0]]; G.food = 300; for (let i = 0; i < 2; i++) D.hostMsg(G.order[0], { k: 'summon' }); D.gainXp(999); }); await p.waitForTimeout(700); await chk('cards');
    await p.evaluate(() => { const D = window.__dbg, G = D.G; const pl = G.pl[G.order[0]]; if (pl.qz && pl.qs === 0) D.hostMsg(G.order[0], { k: 'qa', i: pl.qz.a }); }); await p.waitForTimeout(500); await chk('cards2');
    await p.evaluate(() => { const D = window.__dbg, G = D.G; const pl = G.pl[G.order[0]]; if (pl.offer) D.hostMsg(G.order[0], { k: 'card', i: 0 }); G.t = G.dur - 0.01; G.ev = null; for (let i = 0; i < 3; i++) D.stepBattle(1 / 30); }); await p.waitForTimeout(800); await chk('result');
    console.log(w, h, 'errs', errs);
    await p.close();
  }
  await b.close();
})();
