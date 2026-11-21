const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const errs = [];
  for (const [w, h] of [[1180, 820], [844, 390]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.41'); localStorage.setItem('jd_hid', '1'); localStorage.setItem('jd_cw', JSON.stringify({ tk: 0, sh: 0, own: { gwonyul: 1, gimsimin: 1 }, cos: [], eq: '', pity: 0, pity2: 0, cl: 0, ids: [] })); });
    p.on('pageerror', (e) => errs.push(String(e)));
    await p.goto('file:///home/claude/joseon-defense/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' }); await p.waitForTimeout(300);
    const CST = await p.evaluate(() => { const D = window.__dbg; for (let i = 0; i < 30; i++) { const o = ROUND_OBJ[i]; if (o === 'd' || o === 'b') return i; } return -1; }); console.log('castle round idx', CST);
    // 1) 조각 순서
    const seq = await p.evaluate(() => {
      const o = {}; const sv = localStorage.getItem('jd_cw'); localStorage.setItem('jd_cw', JSON.stringify({ tk: 0, sh: 0, own: {}, cos: [], eq: '', pity: 0, pity2: 0, cl: 0, ids: [] }));
      let d = cwLoad(); let un = cwAddSh(d, 14); o.a = [un, !!d.own.gwonyul, !!d.own.gimsimin, d.sh, d.tk, cwTarget(d)];
      un = cwAddSh(d, 8); o.b = [un, !!d.own.gimsimin, d.sh, d.tk, cwTarget(d)];
      un = cwAddSh(d, 3); o.c = [un, d.sh, d.tk, cwTarget(d)];
      localStorage.setItem('jd_cw', sv); return o; });
    console.log(w, 'shards', JSON.stringify(seq));
    // 2) 로비 버튼
    await p.click('#btnSingle'); await p.waitForTimeout(300);
    console.log('btn', await p.evaluate(() => [roleLeg.textContent, roleLeg2.textContent, roleHid.textContent]));
    await p.evaluate(() => { document.getElementById('roleLeg2').click(); }); await p.waitForTimeout(100);
    console.log('role', await p.evaluate(() => [me.role, document.getElementById('roleTip').textContent.slice(0, 120)]));
    await p.screenshot({ path: `/tmp/h31_lobby_${w}.png` });
    for (const role of ['gimsimin', 'gwonyul', 'admiral']) {
      await p.evaluate((r) => { me.role = r; sendProf(); }, role);
      await p.evaluate((c) => { window.__dbg.hostCtl('start', { start: c, dur: 240, diff: 'normal', wall: 0, coop: true, bots: 3, cl: 1 }); }, CST); await p.waitForTimeout(400);
      await p.evaluate(() => { const D = window.__dbg, G = D.G; D.hostCtl('fight'); G.evDone = [true, true]; G.bossTimes = []; }); await p.waitForFunction(() => window.__dbg.G.en.length >= 8, null, { timeout: 15000 }).catch(() => {}); await p.waitForTimeout(300);
      const r = await p.evaluate((role) => {
        const D = window.__dbg, G = D.G, me = G.pl[G.order[0]], o = { role: me.role };
        me.x = G.ax + 60; me.y = G.ay + 40; const bot = G.pl[G.order[1]]; bot.x = me.x + 80; bot.y = me.y;
        G.en.slice(0, 8).forEach((e, i) => { e.x = me.x + 70 + (i % 4) * 25; e.y = me.y - 40 + (i >> 2) * 40; });
        const n0 = G.en.reduce((a, e) => a + e.hp, 0), hp0 = G.baseHp; G.baseHp = G.baseMax * 0.5;
        bot.x = me.x + 1500; const dmgBefore = heroStats(bot).dmg; bot.x = me.x + 80;
        me.hp = me.mx; const dFull = heroStats(me).dmg; me.hp = me.mx * 0.2; const dLow = heroStats(me).dmg; me.hp = me.mx;
        const h0 = me.hp; hurt(me, 100); o.hurt = Math.round(h0 - me.hp); me.hp = me.mx;
        hostMsg(me.id, { k: 'skill' });
        o.cd = me.cd; o.dmg = Math.round(n0 - G.en.reduce((a, e) => a + e.hp, 0)); o.base = Math.round(G.baseHp - G.baseMax * 0.5); o.sd = me.sdT || 0; o.botSd = bot.sdT || 0;
        const h1 = me.hp; hurt(me, 100); o.hurtSd = Math.round(h1 - me.hp); me.hp = me.mx;
        o.pass = { botDmg: +(heroStats(bot).dmg / dmgBefore).toFixed(2), adm: +(dLow / dFull).toFixed(2) };
        return o; }, role);
      console.log(w, JSON.stringify(r));
      await p.waitForTimeout(280); await p.screenshot({ path: `/tmp/h31_${role}_${w}.png` });
      await p.evaluate(() => { const D = window.__dbg; D.hostCtl('lobby'); }); await p.waitForTimeout(300);
    }
    await p.close();
  }
  console.log('errs', errs); await b.close();
})();
