const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } }); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.38'); });
  await p.goto('file:///home/claude/work/game/dist/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' });
  await p.fill('#nick', '하늘'); await p.click('#btnSingle'); await p.waitForSelector('#sRoom.on'); await p.click('#btnStart'); await p.waitForSelector('#sBrief.on');
  await p.click('#bqOpts .qo'); await p.click('#btnFight'); await p.waitForSelector('#sBattle.on');
  const kills = async (label, cards) => {
    await p.evaluate((cards) => { const m = G.pl.me; m.offer = null; G.ev = null; G.paused = false; G.baseHp = G.baseMax = 1e9; G.souls = []; G.need = 1e9; G.xp = 0; m.cards = cards; calcSyn(m); m.hp = 1e5; m.mx = 1e5; G.en = []; for (let i = 0; i < 40; i++) spawn('grunt', 5, [m.x + 80 + Math.random() * 160, m.y + (Math.random() - 0.5) * 200]); }, cards);
    await p.waitForTimeout(10000);
    const left = await p.evaluate(() => G.en.length); console.log(label.padEnd(18), 'left of 40:', left);
  };
  for (const w of ['bow','cannon','sword','buddha','spear','flail','bomb','hwacha','musket','rocket','stone','nu','turtle']) { await kills(w + '1', { [w]: 1 }); await kills(w + '5', { [w]: 5 }); }
  await kills('syn bow+nu L5', { bow: 5, nu: 5 }); await p.screenshot({ path: '/tmp/w19_syn.png' });
  await kills('syn sword+spear', { sword: 5, spear: 5 });
  await kills('abil mix', { bow: 3, crit: 5, train: 5, forge: 3, guard: 2, medic: 2, spirit: 2, gong: 1 });
  console.log('syn state', JSON.stringify(await p.evaluate(() => ({ sy: G.pl.me.sy, sa: G.pl.me.sa, evo: Object.keys(G.pl.me.cards).filter((k) => k.startsWith('evo_')) }))));
  const r = await p.evaluate(() => { G.pl.me.cards = { bow: 1, sword: 1, flail: 1, buddha: 1, armor: 1, horse: 1, gong: 1, powder: 1 }; const seen = new Set(); for (let i = 0; i < 200; i++) { offerCards(G.pl.me); G.pl.me.offer.forEach((k) => seen.add(k)); } G.pl.me.offer = null; return [...seen].sort().join(); });
  console.log('offers when full(4w+4a):', r);
  console.log('errors', errs); await b.close();
})().catch((e) => { console.error('FAIL', e.message); process.exit(1); });
