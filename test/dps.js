const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } }); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.20'); });
  await p.goto(process.env.URL || 'file:///home/claude/work/game/dist/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' });
  await p.fill('#nick', '봇'); await p.click('#btnSingle'); await p.waitForSelector('#sRoom.on'); await p.click('#btnStart'); await p.waitForSelector('#sBrief.on'); await p.locator('#bqOpts .qo').first().click({ timeout: 1500 }).catch(() => {}); await p.click('#btnFight'); await p.waitForSelector('#sBattle.on');
  const cfgs = JSON.parse(process.env.CFGS);
  for (const [label, cards] of cfgs) {
    const r = await p.evaluate(({ cards }) => {
      const G = window.__dbg.G, me = G.pl.me; me.role = 'archer'; startRound(0); G.ph = 'battle'; G.evDone = [true, true]; G.baseHp = G.baseMax = 1e9; me.hp = me.mx = 1e9; G.need = 1e9; me.cards = Object.assign({}, cards); me.offer = null; me.x = 1000; me.y = 800; me.mvx = me.mvy = 0; G.en = []; G.dif = Object.assign({}, G.dif, { sp: 0 }); G.waveT = 1e9;
      let kills = 0; const old = enemyDeath; enemyDeath = (e) => { kills++; old(e); };
      for (let i = 0; i < 300; i++) { if (i % 15 === 0) { const need = 40 - G.en.length; for (let k = 0; k < need; k++) { const a = Math.random() * 6.283, r = 70 + Math.random() * 250; spawn('grunt', 1.5, [me.x + Math.cos(a) * r, me.y + Math.sin(a) * r * 0.8]); } } stepBattle(1 / 30); G.souls = []; me.offer = null; }
      enemyDeath = old; return kills; }, { cards });
    console.log(label.padEnd(18), r);
  }
  console.log(errs); await b.close();
})();
