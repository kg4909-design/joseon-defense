const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 844, height: 390 }, hasTouch: true });
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.36'); });
  const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
  await p.goto('file:///home/claude/work/game/dist/index.html'); await p.waitForTimeout(400);
  await p.click('#btnSingle'); await p.waitForTimeout(300);
  const r = await p.evaluate(() => {
    const D = window.__dbg, o = {}; D.hostCtl('start', { start: 0, dur: 180, diff: 'normal', wall: 0 }); const G = D.G; G.ph = 'battle'; const me = G.pl[G.order[0]];
    o.obj = G.obj; me.cards = { bow: 5, train: 1, crit: 1 };
    // 적장 소환 후 처치
    D.spawnBoss(0.8, 0.8, ['테스트장수', '시험']); const bs = G.en.find((e) => e.t === 'boss'); o.boss = !!bs; bs.hp = -1;
    for (let i = 0; i < 6; i++) D.stepBattle(1 / 30);
    o.evoQ = G.evoQ; o.offer = me.offer && me.offer.slice(); o.qz = me.qz && { evo: me.qz.evo, by: me.qz.by === me.id };
    // 정답 보내기
    D.hostMsg(me.id, { k: 'qa', i: me.qz.a });
    o.after = { evoBow: me.cards.evo_bow, offer: me.offer, qz: me.qz, info: G.info && G.info.tt };
    // 오답 시나리오: 한 번 더(다른 무기)
    D.hostCtl('start', { start: 0, dur: 180, diff: 'normal', wall: 0 }); G.ph = 'battle'; me.cards = { cannon: 5, powder: 1 }; G.en = []; D.spawnBoss(0.8, 0.8, ['테스트장수', '시험']); G.en.find((e) => e.t === 'boss').hp = -1; for (let i = 0; i < 6; i++) D.stepBattle(1 / 30);
    o.dbg2 = { evoQ: G.evoQ, offer: me.offer, qz: !!me.qz, bosses: G.en.filter((e) => e.t === 'boss').length, bossDead: G.bossDead, elig: D.evoElig(me), ph: G.ph }; if (!me.qz) return o; D.hostMsg(me.id, { k: 'qa', i: (me.qz.a + 1) % me.qz.o.length });
    o.wrong = { evoCannon: me.cards.evo_cannon, offer: me.offer, qs: me.qs };
    // 자격 없을 때 → 일반 카드 문제
    D.hostCtl('start', { start: 0, dur: 180, diff: 'normal', wall: 0 }); G.ph = 'battle'; me.offer = null; me.qz = null; me.cards = { bow: 3 }; G.en = []; D.spawnBoss(0.8, 0.8, ['테스트장수', '시험']); G.en.find((e) => e.t === 'boss').hp = -1; for (let i = 0; i < 8; i++) D.stepBattle(1 / 30);
    o.none = { evo: me.qz && me.qz.evo, hasQz: !!me.qz };
    // 모든 라운드에 적장? e/r 라운드
    return o;
  });
  console.log(JSON.stringify(r, null, 1));
  const rr = await p.evaluate(() => { const D = window.__dbg, G = D.G, out = []; for (const st of [0, 1, 2, 3, 4, 6]) { D.hostCtl('start', { start: st, dur: 180, diff: 'normal', wall: 0 }); G.ph = 'battle'; G.du = null; G.en = G.en.filter((e) => e.t !== 'boss'); let seen = 0, t0 = 0; for (let i = 0; i < 6000 && G.ph === 'battle'; i++) { for (const id of G.order) { G.pl[id].hp = G.pl[id].mx; G.pl[id].down = 0; G.pl[id].offer = null; G.pl[id].qz = null; } G.ev = null; G.baseHp = G.baseMax; D.stepBattle(1 / 30); if (G.en.some((e) => e.t === 'boss') || G.du) { seen = 1; t0 = Math.round(G.t); break; } } out.push({ rd: st, obj: G.obj, boss: seen, t: t0 }); } return out; });
  console.log(JSON.stringify(rr)); console.log('ERR', errs); await b.close();
})();
