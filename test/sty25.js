const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1180, height: 820 } });
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.34'); });
  const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
  await p.goto('file:///home/claude/work/game/dist/index.html'); await p.waitForTimeout(400);
  await p.click('#btnSingle'); await p.waitForTimeout(300);
  const out = await p.evaluate(() => {
    const D = window.__dbg, out = [];
    for (const nm of ['고니시 유키나가', '도도 다카토라', '가토 기요마사', '안코쿠지 에케이', '홍타이지']) {
      D.hostCtl('start', { start: 4, dur: 180, diff: 'normal', wall: 0 }); const G = D.G, id = G.order[0], h = G.pl[id]; G.ph = 'battle';
      h.cards = { bow: 3, nu: 2, train: 2 }; G.t = 109.99; G.evDone = [true, true];
      for (let i = 0; i < 5; i++) { G.ev = null; h.offer = null; D.stepBattle(1 / 30); if (G.du) break; }
      if (!G.du) { out.push(nm + ' 일기토 시작 안됨'); continue; }
      G.du.b.bn = [nm, '']; const cnt = {}; let t = 0, f0 = G.food, seen = new Set();
      for (let i = 0; i < 30 * 100 && G.du; i++) { G.ev = null; h.offer = null; h.hp = h.mx; for (const tl of G.du.tl) seen.add(tl.k); if (G.du.b.hp > G.du.b.mx * 0.3 && i > 30 * 20) { /* 분노 구간 유도 */ } D.stepBattle(1 / 30); t += 1 / 30; if (G.du && G.du.ph === 'fight' && G.du.b.hp > 0) G.du.b.hp = Math.max(1, G.du.b.hp - 0.6 * (G.du.b.mx / 3000)); }
      out.push(`${nm}: ${G.du ? '미결' : G.bossDead ? '승리' : '패배'} ${t.toFixed(0)}s 패턴 ${[...seen].join(',')} info=${G.info && G.info.tx}`);
    }
    return out;
  });
  console.log(out.join('\n')); console.log('errs', errs); await b.close();
})();
