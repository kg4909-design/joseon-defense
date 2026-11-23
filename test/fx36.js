const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const errs = [];
  const run = async (eq, eq2, tag) => {
    const p = await b.newPage({ viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true, deviceScaleFactor: 3 }); p.on('pageerror', (e) => errs.push(e.message));
    await p.addInitScript(([a, t]) => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.42'); localStorage.setItem('jd_cw', JSON.stringify({ tk: 3, sh: 0, own: {}, cos: ['a_gold','a_phx','a_storm','a_fire','a_ice','a_bolt','a_petal','a_star','a_orb','a_rain','a_moon','a_wave','a_leaf','t_rain','t_gold','t_spark','t_petal','t_frost','t_dust','t_leaf'], eq: a, eq2: t, pity: 0, pity2: 0, cl: 0, ids: [] })); }, [eq, eq2]);
    await p.goto('file:///home/claude/joseon-defense/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' }); await p.waitForTimeout(400);
    await p.click('#btnSingle'); await p.waitForTimeout(300);
    await p.evaluate(() => { const D = window.__dbg; D.hostCtl('start', { start: 0, dur: 180, diff: 'normal', wall: 0 }); });
    await p.waitForTimeout(600);
    await p.evaluate(() => { const G = window.__dbg.G; G.ph = 'battle'; G.t = 40; });
    for (let i = 0; i < 70; i++) { await p.evaluate(() => { const G = window.__dbg.G, h = G.pl[G.order[0]]; h.mvx = 1; h.mvy = 0; window.__dbg.stepBattle(1 / 30); }); await p.waitForTimeout(40); }
    console.log(tag, await p.evaluate(() => { const o = {}; for (const k in TRL) o[k] = TRL[k].ps.length; const G = window.__dbg.G; return [JSON.stringify(o), G.pl[G.order[0]].trail, G.pl[G.order[0]].x]; }));
    await p.screenshot({ path: `/tmp/fx_${tag}.png`, clip: { x: 250, y: 90, width: 400, height: 220 } }); await p.close(); };
  await run('a_phx', 't_rain', 'phx'); await run('a_storm', 't_gold', 'storm'); await run('a_fire', 't_petal', 'fire');
  console.log('ERR', errs); await b.close();
})();
