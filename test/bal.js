const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } }); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.37'); });
  await p.goto(process.env.URL || 'file:///home/claude/work/game/dist/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' });
  await p.fill('#nick', '봇'); await p.click('#btnSingle'); await p.waitForSelector('#sRoom.on'); await p.click('#btnStart'); await p.waitForSelector('#sBrief.on'); await p.locator('#bqOpts .qo').first().click({ timeout: 1500 }).catch(() => {}); await p.click('#btnFight'); await p.waitForSelector('#sBattle.on');
  for (const diff of (process.env.DIFFS || 'normal,hard').split(',')) for (const role of ['archer', 'militia', 'monk', 'gunner']) for (const rd of (process.env.RDS || '0,4,9,16').split(',').map(Number)) {
    const r = await p.evaluate(({ role, rd, diff }) => {
      const G = window.__dbg.G; G.dif = DIFF[diff]; G.sel.diff = diff; G.pl.me.role = role; startRound(rd); G.dur = 150; G.evDone = [true, true]; G.ph = 'battle'; const me = G.pl.me; let kills0 = 0;
      for (let i = 0; i < 30 * 160 && G.ph === 'battle'; i++) { if (me.offer) { const o = me.offer; applyCard(me, o[(Math.random() * o.length) | 0]); me.offer = null; }
        if (i % 60 === 0 && G.food >= summonCost() && G.units.includes(null) && !G.castle === false) doSummon(false);
        const a = i * 0.02; me.mvx = G.obj === 'e' ? 0 : Math.cos(a) * 0.5; me.mvy = G.obj === 'e' ? 0 : Math.sin(a) * 0.5; stepBattle(1 / 30); }
      return { ph: G.ph, win: G.res && G.res.win, t: Math.round(G.t), lv: me.lv, hp: Math.round(me.hp), base: Math.round(G.baseHp), cards: Object.keys(me.cards).map((k) => k + me.cards[k]).join(' ') };
    }, { role, rd, diff });
    console.log(diff, role, 'rd' + rd, JSON.stringify(r));
  }
  console.log(errs); await b.close();
})();
