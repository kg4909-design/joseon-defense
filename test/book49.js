const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] }); const errs = [];
  for (const [w, h] of [[1595, 700], [844, 390]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } }); p.on('pageerror', (e) => errs.push(String(e)));
    await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.41'); });
    await p.goto('file:///home/claude/work/game/dist/index.html'); await p.waitForTimeout(5500);
    await p.click('#btnPas'); await p.waitForTimeout(600);
    const r = await p.evaluate(() => { const bb = document.getElementById('bookBody'); const q = bb.getBoundingClientRect(); bb.scrollTop = 99999; return { top: Math.round(q.top), bottom: Math.round(q.bottom), vh: innerHeight, sh: bb.scrollHeight, ch: bb.clientHeight }; });
    console.log(w, h, JSON.stringify(r)); await p.waitForTimeout(300); await p.screenshot({ path: '/tmp/book_' + w + '.png' }); await p.close();
  }
  console.log('ERR', JSON.stringify(errs)); await b.close();
})();
