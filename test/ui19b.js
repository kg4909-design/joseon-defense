const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  for (const [w, h] of [[1650, 904], [1280, 800], [1024, 768], [844, 390], [780, 360]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } }); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.addInitScript(() => { localStorage.setItem('jd_tut', '1');  });
    await p.goto('file:///home/claude/work/game/dist/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' }); await p.waitForTimeout(3200);
    const modal = await p.evaluate(() => document.getElementById('updModal').classList.contains('on'));
    await p.screenshot({ path: `/tmp/um_${w}.png` });
    await p.click('#umClose'); await p.evaluate(() => { document.getElementById('lobSet').open = true; }); await p.waitForTimeout(400);
    const o = await p.evaluate(() => { const s = document.getElementById('sLobby'); return { sw: s.scrollWidth, cw: s.clientWidth, dw: document.documentElement.scrollWidth, iw: innerWidth, art: document.getElementById('lobArt').children.length, imgs: [...document.querySelectorAll('#lobArt>*')].map((e) => Math.round(e.getBoundingClientRect().width)) }; });
    await p.screenshot({ path: `/tmp/lb_${w}.png` });
    console.log(w + 'x' + h, 'modal', modal, JSON.stringify(o), errs); await p.close();
  }
  await b.close();
})();
