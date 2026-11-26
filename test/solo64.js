const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const errs = [], o = {};
  const fresh = async (w, h) => { const p = await b.newPage({ viewport: { width: w || 1180, height: h || 820 } });
    await p.addInitScript(() => { if (!sessionStorage.getItem('x')) { sessionStorage.setItem('x', '1'); localStorage.removeItem('jd_cw'); localStorage.removeItem('jd_chc'); } localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.45'); });
    p.on('pageerror', (e) => errs.push(e.message)); await p.goto('file:///home/claude/work/game/dist/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' }); return p; };
  let p = await fresh();
  await p.click('#btnSingle'); await p.waitForSelector('#sRoom.on');
  o.hidden = await p.evaluate(() => ['rowScn', 'scnInfo', 'rowCmScn', 'rowCmObj', 'cmInfo', 'rowCoop', 'coopNote', 'btnCoop'].map((i) => getComputedStyle(document.getElementById(i)).display)); o.soloNote = await p.evaluate(() => getComputedStyle(document.getElementById('soloNote')).display);
  o.roleRowShown = await p.evaluate(() => getComputedStyle(document.getElementById('roleRow')).display); o.car0 = (await p.textContent('#rcCur')).replace(/\s+/g, ' ');
  await p.click('#rcNext'); o.car1 = (await p.textContent('#rcCur')).replace(/\s+/g, ' ');
  for (let i = 0; i < 4; i++) await p.click('#rcNext'); o.car5 = (await p.textContent('#rcCur')).replace(/\s+/g, ' '); // 히든(잠김) 지나 전설들
  for (let i = 0; i < 7; i++) await p.click('#rcNext'); o.carWrap = (await p.textContent('#rcCur')).replace(/\s+/g, ' ');
  await p.click('#rcNext'); await p.click('#rcPrev'); await p.click('#rcPrev'); // 한 바퀴 후 이동
  await p.evaluate(() => { document.querySelector('#roleRow button[data-r="militia"]').click(); }); await p.selectOption('#selStart', { index: 1 }); await p.click('#btnStart'); await p.waitForTimeout(400);
  o.solo = await p.evaluate(() => { const G = __dbg.G; return [G.rd, G.cm, G.pl[G.order[0]].role]; });
  await p.close();
  // 챕터 보상
  p = await fresh(); await p.click('#btnSingle'); await p.waitForSelector('#sRoom.on'); await p.click('#btnStart'); await p.waitForTimeout(300);
  const clear = async (rd) => { await p.evaluate((rd) => { const D = __dbg; D.hostCtl('start', { start: rd, dur: 300, diff: 'normal', wall: 0 }); D.G.ph = 'battle'; D.endRound(true); }, rd); await p.waitForTimeout(900); return p.evaluate(() => [document.getElementById('rsReward').style.display, document.getElementById('rsReward').textContent, JSON.parse(localStorage.getItem('jd_cw') || '{}').own]); };
  o.mid = await clear(5); o.ch0 = await clear(9); await clear(5); o.ch0again = await clear(9); o.ch1 = await clear(19); o.ch2 = await clear(24); o.ch3 = await clear(29);
  o.tk = await p.evaluate(() => JSON.parse(localStorage.getItem('jd_cw')).tk);
  console.log(JSON.stringify(o, null, 1)); console.log('ERR', JSON.stringify(errs)); await b.close();
})();
