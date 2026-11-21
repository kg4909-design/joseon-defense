const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const sizes = [[1595,905],[1366,640],[1280,720],[1024,768],[844,390],[740,360],[932,430],[667,375],[1920,1080],[390,844]];
  const scr = ['sLobby','sRoom','sBrief','sResult','sEnd','sBook'];
  const errs = [];
  for (const [w, h] of sizes) {
    const p = await b.newPage({ viewport: { width: w, height: h }, hasTouch: w < 1000 });
    p.on('pageerror', (e) => errs.push(String(e)));
    await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.34'); });
    await p.goto('file:///home/claude/work/game/dist/index.html'); await p.waitForTimeout(4500);
    for (const id of scr) {
      const r = await p.evaluate((id) => {
        window.show(id);
        const sc = document.getElementById(id), bd = document.getElementById('bwj-badge'); const B = bd.getBoundingClientRect();
        const inView = B.left >= 0 && B.right <= innerWidth + 1 && B.top >= 0 && B.bottom <= innerHeight + 1;
        const hit = []; const bs = bd.querySelectorAll('button,a');
        for (const e of bs) { const r = e.getBoundingClientRect(); const t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); if (!(t === e || e.contains(t))) hit.push(e.textContent.trim().slice(0, 8)); }
        const ov = [];
        for (const e of sc.querySelectorAll('button,h2,b,li,select,input,.panel,#bkMap,div')) {
          if (e.closest('#bwj-badge') || e.offsetParent === null) continue;
          const own = [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) || /BUTTON|SELECT|INPUT/.test(e.tagName);
          if (!own) continue; const r = e.getBoundingClientRect(); if (!r.width || !r.height) continue;
          // 스크롤 영역 밖으로 잘린 것은 제외
          const sb = e.closest('.scBody,.screen').getBoundingClientRect(); if (r.bottom < sb.top || r.top > sb.bottom) continue;
          if (!(r.right <= B.left || B.right <= r.left || r.bottom <= B.top || B.bottom <= r.top)) ov.push((e.id || e.tagName) + ':' + (e.textContent || '').trim().slice(0, 8));
        }
        let foot = null; const f = sc.querySelector('.scFoot'); if (f) { const fr = f.getBoundingClientRect(); foot = { bottom: Math.round(fr.bottom), inView: fr.bottom <= innerHeight + 1 }; }
        return { id, inView, hit, ov: ov.slice(0, 5), foot };
      }, id);
      const bad = !r.inView || r.hit.length || r.ov.length || (r.foot && !r.foot.inView);
      if (bad) console.log(w + 'x' + h, JSON.stringify(r));
    }
    if (w === 1595 || w === 844) { await p.evaluate(() => window.show('sLobby')); await p.screenshot({ path: '/tmp/ui_lob_' + w + '.png' }); await p.evaluate(() => window.show('sRoom')); await p.screenshot({ path: '/tmp/ui_room_' + w + '.png' }); }
    await p.close();
  }
  console.log('DONE ERR', JSON.stringify(errs)); await b.close();
})();
