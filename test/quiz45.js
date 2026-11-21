const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 844, height: 390 }, hasTouch: true });
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.41'); });
  const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
  await p.goto('file:///home/claude/work/game/dist/index.html'); await p.waitForTimeout(400);
  await p.click('#btnSingle'); await p.waitForTimeout(300);
  const r = await p.evaluate(() => { const D = window.__dbg; const out = {}; const LATE = [['정유재란|칠천량|명량|노량|백의종군|진린|울돌목', 1], ['광해군|인조|정묘|후금|강홍립|이괄|정봉수|대동법', 2], ['병자|청군|삼전도|남한산성|소현|청 태종|심양|척화|삼학사', 3], ['개화|일제|광복|6·25|4·19|동학|3·1|강화도 조약|독립|임시 정부|민주', 9]];
    D.hostCtl('start', { start: 0, dur: 180, diff: 'normal', wall: 0 }); const G = D.G;
    for (const [rd, ch] of [[0, 0], [4, 1], [8, 2], [12, 3]]) { G.rd = rd; G.qseen = {}; const bad = []; let n = 0, core = 0; const ids = new Set(); for (let i = 0; i < 300; i++) { const q = D.nextQuiz(); n++; ids.add(q.q); if (q.tag.startsWith('📚')) core++; const txt = q.q + ' ' + q.o.join(' ') + ' ' + q.w; for (const [re, need] of LATE) if (need > ch && new RegExp(re).test(txt)) bad.push([(txt.match(new RegExp(re)) || [''])[0], q.q.slice(0, 24)]); } out['ch' + ch] = { uniq: ids.size, core, bad: bad.slice(0, 6), nbad: bad.length }; }
    out.total = D.QALL.length; return out; });
  console.log(JSON.stringify(r)); console.log('ERR', JSON.stringify(errs)); await b.close();
})();
