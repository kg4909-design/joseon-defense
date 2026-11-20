const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 851, height: 393 } }); const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
  let down = true; const got = [];
  await p.route('**/bwj-feedback.kimsky4409.workers.dev/**', (r) => { if (down) return r.abort(); const u = r.request().url(); if (u.includes('/api/post')) { got.push(JSON.parse(r.request().postData())); return r.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true,"left":4,"id":"a"}', headers: { 'access-control-allow-origin': '*' } }); } r.fulfill({ status: 200, contentType: 'application/json', body: '{"posts":[]}', headers: { 'access-control-allow-origin': '*' } }); });
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.33'); localStorage.setItem('jd_hid', '1'); });
  await p.goto('file:///home/claude/joseon-defense/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' }); await p.waitForTimeout(300);
  await p.click('#bwj-badge button'); await p.waitForTimeout(300);
  await p.click('.kd >> nth=0'); await p.fill('#bwjTx', '서버가 꺼져 있을 때 쓴 테스트 의견'); await p.click('#bwjSend'); await p.waitForTimeout(1500);
  console.log('msg:', (await p.innerText('#bwjBody')).slice(0, 70).replace(/\n/g, ' '), '| outbox', await p.evaluate(() => localStorage.getItem('bwj-out') && JSON.parse(localStorage.getItem('bwj-out')).length));
  console.log('google form text?', await p.evaluate(() => document.body.innerHTML.includes('forms.gle') || document.getElementById('bwj-fb').innerText.includes('구글폼')));
  down = false; await p.reload(); await p.waitForTimeout(6500);
  console.log('after reconnect sent', got.length, got[0] && got[0].text, '| outbox', await p.evaluate(() => localStorage.getItem('bwj-out')), errs);
  await b.close();
})();
