const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 844, height: 390 }, hasTouch: true });
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.33'); });
  const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
  await p.goto('file:///home/claude/work/game/dist/index.html'); await p.waitForTimeout(400);
  await p.click('#btnSingle'); await p.waitForTimeout(300);
  const r = await p.evaluate(() => { const D = window.__dbg; D.hostCtl('start', { start: 0, dur: 180, diff: 'normal', wall: 0 }); const G = D.G; const tags = {}, ids = new Set(); let n = 0;
    for (let i = 0; i < 120; i++) { const q = D.nextQuiz(); const t = q.tag.startsWith('📚') ? 'core' : q.tag.startsWith('🕰') ? 'old' : 'cur'; tags[t] = (tags[t] || 0) + 1; ids.add(q.q); n++; }
    return { tags, uniq: ids.size, n, stored: Object.keys(JSON.parse(localStorage.getItem('jd_qs') || '{}')).length }; });
  console.log(JSON.stringify(r)); console.log('ERR', JSON.stringify(errs)); await b.close();
})();
