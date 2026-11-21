const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } }); const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.41'); });
  await p.goto('file:///home/claude/work/game/dist/index.html?fast=60'); await p.waitForSelector('#bwj-intro', { state: 'detached' });
  await p.fill('#nick', '하늘'); await p.click('#btnSingle'); await p.waitForSelector('#sRoom.on'); await p.click('#btnStart'); await p.waitForSelector('#sBrief.on');
  await p.click('#bqOpts .qo'); await p.click('#btnFight'); await p.waitForSelector('#sBattle.on');
  const r = await p.evaluate(async () => {
    const D = window.__dbg, G = D.G; G.food = 9999; G.ev = null; const out = {};
    for (let i = 0; i < 6; i++) D.doSummon(false);
    const step = (n) => { for (let i = 0; i < n; i++) { G.paused = false; G.ev = null; for (const id of G.order) G.pl[id].offer = null; D.stepBattle(1 / 30); } };
    step(3); out.born = G.units.filter(Boolean).map((u) => [u.t, Math.round(u.x - G.ax), Math.round(u.y - G.ay)]);
    // 영웅 이동: 병사 위치 변화가 부드러운지(한 프레임 최대 이동량)
    const me = G.pl[G.order[0]]; let maxJump = 0, prev = G.units.map((u) => u && [u.x, u.y]);
    for (let k = 0; k < 90; k++) { me.x += 4; if (G.castle === false) { /* 성 없음 */ } step(1); G.units.forEach((u, i) => { if (u && prev[i]) { const j = Math.hypot(u.x - prev[i][0], u.y - prev[i][1]); if (j > maxJump) maxJump = j; prev[i] = [u.x, u.y]; } }); }
    out.maxJump = Math.round(maxJump * 10) / 10; out.castle = G.castle;
    // 합성: 같은 종류 둘을 만든다
    G.units = [{ t: 'bow', lv: 1, cd: 0 }, { t: 'bow', lv: 1, cd: 0 }, null, null, null, null, null, null];
    step(10); const t0 = G.t; G.units.forEach((u) => { if (u) u.born = -9; }); step(40);
    out.merged = G.units.filter(Boolean).map((u) => u.t + u.lv);
    // 전투: 적 소환 후 교전
    D.spawn('grunt', 1, [G.ax + 150, G.ay]); D.spawn('grunt', 1, [G.ax - 150, G.ay + 40]); const n0 = G.en.length; step(200); out.kills = n0 - G.en.length;
    return out;
  });
  console.log(JSON.stringify(r)); await p.evaluate(() => { __dbg.G.paused = false; }); await p.waitForTimeout(700);
  await p.screenshot({ path: '/tmp/spirit.png' }); console.log('ERR', JSON.stringify(errs)); await b.close();
})().catch((e) => { console.error('FAIL', e.message); process.exit(1); });
