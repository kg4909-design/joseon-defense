import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
import { handle } from '/home/claude/joseon-defense/feedback/core.js';
const mem = new Map(); const store = { get: async (k) => mem.get(k), put: async (k, v) => void mem.set(k, JSON.parse(JSON.stringify(v))), del: async (k) => void mem.delete(k), list: async (p) => [...mem.entries()].filter(([k]) => k.startsWith(p)) };
const env = { ADMIN_KEY: 'k-test' }; let down = false;
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
for (const [w, h] of [[1180, 820], [844, 390]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h } });
  await ctx.addInitScript(() => { if (!localStorage.getItem('jd_tut')) { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.29'); } });
  await ctx.route('https://bwj-feedback.kimsky4409.workers.dev/**', async (route) => { const rq = route.request(); if (down) return route.abort(); const r = await handle(new Request(rq.url(), { method: rq.method(), body: rq.postData() || undefined, headers: rq.headers() }), store, env, '2.2.2.2'); route.fulfill({ status: r.status, headers: Object.fromEntries(r.headers), body: await r.text() }); });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
  await p.goto('file:///home/claude/work/game/dist/index.html'); await p.waitForTimeout(3500);
  await p.click('#btnSingle'); await p.waitForTimeout(300);
  await p.click('#bwj-badge button'); await p.waitForTimeout(400);
  const t1 = await p.evaluate(() => document.querySelector('#bwj-fb h3').innerText);
  await p.click('.kd[data-k="bug"]'); await p.fill('#bwjTx', '결과 화면에서 버튼이 위아래로 흔들려요'); await p.waitForTimeout(100);
  await p.screenshot({ path: `fb_write_${w}.png` });
  await p.click('#bwjSend'); await p.waitForTimeout(600);
  const sent = await p.evaluate(() => document.querySelector('#bwjBody').innerText.slice(0, 40));
  // 선생님 답장
  const A = { 'x-admin-key': 'k-test' }; const post = [...mem.values()].find((x) => x.text && x.text.includes('흔들려요')); 
  const up = await handle(new Request('http://x/api/admin/update', { method: 'POST', headers: A, body: JSON.stringify({ id: post.id, rep: '고쳤어요! 알려 줘서 고마워요', pub: true }) }), store, env, '');
  await p.click('.tabs button[data-t="m"]'); await p.waitForTimeout(700);
  const mine = await p.evaluate(() => document.querySelector('#bwjBody').innerText);
  await p.screenshot({ path: `fb_mine_${w}.png` });
  await p.click('.tabs button[data-t="p"]'); await p.waitForTimeout(700);
  await p.click('.lk'); await p.waitForTimeout(400); const lk = await p.evaluate(() => document.querySelector('.lk').innerText);
  await p.screenshot({ path: `fb_pub_${w}.png` });
  await p.click('#bwjX');
  // 새 답장 → 점
  const post2 = await handle(new Request('http://x/api/post', { method: 'POST', body: JSON.stringify({ game: '조선의 위기 디펜스', kind: 'idea', text: '보스가 더 어려웠으면 좋겠어요', did: await p.evaluate(() => localStorage.getItem('bwj-did')) }) }), store, env, '3.3.3.3').then((r) => r.json());
  await handle(new Request('http://x/api/admin/update', { method: 'POST', headers: A, body: JSON.stringify({ id: post2.id, rep: '다음 버전에서 올릴게요' }) }), store, env, '');
  await p.reload(); await p.waitForTimeout(8000); await p.click('#btnSingle').catch(() => {}); await p.waitForTimeout(300);
  const dot = await p.evaluate(() => { const d = document.querySelector('#bwj-badge .bwjdot'); return d ? d.textContent : null; });
  await p.screenshot({ path: `fb_dot_${w}.png` });
  // 서버 다운 → 구글폼 대체
  down = true; await p.click('#bwj-badge button'); await p.waitForTimeout(800); const fb = await p.evaluate(() => document.querySelector('#bwjBody').innerText.slice(0, 60)); down = false;
  console.log(w + 'x' + h, JSON.stringify({ t1, sent, mineHasReply: mine.includes('선생님 답장'), lk, dot, fb, errs }));
  await ctx.close();
}
await b.close();
