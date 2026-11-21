const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const sizes = [[1595,905],[1366,640],[1280,720],[1024,768],[844,390],[740,360],[932,430],[667,375],[1920,1080]];
  const errs = [];
  for (const [w, h] of sizes) {
    const p = await b.newPage({ viewport: { width: w, height: h }, hasTouch: w < 1000 });
    p.on('pageerror', (e) => errs.push(String(e)));
    await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.41'); });
    await p.goto('file:///home/claude/work/game/dist/index.html'); await p.waitForTimeout(5500);
    const r = await p.evaluate(() => { const ids = ['lobTitle','lobMenu','lobBtns','btnSingle','btnRank','btnGearL']; const o = {}; const m = document.getElementById('lobMain'); o.scroll = m.scrollHeight > m.clientHeight + 2; for (const i of ids) { const r = document.getElementById(i).getBoundingClientRect(); o[i] = [Math.round(r.left), Math.round(r.top), Math.round(r.right), Math.round(r.bottom)]; }
      const inside = (id) => { const r = document.getElementById(id).getBoundingClientRect(); return r.right <= innerWidth + 1 && r.left >= -1; };
      const ov = (a, b2) => { const A = document.getElementById(a).getBoundingClientRect(), B = document.getElementById(b2).getBoundingClientRect(); return !(A.right <= B.left || B.right <= A.left || A.bottom <= B.top || B.bottom <= A.top); };
      return { w: innerWidth, h: innerHeight, scroll: o.scroll, fitX: ['lobBtns','lobMenu','lobTitle'].every(inside), ovBtnSet: false, ovMenuBtns: ov('lobMenu','lobBtns'), ovTitleMenu: ov('lobTitle','lobMenu'), btnsBottom: o.lobBtns[3], setBottom: 0 }; });
    console.log(JSON.stringify(r));
    if (w === 1595 || w === 844) await p.screenshot({ path: '/tmp/lob_' + w + '.png' });
    await p.close();
  }
  console.log('ERR', JSON.stringify(errs)); await b.close();
})();
