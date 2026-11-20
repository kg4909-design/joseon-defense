const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const VP = { phone: [851, 393], phoneS: [740, 360], tab: [1280, 800], tab43: [1024, 768], pc: [1920, 1080], port: [393, 851] };
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  for (const [n, [w, h]] of Object.entries(VP)) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, isMobile: w < 900 });
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
    await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_hid', '1'); localStorage.removeItem('jd_upd_seen'); });
    await p.goto('file:///home/claude/joseon-defense/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' }); await p.waitForTimeout(2600);
    await p.screenshot({ path: `/tmp/s35_${n}_upd.png` });
    await p.click('#umX'); await p.waitForTimeout(200);
    await p.click('#btnSingle'); await p.waitForTimeout(400);
    await p.screenshot({ path: `/tmp/s35_${n}_room.png` });
    const r = await p.evaluate(() => { const q = (s) => document.querySelector(s).getBoundingClientRect(); const s = q('#btnStart'), v = innerHeight; const sc = document.getElementById('sRoom'); return { start: [Math.round(s.top), Math.round(s.bottom), v], ta: getComputedStyle(document.getElementById('btnStart')).touchAction, scroll: [sc.scrollHeight, sc.clientHeight] }; });
    console.log(n, JSON.stringify(r), errs.length ? errs : '');
    await ctx.close();
  }
  await b.close();
})();
