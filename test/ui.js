const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const { spawn } = require('child_process');
(async () => {
  const relay = spawn('node', ['relay/local-relay.js', '8787'], { stdio: 'inherit' }); await new Promise((r) => setTimeout(r, 600));
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const errs = [];
  const mk = async (name) => { const c = await b.newContext({ viewport: { width: 1280, height: 720 }, hasTouch: true }); const p = await c.newPage(); p.on('pageerror', (e) => errs.push(name + ': ' + e.message)); await p.goto('file:///home/claude/work/game/dist/index.html?fast=25'); return p; };
  const A = await mk('A'), B2 = await mk('B');
  await A.screenshot({ path: 'test/s1_lobby.png' });
  await A.evaluate(() => document.querySelector('details').open = true); await B2.evaluate(() => document.querySelector('details').open = true); await A.fill('#nick', '선생님'); await A.fill('#relayUrl', 'ws://localhost:8787/ws'); await A.click('#btnCreate'); await A.waitForSelector('#sRoom.on');
  const code = (await A.textContent('#roomLabel')).replace('방 코드', '').trim(); console.log('code', code);
  await B2.fill('#nick', '학생1'); await B2.fill('#relayUrl', 'ws://localhost:8787/ws'); await B2.fill('#roomCode', code); await B2.click('#btnJoin'); await B2.waitForSelector('#sRoom.on');
  await B2.click('#roleRow button[data-r=monk]');
  await A.waitForTimeout(600);
  console.log('A plist:', (await A.textContent('#plist')).replace(/\s+/g, ' '));
  await A.screenshot({ path: 'test/s2_room.png' });
  // 3번째 잘못된 코드
  const C = await mk('C'); await C.evaluate(() => document.querySelector('details').open = true); await C.fill('#relayUrl', 'ws://localhost:8787/ws'); await C.fill('#roomCode', 'ZZZZ'); await C.click('#btnJoin'); await C.waitForTimeout(500); console.log('bad code msg:', await C.textContent('#err'));
  await A.selectOption('#selStart', '0'); await A.click('#btnStart');
  await A.waitForSelector('#sBrief.on'); await B2.waitForSelector('#sBrief.on'); await A.screenshot({ path: 'test/s3_brief.png' });
  console.log('B brief host button hidden:', await B2.isHidden('#btnFight'));
  await A.click('#btnFight'); await A.waitForSelector('#sBattle.on'); await B2.waitForSelector('#sBattle.on');
  // 입력: B 이동, A 소집
  await A.keyboard.down('d'); await B2.keyboard.down('w'); await A.waitForTimeout(1500);
  for (let i = 0; i < 4; i++) { await A.click('#btnSummon'); await A.waitForTimeout(150); }
  await A.keyboard.up('d'); await B2.keyboard.up('w'); await A.waitForTimeout(6000);
  await A.screenshot({ path: 'test/s4_battleA.png' }); await B2.screenshot({ path: 'test/s5_battleB.png' });
  // 카드/이벤트 대기
  await A.waitForTimeout(6000);
  console.log('A cards visible:', await A.isVisible('#cards'), ' evBox:', await A.isVisible('#evBox'));
  await A.screenshot({ path: 'test/s6_battleA2.png' });
  if (await A.isVisible('#cards')) { await A.screenshot({ path: 'test/s6b_cards.png' }); await A.click('.card[data-i="0"]'); }
  if (await B2.isVisible('#evBox')) await B2.click('.evo[data-i="1"]');
  await A.waitForSelector('#sResult.on', { timeout: 40000 });
  await B2.waitForSelector('#sResult.on'); await A.screenshot({ path: 'test/s7_result.png' });
  console.log('result title:', await A.textContent('#rsTitle'));
  if (await B2.isVisible('.qo')) { await B2.click('.qo[data-i="0"]'); await A.click('.qo[data-i="1"]'); await A.waitForTimeout(500); await A.screenshot({ path: 'test/s8_quiz.png' }); console.log('B why:', (await B2.textContent('#qWhy')).slice(0, 60)); }
  console.log('errors', errs); relay.kill(); await b.close();
})().catch((e) => { console.error('FAIL', e); process.exit(1); });
