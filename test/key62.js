const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 960, height: 540 } });
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.43'); });
  const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
  await p.goto('file:///home/claude/work/game/dist/index.html'); await p.waitForTimeout(400);
  await p.click('#btnSingle'); await p.waitForTimeout(300);
  const r = await p.evaluate(async () => {
    const D = window.__dbg, G = D.G; D.hostCtl('start', { start: 1, dur: 300, diff: 'normal', wall: 0 }); G.ph = 'battle';
    const me = G.pl[G.order[0]], o = {}; const w = (ms) => new Promise((r) => setTimeout(r, ms));
    const key = (t, k, c) => window.dispatchEvent(new KeyboardEvent(t, { key: k, code: c, bubbles: true }));
    key('keydown', 'ㅈ', 'KeyW'); await w(300); o.hangulW = [me.mvx, me.mvy];
    key('keyup', 'ㅈ', 'KeyW'); await w(300); o.afterUp = [me.mvx, me.mvy];
    key('keydown', 'ArrowUp', 'ArrowUp'); await w(300); o.upHeld = [me.mvx, me.mvy];
    window.dispatchEvent(new Event('blur')); await w(300); o.afterBlur = [me.mvx, me.mvy];
    key('keydown', 'Process', 'KeyD'); await w(300); o.procD = [me.mvx, me.mvy];
    key('keyup', 'Process', 'KeyD'); await w(300); o.procUp = [me.mvx, me.mvy];
    return o;
  });
  console.log(JSON.stringify(r)); console.log('ERR', JSON.stringify(errs)); await b.close();
})();
