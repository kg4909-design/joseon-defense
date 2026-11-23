const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 844, height: 390 } }); const errs = [];
  p.on('pageerror', (e) => errs.push(String(e)));
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.42'); localStorage.setItem('jd_hid', '1'); });
  await p.goto('file:///home/claude/joseon-defense/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' }); await p.waitForTimeout(300);
  await p.click('#btnSingle'); await p.waitForTimeout(300);
  const r = await p.evaluate(async () => {
    const D = window.__dbg, G = D.G; D.hostCtl('start', { start: 3, dur: 300, diff: 'normal', coop: true, bots: 2, cl: 2 }); D.hostCtl('fight'); G.cmObj = 'd';
    const out = {}; const me = G.order[0];
    // 가짜 2번째 사람 추가
    const h2 = 'h2'; G.pl[h2] = Object.assign({}, G.pl[G.order[1]], { id: h2, name: '친구', bot: false, cards: { bow: 1 }, offer: null }); G.order.push(h2);
    G.pl[me].cards = { bow: 2 }; for (const id of G.order) if (id !== me) { G.pl[id].cards = G.pl[id].cards || {}; }
    const cnt = () => G.order.map((id) => JSON.stringify(G.pl[id].cards));
    out.before = cnt();
    G.pl[me].qturn = 0; G.pl[h2].qturn = 5; D.startQuiz(); out.qzr = G.qzr === me; out.offers = G.order.map((id) => !!G.pl[id].offer);
    D.hostMsg(h2, { k: 'qa', i: 0 }); out.ignoredQA = G.pl[me].qs === 0;
    D.hostMsg(me, { k: 'qa', i: G.pl[me].qz.a }); out.qs = G.order.map((id) => G.pl[id].qs); out.len = G.order.map((id) => G.pl[id].offer && G.pl[id].offer.length);
    D.hostMsg(h2, { k: 'card', i: 0 }); out.ignoredCard = !!G.pl[me].offer;
    D.hostMsg(h2, { k: 'cheer', i: 1 }); out.ch = JSON.stringify(D.makeSnap().ch);
    // 능력 카드로 강제
    G.pl[me].offer = ['armor', 'bow', 'cannon', 'heal']; G.pl[h2].offer = G.pl[me].offer.slice();
    D.hostMsg(me, { k: 'card', i: 0 }); out.after = cnt(); out.offersCleared = G.order.every((id) => !G.pl[id].offer);
    // 무기 카드
    G.pl[me].offer = ['cannon', 'armor', 'bow', 'heal']; G.pl[me].qz = G.pl[me].qz || { by: me }; G.pl[me].qs = 1; G.pl[h2].offer = G.pl[me].offer.slice(); G.pl[h2].qz = { by: me }; G.pl[h2].qs = 1;
    D.hostMsg(me, { k: 'card', i: 0 }); out.after2 = cnt();
    return out;
  });
  console.log(JSON.stringify(r, null, 1)); console.log('errs', errs); await b.close();
})();
