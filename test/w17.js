const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } }); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.40'); });
  await p.goto('file:///home/claude/work/game/dist/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' });
  await p.fill('#nick', '하늘'); await p.click('#btnSingle'); await p.waitForSelector('#sRoom.on'); await p.click('#btnStart'); await p.waitForSelector('#sBrief.on');
  console.log('bkSrc', JSON.stringify(await p.evaluate(() => document.getElementById('bkSrc').innerHTML)));
  await p.click('#bqOpts .qo'); await p.click('#btnFight'); await p.waitForSelector('#sBattle.on');
  const kills = async (label, cards) => {
    await p.evaluate((cards) => { G.pl.me.offer = null; G.ev = null; G.paused = false; G.baseHp = G.baseMax = 1e9; G.souls = []; G.need = 1e9; G.xp = 0; G.pl.me.cards = cards; G.pl.me.hp = 1e5; G.pl.me.mx = 1e5; for (const e of G.en) e.hp = 0; G.en = []; for (let i = 0; i < 40; i++) spawn('grunt', 5, [G.pl.me.x + 80 + Math.random() * 160, G.pl.me.y + (Math.random() - 0.5) * 200]); }, cards);
    const n0 = await p.evaluate(() => G.en.length); await p.waitForTimeout(3500);
    console.log(JSON.stringify(await p.evaluate(() => ({ ph: G.ph, paused: G.paused, off: !!G.pl.me.offer, ev: !!G.ev, t: Math.round(G.t), sh: G.pl.me.sp1, hp: Math.round(G.pl.me.hp), dn: G.pl.me.down }))), label, 'enemies', n0, '->', await p.evaluate(() => G.en.length), 'kills hp avg', await p.evaluate(() => Math.round(G.en.reduce((a, e) => a + e.hp / e.mx, 0) / Math.max(1, G.en.length) * 100) / 100));
  };
  await kills('spear1', { spear: 1 }); await p.screenshot({ path: '/tmp/w_spear1.png' });
  await kills('spear5', { spear: 5 }); await p.screenshot({ path: '/tmp/w_spear5.png' });
  await kills('evo_spear', { spear: 5, armor: 1, evo_spear: 1 });
  await kills('sword1', { sword: 1 }); await p.screenshot({ path: '/tmp/w_sword1.png' });
  await kills('sword5', { sword: 5 }); await p.screenshot({ path: '/tmp/w_sword5.png' });
  await kills('evo_sword', { sword: 5, gun: 1, evo_sword: 1 });
  await kills('flail1', { flail: 1 }); await p.screenshot({ path: '/tmp/w_flail1.png' });
  await kills('flail5', { flail: 5 }); await p.screenshot({ path: '/tmp/w_flail5.png' });
  await kills('evo_flail', { flail: 5, horse: 1, evo_flail: 1 });
  await kills('buddha1', { buddha: 1 }); await p.screenshot({ path: '/tmp/w_buddha1.png' });
  await kills('buddha5', { buddha: 5 }); await p.screenshot({ path: '/tmp/w_buddha5.png' });
  await kills('evo_buddha', { buddha: 5, gong: 1, evo_buddha: 1 });
  await kills('gong5+horse', { gong: 5, horse: 5 }); await p.screenshot({ path: '/tmp/w_gong.png' });
  // 공명첩
  await p.evaluate(() => { G.crates.push({ x: G.pl.me.x, y: G.pl.me.y, k: 'gmc' }); }); await p.waitForTimeout(600);
  console.log('info', JSON.stringify(await p.evaluate(() => G.info && G.info.tt)), 'food', await p.evaluate(() => G.food));
  await p.screenshot({ path: '/tmp/w_gmc.png' });
  // 무기 4개 제한
  const r = await p.evaluate(() => { const c = { spear: 1, sword: 1, flail: 1, buddha: 1 }; G.pl.me.cards = c; let seen = new Set(); for (let i = 0; i < 60; i++) { offerCards(G.pl.me); G.pl.me.offer.forEach((k) => seen.add(k)); } G.pl.me.offer = null; return [...seen].sort().join(); });
  console.log('offers with 4 weapons:', r);
  console.log('errors', errs); await b.close();
})().catch((e) => { console.error('FAIL', e.message); process.exit(1); });
