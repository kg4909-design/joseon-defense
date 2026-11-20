const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  for (const [w, h] of [[1280, 720], [844, 390]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } }); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.25'); localStorage.setItem('jd_dex', JSON.stringify({ s: { bow_nu: 2, sword_spear: 1 }, h: { archer: 1 }, b: { 0: 1 } })); localStorage.setItem('jd_rank', JSON.stringify([{ n: '하늘', s: 500, t: 300, k: 120, q: 3, r: 33 }])); });
    await p.goto('file:///home/claude/work/game/dist/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' }); await p.waitForTimeout(3200);
    await p.screenshot({ path: `/tmp/lob_${w}.png` });
    for (const t of ['syn', 'hero', 'boss', 'rank']) { await p.click(t === 'syn' ? '#btnDex' : '#btnDex'); await p.click(`#bookTabs button[data-t=${t}]`); await p.waitForTimeout(200); await p.screenshot({ path: `/tmp/bk_${w}_${t}.png` }); await p.click('#bookBack'); }
    await p.waitForTimeout(300); console.log(w, errs);
    await p.close();
  }
  await b.close();
})();
