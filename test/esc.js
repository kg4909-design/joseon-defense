const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } }); await p.addInitScript(() => { try { { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.29'); }; } catch (e) {} }); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto('file:///home/claude/work/game/dist/index.html?fast=120'); await p.waitForSelector('#bwj-intro', { state: 'detached' });
  await p.fill('#nick', '하늘'); await p.click('#btnSingle'); await p.waitForSelector('#sRoom.on'); await p.click('#btnStart'); await p.waitForSelector('#sBrief.on');
  await p.evaluate(() => { startRound(1); });
  await p.waitForSelector('#sBrief.on'); await p.screenshot({ path: 'test/e_brief.png' });
  await p.click('#bqOpts .qo'); await p.click('#btnFight'); await p.waitForSelector('#sBattle.on'); await p.waitForTimeout(1500); await p.screenshot({ path: 'test/e_start.png' });
  // 오른쪽으로 달리는 봇 (카드 즉시 선택)
  let last = null;
  for (let i = 0; i < 75; i++) {
    const r = await p.evaluate(() => { const G = __dbg.G, me = G.pl.me; if (me.offer) { applyCard(me, me.offer[0]); me.offer = null; } const g = G.goals[0]; const dy = g ? g[1] - me.y : 0; me.mvx = 1; me.mvy = Math.max(-1, Math.min(1, dy / 80)); return { ph: G.ph, x: Math.round(me.x), fl: G.fl, sf: G.sf, goal: G.goals[0] && Math.round(G.goals[0][0]), t: Math.round(G.t), en: G.en.length, lives: G.lives, res: G.res && G.res.win, hp: Math.round(me.hp) }; });
    last = r; if (i % 20 === 0) console.log(JSON.stringify(r)); if (i === 40) await p.screenshot({ path: 'test/e_mid.png' }); if (r.ph === 'result') break; await p.waitForTimeout(1000);
  }
  console.log('final', JSON.stringify(last), errs); await b.close();
})().catch((e) => { console.error('FAIL', e.message); process.exit(1); });
