const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
  const p = await b.newPage({ viewport: { width: 1180, height: 820 } });
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.26'); });
  const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
  await p.goto('file:///home/claude/work/game/dist/index.html'); await p.waitForTimeout(500);
  await p.mouse.click(300, 300); await p.waitForTimeout(800);
  const r = await p.evaluate(async () => {
    const o = { on: BGM.on, state: SFX.ctx && SFX.ctx.state };
    const an = SFX.ctx.createAnalyser(); an.fftSize = 2048; BGM.bus.connect(an); const buf = new Float32Array(2048);
    const meas = async (lv) => { BGM.lv = lv; let peak = 0, sum = 0, n = 0; for (let i = 0; i < 60; i++) { await new Promise((r) => setTimeout(r, 100)); an.getFloatTimeDomainData(buf); for (const x of buf) { peak = Math.max(peak, Math.abs(x)); sum += x * x; n++; } } return { peak: +peak.toFixed(3), rms: +Math.sqrt(sum / n).toFixed(4) }; };
    const sync = BGM.sync; BGM.sync = () => {};
    o.l0 = await meas(0); o.l2 = await meas(2); o.l3 = await meas(3); o.step = BGM.step;
    BGM.sync = sync; return o;
  });
  console.log(JSON.stringify(r), errs);
  await b.close();
})();
